import fsExtra from 'fs-extra'
import { IBlueprint } from '@stone-js/core'
import { CliError } from './errors/CliError'
import { DotenvConfig } from './options/DotenvConfig'
import { basePath, getEnvVariables, getStoneOptions } from './utils'

const { pathExistsSync } = fsExtra

/**
 * Ensure that the current directory is a Stone project.
 */
const ensureStoneProject = (): void => {
  if (!pathExistsSync(basePath('stone.config.js')) && !pathExistsSync(basePath('stone.config.mjs'))) {
    throw new CliError('This is not a Stone project. Please run this command in a Stone project directory.')
  }
}

/**
 * Loads the Stone configuration from the user's root project.
 * The configuration is expected to be in the file `stone.config.mjs`.
 *
 * @param blueprint - The blueprint object to set the configuration options on.
 * @returns A promise that resolves when the configuration has been loaded and set.
 */
const loadStoneConfig = async (blueprint: IBlueprint): Promise<void> => {
  const config = await getStoneOptions()
  blueprint.set('stone.dotenv', config.dotenv)
  blueprint.set('stone.autoload', config.autoload)
}

/**
 * Load the env variables in .env file to process.env.
 *
 * @returns This StoneCliServiceProvider instance for chaining.
 */
const loadDotenvVariables = (blueprint: IBlueprint): void => {
  const options = blueprint.get<DotenvConfig>('stone.dotenv', {})
  const publicOptions = { ...options?.options, ...options?.public }
  const privateOptions = { ...options?.options, ...options?.private }

  getEnvVariables(publicOptions)
  getEnvVariables(privateOptions)
}

/**
 * Hook that runs once before everything.
 */
export const onInit = [
  ensureStoneProject,
  loadStoneConfig,
  loadDotenvVariables
]
