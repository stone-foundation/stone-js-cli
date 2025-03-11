import { ConsoleContext } from '../declarations'
import { MetaPipe, Pipeline } from '@stone-js/pipeline'
import { basePath, buildPath } from '@stone-js/filesystem'
import { IBlueprint, IncomingEvent } from '@stone-js/core'
import { CommandOutput } from '@stone-js/node-cli-adapter'
import { ReactPreviewMiddleware } from './ReactPreviewMiddleware'
import { reactServerTemplate, reactHtmlTemplate, reactClientTemplate } from './stubs'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { ReactConsoleMiddleware, ReactDevMiddleware } from './ReactDevMiddleware'
import { ReactClientBuildMiddleware, ReactServerBuildMiddleware } from './ReactBuildMiddleware'

/**
 * The React builder class.
 */
export class ReactBuilder {
  private readonly blueprint: IBlueprint
  private readonly commandOutput: CommandOutput

  /**
   * Creates a new React builder instance.
   *
   * @param context - The service container to manage dependencies.
   */
  constructor (private readonly context: ConsoleContext) {
    this.blueprint = context.blueprint
    this.commandOutput = context.commandOutput
  }

  /**
   * Builds the application.
   *
   * @param event The incoming event.
   */
  async build (event: IncomingEvent): Promise<void> {
    const ssr = event.get<boolean>('ssr', false)
    this.commandOutput.info(`Building React application with ${ssr ? 'SSR' : 'CSR'}...`)
    await this.executeThroughPipeline(ssr ? ReactServerBuildMiddleware : ReactClientBuildMiddleware)
    this.commandOutput.info('React application built successfully!')
  }

  /**
   * Starts the development server.
   *
   * @param _event The incoming event.
   */
  async dev (_event: IncomingEvent): Promise<void> {
    await this.executeThroughPipeline(ReactDevMiddleware)
  }

  /**
   * Previews the application.
   *
   * @param _event The incoming event.
   */
  async preview (_event: IncomingEvent): Promise<void> {
    await this.executeThroughPipeline(ReactPreviewMiddleware)
  }

  /**
   * Runs the application in the console.
   *
   * @param _event The incoming event.
   */
  async console (_event: IncomingEvent): Promise<void> {
    await this.executeThroughPipeline(ReactConsoleMiddleware)
  }

  /**
   * Exports the application.
   *
   * @param event The incoming event.
   */
  async exportIndexHtml (event: IncomingEvent): Promise<void> {
    const userIndexJS = basePath(this.isTypescript() ? 'index.ts' : 'index.mjs')
    const builtIndexJS = buildPath(this.isTypescript() ? 'index.ts' : 'index.mjs')

    writeFileSync(
      basePath('index.html'),
      reactHtmlTemplate(existsSync(userIndexJS) ? userIndexJS : builtIndexJS),
      'utf-8'
    )
  }

  /**
   * Exports the development index HTML file.
   *
   * @param event The incoming event.
   */
  async exportIndexDevHtml (event: IncomingEvent): Promise<void> {
    const userIndexJS = basePath(this.isTypescript() ? 'index.dev.ts' : 'index.dev.mjs')
    const builtIndexJS = buildPath(this.isTypescript() ? 'index.dev.ts' : 'index.dev.mjs')

    writeFileSync(
      basePath('index.dev.html'),
      reactHtmlTemplate(existsSync(userIndexJS) ? userIndexJS : builtIndexJS),
      'utf-8'
    )
  }

  /**
   * Exports the index JS file.
   *
   * @param event The incoming event.
   */
  async exportIndexJs (event: IncomingEvent): Promise<void> {
    writeFileSync(
      basePath(this.isTypescript() ? 'index.ts' : 'index.mjs'),
      reactClientTemplate(basePath(this.blueprint.get('stone.autoload.app', 'app/**/*.{ts,mjs,js,json}'))),
      'utf-8'
    )
  }

  /**
   * Exports the development index JS file.
   *
   * @param event The incoming event.
   */
  async exportIndexDevJs (event: IncomingEvent): Promise<void> {
    writeFileSync(
      basePath(this.isTypescript() ? 'index.dev.ts' : 'index.dev.mjs'),
      reactServerTemplate(basePath(this.blueprint.get('stone.autoload.app', 'app/**/*.{ts,tsx,js,mjs,jsx,mjsx,json}'))),
      'utf-8'
    )
  }

  /**
   * Exports the Vite configuration file.
   *
   * @param event The incoming event.
   */
  async exportViteConfig (event: IncomingEvent): Promise<void> {
    writeFileSync(
      basePath(this.isTypescript() ? 'vite.config.ts' : 'vite.config.js'),
      readFileSync('./vite.config.ts', 'utf-8'),
      'utf-8'
    )
  }

  /**
   * Exports the Vitest configuration file.
   *
   * @param event The incoming event.
   */
  async exportVitestConfig (event: IncomingEvent): Promise<void> {
    writeFileSync(
      basePath(this.isTypescript() ? 'vitest.config.ts' : 'vitest.config.js'),
      readFileSync('./vitest.config.ts', 'utf-8'),
      'utf-8'
    )
  }

  private isTypescript (): boolean {
    return this.blueprint.get<string>('stone.autoload.type', 'javascript') === 'typescript'
  }

  private async executeThroughPipeline (pipes: Array<MetaPipe<IBlueprint>>): Promise<void> {
    await Pipeline
      .create<IBlueprint>()
      .send(this.blueprint)
      .through(...pipes)
      .thenReturn()
  }
}
