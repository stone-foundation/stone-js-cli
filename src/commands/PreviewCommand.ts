import spawn from 'cross-spawn'
import { IncomingEvent } from '@stone-js/core'
import { ConsoleContext } from '../declarations'
import { ChildProcess } from 'node:child_process'
import { ReactBuilder } from '../react/ReactBuilder'
import { ServerBuilder } from '../server/ServerBuilder'
import { buildPath, distPath } from '@stone-js/filesystem'
import { CommandOptions } from '@stone-js/node-cli-adapter'
import { isReactApp, setupProcessSignalHandlers } from '../utils'

/**
 * The preview command options.
 */
export const previewCommandOptions: CommandOptions = {
  name: 'preview',
  alias: 'p',
  desc: 'Run project in preview mode'
}

/**
 * The preview command class.
 */
export class PreviewCommand {
  private serverProcess?: ChildProcess

  /**
   * Create a new instance of PreviewCommand.
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
      await new ReactBuilder(this.context).preview(event)
      this.startProcess(buildPath('preview.mjs'))
    } else {
      await new ServerBuilder(this.context).preview(event)
      this.startProcess(distPath('index.mjs'))
    }
  }

  /**
   * Start Process.
   */
  private startProcess (path: string): void {
    this.serverProcess = spawn('node', [path], { stdio: 'inherit' })
    this.serverProcess.on('exit', (code) => process.exit(code ?? 0))
  }
}
