import { Argv } from 'yargs'
import spawn from 'cross-spawn'
import { CommandOptions } from '@stone-js/node-cli-adapter'
import { IncomingEvent, OutgoingResponse } from '@stone-js/core'

export const initCommandOptions: CommandOptions = {
  name: 'init',
  alias: 'i',
  args: ['[project-name]'],
  desc: 'Create a fresh Stone app',
  options: (yargs: Argv) => {
    return yargs
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
}

export class InitCommand {
  /**
   * Handle the incoming event.
   */
  async handle (event: IncomingEvent): Promise<OutgoingResponse> {
    await this.launchStarter(event)

    return OutgoingResponse.create({ statusCode: 0 })
  }

  /**
   * Launch Stone.js starter.
   */
  private async launchStarter (event: IncomingEvent): Promise<void> {
    const args = [event.getMetadataValue('project-name'), '--'] as string[]

    event.getMetadataValue('yes') !== undefined && args.push('--yes', event.getMetadataValue('yes') as string)
    event.getMetadataValue('force') !== undefined && args.push('--force', event.getMetadataValue('force') as string)

    spawn('npm', ['create', '@stone-js@latest'].concat(args), { stdio: 'inherit' })
  }
}
