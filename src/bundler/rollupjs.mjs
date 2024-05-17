import { rollup } from 'rollup'
import { pathExistsSync } from 'fs-extra/esm'
import rollupConfig from './rollup.config.mjs'
import { checkAutoloadModule, getEnvVariables } from '../utils.mjs'
import { basePath, buildPath, distPath, importModule } from '@stone-js/common'

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
 * @param {Config} config
 * @returns
 */
export async function rollupBundle (_config) {
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
  const rollupOtions = await getRollupConfig(config)

  return Object
    .entries(config.get('autoload.modules', {}))
    .filter(([name]) => checkAutoloadModule(config, name))
    .map(([name, input]) => rollupOtions({
      input: basePath(input),
      output: [{ format: 'es', file: buildPath(`${name}.mjs`) }],
      externaleOptions: { include: /^@stone-js/ },
      replaceOptions: replaceProcessEnvVars(config)
    }))
}

/**
 * Make Rollup bundle options.
 *
 * @private
 * @returns {Object}
 */
async function makeBundleOptions () {
  const rollupOtions = await getRollupConfig()

  return rollupOtions({
    input: buildPath('app.bootstrap.mjs'),
    output: [{ format: 'es', file: distPath('stone.mjs') }],
    externaleOptions: { deps: false },
    replaceOptions: {}
  })
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
    return Object.values(module).shift() ?? rollupConfig
  }

  return rollupConfig
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
