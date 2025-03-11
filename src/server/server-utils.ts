import { existsSync } from 'fs'
import { RollupOptions } from 'rollup'
import { getEnvVariables } from '../utils'
import { IBlueprint } from '@stone-js/core'
import rollupBuildConfig from './rollup.config'
import rollupBundleConfig from './rollup.bundle.config'
import { basePath, importModule } from '@stone-js/filesystem'
import { RollupReplaceOptions } from '@rollup/plugin-replace'

/**
 * Gets the Rollup configuration.
 *
 * @returns The Rollup configuration.
 */
export const getRollupConfig = async (
  command: 'build' | 'bundle' = 'build'
): Promise<RollupOptions> => {
  let config: RollupOptions | undefined
  const filename = command === 'bundle' ? 'rollup.bundle.config' : 'rollup.config'

  if (existsSync(basePath(`${filename}.mjs`))) {
    config = await importModule<RollupOptions>(`${filename}.mjs`)
  } else if (existsSync(basePath(`${filename}.js`))) {
    config = await importModule<RollupOptions>(`${filename}.js`)
  }

  return config ?? (command === 'bundle' ? rollupBundleConfig : rollupBuildConfig)
}

/**
 * Generate replace options for process environment variables.
 *
 * This function takes the environment variables from the `.env`
 * file add prefixes to them, stringify them and return the with rollup replace options plugin.
 *
 * The prcocess is done only for the public environment variables during the bundled staged.
 *
 * @param blueprint - The blueprint.
 * @returns An object with environment variable replacement details.
 */
export function replaceProcessEnvVars (blueprint: IBlueprint): RollupReplaceOptions {
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
