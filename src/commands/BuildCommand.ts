import { buildApp } from '../utils'
import { CliError } from '../errors/CliError'
import { CommandOptions } from '@stone-js/node-cli-adapter'
import { buildPipes, bundlePipes } from '../middleware/buildMiddleware'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'

export const buildCommandOptions: CommandOptions = {
  name: 'build',
  alias: 'b',
  desc: 'Build project'
}

export class BuildCommand {
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
   *
   * @returns The blueprint.
   */
  async handle (_event: IncomingEvent): Promise<OutgoingResponse> {
    await buildApp(this.blueprint, buildPipes.concat(bundlePipes), v => v)

    return OutgoingResponse.create({ statusCode: 0 })
  }
}
