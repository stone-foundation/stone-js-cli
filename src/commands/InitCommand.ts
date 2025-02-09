import { Argv } from 'yargs'
import { CliError } from '../errors/CliError'
import { processThroughPipeline } from '../utils'
import { Questionnaire } from '../create-app/Questionnaire'
import { createAppMiddleware } from '../middleware/createAppMiddleware'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'
import { CommandInput, CommandOptions, CommandOutput } from '@stone-js/node-cli-adapter'

export const initCommandOptions: CommandOptions = {
  name: 'init',
  alias: 'i',
  args: ['[project-name]'],
  desc: 'Create a fresh Stone app from a starter template',
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

export interface CreateAppContext {
  blueprint: IBlueprint
  commandInput: CommandInput
  commandOutput: CommandOutput
}

export class InitCommand {
  /**
   * Blueprint configuration used to retrieve app settings.
   */
  private readonly blueprint: IBlueprint

  /**
   * Output used to print data in console.
   */
  private readonly commandOutput: CommandOutput

  /**
   * Output used to print data in console.
   */
  private readonly createAppContext: CreateAppContext

  /**
   * Create a new instance of CoreServiceProvider.
   *
   * @param container - The service container to manage dependencies.
   * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
   */
  constructor ({ container, blueprint, commandOutput }: { container: CreateAppContext, blueprint: IBlueprint, commandOutput: CommandOutput }) {
    if (blueprint === undefined) { throw new CliError('Blueprint is required to create a InitCommand instance.') }
    if (container === undefined) { throw new CliError('Container is required to create a InitCommand instance.') }
    if (commandOutput === undefined) { throw new CliError('CommandOutput is required to create a InitCommand instance.') }

    this.blueprint = blueprint
    this.createAppContext = container
    this.commandOutput = commandOutput
  }

  /**
   * Handle the incoming event.
   */
  async handle (event: IncomingEvent): Promise<OutgoingResponse> {
    try {
      this.setUserOptions(event)

      if (!event.getMetadataValue<boolean>('yes', false)) {
        const answers = await Questionnaire.create(this.createAppContext).getAnswers()
        this.blueprint.set('stone.createApp', answers)
      }

      await processThroughPipeline(this.createAppContext, createAppMiddleware)

      return OutgoingResponse.create({ statusCode: 0 })
    } catch (error: any) {
      this.commandOutput.error(error.message)
      return OutgoingResponse.create({ statusCode: 500 })
    }
  }

  private setUserOptions (event: IncomingEvent): void {
    this.blueprint.set('stone.createApp.overwrite', event.get<boolean>('force', false))
    this.blueprint.set('stone.createApp.projectName', event.get<string>('project-name', 'stone-project'))
  }
}
