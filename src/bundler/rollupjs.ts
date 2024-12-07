import fsExtra from 'fs-extra'
import { Plugin, rollup } from 'rollup'
import rollupConfig from './rollup.config'
import { IBlueprint } from '@stone-js/core'
import { StoneRollupOptions } from '../declarations.js'
import { RollupReplaceOptions } from '@rollup/plugin-replace'
import { checkAutoloadModule, getEnvVariables, basePath, buildPath, distPath, importModule } from '../utils.js'

const { pathExistsSync } = fsExtra

/**
 * Rollup build process.
 *
 * @param blueprint - The blueprint.
 */
export async function rollupBuild (blueprint: IBlueprint): Promise<void> {
  const options = await makeBuildOptions(blueprint)

  for (const option of options) {
    const bundle = await rollup(option)
    if (Array.isArray(option.output)) {
      await Promise.all(option.output?.map(bundle.write.bind(bundle)))
    }
  }
}

/**
 * Rollup bundle process.
 *
 * @param blueprint - The blueprint.
 */
export async function rollupBundle (blueprint: IBlueprint): Promise<void> {
  const options = await makeBundleOptions(blueprint)
  const bundle = await rollup(options)
  if (Array.isArray(options.output)) {
    await Promise.all(options.output.map(bundle.write.bind(bundle)))
  }
}

/**
 * Generate Rollup build options based on the configuration.
 *
 * @param blueprint - The blueprint.
 * @returns An array of Rollup build options.
 */
async function makeBuildOptions (blueprint: IBlueprint): Promise<StoneRollupOptions[]> {
  const rollupOptionsFactory = await getRollupConfig(blueprint)

  return Object.entries(blueprint.get<Record<string, string>>('stone.autoload.modules', {}))
    .filter(([name]) => checkAutoloadModule(blueprint, name))
    .map(([name, input]) =>
      rollupOptionsFactory({
        input: basePath(input),
        output: [
          {
            format: 'es',
            file: buildPath(`${name}.mjs`)
          }
        ],
        plugins: [],
        replaceOptions: { preventAssignment: true }
      })
    )
}

/**
 * Generate Rollup bundle options for the entire application.
 *
 * @param blueprint - The blueprint.
 * @returns A single RollupOptions object for bundling.
 */
async function makeBundleOptions (blueprint: IBlueprint): Promise<StoneRollupOptions> {
  const rollupOptionsFactory = await getRollupConfig(blueprint)
  const bundleExcludes = ['babel', 'multi-entry']

  const options = rollupOptionsFactory({
    input: buildPath('app.bootstrap.mjs'),
    output: [
      {
        format: 'es',
        file: distPath('stone.mjs')
      }
    ],
    plugins: [],
    externalsOptions: { deps: false },
    replaceOptions: replaceProcessEnvVars(blueprint)
  })

  if (Array.isArray(options.plugins)) {
    options.plugins = options.plugins?.filter(
      (plugin) => bundleExcludes.includes((plugin as Plugin)?.name)
    )
  }

  return options
}

/**
 * Retrieve Rollup configuration.
 *
 * @param blueprint - The blueprint (optional for backward compatibility).
 * @returns A function to generate RollupOptions objects.
 */
async function getRollupConfig (_blueprint?: IBlueprint): Promise<(options: StoneRollupOptions) => StoneRollupOptions> {
  if (pathExistsSync(basePath('rollup.config.mjs'))) {
    const module = await importModule<{ [k: string]: (options: StoneRollupOptions) => StoneRollupOptions }>('rollup.config.mjs')
    const config = Object.values(module ?? {}).shift()
    return typeof config === 'function' ? config : rollupConfig
  }

  return rollupConfig
}

/**
 * Generate replace options for process environment variables.
 *
 * @param blueprint - The blueprint.
 * @returns An object with environment variable replacement details.
 */
function replaceProcessEnvVars (blueprint: IBlueprint): RollupReplaceOptions {
  const options = blueprint.get<Record<string, any>>('stone.dotenv', {})
  const publicOptions = { ...options.options, ...options.public }
  const prefix = publicOptions.prefix ?? 'window.__stone_env__'

  const publicEnv = getEnvVariables(publicOptions) ?? {}

  const values = prefix.endsWith('.') === true
    ? Object.entries(publicEnv).reduce((acc, [key, value]) => ({ ...acc, [`${String(prefix)}${String(key)}`]: JSON.stringify(value) }), {})
    : { [prefix]: JSON.stringify(publicEnv) }

  return {
    values,
    ...options.replace
  }
}
