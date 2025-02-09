import spawn from 'cross-spawn'
import { watch } from 'chokidar'
import process from 'node:process'
import { CliError } from '../errors/CliError'
import { ChildProcess } from 'node:child_process'
import { IncomingEvent, OutgoingResponse } from '@stone-js/core'
import { CommandOptions, CommandOutput } from '@stone-js/node-cli-adapter'
import { BuildAppContext, buildMiddleware } from '../middleware/buildMiddleware'
import { basePath, processThroughPipeline, buildPath, setupProcessSignalHandlers } from '../utils'

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
   * Output used to print data in console.
   */
  private readonly buildAppContext: BuildAppContext

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
  constructor (container: BuildAppContext) {
    if (container === undefined) { throw new CliError('Container is required to create a ServeCommand instance.') }
    if (container.blueprint === undefined) { throw new CliError('Blueprint is required to create a ServeCommand instance.') }
    if (container.commandOutput === undefined) { throw new CliError('CommandOutput is required to create a ServeCommand instance.') }

    this.buildAppContext = container
    this.commandOutput = container.commandOutput

    setupProcessSignalHandlers(this.serverProcess)
  }

  /**
   * Handle the incoming event.
   */
  async handle (_event: IncomingEvent): Promise<OutgoingResponse> {
    // Build and run app.
    await processThroughPipeline(this.buildAppContext, buildMiddleware)
    this.startProcess()

    // Rebuild and restart app on files changed.
    this.appWatcher(async () => {
      await processThroughPipeline(this.buildAppContext, buildMiddleware)
      this.startProcess()
    })

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
    this.serverProcess = spawn('node', [buildPath('app.bootstrap.mjs'), ...process.argv.slice(2)], { stdio: 'inherit' })
    this.serverProcess.on('exit', (code) => process.exit(code ?? 0))
  }
}
