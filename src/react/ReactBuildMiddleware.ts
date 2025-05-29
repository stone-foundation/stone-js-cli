import { glob } from 'glob'
import fsExtra from 'fs-extra'
import { relative } from 'node:path'
import { existsSync } from 'node:fs'
import { build, mergeConfig } from 'vite'
import { ConsoleContext } from '../declarations'
import { PageRouteDefinition } from '@stone-js/router'
import { MetaPipe, NextPipe } from '@stone-js/pipeline'
import { removeImportsVitePlugin } from './RemoveImportsVitePlugin'
import { basePath, buildPath, distPath } from '@stone-js/filesystem'
import { isNotEmpty, IBlueprint, ClassType, isStoneBlueprint } from '@stone-js/core'
import { generatePublicEnviromentsFile, isDeclarative, isLazyViews, isTypescriptApp } from '../utils'
import { generateDeclarativeLazyPages, generateImperativeLazyPages, getViteConfig } from './react-utils'
import { reactHtmlEntryPointTemplate, reactClientEntryPointTemplate, reactServerEntryPointTemplate } from './stubs'
import { MetaAdapterErrorPage, MetaErrorPage, MetaPageLayout, ReactIncomingEvent, UseReactBlueprint } from '@stone-js/use-react'

const { outputFileSync, moveSync, removeSync, readFileSync } = fsExtra

/**
 * Lazy: Generates an index file for all views in the application.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateViewsIndexMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  if (!isLazyViews(context.blueprint, context.event)) {
    return await next(context)
  }

  context.commandOutput.info('Generating lazy pages...')

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
 * Lazy: Builds the views using Vite.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
*/
export const BuildViewsMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  if (!isLazyViews(context.blueprint, context.event)) {
    return await next(context)
  }

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
 * Lazy: Generates a lazy pages file.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GenerateLazyPageMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  if (!isLazyViews(context.blueprint, context.event)) {
    return await next(context)
  }

  const definitions: PageRouteDefinition[] = []
  const layouts: Record<string, MetaPageLayout> = {}
  const errorPages: Record<string, MetaErrorPage<ReactIncomingEvent>> = {}
  const adapterErrorPages: Record<string, MetaAdapterErrorPage<unknown, unknown, unknown>> = {}

  const { views } = await import(buildPath('tmp/viewsIndex.mjs'))
  const viewsPattern = relative(
    buildPath('tmp'),
    basePath(context.blueprint.get('stone.builder.input.views', 'app/**/*.{tsx,jsx,mjsx}'))
  )

  for (const [path, view] of Object.entries<Record<string, ClassType>>(views)) {
    for (const [key, module] of Object.entries(view)) {
      let result = {}
      type resultType = ReturnType<typeof generateDeclarativeLazyPages | typeof generateImperativeLazyPages>

      if (isDeclarative(context.blueprint, context.event)) {
        result = generateDeclarativeLazyPages(module, path, key)
      } else if (isStoneBlueprint<UseReactBlueprint>(module)) {
        result = generateImperativeLazyPages(module, path, key)
      }

      if (isNotEmpty<resultType>(result)) {
        definitions.push(...result.definitions)
        Object.assign(layouts, result.layouts)
        Object.assign(errorPages, result.errorPages)
        Object.assign(adapterErrorPages, result.adapterErrorPages)
      }
    }
  }

  const dynamicBlueprint = {
    stone: {
      router: {
        definitions
      },
      useReact: {
        layouts,
        errorPages,
        adapterErrorPages
      }
    }
  }
  const replacePattern = /"(\(\) => modules\[[^)]+\]\(\)\.then\(v => v\.[^)]+\))"/g
  const pagesContent = `
  // @ts-ignore
  const modules = import.meta.glob('${viewsPattern}')
  export const dynamicBlueprint = ${JSON.stringify(dynamicBlueprint, null, 2).replace(replacePattern, '$1')};
  `

  outputFileSync(
    buildPath(isTypescriptApp(context.blueprint, context.event) ? 'tmp/pages.ts' : 'tmp/pages.mjs'),
    pagesContent,
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
  const isLazy = isLazyViews(context.blueprint, context.event)
  const basePattern = basePath(!isLazy
    ? context.blueprint.get('stone.builder.input.all', 'app/**/*.**')
    : context.blueprint.get('stone.builder.input.app', 'app/**/*.{ts,js,mjs,json}'))
  const pattern = relative(buildPath('tmp'), basePattern)

  const isTypescript = isTypescriptApp(context.blueprint, context.event)
  const userFilename = isTypescript ? 'client.ts' : 'client.mjs'
  const filename = isTypescript ? 'tmp/index.ts' : 'tmp/index.mjs'

  let content = existsSync(basePath(userFilename))
    ? readFileSync(basePath(userFilename), 'utf-8')
    : reactClientEntryPointTemplate(pattern)

  // Add the lazy pages to the client file.
  content = !isLazy
    ? content.replace('%pattern%', pattern)
    : `import * as pages from './pages${isTypescript ? '' : '.mjs'}';\n`
      .concat(content)
      .replace('%pattern%', pattern)
      .replace('// %concat%', '.concat(Object.values(pages))')

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

  const isTypescript = isTypescriptApp(context.blueprint, context.event)
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
  const jsEntryPoint = isTypescriptApp(context.blueprint, context.event) ? 'index.ts' : 'index.mjs'
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
      ssr: buildPath(isTypescriptApp(context.blueprint, context.event) ? 'tmp/server.ts' : 'tmp/server.mjs'),
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
    `export const template = \`${readFileSync(distPath('index.html'), 'utf-8')}\`;`,
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
export const BuildReactCleaningMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  moveSync(distPath('.stone/tmp/index.html'), distPath('index.html'))

  removeSync(buildPath('tmp'))
  removeSync(distPath('.stone'))

  return await next(context)
}

