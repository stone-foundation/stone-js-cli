import {
  reactHtmlEntryPointTemplate,
  reactServerEntryPointTemplate,
  reactClientEntryPointTemplate,
  reactConsoleEntryPointTemplate
} from './stubs'
import { basePath } from '@stone-js/filesystem'
import { ConsoleContext } from '../declarations'
import { dirPath, isTypescriptApp } from '../utils'
import { MetaPipe, Pipeline } from '@stone-js/pipeline'
import { IBlueprint, IncomingEvent } from '@stone-js/core'
import { ReactPreviewMiddleware } from './ReactPreviewMiddleware'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { ReactConsoleMiddleware, ReactDevMiddleware } from './ReactDevMiddleware'
import { ReactClientBuildMiddleware, ReactServerBuildMiddleware } from './ReactBuildMiddleware'

/**
 * The React builder class.
 */
export class ReactBuilder {
  /**
   * Creates a new React builder instance.
   *
   * @param context - The service container to manage dependencies.
   */
  constructor (private readonly context: ConsoleContext) {}

  /**
   * Builds the application.
   *
   * @param event The incoming event.
   */
  async build (event: IncomingEvent): Promise<void> {
    const ssr = event.get<boolean>('ssr', false)
    this.context.commandOutput.info(`Building React application with ${ssr ? 'SSR' : 'CSR'}...`)
    await this.executeThroughPipeline(ssr ? ReactServerBuildMiddleware : ReactClientBuildMiddleware)
    this.context.commandOutput.show(`🎉 ${this.context.commandOutput.format.green('React application built successfully!')}`)
    setImmediate(() => process.exit(0)).unref()
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
   * Exports server files.
   *
   * @param event The incoming event.
   */
  async export (event: IncomingEvent): Promise<void> {
    let isExported = false
    const module = event.get<'app' | 'console' | 'vite' | 'vitest'>('module', 'app')
    switch (module) {
      case 'app':
        await this.exportClientTemplate()
        await this.exportServerTemplate()
        isExported = await this.exportIndexHtml()
        break
      case 'console':
        isExported = await this.exportConsoleTemplate()
        break
      case 'vite':
        isExported = await this.exportViteConfig()
        break
    }

    isExported && this.context.commandOutput.info(`Module(${module}) exported!`)
  }

  /**
   * Exports the application index.html file.
   *
   * @returns The export status.
   */
  private async exportIndexHtml (): Promise<boolean> {
    if (await this.confirmCreation('index.html')) {
      const content = reactHtmlEntryPointTemplate(
        '<!--main-js-->',
        '<!--main-css-->'
      )

      writeFileSync(basePath('index.html'), content, 'utf-8')

      return true
    }
    return false
  }

  /**
   * Exports the client template.
   *
   * @returns The export status.
   */
  private async exportClientTemplate (): Promise<boolean> {
    const filename = this.isTypescript() ? 'client.ts' : 'client.mjs'

    if (await this.confirmCreation(filename)) {
      writeFileSync(
        basePath(filename),
        reactClientEntryPointTemplate('%pattern%'),
        'utf-8'
      )
      return true
    }
    return false
  }

  /**
   * Exports the server template.
   *
   * @returns The export status.
   */
  private async exportServerTemplate (): Promise<boolean> {
    const filename = this.isTypescript() ? 'server.ts' : 'server.mjs'

    if (await this.confirmCreation(filename)) {
      writeFileSync(
        basePath(filename),
        reactServerEntryPointTemplate('%pattern%', "'%printUrls%'"),
        'utf-8'
      )
      return true
    }
    return false
  }

  /**
   * Exports the console template.
   *
   * @returns The export status.
   */
  private async exportConsoleTemplate (): Promise<boolean> {
    const filename = this.isTypescript() ? 'console.ts' : 'console.mjs'

    if (await this.confirmCreation(filename)) {
      writeFileSync(
        basePath(filename),
        reactConsoleEntryPointTemplate('%pattern%'),
        'utf-8'
      )
      return true
    }
    return false
  }

  /**
   * Exports the Vite configuration file.
   *
   * @returns The export status.
   */
  private async exportViteConfig (): Promise<boolean> {
    const filename = this.isTypescript() ? 'vite.config.ts' : 'vite.config.mjs'

    if (await this.confirmCreation(filename)) {
      writeFileSync(
        basePath(filename),
        readFileSync(dirPath('../dist/vite.config.js'), 'utf-8'),
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
   * Is the application a TypeScript application.
   *
   * @returns True if the application is a TypeScript application, false otherwise.
   */
  private isTypescript (): boolean {
    return isTypescriptApp(this.context.blueprint)
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
