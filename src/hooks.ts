import fsExtra from 'fs-extra'
import { IBlueprint } from '@stone-js/core'
import { CliError } from './errors/CliError'
import { DotenvConfig } from './declarations'
import { basePath, getEnvVariables } from './utils'

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
export const onInit = [ensureStoneProject, loadDotenvVariables]
