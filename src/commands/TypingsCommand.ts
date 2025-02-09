import { Argv } from 'yargs'
import spawn from 'cross-spawn'
import process from 'node:process'
import { CliError } from '../errors/CliError'
import { ChildProcess } from 'node:child_process'
import { CommandOptions } from '@stone-js/node-cli-adapter'
import { nodeModulesPath, setupProcessSignalHandlers } from '../utils'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'

export const typingsCommandOptions: CommandOptions = {
  name: 'typings',
  alias: 't',
  desc: 'Check code typings for typescript',
  options: (yargs: Argv) => {
    return yargs
      .option('watch', {
        alias: 'w',
        type: 'boolean',
        default: false,
        desc: 'Launch checker in watch mode for Typescript'
      })
  }
}

export class TypingsCommand {
  /**
   * Server process.
   */
  private serverProcess?: ChildProcess

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
    if (blueprint === undefined) { throw new CliError('Blueprint is required to create a TypingsCommand instance.') }

    this.blueprint = blueprint

    setupProcessSignalHandlers(this.serverProcess)
  }

  /**
   * Handle the incoming event.
   */
  async handle (event: IncomingEvent): Promise<OutgoingResponse> {
    this.typeCheckerProcess(event.getMetadataValue<boolean>('watch', false))
    return OutgoingResponse.create({ statusCode: 0 })
  }

  /**
   * Type checker watcher Process.
   */
  private typeCheckerProcess (watch?: boolean): void {
    if (watch === true) {
      if (this.blueprint.get('stone.autoload.type') === 'typescript') {
        this.serverProcess = spawn('node', [nodeModulesPath('.bin/tsc'), '--noEmit', '--watch'], { stdio: 'inherit' })
        this.serverProcess.on('exit', (code) => process.exit(code ?? 0))
      }
    } else {
      if (this.blueprint.get('stone.autoload.type') === 'typescript') {
        this.serverProcess = spawn('node', [nodeModulesPath('.bin/tsc'), '--noEmit'], { stdio: 'inherit' })
        this.serverProcess.on('exit', (code) => process.exit(code ?? 0))
      }
    }
  }
}
