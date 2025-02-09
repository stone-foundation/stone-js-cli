import fsExtra from 'fs-extra'
import { IBlueprint } from '@stone-js/core'
import { CommandOutput } from '@stone-js/node-cli-adapter'
import { rollupBuild, rollupBundle } from '../bundler/rollupjs'
import { pipeable, buildPath, setCache, makeBootstrapFile, distPath } from '../utils'

const { emptyDirSync } = fsExtra

/**
 * Represents the context for building or bundling an application.
 */
export interface BuildAppContext {
  /**
   * The blueprint configuration used to guide the build or bundle process.
   */
  blueprint: IBlueprint

  /**
   * The command output object used to log messages during the build or bundle process.
   */
  commandOutput: CommandOutput
}

/**
 * Middleware pipeline for building the application.
 *
 * This pipeline includes tasks such as clearing the build directory, running Rollup builds,
 * setting the cache, and generating bootstrap files. It logs the progress to the command output.
 */
export const buildMiddleware = [
  /**
   * Logs the start of the build process.
   *
   * @param context - The build application context.
   */
  pipeable(({ commandOutput }: BuildAppContext) => commandOutput.info('Building...')),

  /**
   * Clears the build directory.
   */
  pipeable(() => emptyDirSync(buildPath())),

  /**
   * Runs the Rollup build process based on the blueprint.
   *
   * @param context - The build application context.
   */
  pipeable(async ({ blueprint }: BuildAppContext) => await rollupBuild(blueprint)),

  /**
   * Sets the build cache for the blueprint.
   *
   * @param context - The build application context.
   */
  pipeable(({ blueprint }: BuildAppContext) => setCache(blueprint)),

  /**
   * Generates the main bootstrap file for the build process.
   *
   * @param context - The build application context.
   */
  pipeable(({ blueprint }: BuildAppContext) => makeBootstrapFile(blueprint, 'build')),

  /**
   * Generates an additional bootstrap file (e.g., for testing) during the build process.
   *
   * @param context - The build application context.
   */
  pipeable(({ blueprint }: BuildAppContext) => makeBootstrapFile(blueprint, 'build', true)),

  /**
   * Logs the completion of the build process.
   *
   * @param context - The build application context.
   */
  pipeable(({ commandOutput }: BuildAppContext) => commandOutput.info('Build finished'))
]

/**
 * Middleware pipeline for bundling the application.
 *
 * This pipeline includes tasks such as clearing the distribution directory,
 * running Rollup bundling, and logging progress to the command output.
 */
export const bundleMiddleware = [
  /**
   * Logs the start of the bundling process.
   *
   * @param context - The build application context.
   */
  pipeable(({ commandOutput }: BuildAppContext) => commandOutput.info('Bundling...')),

  /**
   * Clears the distribution directory.
   */
  pipeable(() => emptyDirSync(distPath())),

  /**
   * Runs the Rollup bundling process based on the blueprint.
   *
   * @param context - The build application context.
   */
  pipeable(async ({ blueprint }: BuildAppContext) => await rollupBundle(blueprint)),

  /**
   * Logs the completion of the build process.
   *
   * @param context - The build application context.
   */
  pipeable(({ commandOutput }: BuildAppContext) => commandOutput.info('Build finished'))
]
