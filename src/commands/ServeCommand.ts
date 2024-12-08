import spawn from 'cross-spawn'
import { watch } from 'chokidar'
import { argv } from 'node:process'
import { CliError } from '../errors/CliError'
import { ChildProcess } from 'node:child_process'
import { basePath, buildApp, buildPath } from '../utils'
import { buildPipes } from '../middleware/buildMiddleware'
import { CommandOptions, CommandOutput } from '@stone-js/node-cli-adapter'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'

export const serveCommandOptions: CommandOptions = {
  name: 'serve',
  alias: 's',
  desc: 'Serve project'
}

export class ServeCommand {
  /**
   * Server process.
   */
  private serverProcess?: ChildProcess

  /**
   * Blueprint configuration used to retrieve app settings.
   */
  private readonly blueprint: IBlueprint

  /**
   * Output used to print data in console.
   */
  private readonly commandOutput: CommandOutput

  /**
   * Create a new instance of CoreServiceProvider.
   *
   * @param container - The service container to manage dependencies.
   * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
   */
  constructor ({ blueprint, commandOutput }: { blueprint: IBlueprint, commandOutput: CommandOutput }) {
    if (blueprint === undefined) { throw new CliError('Blueprint is required to create a ServeCommand instance.') }
    if (commandOutput === undefined) { throw new CliError('CommandOutput is required to create a ServeCommand instance.') }

    this.blueprint = blueprint
    this.commandOutput = commandOutput
  }

  /**
   * Handle the incoming event.
   */
  async handle (_event: IncomingEvent): Promise<OutgoingResponse> {
    // Build and run app.
    await buildApp(this.blueprint, buildPipes, (blueprint) => {
      this.startProcess()
      return blueprint
    })

    // Rebuild and restart app on files changed.
    this.appWatcher(async () => await buildApp(this.blueprint, buildPipes, (blueprint) => {
      this.startProcess()
      return blueprint
    }))

    return OutgoingResponse.create({ statusCode: 0 })
  }

  /**
   * App watcher.
   */
  private appWatcher (handler: () => void | Promise<void>): void {
    const watcher = watch('.', {
      ignored: ['node_modules/**', 'dist/**', '.stone/**'],
      cwd: basePath(),
      persistent: true,
      ignoreInitial: true,
      followSymlinks: false,
      depth: undefined
    })

    /* eslint-disable @typescript-eslint/no-misused-promises */
    watcher.on('change', async (path) => {
      this.commandOutput.info(`File ${path} changed`)
      await handler()
    })

    /* eslint-disable @typescript-eslint/no-misused-promises */
    watcher.on('add', async (path) => {
      this.commandOutput.info(`File ${path} has been added`)
      await handler()
    })
  }

  /**
   * Start Process.
   */
  private startProcess (): void {
    this.serverProcess?.kill()
    this.serverProcess = spawn('node', [buildPath('app.bootstrap.mjs'), ...argv.slice(2)], { stdio: 'inherit' })
  }
}
