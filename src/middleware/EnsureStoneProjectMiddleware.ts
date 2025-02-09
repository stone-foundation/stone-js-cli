import fsExtra from 'fs-extra'
import { basePath } from '../utils'
import { CliError } from '../errors/CliError'
import { NextPipe } from '@stone-js/pipeline'
import { initCommandOptions } from '../commands/InitCommand'
import { IncomingEvent, OutgoingResponse } from '@stone-js/core'

const { pathExistsSync, readJsonSync } = fsExtra

export class EnsureStoneProjectMiddleware<
  IncomingEventType extends IncomingEvent,
  OutgoingResponseType extends OutgoingResponse
> {
  /**
   * Handles the incoming event, processes it, and invokes the next middleware in the pipeline.
   *
   * @param event - The incoming event.
   * @param next - The next middleware in the pipeline.
   * @returns A promise that resolves to the outgoing response after processing.
   *
   * @throws {InitializationError} If no router or event handler is provided.
   */
  async handle (event: IncomingEventType, next: NextPipe<IncomingEventType, OutgoingResponseType>): Promise<OutgoingResponseType> {
    const { name, alias = '' } = initCommandOptions
    const task = event.get<string>('_task') ?? ''

    if (![name, alias].includes(task) && !this.isStoneProject()) {
      throw new CliError('This is not a Stone project. Please run this command in a Stone project directory.')
    }

    return await next(event)
  }

  private isStoneProject (): boolean {
    const dependencies = readJsonSync(basePath('package.json'), { throws: false })?.dependencies
    return dependencies?.['@stone-js/core'] !== undefined || pathExistsSync(basePath('stone.config.js')) || pathExistsSync(basePath('stone.config.mjs'))
  }
}
