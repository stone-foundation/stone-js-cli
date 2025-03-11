import { NODE_CONSOLE_PLATFORM } from '@stone-js/node-cli-adapter'

export const reactClientTemplate = (path = './app/**/*.{ts,js,mjs,json}'): string => `
import * as pageRoutes from './routes'
import { stoneApp } from '@stone-js/core'

/**
 * Import application modules.
 */
// @ts-expect-error
const rawModules = import.meta.glob('${path}', { eager: true })
const modules = Object
  .values(rawModules)
  .flatMap((module) => Object.values(module)[0])
  .concat(Object.values(pageRoutes))

/**
 * Create and run the Stone app.
 */
export const stone = await stoneApp({ modules }).run()
`

export const reactServerTemplate = (
  path = './app/**/*.{ts,tsx,js,mjs,jsx,mjsx,json}',
  printUrls: boolean = true
): string => `
import { stoneApp } from '@stone-js/core'

/**
 * Middleware to print the URLs of the server.
 */
const PrintUrlsMiddleware = (context, next) => {
  context.blueprint.set('stone.adapter.printUrls', Boolean(${String(printUrls)}))
  return next(context)
}

/**
 * Import application modules.
 */
// @ts-expect-error
const rawModules = import.meta.glob('${path}', { eager: true })
const modules = Object
  .values(rawModules)
  .flatMap((module) => Object.values(module)[0])

/**
 * Create and run the Stone app.
 */
export const stone = await stoneApp({
  modules
})
.add('stone.builder.middleware', [{ module: PrintUrlsMiddleware }])
.run()
`

export const reactConsoleTemplate = (
  path = './app/**/*.{ts,tsx,js,mjs,jsx,mjsx,json}',
  platform: string = NODE_CONSOLE_PLATFORM
): string => `
import { stoneApp } from '@stone-js/core'

/**
 * Import application modules.
 */
// @ts-expect-error
const rawModules = import.meta.glob('${path}', { eager: true })
const modules = Object
  .values(rawModules)
  .flatMap((module) => Object.values(module)[0])

/**
 * Create and run the Stone app.
 */
export const stone = await stoneApp({
  modules
})
.set('stone.adapter.platform', '${platform}')
.run()
`

export const reactHtmlTemplate = (
  script = '/.stone/index.mjs',
  css = '/assets/css/index.css'
): string => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stone.js + React</title>
    <link rel="stylesheet" href="${css}" />
    <!--app-head-->
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="${script}"></script>
  </body>
</html>
`

export const viteServerTemplate = (serverName: string = 'runDevServer'): string => `
import { ${serverName} } from "@stone-js/cli"

const server = await ${serverName}()

const shutdown = async (signal) => {
  await server.close()
  process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
`
