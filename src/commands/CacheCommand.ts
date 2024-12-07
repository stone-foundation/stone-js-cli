import { Argv } from 'yargs'
import fsExtra from 'fs-extra'
import { buildPath } from '../utils'
import { CliError } from '../errors/CliError'
import { CommandOptions, CommandOutput } from '@stone-js/node-cli-adapter'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'

const { emptyDirSync } = fsExtra

export const cacheCommandOptions: CommandOptions = {
  name: 'cache',
  alias: 'c',
  desc: 'Manage app cache',
  options: (yargs: Argv) => {
    return yargs
      .option('clear', {
        alias: 'c',
        type: 'boolean',
        default: false,
        desc: 'Clear cache'
      })
  }
}

export class CacheCommand {
  /**
   * Blueprint configuration used to retrieve app settings.
   */
  private readonly blueprint: IBlueprint

  /**
   * Output used to print data in console.
   */
  private readonly commandOutput: CommandOutput

  /**
   * Create a new instance of CoreServiceProvider.
   *
   * @param container - The service container to manage dependencies.
   * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
   */
  constructor ({ blueprint, commandOutput }: { blueprint: IBlueprint, commandOutput: CommandOutput }) {
    if (blueprint === undefined) { throw new CliError('Blueprint is required to create a BuildCommand instance.') }

    this.blueprint = blueprint
    this.commandOutput = commandOutput
  }

  /**
   * Handle the incoming event.
   */
  handle (event: IncomingEvent): OutgoingResponse {
    if (event.getMetadataValue('clear', false) === true) {
      emptyDirSync(buildPath())
      this.commandOutput.info('Cache deleted!')
    }
    return OutgoingResponse.create({ statusCode: 0 })
  }
}
