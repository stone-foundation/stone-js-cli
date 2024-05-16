import { Config } from '@stone-js/config'
import { version } from '../package.json'
import { Mapper } from '@stone-js/adapters'
import { getEnvVariables } from './utils.mjs'
import { IncomingEvent } from '@stone-js/common'
import { initTask } from './tasks/task-init.mjs'
import { buildTask } from './tasks/task-build.mjs'
import { serveTask } from './tasks/task-serve.mjs'
import { cacheTask } from './tasks/task-cache.mjs'
import { customTask } from './tasks/task-custom.mjs'
import { configTask } from './tasks/task-config.mjs'
import { exportTask } from './tasks/task-export.mjs'
import { Container } from '@stone-js/service-container'
import { CommonInputMiddleware } from './middleware.mjs'

/**
 * Class representing a Stone.js console Handler.
 *
 * @version 0.0.1
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class Handler {
  #container

  /**
   * Create a Stone.js console handler.
   *
   * @param   {Object} options - Stone.js configuration options.
   * @returns {Handler}
   */
  static create (options) {
    return new this(options)
  }

  /**
   * Create a Stone.js console handler.
   *
   * @param {Object} options - Stone.js configuration options.
   */
  constructor (options) {
    this.#container = new Container()
    this.#container.instance(Config, Config.create(options)).alias(Config, 'config')
    this.#container.singleton('inputMapper', (container) => Mapper.create(container, [CommonInputMiddleware], (passable) => IncomingEvent.create(passable.event)))
  }

  /** @return {Container} */
  get container () {
    return this.#container
  }

  /**
   * Hook that runs at each events and before everything.
   * Useful to initialize things at each events.
   */
  beforeHandle () {
    this.#loadDotenvVariables()
    this.#registerCommand(this.#container.builder)
  }

  /**
   * Handle IncomingEvent.
   *
   * @param   {IncomingEvent} event
   * @returns
   */
  async handle (event) {
    switch (true) {
      case ['init', 'i'].includes(event.get('task')):
        await initTask(this.#container, event)
        break
      case ['build', 'b'].includes(event.get('task')):
        await buildTask(this.#container, event)
        break
      case ['serve', 's'].includes(event.get('task')):
        await serveTask(this.#container, event)
        break
      case ['export', 'e'].includes(event.get('task')):
        await exportTask(this.#container, event)
        break
      case ['config', 'c'].includes(event.get('task')):
        await configTask(this.#container, event)
        break
      case ['cache', 'ca'].includes(event.get('task')):
        await cacheTask(this.#container, event)
        break
      case ['list', 'ls', 'l'].includes(event.get('task')):
        await customTask(this.#container, event, true)
        break
      default:
        await customTask(this.#container, event)
        break
    }
  }

  /**
   * Register command.
   *
   * @param   {Object} builder - Yargs builder.
   * @returns
   */
  #registerCommand (builder) {
    builder
      .command({
        command: 'build',
        aliases: ['b'],
        desc: 'Build project'
      })
      .command({
        command: 'serve',
        aliases: ['s'],
        desc: 'Serve project'
      })
      .command({
        command: 'list',
        aliases: ['l', 'ls'],
        desc: 'List all custom commands'
      })
      .command({
        command: 'init <type>',
        aliases: ['i'],
        desc: 'Create a fresh Stone app or activate the cli',
        builder: (yargs) => {
          return yargs
            .positional('type', {
              type: 'string',
              choices: ['app', 'cli'],
              desc: 'To create a new Stone app use `app` and `cli` to activate the cli in an existing project.'
            })
            .option('force', {
              alias: 'f',
              type: 'boolean',
              default: false,
              desc: 'Force overriding'
            })
        }
      })
      .command({
        command: 'export [module]',
        aliases: ['e'],
        desc: 'Export app bootstrap files',
        builder: (yargs) => {
          return yargs
            .positional('module', {
              type: 'string',
              default: 'app',
              choices: ['app', 'cli', 'all'],
              desc: 'module name to override'
            })
            .option('force', {
              alias: 'f',
              type: 'boolean',
              default: false,
              desc: 'Force overriding'
            })
        }
      })
      .command({
        command: 'config <action> <module>',
        aliases: ['c'],
        desc: 'Manage configuration options. Useful to export third party config/options.',
        builder: (yargs) => {
          return yargs
            .positional('action', {
              type: 'string',
              choices: ['make'],
              desc: 'copy options module from package to app'
            })
            .positional('module', {
              type: 'string',
              desc: 'package name. e.g. @stone-js/adapters'
            })
            .option('force', {
              alias: 'f',
              type: 'boolean',
              default: false,
              desc: 'Force overriding'
            })
        }
      })
      .command({
        command: 'cache <action>',
        aliases: ['ca'],
        desc: 'Manage app cache',
        builder: (yargs) => {
          return yargs
            .positional('action', {
              type: 'string',
              choices: ['clear'],
              desc: 'cache action'
            })
        }
      })
      .help()
      .version(version)
  }

  /**
   * Load the env variables in .env file to process.env.
   *
   * @returns
   */
  #loadDotenvVariables () {
    const options = this.#container.config.get('dotenv', {})
    const publicOptions = { ...options?.options, ...options?.public }
    const privateOptions = { ...options?.options, ...options?.private }

    getEnvVariables(publicOptions)
    getEnvVariables(privateOptions)
  }
}