/**
 * Generates the public environment files.
 *
 * @param context The console context.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GeneratePublicEnvFileMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  const content = readFileSync(distPath('index.html'), 'utf-8')
  const hasEnvFile = generatePublicEnviromentsFile(
    context.blueprint,
    distPath('env')
  )

  outputFileSync(
    distPath('index.html'),
    content.replace(
      '<!--env-js-->',
      hasEnvFile ? '<script src="/env/environments.js"></script>' : ''
    ),
    'utf-8'
  )

  return await next(context)
}

/**
 * Middleware for building CSR React applications.
 */
export const ReactCSRBuildMiddleware: Array<MetaPipe<ConsoleContext, IBlueprint>> = [
  { module: GenerateViewsIndexMiddleware, priority: 0 },
  { module: BuildViewsMiddleware, priority: 1 },
  { module: GenerateLazyPageMiddleware, priority: 2 },
  { module: GenerateClientFileMiddleware, priority: 3 },
  { module: GenerateIndexHtmlFileMiddleware, priority: 4 },
  { module: BuildClientAppMiddleware, priority: 5 },
  { module: BuildReactCleaningMiddleware, priority: 6 },
  { module: GeneratePublicEnvFileMiddleware, priority: 7 }
]

/**
 * Middleware for building SSR React applications.
 */
export const ReactSSRBuildMiddleware: Array<MetaPipe<ConsoleContext, IBlueprint>> = [
  { module: GenerateViewsIndexMiddleware, priority: 0 },
  { module: BuildViewsMiddleware, priority: 1 },
  { module: GenerateLazyPageMiddleware, priority: 2 },
  { module: GenerateClientFileMiddleware, priority: 3 },
  { module: GenerateIndexHtmlFileMiddleware, priority: 4 },
  { module: BuildClientAppMiddleware, priority: 5 },
  { module: GenerateReactServerFileMiddleware, priority: 6 },
  { module: BuildReactServerAppMiddleware, priority: 7 },
  { module: BuildReactCleaningMiddleware, priority: 8 },
  { module: GeneratePublicEnvFileMiddleware, priority: 9 },
  { module: MakeServerHtmlTemplateMiddleware, priority: 10 }
]
