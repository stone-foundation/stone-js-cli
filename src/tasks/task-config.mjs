import { readFileSync } from 'node:fs'
import { nodeModulesPath, configPath } from '@stone-js/common'
import { outputFileSync, pathExistsSync, readJsonSync } from 'fs-extra/esm'

/**
 * Custom task.
 *
 * @param {Container} container
 * @param {IncomingEvent} [event]
 * @returns
 */
export const configTask = async (_container, event) => {
  if (event.get('action') === 'make') {
    makeConfig(event.get('module'), event.get('force', false))
  }
}

/**
 * Make config.
 *
 * @private
 * @param {string} module
 * @param {boolean} [force]
 * @returns
 */
const makeConfig = async (module, force) => {
  if (!pathExistsSync(nodeModulesPath(module, 'package.json'))) {
    return console.log(`No "package.json" found for this module(${module}).`)
  }

  const packageJson = readJsonSync(nodeModulesPath(module, 'package.json'), { throws: false })

  const make = packageJson.stone?.config?.make ?? {}

  Object.entries(make).forEach(([filename, optionsPath]) => {
    if (!filename) {
      return console.log(`No configurations maker defined for this module(${module})`)
    }

    const destPath = configPath(`${filename}.mjs`)
    const originPath = nodeModulesPath(module, optionsPath)

    if (!pathExistsSync(originPath)) {
      return console.log(`No options file(${filename}) found for this module(${module}).`)
    }

    const stub = readFileSync(originPath, 'utf-8')

    if (pathExistsSync(destPath) && !force) {
      return console.log(`Cannot override an existing file(${filename}). Use --force to override it.`)
    } else {
      outputFileSync(destPath, stub.trim())
    }

    console.log('Options copied!')
  })
}
