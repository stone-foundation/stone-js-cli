import { Argv } from 'yargs'
import spawn from 'cross-spawn'
import { nodeModulesPath } from '../utils'
import { CliError } from '../errors/CliError'
import { CommandOptions } from '@stone-js/node-cli-adapter'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'

export const typingsCommandOptions: CommandOptions = {
  name: 'typings',
  alias: 't',
  desc: 'Check code typings for typescript or flow project.',
  options: (yargs: Argv) => {
    return yargs
      .option('watch', {
        alias: 'w',
        type: 'boolean',
        default: false,
        desc: 'Launch checker in watch mode. Only for Typescript.'
      })
  }
}

export class TypingsCommand {
  /**
   * Blueprint configuration used to retrieve app settings.
   */
  private readonly blueprint: IBlueprint

  /**
   * Create a new instance of CoreServiceProvider.
   *
   * @param container - The service container to manage dependencies.
   * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
   */
  constructor ({ blueprint }: { blueprint: IBlueprint }) {
    if (blueprint === undefined) { throw new CliError('Blueprint is required to create a BuildCommand instance.') }

    this.blueprint = blueprint
  }

  /**
   * Handle the incoming event.
   */
  async handle (event: IncomingEvent): Promise<OutgoingResponse> {
    this.typeCheckerProcess(event.getMetadataValue('watch', false) as boolean)
    return OutgoingResponse.create({ statusCode: 0 })
  }

  /**
   * Type checker watcher Process.
   */
  private typeCheckerProcess (watch: boolean): void {
    if (watch) {
      if (this.blueprint.get('stone.autoload.type') === 'typescript') {
        spawn('node', [nodeModulesPath('.bin/tsc'), '--noEmit', '--watch'], { stdio: 'inherit' })
      }
    } else {
      if (this.blueprint.get('stone.autoload.type') === 'typescript') {
        spawn('node', [nodeModulesPath('.bin/tsc'), '--noEmit'], { stdio: 'inherit' })
      }
    }
  }
}
