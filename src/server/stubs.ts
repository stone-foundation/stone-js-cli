import { NODE_CONSOLE_PLATFORM } from '@stone-js/node-cli-adapter'

export const serverIndexFile = (printUrls: boolean = false): string => `
import { stoneApp } from '@stone-js/core'
import * as rawModules from './modules.mjs'

/**
 * Middleware to print the URLs of the server.
 */
const PrintUrlsMiddleware = (context, next) => {
  context.blueprint.set('stone.adapter.printUrls', Boolean(${String(printUrls)}))
  return next(context)
}

/**
 * Build and run the Stone app.
 */
export const stone = await stoneApp({
  modules: Object.values(rawModules),
})
.add('stone.builder.middleware', [{ module: PrintUrlsMiddleware }])
.run()
`

export const consoleIndexFile = (platform: string = NODE_CONSOLE_PLATFORM): string => `
import { stoneApp } from '@stone-js/core'
import * as rawModules from './modules.mjs'

/**
 * Build and run the Stone app.
 */
await stoneApp({
  modules: Object.values(rawModules),
})
.set('stone.adapter.platform', '${platform}')
.run()
`
