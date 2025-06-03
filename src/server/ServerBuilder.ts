import chalk from 'chalk'
import { watch } from 'chokidar'
import { format } from 'date-fns'
import { dirPath } from '../utils'
import { CliError } from '../errors/CliError'
import { ConsoleContext } from '../declarations'
import { MetaPipe, Pipeline } from '@stone-js/pipeline'
import { basePath, distPath } from '@stone-js/filesystem'
import { IBlueprint, IncomingEvent } from '@stone-js/core'
import { consoleIndexFile, serverIndexFile } from './stubs'
import { ServerBuildMiddleware } from './ServerBuildMiddleware'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { ConsoleDevMiddleware, ServerDevMiddleware } from './ServerDevMiddleware'

/**
 * The Server builder class.
 */
export class ServerBuilder {
  /**
   * Creates a new Server builder instance.
   *
   * @param context - The service container to manage dependencies.
   */
  constructor (private readonly context: ConsoleContext) {}

  /**
   * Builds the application.
   *
   * @param _event The incoming event.
   */
  async build (_event: IncomingEvent): Promise<void> {
    await this.executeThroughPipeline(ServerBuildMiddleware)
  }

  /**
   * Starts the development server.
   *
   * @param _event The incoming event.
   * @param restart Whether to restart the server.
   */
  async dev (_event: IncomingEvent, restart?: boolean): Promise<void> {
    this.context.blueprint.set('stone.builder.server.printUrls', restart !== true)
    await this.executeThroughPipeline(ServerDevMiddleware)
  }

  /**
   * Previews the application.
   *
   * @param _event The incoming event.
   */
  preview (_event: IncomingEvent): void {
    const output = this.context.blueprint.get('stone.builder.output', 'index.mjs')
    if (!existsSync(distPath(output))) {
      throw new CliError('The application must be built before previewing.')
    }
  }

  /**
   * Runs the application in the console.
   *
   * @param _event The incoming event.
   */
  async console (_event: IncomingEvent): Promise<void> {
    await this.executeThroughPipeline(ConsoleDevMiddleware)
  }

  /**
   * Exports server files.
   *
   * @param event The incoming event.
   */
  async export (event: IncomingEvent): Promise<void> {
    let isExported = false
    const module = event.get<'app' | 'console' | 'rollup'>('module', 'app')
    switch (module) {
      case 'app':
        isExported = await this.exportServerTemplate()
        break
      case 'console':
        isExported = await this.exportConsoleTemplate()
        break
      case 'rollup':
        isExported = await this.exportRollupConfig()
        break
    }

    isExported && this.context.commandOutput.info(`Module(${module}) exported!`)
  }

  /**
   * Server Files watcher.
   *
   * @param cb - The callback function.
   */
  watchFiles (cb: () => void | Promise<void>): void {
    const filesChangedCount: Record<string, number> = {}
    const ignored = this.context.blueprint.get(
      'stone.builder.watcher.ignored',
      ['node_modules/**', 'dist/**', '.stone/**']
    )
    const watcher = watch('.', {
      ignored,
      cwd: basePath(),
      persistent: true,
      depth: undefined,
      ignoreInitial: true,
      followSymlinks: false
    })

    const incrementCount = (path: string): number => {
      filesChangedCount[path] ??= 0
      return ++filesChangedCount[path]
    }

    /* eslint-disable @typescript-eslint/no-misused-promises */
    watcher.on('change', async (path) => {
      this.printChangedFileMessage(path, 'file changed', incrementCount(path))
      await cb()
    })

    /* eslint-disable @typescript-eslint/no-misused-promises */
    watcher.on('add', async (path) => {
      this.printChangedFileMessage(path, 'file added', incrementCount(path))
      await cb()
    })

    process
      .on('SIGINT', async () => await watcher.close())
      .on('SIGTERM', async () => await watcher.close())
  }

  /**
   * Exports the server entry point template.
   *
   * @returns The export status.
   */
  private async exportServerTemplate (): Promise<boolean> {
    if (await this.confirmCreation('server.mjs')) {
      writeFileSync(
        basePath('server.mjs'),
        serverIndexFile("'%printUrls%'"),
        'utf-8'
      )
      return true
    }
    return false
  }

  /**
   * Exports the console entry point template.
   *
   * @returns The export status.
   */
  private async exportConsoleTemplate (): Promise<boolean> {
    if (await this.confirmCreation('console.mjs')) {
      writeFileSync(
        basePath('console.mjs'),
        consoleIndexFile(),
        'utf-8'
      )
      return true
    }
    return false
  }

  /**
   * Exports the Rollup configuration file.
   *
   * @returns The export status.
   */
  private async exportRollupConfig (): Promise<boolean> {
    if (await this.confirmCreation('rollup.config.mjs')) {
      writeFileSync(
        basePath('rollup.config.mjs'),
        readFileSync(dirPath('../dist/rollup.config.js'), 'utf-8'),
        'utf-8'
      )
      return true
    }
    return false
  }

  /**
   * Confirm the creation of the file.
   *
   * @param path - The path of the file.
   * @returns The confirmation status.
  */
  private async confirmCreation (path: string): Promise<boolean> {
    if (existsSync(basePath(path))) {
      return await this.context.commandInput.confirm(`This file(${path}) already exists. Do you want to overwrite it?`)
    }

    return true
  }

  /**
   * Print the changed file message.
   *
   * @param path - The path of the file.
   * @param message - The message to print
   * @param count - The count of the file.
   */
  private printChangedFileMessage (path: string, message: string, count: number = 0): void {
    const time = format(new Date(), 'h:mm:ss a')
    const countTimes = count > 1 ? chalk.yellow(`(x${count})`) : ''

    this.context.commandOutput.show(
      `${chalk.gray(time)} ${chalk.blue('[stone]')} ${chalk.green(message)} ${chalk.gray(path)} ${countTimes}`
    )
  }

  /**
   * Execute the pipeline.
   *
   * @param pipes - The pipeline to execute.
   */
  private async executeThroughPipeline (pipes: Array<MetaPipe<ConsoleContext, IBlueprint>>): Promise<void> {
    await Pipeline
      .create<ConsoleContext, IBlueprint>()
      .send(this.context)
      .through(...pipes)
      .then(context => context.blueprint)
  }
}
