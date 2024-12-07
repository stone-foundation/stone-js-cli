import { pathExistsSync } from 'fs-extra'
import { CliError } from './errors/CliError'
import { DotenvConfig } from './declarations'
import { basePath, getEnvVariables } from './utils'
import { IBlueprint, IProvider } from '@stone-js/core'

/**
 * Stone CLI Service Provider.
 */
export class StoneCliServiceProvider implements IProvider {
  /**
   * Hook that runs once before everything.
   */
  static onInit (blueprint: IBlueprint): void {
    this.ensureStoneProject()
    this.loadDotenvVariables(blueprint)
  }

  /**
   * Ensure that the current directory is a Stone project.
   */
  private static ensureStoneProject (): void {
    if (pathExistsSync(basePath('stone.config.js')) || pathExistsSync(basePath('stone.config.mjs'))) {
      throw new CliError('This is not a Stone project. Please run this command in a Stone project directory.')
    }
  }

  /**
   * Load the env variables in .env file to process.env.
   *
   * @returns This StoneCliServiceProvider instance for chaining.
   */
  private static loadDotenvVariables (blueprint: IBlueprint): void {
    const options = blueprint.get<DotenvConfig>('stone.dotenv', {})
    const publicOptions = { ...options?.options, ...options?.public }
    const privateOptions = { ...options?.options, ...options?.private }

    getEnvVariables(publicOptions)
    getEnvVariables(privateOptions)
  }

  /**
   * Hook that runs before the main handler is invoked.
   */
  beforeHandle (): void {}
}
