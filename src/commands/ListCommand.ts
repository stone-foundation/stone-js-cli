import spawn from 'cross-spawn'
import { buildApp, buildPath, shouldBuild } from '../utils'
import { CliError } from '../errors/CliError'
import { CommandOptions } from '@stone-js/node-cli-adapter'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'
import { buildPipes } from './BuildCommand'

export const listCommandOptions: CommandOptions = {
  name: 'list',
  alias: 'ls',
  desc: 'List all custom commands'
}

export class ListCommand {
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
   * @param _event - The incoming event.
   * @returns The blueprint.
   */
  async handle (_event: IncomingEvent): Promise<OutgoingResponse> {
    if (shouldBuild(this.blueprint)) {
      await buildApp(this.blueprint, buildPipes, (blueprint) => {
        this.startProcess()
        return blueprint
      })
    } else {
      this.startProcess()
    }
    return OutgoingResponse.create({ statusCode: 0 })
  }

  /**
   * Start Process.
   */
  private startProcess (): void {
    spawn('node', [buildPath('cli.bootstrap.mjs'), '--help'], { stdio: 'inherit' })
  }
}
