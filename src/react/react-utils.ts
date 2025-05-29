import {
  preview,
  UserConfig,
  mergeConfig,
  createServer,
  PreviewServer,
  ViteDevServer,
  loadConfigFromFile
} from 'vite'
import { existsSync } from 'fs'
import { viteConfig } from './vite.config'
import { getStoneBuilderConfig } from '../utils'
import { removeImportsVitePlugin } from './RemoveImportsVitePlugin'
import { basePath, buildPath, distPath } from '@stone-js/filesystem'
import { PageRouteDefinition, GET, RouterBlueprint } from '@stone-js/router'
import { getMetadata, isNotEmpty, ClassType, isObjectLikeModule } from '@stone-js/core'
import { REACT_PAGE_KEY, REACT_PAGE_LAYOUT_KEY, REACT_ERROR_PAGE_KEY, PageLayoutOptions, ErrorPageOptions, REACT_ADAPTER_ERROR_PAGE_KEY, MetaErrorPage, MetaPageLayout, ReactIncomingEvent, MetaAdapterErrorPage, UseReactBlueprint, AdapterErrorPageOptions } from '@stone-js/use-react'

/**
 * Gets the Vite configuration.
 *
 * @param command The command to run.
 * @param mode The mode to run.
 * @returns The Vite configuration.
 */
export const getViteConfig = async (
  command: 'build' | 'serve',
  mode: 'production' | 'development'
): Promise<UserConfig> => {
  let config: UserConfig | undefined
  const stoneConfig = await getStoneBuilderConfig()

  if (existsSync(basePath('./vite.config.ts'))) {
    config = (await loadConfigFromFile({ command, mode }, basePath('./vite.config.ts')))?.config
  } else if (existsSync(basePath('./vite.config.js'))) {
    config = (await loadConfigFromFile({ command, mode }, basePath('./vite.config.js')))?.config
  } else if (existsSync(basePath('./vite.config.mjs'))) {
    config = (await loadConfigFromFile({ command, mode }, basePath('./vite.config.mjs')))?.config
  }

  config ??= viteConfig({ command, mode })

  return mergeConfig(config, stoneConfig.vite ?? {})
}

/**
 * Runs the development server.
 *
 * @param userConfig The user configuration.
 * @returns The Vite development server.
 */
export const runDevServer = async (
  userConfig?: UserConfig
): Promise<ViteDevServer> => {
  const stoneConfig = await getStoneBuilderConfig()
  const printUrls = stoneConfig.server?.printUrls ?? true
  const viteConfig = await getViteConfig('serve', 'development')
  const excludedModules = stoneConfig.browser?.excludedModules ?? []

  const server = await createServer(mergeConfig(viteConfig, userConfig ?? {
    plugins: [
      removeImportsVitePlugin(excludedModules)
    ],
    root: buildPath(),
    publicDir: basePath('public')
  }))

  await server.listen()

  if (printUrls) {
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  }

  return server
}

/**
 * Runs the preview server.
 *
 * @param userConfig The user configuration.
 * @returns The Vite preview server.
 */
export const runPreviewServer = async (
  userConfig?: UserConfig
): Promise<PreviewServer> => {
  const stoneConfig = await getStoneBuilderConfig()
  const printUrls = stoneConfig.server?.printUrls ?? true
  const viteConfig = await getViteConfig('serve', 'development')

  const server = await preview(mergeConfig(viteConfig, userConfig ?? {
    build: {
      outDir: distPath()
    }
  }))

  if (printUrls) {
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  }

  return server
}

/**
 * Generates the declarative lazy pages.
 *
 * @param module The module to generate.
 * @param path The path to the module.
 * @param key The key to use for the module.
 * @returns The generated pages.
 */
