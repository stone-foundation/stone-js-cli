import { Argv } from 'yargs'
import spawn from 'cross-spawn'
import { IncomingEvent } from '@stone-js/core'
import { buildPath } from '@stone-js/filesystem'
import { ConsoleContext } from '../declarations'
import { ChildProcess } from 'node:child_process'
import { ReactBuilder } from '../react/ReactBuilder'
import { ServerBuilder } from '../server/ServerBuilder'
import { CommandOptions } from '@stone-js/node-cli-adapter'
import { isReactApp, setupProcessSignalHandlers } from '../utils'

/**
 * The serve command options.
 */
export const serveCommandOptions: CommandOptions = {
  name: 'serve',
  alias: 'dev',
  args: ['[target]'],
  desc: 'Run project in dev mode',
  options: (yargs: Argv) => {
    return yargs
      .positional('target', {
        type: 'string',
        desc: 'app target to serve',
        choices: ['server', 'react']
      })
      .option('language', {
        alias: 'lang',
        type: 'string',
        desc: 'language to use',
        choices: ['javascript', 'typescript']
      })
      .option('rendering', {
        alias: 'r',
        type: 'string',
        desc: 'web rendering type',
        choices: ['csr', 'ssr']
      })
      .option('imperative', {
        alias: 'i',
        type: 'boolean',
        desc: 'imperative api'
      })
  }
}

/**
 * The serve command class.
 */
export class ServeCommand {
  private serverProcess?: ChildProcess

  /**
   * Create a new instance of ServeCommand.
   *
   * @param context - The service container to manage dependencies.
   */
  constructor (private readonly context: ConsoleContext) {
    setupProcessSignalHandlers(this.serverProcess)
  }

  /**
   * Handle the incoming event.
   *
   * @param event - The incoming event.
   */
  async handle (event: IncomingEvent): Promise<void> {
    if (isReactApp(this.context.blueprint, event)) {
      await this.startReactServer(event)
    } else {
      await this.startServerAndWatchFiles(event)
    }
  }

  /**
   * Start React Server Process.
   *
   * @param event - The incoming event.
   */
  private async startReactServer (event: IncomingEvent): Promise<void> {
    await new ReactBuilder(this.context).dev(event)
    this.startProcess()
  }

  /**
   * Start Backend App Server and Watch file changes.
   *
   * @param event - The incoming event.
   */
  private async startServerAndWatchFiles (event: IncomingEvent): Promise<void> {
    const server = new ServerBuilder(this.context)

    this.context.commandOutput.show(
      this.context.commandOutput.format.yellow('⚡ Building application...')
    )

    await server.dev(event)

    server.watchFiles(async () => {
      try {
        await server.dev(event, true)
        this.startProcess()
      } catch (error: any) {
        this.context.commandOutput.error(`Error: ${String(error.message)}`)
      }
    })

    this.startProcess()
  }

  /**
   * Start Process.
   */
  private startProcess (): void {
    this.serverProcess?.kill('SIGTERM')
    this.serverProcess = spawn('node', [buildPath('server.mjs'), ...process.argv.slice(2)], { stdio: 'inherit' })
  }
}
