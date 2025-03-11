import { Argv } from 'yargs'
import { isReactApp } from '../utils'
import { IncomingEvent } from '@stone-js/core'
import { ConsoleContext } from '../declarations'
import { ReactBuilder } from '../react/ReactBuilder'
import { ServerBuilder } from '../server/ServerBuilder'
import { CommandOptions } from '@stone-js/node-cli-adapter'

/**
 * The build command options.
 */
export const buildCommandOptions: CommandOptions = {
  name: 'build',
  alias: 'prod',
  args: ['[app-type]'],
  desc: 'Build project',
  options: (yargs: Argv) => {
    return yargs
      .positional('app-type', {
        type: 'string',
        default: 'server',
        desc: 'app type to build',
        choices: ['server', 'react']
      })
      .option('ssr', {
        alias: 's',
        type: 'boolean',
        default: false,
        desc: 'Build SSR App'
      })
      .option('imperative', {
        alias: 'i',
        type: 'boolean',
        default: false,
        desc: 'imperative api'
      })
  }
}

/**
 * The build command class.
 */
export class BuildCommand {
  /**
   * Create a new instance of BuildCommand.
   *
   * @param context - The service container to manage dependencies.
   */
  constructor (private readonly context: ConsoleContext) {}

  /**
   * Handle the incoming event.
   *
   * @returns The blueprint.
   */
  async handle (event: IncomingEvent): Promise<void> {
    if (isReactApp(this.context.blueprint, event)) {
      await new ReactBuilder(this.context).build(event)
    } else {
      await new ServerBuilder(this.context).build(event)
    }
  }
}
