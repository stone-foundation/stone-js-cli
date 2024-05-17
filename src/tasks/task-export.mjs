import { makeBootstrapFile } from './stubs.mjs'
import { checkAutoloadModule, makeFilename } from '../utils.mjs'
import { copySync, pathExistsSync, readJsonSync } from 'fs-extra/esm'
import { basePath, configPath, nodeModulesPath } from '@stone-js/common'

/**
 * Export task.
 * Useful to export app cli.bootstrap.mjs and app.bootstrap.mjs
 * For customization.
 *
 * @param {Container} container
 * @param {IncomingEvent} event
 * @returns
 */
export const exportTask = async (container, event) => {
  let isExported = false
  const config = container.config
  const force = event.get('force', false)
  const module = event.get('module', 'app')

  switch (module) {
    case 'app':
      isExported = makeBootstrapFile(config, 'export', false, force)
      break
    case 'cli':
      if (!checkAutoloadModule(config, 'commands')) {
        return console.error('Cannot export `cli.bootstrap.mjs` file when commands folder is empty.')
      } else {
        isExported = makeBootstrapFile(config, 'export', true, force)
      }
      break
    case 'rollup':
      isExported = exportRollup(force)
      break
    default:
      isExported = exportModuleConfig(config, module, force)
      break
  }

  isExported && console.log(`Module(${module}) exported!`)
}
/**
 * Export rollup config.
 *
 * @private
 * @param {boolean} [force]
 * @returns
 */
const exportRollup = (force) => {
  const filename = 'rollup.config.mjs'
  const destPath = basePath(filename)
  const originPath = nodeModulesPath('@stone-js/cli/dist', filename)

  try {
    copySync(originPath, destPath, { overwrite: force, errorOnExist: true })
  } catch (_) {
    return console.log(`Cannot override your existing (${filename}) file. Use --force to override it.`)
  }

  return true
}

/**
 * Export modules config/options.
 *
 * @private
 * @param {Config} config
 * @param {string} module
 * @param {boolean} [force]
 * @returns
 */
const exportModuleConfig = (config, module, force) => {
  let isExported = false
  if (!pathExistsSync(nodeModulesPath(module, 'package.json'))) {
    return console.log(`This module(${module}) does not exist or does not provide export options.`)
  }

  const packageJson = readJsonSync(nodeModulesPath(module, 'package.json'), { throws: false })

  const make = packageJson.stone?.config?.make ?? {}

  Object.entries(make).forEach(([filename, optionsPath]) => {
    if (!filename) {
      return console.log(`No configurations maker defined for this module(${module})`)
    }

    const originPath = nodeModulesPath(module, optionsPath)
    const destPath = configPath(makeFilename(config, filename))

    if (!pathExistsSync(originPath)) {
      return console.log(`No options file(${filename}) found for this module(${module}).`)
    }

    try {
      copySync(originPath, destPath, { overwrite: force, errorOnExist: true })
    } catch (_) {
      return console.log(`Cannot override an existing file(${filename}) for this module(${module}). Use --force to override it.`)
    }

    isExported = true
  })

  return isExported
}
