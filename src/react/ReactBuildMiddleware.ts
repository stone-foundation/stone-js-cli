import { glob } from 'glob'
import fsExtra from 'fs-extra'
import { relative } from 'node:path'
import { existsSync } from 'node:fs'
import { build, mergeConfig } from 'vite'
import { isTypescriptApp } from '../utils'
import { getViteConfig } from './react-utils'
import { ConsoleContext } from '../declarations'
import { PageRouteDefinition } from '@stone-js/router'
import { MetaPipe, NextPipe } from '@stone-js/pipeline'
import { removeImportsVitePlugin } from './RemoveImportsVitePlugin'
import { basePath, buildPath, distPath } from '@stone-js/filesystem'
import { getMetadata, hasMetadata, isNotEmpty, IBlueprint, ClassType } from '@stone-js/core'
import { reactHtmlEntryPointTemplate, reactClientEntryPointTemplate, reactServerEntryPointTemplate } from './stubs'
import { REACT_ADAPTER_ERROR_HANDLER_KEY, REACT_ERROR_HANDLER_KEY, REACT_PAGE_KEY, REACT_PAGE_LAYOUT_KEY } from '@stone-js/use-react'

const { outputFileSync, moveSync, removeSync, readFileSync } = fsExtra

/**
 * Generates an index file for all views in the application.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateViewsIndexMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  context.commandOutput.info('Generating lazy routes...')

  let imports = ''
  let exportsMap = ''
  const path = buildPath('tmp/viewsIndex.mjs')
  const files = glob.sync(basePath(context.blueprint.get(
    'stone.builder.input.views', 'app/**/*.{tsx,jsx,mjsx}'
  )))

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

  return await next(context)
}

/**
 * Builds the views using Vite.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
*/
export const BuildViewsMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
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

  return await next(context)
}

/**
 * Generates a lazy page routes file.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateLazyPageRoutesMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
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
    buildPath(isTypescriptApp(context.blueprint) ? 'tmp/routes.ts' : 'tmp/routes.mjs'),
    routesContent,
    'utf-8'
  )

  return await next(context)
}

/**
 * Generates the client file for the application.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateClientFileMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  const pattern = relative(
    buildPath('tmp'),
    basePath(context.blueprint.get('stone.builder.input.app', 'app/**/*.{ts,js,mjs,json}'))
  )

  const isTypescript = isTypescriptApp(context.blueprint)
  const userFilename = isTypescript ? 'client.ts' : 'client.mjs'
  const filename = isTypescript ? 'tmp/index.ts' : 'tmp/index.mjs'

  let content = existsSync(basePath(userFilename))
    ? readFileSync(basePath(userFilename), 'utf-8')
    : reactClientEntryPointTemplate(pattern)

  // Add the lazy routes to the client file
  content = `import * as pageRoutes from './routes${isTypescript ? '' : '.mjs'}';\n`
    .concat(content)
    .replace('%pattern%', pattern)
    .replace('// %concat%', '.concat(Object.values(pageRoutes))')

  outputFileSync(buildPath(filename), content, 'utf-8')

  return await next(context)
}

/**
 * Generates a server file for all modules in the application.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateReactServerFileMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  const pattern = relative(
    buildPath('tmp'),
    basePath(context.blueprint.get('stone.builder.input.all', 'app/**/*.**'))
  )
  const printUrls = context.blueprint.get('stone.builder.server.printUrls', true)

  const isTypescript = isTypescriptApp(context.blueprint)
  const userFilename = isTypescript ? 'server.ts' : 'server.mjs'
  const filename = isTypescript ? 'tmp/server.ts' : 'tmp/server.mjs'

  let content = existsSync(basePath(userFilename))
    ? readFileSync(basePath(userFilename), 'utf-8')
    : reactServerEntryPointTemplate(pattern, printUrls)

  content = content
    .replace('%pattern%', pattern)
    .replace("'%printUrls%'", String(printUrls))

  outputFileSync(buildPath(filename), content, 'utf-8')

  return await next(context)
}

/**
 * Generates an index HTML file for the application.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateIndexHtmlFileMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  const jsEntryPoint = isTypescriptApp(context.blueprint) ? 'index.ts' : 'index.mjs'
  const cssEntryPoint = context.blueprint.get('stone.builder.input.mainCSS', '/assets/css/index.css')

  const mainjs = `<script type="module" src="${jsEntryPoint}"></script>`
  const mainCSS = `<link rel="stylesheet" href="${basePath(cssEntryPoint)}" />`

  let content = existsSync(basePath('index.html'))
    ? readFileSync(basePath('index.html'), 'utf-8')
    : reactHtmlEntryPointTemplate(mainjs, mainCSS)

  content = content
    .replace('<!--main-js-->', mainjs)
    .replace('<!--main-css-->', mainCSS)

  outputFileSync(buildPath('tmp/index.html'), content, 'utf-8')

  return await next(context)
}

/**
 * Builds the client application using Vite.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const BuildClientAppMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  context.commandOutput.info('Building client application...')
  const userConfig = await getViteConfig('build', 'production')
  const excludedModules = context.blueprint.get('stone.builder.browser.excludedModules', [])
  const customInput = {
    plugins: [
      removeImportsVitePlugin(excludedModules)
    ],
    build: {
      emptyOutDir: true,
      outDir: distPath(),
      rollupOptions: {
        input: buildPath('tmp/index.html')
      }
    }
  }
  const viteConfig = mergeConfig(userConfig, customInput)

  await build(viteConfig)

  return await next(context)
}

/**
 * Builds the server application using Vite.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const BuildReactServerAppMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  console.info('Building server application...')
  const userConfig = await getViteConfig('build', 'production')
  const customInput = {
    build: {
      emptyOutDir: false,
      outDir: distPath(),
      ssr: buildPath(isTypescriptApp(context.blueprint) ? 'tmp/server.ts' : 'tmp/server.mjs'),
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

  return await next(context)
}

/**
 * Makes the server HTML template.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const MakeServerHtmlTemplateMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  outputFileSync(
    distPath('template.mjs'),
    `export const template = \`${readFileSync(distPath('.stone/tmp/index.html'), 'utf-8')}\`;`,
    'utf-8'
  )

  return await next(context)
}

/**
 * Build terminating middleware.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const BuildReactTerminatingMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  moveSync(distPath('.stone/tmp/index.html'), distPath('index.html'))
  removeSync(buildPath('tmp'))
  removeSync(distPath('.stone'))

  return await next(context)
}

/**
 * Middleware for building SPA React applications.
 */
export const ReactClientBuildMiddleware: Array<MetaPipe<ConsoleContext, IBlueprint>> = [
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
export const ReactServerBuildMiddleware: Array<MetaPipe<ConsoleContext, IBlueprint>> = [
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
