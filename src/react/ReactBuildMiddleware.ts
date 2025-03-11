import { glob } from 'glob'
import fsExtra from 'fs-extra'
import { relative } from 'node:path'
import { existsSync } from 'node:fs'
import { isTypescriptApp } from '../utils'
import { build, mergeConfig } from 'vite'
import { PageRouteDefinition } from '@stone-js/router'
import { MetaPipe, NextPipe } from '@stone-js/pipeline'
import { reactHtmlTemplate, reactClientTemplate, reactServerTemplate } from './stubs'
import { removeImportsVitePlugin } from './RemoveImportsVitePlugin'
import { basePath, buildPath, distPath } from '@stone-js/filesystem'
import { getViteConfig, removedBuiltinSSRImports } from './react-utils'
import { getMetadata, hasMetadata, isNotEmpty, IBlueprint, ClassType } from '@stone-js/core'
import { REACT_ADAPTER_ERROR_HANDLER_KEY, REACT_ERROR_HANDLER_KEY, REACT_PAGE_KEY, REACT_PAGE_LAYOUT_KEY } from '@stone-js/use-react'

const { outputFileSync, moveSync, removeSync, readFileSync } = fsExtra

/**
 * Generates an index file for all views in the application.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateViewsIndexMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  console.info('Generating lazy routes...')

  let imports = ''
  let exportsMap = ''
  const path = buildPath('tmp/viewsIndex.mjs')
  const files = glob.sync(basePath(blueprint.get('stone.autoload.views', 'app/**/*.{tsx,jsx,mjsx}')))

  files.forEach((filePath, index) => {
    const relFilePath = relative(buildPath('tmp'), filePath)
    const importName = `View${index}`
    imports += `import * as ${importName} from '${relFilePath}';\n`
    exportsMap += `  '${relFilePath}': ${importName},\n`
  })

  const value = `
    ${imports}
    export const views = {
      ${exportsMap}
    };
  `

  outputFileSync(path, value, 'utf-8')

  return await next(blueprint)
}

/**
 * Builds the views using Vite.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
*/
export const BuildViewsMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  const userConfig = await getViteConfig('build', 'production')

  const viteConfig = mergeConfig(userConfig, {
    build: {
      minify: false,
      target: 'esnext',
      sourcemap: false,
      lib: {
        formats: ['es'],
        entry: buildPath('tmp/viewsIndex.mjs')
      },
      rollupOptions: {
        output: {
          format: 'es',
          dir: buildPath('/tmp'),
          entryFileNames: '[name].mjs'
        }
      },
      emptyOutDir: false
    }
  })

  await build(viteConfig)

  return await next(blueprint)
}

/**
 * Generates a lazy page routes file.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateLazyPageRoutesMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  let exported = ''
  const definitions: PageRouteDefinition[] = []
  const { views } = await import(buildPath('tmp/viewsIndex.mjs'))

  for (const [path, view] of Object.entries<Record<string, ClassType>>(views)) {
    const module = Object.values(view)[0]
    const pageOptions = getMetadata(module, REACT_PAGE_KEY)

    if (
      hasMetadata(module, REACT_PAGE_LAYOUT_KEY) ||
      hasMetadata(module, REACT_ERROR_HANDLER_KEY) ||
      hasMetadata(module, REACT_ADAPTER_ERROR_HANDLER_KEY)
    ) {
      exported += `export * from '${path}';\n`
    }

    if (isNotEmpty<PageRouteDefinition>(pageOptions)) {
      definitions.push({
        ...pageOptions,
        handler: {
          lazy: true,
          ...pageOptions.handler,
          module: `() => import('${path}').then(v => Object.values(v)[0])` as any
        }
      })
    }
  }

  const routerBlueprint = {
    stone: {
      router: {
        definitions
      }
    }
  }
  const replacePattern = /"(\(\) => import\([^)]+\)\.then\(v => Object\.values\(v\)\[0\]\))"/g
  const routesContent = `
  ${exported}
  export const dynamicBlueprint = ${JSON.stringify(routerBlueprint, null, 2).replace(replacePattern, '$1')};
  `

  outputFileSync(
    buildPath(isTypescriptApp(blueprint) ? 'tmp/routes.ts' : 'tmp/routes.mjs'),
    routesContent,
    'utf-8'
  )

  return await next(blueprint)
}

/**
 * Generates an index file for all modules in the application.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateClientFileMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  outputFileSync(
    buildPath(isTypescriptApp(blueprint) ? 'tmp/index.ts' : 'tmp/index.mjs'),
    reactClientTemplate(relative(
      buildPath('tmp'),
      basePath(blueprint.get('stone.autoload.app', 'app/**/*.{ts,js,mjs,json}'))
    )),
    'utf-8'
  )
  return await next(blueprint)
}