export const generateDeclarativeLazyPages = (
  module: ClassType,
  path: string,
  key: string
): {
  definitions: PageRouteDefinition[]
  layouts: Record<string, MetaPageLayout>
  errorPages: Record<string, MetaErrorPage<ReactIncomingEvent>>
  adapterErrorPages: Record<string, MetaAdapterErrorPage<unknown, unknown, unknown>>
} => {
  const definitions: PageRouteDefinition[] = []
  const layouts: Record<string, MetaPageLayout> = {}
  const lazyModule: any = `() => modules['${path}']().then(v => v.${key})`
  const errorPages: Record<string, MetaErrorPage<ReactIncomingEvent>> = {}
  const adapterErrorPages: Record<string, MetaAdapterErrorPage<unknown, unknown, unknown>> = {}

  const pageOptions = getMetadata(module, REACT_PAGE_KEY)
  const layoutOptions = getMetadata(module, REACT_PAGE_LAYOUT_KEY)
  const errorPageOptions = getMetadata(module, REACT_ERROR_PAGE_KEY)
  const errorAdapterPageOptions = getMetadata(module, REACT_ADAPTER_ERROR_PAGE_KEY)

  if (isNotEmpty<PageLayoutOptions>(layoutOptions)) {
    layouts[layoutOptions.name ?? 'default'] = { module: lazyModule, lazy: true, isClass: true }
  } else if (isNotEmpty<ErrorPageOptions>(errorPageOptions)) {
    Array(errorPageOptions.error ?? 'default').flat().forEach((name: string) => {
      errorPages[name] = { ...errorPageOptions, module: lazyModule, lazy: true, isClass: true }
    })
  } else if (isNotEmpty<AdapterErrorPageOptions>(errorAdapterPageOptions)) {
    Array(errorAdapterPageOptions.error ?? 'default').flat().forEach((name: string) => {
      adapterErrorPages[name] = { ...errorAdapterPageOptions, module: lazyModule, lazy: true, isClass: true }
    })
  } else if (isNotEmpty<PageRouteDefinition>(pageOptions)) {
    definitions.push({
      ...pageOptions,
      method: GET,
      methods: undefined,
      children: undefined,
      handler: {
        ...pageOptions.handler,
        lazy: true,
        isComponent: true,
        module: lazyModule
      }
    })
  }

  return { adapterErrorPages, layouts, definitions, errorPages }
}

/**
 * Generates the imperative lazy pages.
 *
 * @param module The module to generate.
 * @param path The path to the module.
 * @param key The key to use for the module.
 * @returns The generated pages.
 */
export const generateImperativeLazyPages = (
  module: UseReactBlueprint,
  path: string,
  key: string
): {
  definitions: PageRouteDefinition[]
  layouts: Record<string, MetaPageLayout>
  errorPages: Record<string, MetaErrorPage<ReactIncomingEvent>>
  adapterErrorPages: Record<string, MetaAdapterErrorPage<unknown, unknown, unknown>>
} => {
  const definitions: PageRouteDefinition[] = []
  const layouts: Record<string, MetaPageLayout> = {}
  const lazyModule: any = `() => modules['${path}']().then(v => v.${key})`
  const errorPages: Record<string, MetaErrorPage<ReactIncomingEvent>> = {}
  const adapterErrorPages: Record<string, MetaAdapterErrorPage<unknown, unknown, unknown>> = {}

  if (isObjectLikeModule<MetaPageLayout>(module.stone.useReact?.layout)) {
    Object.entries(module.stone.useReact.layout).forEach(([name, layout]) => {
      if (isNotEmpty<MetaPageLayout>(layout)) {
        layouts[name] = { ...layout, module: lazyModule, lazy: true }
      }
    })
  } else if (isObjectLikeModule<MetaErrorPage<ReactIncomingEvent>>(module.stone.useReact?.errorPages)) {
    Object.entries(module.stone.useReact.errorPages).forEach(([name, errorPage]) => {
      if (isNotEmpty<MetaErrorPage<ReactIncomingEvent>>(errorPage)) {
        errorPages[name] = { ...errorPage, module: lazyModule, lazy: true }
      }
    })
  } else if (isObjectLikeModule<MetaAdapterErrorPage<unknown, unknown, unknown>>(module.stone.useReact?.adapterErrorPages)) {
    Object.entries(module.stone.useReact.adapterErrorPages).forEach(([name, errorPage]) => {
      if (isNotEmpty<MetaAdapterErrorPage<unknown, unknown, unknown>>(errorPage)) {
        adapterErrorPages[name] = { ...errorPage, module: lazyModule, lazy: true }
      }
    })
  } else if (isNotEmpty<RouterBlueprint>(module) && isNotEmpty<PageRouteDefinition[]>(module.stone.router?.definitions)) {
    module.stone.router.definitions.forEach((route) => {
      if (isNotEmpty<PageRouteDefinition>(route)) {
        definitions.push({
          ...route,
          method: GET,
          methods: undefined,
          children: undefined,
          handler: {
            ...route.handler,
            lazy: true,
            isComponent: true,
            module: lazyModule
          }
        })
      }
    })
  }

  return { adapterErrorPages, layouts, definitions, errorPages }
}
