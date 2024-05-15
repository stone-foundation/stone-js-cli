import { readFileSync } from 'node:fs'
import { checkAutoloadModule } from '../utils.mjs'
import { basePath, buildPath } from '@stone-js/common'
import { outputFileSync, pathExistsSync } from 'fs-extra/esm'

/**
 * App boostrap module stub.
 *
 * @returns {string}
 */
export const bootstrapStub = `
__app_modules_import__
import { StoneFactory } from '@stone-js/core'
__stone_config_import__
import { ConfigBuilder } from '@stone-js/core/config'

/**
 * Get app options.
 */
const appOptions = await ConfigBuilder.create(stoneOptions).build({ __app_module_names__ })

/**
 * Run application.
 */
const stone = await StoneFactory.createAndRun(appOptions)

/**
 * Export adapter specific output.
 * Usefull for FAAS handler like AWS lambda handler.
 * 
 * @returns {Object}
 */
export { stone }
`

/**
 * Console App boostrap module stub.
 *
 * @returns {string}
 */
export const consoleBootstrapStub = `
__app_modules_import__
import { StoneFactory } from '@stone-js/core'
__stone_config_import__
__stone_cli_config_import__
import { ConfigBuilder } from '@stone-js/core/config'
import { NODE_CONSOLE_PLATFORM, merge } from '@stone-js/common'

/**
 * Get app options.
 * Auto build app options.
 * 
 * @returns {Object}
 */
const appOptions = await ConfigBuilder.create(merge(stoneOptions, stoneCliOptions)).build({ __app_module_names__ })

/**
 * Force console as current adapter
 */
appOptions.app.adapter.current = NODE_CONSOLE_PLATFORM

/**
 * Run application.
 */
StoneFactory.createAndRun(appOptions)
`

/**
 * Make App boostrap module from stub.
 * In .stone directory for build action.
 * And a the root of the project for export action.
 *
 * @param {Config} config
 * @param {string} action - Action can be: `build` or `export`.
 * @param {boolean} [isConsole=false] - Build for console.
 * @param {boolean} [force=false] - Force file override if exists.
 * @returns
 */
export function makeBootstrapFile (config, action, isConsole = false, force = false) {
  const exclude = isConsole ? [] : ['commands']
  let stub = isConsole ? consoleBootstrapStub : bootstrapStub
  const filename = isConsole ? 'console.bootstrap.mjs' : 'app.bootstrap.mjs'

  if (action === 'export') {
    if (pathExistsSync(basePath(filename)) && !force) {
      return console.log(`Cannot override an existing file(${filename}). Use --force to override it.`)
    } else {
      outputFileSync(basePath(filename), normalizeBootstrapStub(config, stub, action, exclude))
    }
  } else {
    stub = pathExistsSync(basePath(filename)) ? readFileSync(basePath(filename), 'utf-8') : stub
    outputFileSync(buildPath(filename), normalizeBootstrapStub(config, stub, action, exclude))
  }
}

/**
 * Normalize bootstrap content by replace module import statement.
 *
 * @param {Config} config
 * @param {string} stub
 * @param {string} action - Action can be: `build` or `export`
 * @returns
 */
export function normalizeBootstrapStub (config, stub, action, exclude = []) {
  const modules = Object
    .keys(config.get('autoload.modules', {}))
    .filter((name) => checkAutoloadModule(config, name, false))
    .filter((name) => !exclude.includes(name))

  const statement = modules.map((name) => `import * as ${name} from './${name}.mjs'`)

  stub = stub
    .replace('__app_module_names__', modules.join(', '))
    .replace('__app_modules_import__', statement.join('\n'))

  if (action === 'export') {
    return stub
      .trim()
      .replaceAll('./', './.stone/')
      .replace('__stone_config_import__', "import { stoneOptions } from './stone.config.mjs'")
      .replace('__stone_cli_config_import__', "import { stoneCliOptions } from './cli.config.mjs'")
  } else {
    return stub
      .trim()
      .replaceAll('./.stone/', './')
      .replace('__stone_config_import__', "import { stoneOptions } from '../stone.config.mjs'")
      .replace('__stone_cli_config_import__', "import { stoneCliOptions } from '../cli.config.mjs'")
  }
}
