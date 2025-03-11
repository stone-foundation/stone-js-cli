import { existsSync } from 'fs'
import BuiltinViteConfig from './vite.config'
import { removeImportsVitePlugin } from './RemoveImportsVitePlugin'
import { basePath, buildPath, distPath } from '@stone-js/filesystem'
import { createServer, loadConfigFromFile, mergeConfig, preview, PreviewServer, UserConfig, ViteDevServer } from 'vite'

/**
 * Removes the built-in SSR imports from the application.
 */
export const removedBuiltinSSRImports = [
  '@stone-js/filesystem',
  /@stone-js\/\S*http\S*/,
  '@stone-js/node-cli-adapter'
]

/**
 * Gets the Vite configuration.
 *
 * @returns The Vite configuration.
 */
export const getViteConfig = async (
  command: 'build' | 'serve',
  mode: 'production' | 'development'
): Promise<UserConfig> => {
  let config: UserConfig | undefined

  if (existsSync(basePath('./vite.config.ts'))) {
    config = (await loadConfigFromFile({ command, mode }, basePath('./vite.config.ts')))?.config
  } else if (existsSync(basePath('./vite.config.js'))) {
    config = (await loadConfigFromFile({ command, mode }, basePath('./vite.config.js')))?.config
  } else if (existsSync(basePath('./vite.config.mjs'))) {
    config = (await loadConfigFromFile({ command, mode }, basePath('./vite.config.mjs')))?.config
  }

  return config ?? BuiltinViteConfig({ command, mode })
}

/**
 * Runs the development server.
 *
 * @param userConfig The user configuration.
 */
export const runDevServer = async (userConfig?: UserConfig): Promise<ViteDevServer> => {
  const viteConfig = await getViteConfig('serve', 'development')

  const server = await createServer(mergeConfig(viteConfig, userConfig ?? {
    plugins: [
      removeImportsVitePlugin(removedBuiltinSSRImports)
    ],
    root: buildPath(),
    publicDir: basePath('public')
  }))
  await server.listen()

  server.printUrls()
  server.bindCLIShortcuts({ print: true })

  return server
}

/**
 * Runs the preview server.
 *
 * @param userConfig The user configuration.
 */
export const runPreviewServer = async (userConfig?: UserConfig): Promise<PreviewServer> => {
  const viteConfig = await getViteConfig('serve', 'development')

  const server = await preview(mergeConfig(viteConfig, userConfig ?? {
    build: {
      outDir: distPath()
    }
  }))

  server.printUrls()
  server.bindCLIShortcuts({ print: true })

  return server
}
