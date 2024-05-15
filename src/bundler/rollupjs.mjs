import { rollup } from 'rollup'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import { pathExistsSync } from 'fs-extra/esm'
import multi from '@rollup/plugin-multi-entry'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import nodeExternals from 'rollup-plugin-node-externals'
import { checkAutoloadModule, getEnvVariables } from '../utils.mjs'
import { basePath, buildPath, distPath, merge, importModule } from '@stone-js/common'

/**
 * Rollup build.
 *
 * @param {Config} config
 * @returns
 */
export async function rollupBuild (config) {
  const options = await makeBuildOptions(config)

  for (const option of options) {
    const bundle = await rollup(option)
    await Promise.all(option.output.map(bundle.write))
  }
}

/**
 * Rollup bundle.
 *
 * @returns
 */
export async function rollupBundle () {
  const options = makeBundleOptions()
  const bundle = await rollup(options)
  await Promise.all(options.output.map(bundle.write))
}

/**
 * Make Rollup build options.
 *
 * @private
 * @param   {Config} config
 * @returns {Object}
 */
async function makeBuildOptions (config) {
  const rollupOtions = await getRollupConfig()

  return Object
    .entries(config.get('autoload.modules', {}))
    .filter(([name]) => checkAutoloadModule(config, name, false))
    .map(([name, input]) => merge({
      input: basePath(input),
      output: [
        { format: 'es', file: buildPath(`${name}.mjs`) }
      ],
      plugins: [
        json(),
        multi(),
        nodeExternals({
          include: /^@stone-js/
        }), // Must always be before `nodeResolve()`.
        nodeResolve({
          exportConditions: ['node', 'import', 'require', 'default']
        }),
        babel({ babelHelpers: 'bundled' }),
        commonjs(),
        replace(replaceProcessEnvVars(config))
      ]
    }, rollupOtions))
}

/**
 * Make Rollup bundle options.
 *
 * @private
 * @param   {Object} inputs
 * @param   {Object} [options={}]
 * @returns {Object}
 */
function makeBundleOptions () {
  return {
    input: buildPath('app.bootstrap.mjs'),
    output: [
      { format: 'es', file: distPath('stone.mjs') }
      // { format: 'es', file: distPath('stone.mjs'), plugins: terser() }
    ],
    plugins: [
      json(),
      nodeExternals({ deps: false }), // Must always be before `nodeResolve()`.
      nodeResolve({
        exportConditions: ['node', 'import', 'require', 'default']
      }),
      commonjs()
    ]
  }
}

/**
 * Replace process env variables.
 *
 * @private
 * @param   {Config} config
 * @returns {Object}
 */
function replaceProcessEnvVars (config) {
  const options = config.get('dotenv', {})
  const publicOptions = { ...options?.options, ...options?.public }
  const prefix = publicOptions.prefix ?? 'process.__env__'

  // Get public envs
  const publicEnv = getEnvVariables(publicOptions)

  // Build public values
  const values = prefix.endsWith('.')
    ? Object
      .entries(publicEnv)
      .reduce((prev, [key, value]) => ({ ...prev, [`${prefix}${key}`]: JSON.stringify(value) }), {})
    : { [prefix]: JSON.stringify(publicEnv) }

  return {
    values,
    ...options?.replace
  }
}

/**
 * Get rollup config.
 *
 * @private
 * @returns {Object}
 */
async function getRollupConfig () {
  if (pathExistsSync(basePath('rollup.config.mjs'))) {
    const module = await importModule('rollup.config.mjs')
    return Object.values(module).shift() ?? {}
  }

  return {}
}
