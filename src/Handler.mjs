import { Config } from '@stone-js/config'
import { version } from '../package.json'
import { Mapper } from '@stone-js/adapters'
import { getEnvVariables } from './utils.mjs'
import { buildTask } from './tasks/task-build.mjs'
import { serveTask } from './tasks/task-serve.mjs'
import { customTask } from './tasks/task-custom.mjs'
import { mapperInputResolver } from './resolvers.mjs'
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
    this.#container.singleton('inputMapper', (container) => Mapper.create(container, [CommonInputMiddleware], mapperInputResolver))
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
    this.#command(this.#container.builder)
  }

  /**
   * Handle IncomingEvent.
   *
   * @param   {IncomingEvent} event
   * @returns
   */
  async handle (event) {
    switch (true) {
      case ['build', 'b'].includes(event.get('task')):
        await buildTask(this.#container, event)
        break
      case ['serve', 's'].includes(event.get('task')):
        await serveTask(this.#container, event)
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
   * Command builder.
   *
   * @param {Yargs} builder - Yargs command builder.
   */
  #command (builder) {
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