/**
 * Generates a server file for all modules in the application.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateReactServerFileMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  outputFileSync(
    buildPath(isTypescriptApp(blueprint) ? 'tmp/server.ts' : 'tmp/server.mjs'),
    reactServerTemplate(relative(
      buildPath('tmp'),
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
export const GenerateIndexHtmlFileMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  outputFileSync(
    buildPath('tmp/index.html'),
    reactHtmlTemplate(isTypescriptApp(blueprint) ? './index.ts' : './index.mjs'),
    'utf-8'
  )
  return await next(blueprint)
}

/**
 * Builds the client application using Vite.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const BuildClientAppMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  console.info('Building client application...')
  const hasUserIndex = existsSync(basePath('index.html'))
  const userConfig = await getViteConfig('build', 'production')
  const customInput = {
    plugins: [
      removeImportsVitePlugin(removedBuiltinSSRImports)
    ],
    build: {
      emptyOutDir: true,
      outDir: distPath(),
      rollupOptions: hasUserIndex
        ? {}
        : {
            input: buildPath('tmp/index.html')
          }
    }
  }
  const viteConfig = mergeConfig(userConfig, customInput)

  await build(viteConfig)

  return await next(blueprint)
}

/**
 * Builds the server application using Vite.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const BuildReactServerAppMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  console.info('Building server application...')
  const userConfig = await getViteConfig('build', 'production')
  const customInput = {
    build: {
      emptyOutDir: false,
      outDir: distPath(),
      ssr: buildPath(isTypescriptApp(blueprint) ? 'tmp/server.ts' : 'tmp/server.mjs'),
      rollupOptions: {
        output: {
          entryFileNames: 'server.mjs',
          chunkFileNames: 'assets/server-[name]-[hash].mjs'
        }
      }
    },
    ssr: {
      noExternal: true,
      external: undefined
    }
  }
  const viteConfig = mergeConfig(userConfig, customInput)

  await build(viteConfig)

  return await next(blueprint)
}

/**
 * Makes the server HTML template.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const MakeServerHtmlTemplateMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  outputFileSync(
    distPath('template.mjs'),
    `export const template = \`${readFileSync(distPath('.stone/tmp/index.html'), 'utf-8')}\`;`,
    'utf-8'
  )

  return await next(blueprint)
}

/**
 * Build terminating middleware.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const BuildReactTerminatingMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  moveSync(distPath('.stone/tmp/index.html'), distPath('index.html'))
  removeSync(buildPath('tmp'))
  removeSync(distPath('.stone'))

  return await next(blueprint)
}

/**
 * Middleware for building SPA React applications.
 */
export const ReactClientBuildMiddleware: Array<MetaPipe<IBlueprint>> = [
  { module: GenerateViewsIndexMiddleware, priority: 0 },
  { module: BuildViewsMiddleware, priority: 1 },
  { module: GenerateLazyPageRoutesMiddleware, priority: 2 },
  { module: GenerateClientFileMiddleware, priority: 3 },
  { module: GenerateIndexHtmlFileMiddleware, priority: 4 },
  { module: BuildClientAppMiddleware, priority: 5 },
  { module: BuildReactTerminatingMiddleware, priority: 6 }
]

/**
 * Middleware for building SSR React applications.
 */
export const ReactServerBuildMiddleware: Array<MetaPipe<IBlueprint>> = [
  { module: GenerateViewsIndexMiddleware, priority: 0 },
  { module: BuildViewsMiddleware, priority: 1 },
  { module: GenerateLazyPageRoutesMiddleware, priority: 2 },
  { module: GenerateClientFileMiddleware, priority: 3 },
  { module: GenerateIndexHtmlFileMiddleware, priority: 4 },
  { module: BuildClientAppMiddleware, priority: 5 },
  { module: GenerateReactServerFileMiddleware, priority: 6 },
  { module: BuildReactServerAppMiddleware, priority: 7 },
  { module: MakeServerHtmlTemplateMiddleware, priority: 8 },
  { module: BuildReactTerminatingMiddleware, priority: 9 }
]
