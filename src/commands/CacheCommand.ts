import { Argv } from 'yargs'
import fsExtra from 'fs-extra'
import { buildPath } from '../utils'
import { CliError } from '../errors/CliError'
import { IncomingEvent, OutgoingResponse } from '@stone-js/core'
import { CommandOptions, CommandOutput } from '@stone-js/node-cli-adapter'

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
   * Output used to print data in console.
   */
  private readonly commandOutput: CommandOutput

  /**
   * Create a new instance of CoreServiceProvider.
   *
   * @param container - The service container to manage dependencies.
   * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
   */
  constructor ({ commandOutput }: { commandOutput: CommandOutput }) {
    if (commandOutput === undefined) { throw new CliError('CommandOutput is required to create a CacheCommand instance.') }

    this.commandOutput = commandOutput
  }

  /**
   * Handle the incoming event.
   */
  handle (event: IncomingEvent): OutgoingResponse {
    if (event.getMetadataValue<boolean>('clear', false) === true) {
      emptyDirSync(buildPath())
      this.commandOutput.info('Cache cleared!')
    }

    return OutgoingResponse.create({ statusCode: 0 })
  }
}
