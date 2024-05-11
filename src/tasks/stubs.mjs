import { readFileSync } from 'node:fs'
import { basePath, buildPath } from '@stone-js/common'
import { outputFileSync, pathExistsSync } from 'fs-extra/esm'

/**
 * App boostrap module stub.
 *
 * @returns {string}
 */
export const bootstrap = `
import * as app from './app.mjs'
import * as options from './options.mjs'
import { StoneFactory } from '@stone-js/core'
import { ConfigLoader } from '@stone-js/config'
import { getStoneOptions } from '@stone-js/common'
import * as defaultPipes from '@stone-js/config/pipes'

/**
 * Get stone config options.
 */
const stoneOptions = await getStoneOptions()

/**
 * Set default configuration pipes.
 * Useful for modules autoload builder.
 */
stoneOptions.autoload.pipes = Object.values(defaultPipes).concat(stoneOptions.autoload.pipes ?? [])

/**
 * Get app options.
 */
const appOptions = await ConfigLoader.create(stoneOptions).load({ app, options })

/**
 * Run application.
 */
const stone = await StoneFactory
  .create(appOptions)
  .hook('onInit', () => stoneOptions.onInit?.())
  .run()

export { stone }
`

/**
 * Console App boostrap module stub.
 *
 * @returns {string}
 */
export const consoleBootstrap = `
import * as app from './app.mjs'
import * as options from './options.mjs'
import * as commands from './commands.mjs'
import { StoneFactory } from '@stone-js/core'
import { ConfigLoader } from '@stone-js/config'
import { getStoneOptions } from '@stone-js/common'
import * as defaultPipes from '@stone-js/config/pipes'
import { consolePipes, addConsoleOptions } from '@stone-js/cli/config'

/**
 * Get stone config options.
 * 
 * @returns {Object}
 */
const stoneOptions = await getStoneOptions()

/**
 * Set default configuration pipes.
 * Useful for modules autoload builder.
 */
stoneOptions.autoload.pipes = consolePipes.concat(Object.values(defaultPipes), stoneOptions.autoload.pipes ?? [])

/**
 * Get app options.
 * Auto build app options.
 * 
 * @returns {Object}
 */
let appOptions = await ConfigLoader.create(stoneOptions).load({ app, options, commands })

/**
 * Set console adapter options.
 * Useful to only enable and isolate console on for cli command.
 */
appOptions = addConsoleOptions(appOptions, true)

/**
 * Run application.
 */
StoneFactory
  .create(appOptions)
  .hook('onInit', () => stoneOptions.onInit?.())
  .run()
`

/**
 * Make App boostrap module from stub.
 *
 * @returns
 */
export function makeBootstrapFile () {
  const content = pathExistsSync(basePath('app.bootstrap.mjs'))
    ? readFileSync(basePath('app.bootstrap.mjs'), 'utf-8')
    : bootstrap
  outputFileSync(buildPath('app.bootstrap.mjs'), content.trim())
}

/**
 * Make Console App boostrap module from stub.
 *
 * @returns
 */
export function makeConsoleBootstrapFile () {
  const content = pathExistsSync(basePath('console.bootstrap.mjs'))
    ? readFileSync(basePath('console.bootstrap.mjs'), { throws: false })
    : consoleBootstrap
  outputFileSync(buildPath('console.bootstrap.mjs'), content.trim())
}
