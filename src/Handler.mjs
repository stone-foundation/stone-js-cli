import { Config } from '@stone-js/config'
import { version } from '../package.json'
import { basePath } from '@stone-js/common'
import { pathExistsSync } from 'fs-extra/esm'
import { getEnvVariables } from './utils.mjs'
import { AdapterMapper } from '@stone-js/core'
import { initTask } from './tasks/task-init.mjs'
import { buildTask } from './tasks/task-build.mjs'
import { serveTask } from './tasks/task-serve.mjs'
import { cacheTask } from './tasks/task-cache.mjs'
import { customTask } from './tasks/task-custom.mjs'
import { exportTask } from './tasks/task-export.mjs'
import { typingsTask } from './tasks/task-typings.mjs'
import { Container } from '@stone-js/service-container'
import { CommonInputMiddleware } from './middleware.mjs'
import { IncomingEvent } from '@stone-js/event-foundation'

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
    this.#container.singleton('inputMapper', (container) => AdapterMapper.create(container, [CommonInputMiddleware], (passable) => IncomingEvent.create(passable.event)))
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
    // Check if `stone.config.mjs` exists
    if (this.#ensureStoneConfigExists(event)) {
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
        case ['typings', 't'].includes(event.get('task')):
          await typingsTask(this.#container, event)
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
    } else {
      this.#container.output.error('You cannot use this command outside of a Stone project.')
      this.#container.output.error('All Stone projects must have a `stone.config.mjs` file at its root.')
    }
  }

  /**
   * Ensure Stone config.
   * Check if stone config exists.
   * Stone.config must exist for all task except
   * for `stone init app`.
   *
   * @param {IncomingEvent} event
   * @returns
   */
  #ensureStoneConfigExists (event) {
    return ((['init', 'i'].includes(event.get('task')) && event.get('action') === 'app')) ||
      pathExistsSync(basePath('stone.config.js')) ||
      pathExistsSync(basePath('stone.config.mjs'))
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
        command: 'init [action] [project-name]',
        aliases: ['i'],
        desc: 'Create a fresh Stone app or activate the cli',
        builder: (yargs) => {
          return yargs
            .positional('action', {
              type: 'string',
              default: 'app',
              choices: ['app', 'cli'],
              desc: 'init a new app or the cli in an existing app'
            })
            .positional('project-name', {
              type: 'string',
              default: 'stone-project',
              desc: 'your project name'
            })
            .option('yes', {
              alias: 'y',
              default: false,
              type: 'boolean',
              desc: 'create with default values'
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
        desc: 'Useful to export Stone.js or third party config/options.',
        builder: (yargs) => {
          return yargs
            .positional('module', {
              type: 'string',
              default: 'app',
              desc: 'module or package name to export. e.g. app, cli, rollup, @stone-js/node-adapter'
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
        command: 'typings',
        aliases: ['t'],
        desc: 'Check code typings for typescript or flow project.',
        builder: (yargs) => {
          return yargs
            .option('watch', {
              alias: 'w',
              type: 'boolean',
              default: false,
              desc: 'Launch checker in watch mode. Only for Typescript.'
            })
        }
      })
      .command({
        command: 'cache',
        aliases: ['ca'],
        desc: 'Manage app cache',
        builder: (yargs) => {
          return yargs
            .option('clear', {
              alias: 'c',
              type: 'boolean',
              default: false,
              desc: 'Clear cache'
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
