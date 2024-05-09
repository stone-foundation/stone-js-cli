import { isFunction } from '@stone-js/common'

/**
 * Class representing a Router.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class Router {
  #config
  #container

  /**
   * Create a new instance of Provider.
   *
   * @param {Container} container
   */
  constructor (container) {
    this.#container = container
    this.#config = container.config
  }

  /** @returns {Function[]} */
  get #commands () {
    return this.#config.get('app.commands', [])
  }

  /**
   * Dispatch event to command.
   *
   * @param   {IncomingEvent} event
   * @returns {*}
   */
  dispatch (event) {
    return this.runCommand(event, this.findCommand(event))
  }

  /**
   * Find command.
   *
   * @param   {IncomingEvent} event
   * @returns {(AbstractCommand|undefined)}
   */
  findCommand (event) {
    return this
      .#commands
      .map(command => this.#container.resolve(command, true))
      .find(command => {
        if (!isFunction(command.match)) {
          throw new TypeError(`No match method defined in command class(${command.toString()}).`)
        }

        return command.match(event)
      })
  }

  /**
   * Run command.
   *
   * @param   {IncomingEvent} event
   * @param   {Object} command
   * @returns {*}
   */
  runCommand (event, command) {
    if (!command) {
      this.#container.builder.showHelp()
    } else {
      if (!isFunction(command.handle)) {
        throw new TypeError(`No handle method defined in command class(${command.toString()}).`)
      }

      return command.handle(event)
    }
  }
}
