import { CliError } from '../errors/CliError'
import { processThroughPipeline } from '../utils'
import { CommandOptions } from '@stone-js/node-cli-adapter'
import { IncomingEvent, OutgoingResponse } from '@stone-js/core'
import { BuildAppContext, buildMiddleware, bundleMiddleware } from '../middleware/buildMiddleware'

export const buildCommandOptions: CommandOptions = {
  name: 'build',
  alias: 'b',
  desc: 'Build project'
}

export class BuildCommand {
  /**
   * Output used to print data in console.
   */
  private readonly buildAppContext: BuildAppContext

  /**
   * Create a new instance of CoreServiceProvider.
   *
   * @param container - The service container to manage dependencies.
   * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
   */
  constructor (container: BuildAppContext) {
    if (container === undefined) { throw new CliError('Container is required to create a BuildCommand instance.') }

    this.buildAppContext = container
  }

  /**
   * Handle the incoming event.
   *
   * @returns The blueprint.
   */
  async handle (_event: IncomingEvent): Promise<OutgoingResponse> {
    await processThroughPipeline<BuildAppContext>(this.buildAppContext, buildMiddleware.concat(bundleMiddleware))

    return OutgoingResponse.create({ statusCode: 0 })
  }
}
