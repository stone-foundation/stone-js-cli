import spawn from 'cross-spawn'
import process from 'node:process'
import { CliError } from '../errors/CliError'
import { ChildProcess } from 'node:child_process'
import { CommandOptions } from '@stone-js/node-cli-adapter'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'
import { BuildAppContext, buildMiddleware } from '../middleware/buildMiddleware'
import { processThroughPipeline, buildPath, shouldBuild, setupProcessSignalHandlers } from '../utils'

export const customCommandOptions: CommandOptions = {
  name: '*',
  desc: 'Redirect to user-defined commands'
}

export class CustomCommand {
  /**
   * Server process.
   */
  private serverProcess?: ChildProcess

  /**
   * Output used to print data in console.
   */
  private readonly buildAppContext: BuildAppContext

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
  constructor (container: BuildAppContext) {
    if (container === undefined) { throw new CliError('Container is required to create a CustomCommand instance.') }
    if (container.blueprint === undefined) { throw new CliError('Blueprint is required to create a CustomCommand instance.') }

    this.buildAppContext = container
    this.blueprint = container.blueprint

    setupProcessSignalHandlers(this.serverProcess)
  }

  /**
   * Handle the incoming event.
   *
   * @param _event - The incoming event.
   * @returns The blueprint.
   */
  async handle (_event: IncomingEvent): Promise<OutgoingResponse> {
    if (shouldBuild(this.blueprint)) {
      await processThroughPipeline(this.buildAppContext, buildMiddleware)
      this.startProcess()
    } else {
      this.startProcess()
    }

    return OutgoingResponse.create({ statusCode: 0 })
  }

  /**
   * Start Process.
   */
  private startProcess (): void {
    this.serverProcess = spawn('node', [buildPath('cli.bootstrap.mjs'), ...process.argv.slice(2)], { stdio: 'inherit' })
    this.serverProcess.on('exit', (code) => process.exit(code ?? 0))
  }
}
