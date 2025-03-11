import fsExtra from 'fs-extra'
import { relative } from 'node:path'
import { build, mergeConfig } from 'vite'
import { IBlueprint } from '@stone-js/core'
import { getViteConfig } from './react-utils'
import { isTypescriptApp, setCache } from '../utils'
import { MetaPipe, NextPipe } from '@stone-js/pipeline'
import { basePath, buildPath } from '@stone-js/filesystem'
import { reactServerTemplate, reactHtmlTemplate, viteServerTemplate, reactConsoleTemplate } from './stubs'

const { outputFileSync } = fsExtra

/**
 * Generates an index file for all modules in the application.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateEntryPointFileMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  outputFileSync(
    buildPath(isTypescriptApp(blueprint) ? 'index.ts' : 'index.mjs'),
    reactServerTemplate(relative(
      buildPath(),
      basePath(blueprint.get('stone.autoload.all', 'app/**/*.{ts,tsx,js,mjs,mjsx,jsx,json}'))
    )),
    'utf-8'
  )
  return await next(blueprint)
}

/**
 * Generates an index HTML file for the application.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateDevHtmlTemplateFileMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  outputFileSync(
    buildPath('index.html'),
    reactHtmlTemplate(
      isTypescriptApp(blueprint) ? './index.ts' : './index.mjs',
      basePath('/assets/css/index.css')
    ),
    'utf-8'
  )
  return await next(blueprint)
}

/**
 * Generates a development server for the application.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateDevServerMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  outputFileSync(
    buildPath('server.mjs'),
    viteServerTemplate(),
    'utf-8'
  )
  return await next(blueprint)
}

/**
 * Generates console index file for all modules in the application.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateReactConsoleFileMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  outputFileSync(
    buildPath(isTypescriptApp(blueprint) ? 'console-index.ts' : 'console-index.mjs'),
    reactConsoleTemplate(relative(
      buildPath(),
      basePath(blueprint.get('stone.autoload.all', 'app/**/*.{ts,tsx,js,mjs,mjsx,jsx,json}'))
    )),
    'utf-8'
  )

  outputFileSync(
    buildPath('template.mjs'),
    'export const template = ""',
    'utf-8'
  )

  return await next(blueprint)
}

/**
 * Builds the console application using Vite.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const BuildConsoleAppMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  const userConfig = await getViteConfig('build', 'production')
  const pattern = blueprint.get(
    'stone.autoload.all',
    'app/**/*.{ts,tsx,js,mjs,mjsx,jsx,json}'
  )
  const customInput = {
    build: {
      emptyOutDir: false,
      outDir: buildPath(),
      ssr: buildPath(isTypescriptApp(blueprint) ? 'console-index.ts' : 'console-index.mjs'),
      rollupOptions: {
        output: {
          entryFileNames: 'console.mjs',
          chunkFileNames: 'console-[name].mjs'
        }
      }
    }
  }
  const viteConfig = mergeConfig(userConfig, customInput)

  await build(viteConfig)

  setCache(pattern)

  return await next(blueprint)
}

/**
 * Middleware for building React applications.
 */
export const ReactDevMiddleware: Array<MetaPipe<IBlueprint>> = [
  { module: GenerateEntryPointFileMiddleware, priority: 0 },
  { module: GenerateDevHtmlTemplateFileMiddleware, priority: 1 },
  { module: GenerateDevServerMiddleware, priority: 2 }
]

/**
 * Middleware for building server applications.
 */
export const ReactConsoleMiddleware: Array<MetaPipe<IBlueprint>> = [
  { module: GenerateReactConsoleFileMiddleware, priority: 0 },
  { module: BuildConsoleAppMiddleware, priority: 2 }
]
