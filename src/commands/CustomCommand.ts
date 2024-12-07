import spawn from 'cross-spawn'
import { argv } from 'node:process'
import { buildPipes } from './BuildCommand'
import { CliError } from '../errors/CliError'
import { CommandOptions } from '@stone-js/node-cli-adapter'
import { buildApp, buildPath, shouldBuild } from '../utils'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'

export const customCommandOptions: CommandOptions = {
  name: '*',
  desc: 'Build the Stone project.'
}

export class CustomCommand {
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
    spawn('node', [buildPath('cli.bootstrap.mjs'), ...argv.slice(2)], { stdio: 'inherit' })
  }
}
