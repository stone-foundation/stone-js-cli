import chalk from 'chalk'
import fsExtra from 'fs-extra'
import { rollup } from 'rollup'
import { serverIndexFile } from './stubs'
import { IBlueprint } from '@stone-js/core'
import replace from '@rollup/plugin-replace'
import { existsSync, readFileSync } from 'node:fs'
import { MetaPipe, NextPipe } from '@stone-js/pipeline'
import { basePath, buildPath, distPath } from '@stone-js/filesystem'
import { getRollupConfig, replaceProcessEnvVars } from './server-utils'

const { outputFileSync, removeSync } = fsExtra

/**
 * Builds the server application using Rollup.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const BuildServerAppMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  console.log(`${chalk.yellow('⚡ Building application...')}`)
  const rollupConfig = await getRollupConfig()
  const plugins = rollupConfig.plugins ?? []
  rollupConfig.input = basePath(blueprint.get('stone.autoload.all', 'app/**/*.{ts,js,mjs,json}'))
  rollupConfig.output = {
    format: 'es',
    file: buildPath('tmp/modules.mjs')
  }
  if (Array.isArray(plugins)) {
    plugins.push(replace({ preventAssignment: true }))
  }

  const bundle = await rollup(rollupConfig)

  await bundle.write(rollupConfig.output)

  return await next(blueprint)
}

/**
 * Generates a server file.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateServerFileMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  const content = existsSync(basePath('server.mjs'))
    ? readFileSync(basePath('server.mjs'), 'utf-8')
    : serverIndexFile(blueprint.get('stone.server.printUrls', true))

  outputFileSync(buildPath('tmp/server.mjs'), content, 'utf-8')

  return await next(blueprint)
}

/**
 * Bundles the server application using Rollup.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const BundleServerAppMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  console.log(`${chalk.green('🚀 Bundling application...')}`)
  const rollupConfig = await getRollupConfig('bundle')
  const plugins = rollupConfig.plugins ?? []
  rollupConfig.input = buildPath('tmp/server.mjs')
  rollupConfig.output = {
    format: 'es',
    file: distPath('index.mjs')
  }
  if (Array.isArray(plugins)) {
    plugins.push(replace(replaceProcessEnvVars(blueprint)))
  }

  const bundle = await rollup(rollupConfig)

  await bundle.write(rollupConfig.output)

  return await next(blueprint)
}

/**
 * Build terminating middleware.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const BuildTerminatingMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  removeSync(buildPath('tmp'))

  return await next(blueprint)
}

/**
 * Middleware for building Server applications.
 */
export const ServerBuildMiddleware: Array<MetaPipe<IBlueprint>> = [
  { module: BuildServerAppMiddleware, priority: 0 },
  { module: GenerateServerFileMiddleware, priority: 1 },
  { module: BundleServerAppMiddleware, priority: 2 },
  { module: BuildTerminatingMiddleware, priority: 3 }
]
