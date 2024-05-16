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
import { ConfigBuilder } from '@stone-js/core/config'

/**
 * Auto build app options.
 */
const appOptions = await ConfigBuilder.create().build({ __app_module_names__ })

/**
 * Run application.
 */
const stone = await StoneFactory.createAndRun(appOptions)

/**
 * Export adapter specific output.
 * Useful for FAAS handler like AWS lambda handler.
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
import { ConfigBuilder } from '@stone-js/core/config'

/**
 * Auto build app options.
 * 
 * @returns {Object}
 */
const appOptions = await ConfigBuilder.create().build({ __app_module_names__ })

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
  let stub = isConsole ? consoleBootstrapStub : bootstrapStub
  const filename = isConsole ? 'cli.bootstrap.mjs' : 'app.bootstrap.mjs'
  const exclude = isConsole ? [] : config.get('autoload.exclude', ['commands'])

  // Do not create boostrap file when commands folder is empty.
  if (isConsole && !checkAutoloadModule(config, 'commands')) {
    return false
  }

  if (action === 'export') {
    if (pathExistsSync(basePath(filename)) && !force) {
      console.log(`Cannot override an existing file(${filename}). Use --force to override it.`)
      return false
    } else {
      outputFileSync(basePath(filename), normalizeBootstrapStub(config, stub, action, exclude))
    }
  } else {
    stub = pathExistsSync(basePath(filename)) ? readFileSync(basePath(filename), 'utf-8') : stub
    outputFileSync(buildPath(filename), normalizeBootstrapStub(config, stub, action, exclude))
  }

  return true
}

/**
 * Normalize bootstrap content by replace module import statement.
 *
 * @param {Config} config
 * @param {string} stub
 * @param {string} action - Action can be: `build` or `export`.
 * @param {string} [exclude=[]] - Modules to exclude from import.
 * @returns
 */
export function normalizeBootstrapStub (config, stub, action, exclude = []) {
  const modules = Object
    .keys(config.get('autoload.modules', {}))
    .filter((name) => checkAutoloadModule(config, name))
    .filter((name) => !exclude.includes(name))

  const statement = modules.map((name) => `import * as ${name} from './${name}.mjs'`)

  stub = stub
    .replace('__app_module_names__', modules.join(', '))
    .replace('__app_modules_import__', statement.join('\n'))

  if (action === 'export') {
    return stub.trim().replaceAll('./', './.stone/')
  } else {
    return stub.trim().replaceAll('./.stone/', './')
  }
}
