import deepmerge from 'deepmerge'
import { consolePipes } from './pipes.mjs'
import { consoleOptions } from './options.mjs'
import { NODE_CONSOLE_PLATFORM } from '@stone-js/common'
import { ConfigBuilder as BaseConfigBuilder } from '@stone-js/core/config'

/**
 * Class representing a ConfigBuilder.
 * Constructing and configuring the dynamic
 * Complex structured options for StoneFactory.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class ConfigBuilder extends BaseConfigBuilder {
  /**
   * Create a ConfigBuilder.
   *
   * @param {Object} options
   */
  constructor (options) {
    super(options)
    this.#addConsolePipes(options)
  }

  /**
   * Build config
   *
   * @param   {Object} modules
   * @param   {Object} modules.app
   * @param   {Object} modules.options
   * @param   {Object} modules.commands
   * @returns {Object}
   */
  async build (modules) {
    const appOptions = await super.build(modules)
    return this.#addConsoleOptions(appOptions)
  }

  /**
   * Add console options to app options.
   * And merge it with previous console options so we can add NodeConsoleAdapter only at run time.
   *
   * @param   {Object} appOptions - Application options.
   * @returns {Object}
   */
  #addConsoleOptions (appOptions) {
    appOptions.app ??= {}
    appOptions.adapters ??= []
    appOptions.app.adapter.current = NODE_CONSOLE_PLATFORM
    appOptions.adapters.push(deepmerge(consoleOptions, this.options.console ?? {}))

    return appOptions
  }

  /**
   * Add console pipes to stone options.
   *
   * @param   {Object} stoneOptions - Stone options.
   * @returns {Object}
   */
  #addConsolePipes (stoneOptions) {
    this.options.autoload ??= {}
    this.options.autoload.pipes = consolePipes.concat(stoneOptions.autoload?.pipes ?? [])
  }
}
