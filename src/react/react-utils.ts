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
