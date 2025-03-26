import { NODE_CONSOLE_PLATFORM } from '@stone-js/node-cli-adapter'

/**
 * The React client template.
 * This template is used to create the client entry point for a React application.
 */
export const reactClientEntryPointTemplate = (
  path = './app/**/*.{ts,js,mjs,json}'
): string => `
import { stoneApp } from '@stone-js/core'

/**
 * Import application modules.
 */
// @ts-ignore
const rawModules = import.meta.glob('${path}', { eager: true })
const modules = Object
  .values(rawModules)
  // @ts-ignore
  .flatMap((module) => Object.values(module)[0])
  // %concat%

/**
 * Create and run the Stone app.
 */
export const stone = await stoneApp({ modules }).run()
`

/**
 * The React server template.
 * This template is used to create the server entry point for a React application.
 */
export const reactServerEntryPointTemplate = (
  path = './app/**/*',
  printUrls: boolean | string = true
): string => `
import { stoneApp } from '@stone-js/core'

/**
 * Middleware to print the URLs of the server.
 */
const PrintUrlsMiddleware = (context, next) => {
  context.blueprint.setIf('stone.adapter.printUrls', ${String(printUrls)})
  return next(context)
}

/**
 * Import application modules.
 */
// @ts-ignore
const rawModules = import.meta.glob('${path}', { eager: true })
const modules = Object
  .values(rawModules)
  // @ts-ignore
  .flatMap((module) => Object.values(module)[0])

/**
 * Create and run the Stone app.
 */
export const stone = await stoneApp({
  modules
})
.add('stone.blueprint.middleware', [{ module: PrintUrlsMiddleware }])
.run()
`

/**
 * The React console template.
 * This template is used to create the console entry point for a React application.
 */
export const reactConsoleEntryPointTemplate = (
  path = './app/**/*',
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
  // @ts-ignore
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

/**
 * The React template.
 * This template is used to create the entry point for a React application.
 */
export const reactHtmlEntryPointTemplate = (
  mainScript = '<script type="module" src="/.stone/index.mjs"></script>',
  mainCSS = '<link rel="stylesheet" href="/assets/css/index.css" />'
): string => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stone.js + React</title>
    ${mainCSS}
    <!--env-js-->
    <!--app-head-->
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    ${mainScript}
  </body>
</html>
`

/**
 * The Vite server template.
 * This template is used to create the server entry point for a Vite application.
 */
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
