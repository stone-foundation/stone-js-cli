import fsExtra from 'fs-extra'
import { rollup } from 'rollup'
import { setCache } from '../utils'
import { IBlueprint } from '@stone-js/core'
import replace from '@rollup/plugin-replace'
import { getRollupConfig } from './server-utils'
import { existsSync, readFileSync } from 'node:fs'
import { MetaPipe, NextPipe } from '@stone-js/pipeline'
import { basePath, buildPath } from '@stone-js/filesystem'
import { consoleIndexFile, serverIndexFile } from './stubs'

const { outputFileSync } = fsExtra

/**
 * Builds the server application using Rollup.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const BuildDevServerAppMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  const rollupConfig = await getRollupConfig()
  const plugins = rollupConfig.plugins ?? []
  const pattern = blueprint.get(
    'stone.autoload.all',
    'app/**/*.{ts,js,mjs,json}'
  )

  rollupConfig.input = basePath(pattern)
  rollupConfig.output = {
    format: 'es',
    file: buildPath('modules.mjs')
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
export const GenerateDevServerFileMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  const content = existsSync(basePath('server.mjs'))
    ? readFileSync(basePath('server.mjs'), 'utf-8')
    : serverIndexFile(blueprint.get('stone.server.printUrls', false))

  outputFileSync(buildPath('server.mjs'), content, 'utf-8')

  return await next(blueprint)
}

/**
 * Generates a console file.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateConsoleFileMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  const pattern = blueprint.get(
    'stone.autoload.all',
    'app/**/*.{ts,js,mjs,json}'
  )
  const content = existsSync(basePath('console.mjs'))
    ? readFileSync(basePath('console.mjs'), 'utf-8')
    : consoleIndexFile()

  setCache(pattern)
  outputFileSync(buildPath('console.mjs'), content, 'utf-8')

  return await next(blueprint)
}

/**
 * Middleware for building server applications.
 */
export const ServerDevMiddleware: Array<MetaPipe<IBlueprint>> = [
  { module: BuildDevServerAppMiddleware, priority: 0 },
  { module: GenerateDevServerFileMiddleware, priority: 1 }
]

/**
 * Middleware for building server applications.
 */
export const ConsoleDevMiddleware: Array<MetaPipe<IBlueprint>> = [
  { module: BuildDevServerAppMiddleware, priority: 0 },
  { module: GenerateConsoleFileMiddleware, priority: 2 }
]
