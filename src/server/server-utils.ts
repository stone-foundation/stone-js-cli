import { existsSync } from 'fs'
import { RollupOptions } from 'rollup'
import { getEnvVariables } from '../utils'
import { IBlueprint } from '@stone-js/core'
import { RollupConfig } from '../options/BuilderConfig'
import { RollupReplaceOptions } from '@rollup/plugin-replace'
import { basePath, importModule } from '@stone-js/filesystem'

/**
 * Gets the Rollup configuration.
 *
 * @returns The Rollup configuration.
 */
export const getRollupConfig = async (
  blueprint: IBlueprint,
  command: 'build' | 'bundle' = 'build'
): Promise<RollupOptions> => {
  const filename = 'rollup.config'
  const config = blueprint.get<RollupConfig>('stone.builder.rollup', {} as any)
  let module: Record<'rollupBuildConfig' | 'rollupBundleConfig', RollupOptions> | undefined

  if (existsSync(basePath(`${filename}.mjs`))) {
    module = await importModule(`${filename}.mjs`)
  } else if (existsSync(basePath(`${filename}.js`))) {
    module = await importModule(`${filename}.js`)
  }

  // Full override if the rollup config file exists.
  config.build = module?.rollupBuildConfig ?? config.build
  config.bundle = module?.rollupBundleConfig ?? config.bundle

  return config[command]
}

/**
 * Generate replace options for process environment variables.
 *
 * This function takes the environment variables from the `.env`
 * file add prefixes to them, stringify them and return them with rollup replace options plugin.
 *
 * The prcocess is done only for the public environment variables during the bundled staged.
 *
 * @param blueprint - The blueprint.
 * @returns An object with environment variable replacement details.
 */
export function replaceProcessEnvVars (blueprint: IBlueprint): RollupReplaceOptions {
  const options = blueprint.get<Record<string, any>>('stone.builder.dotenv', {})
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
