import { Argv } from 'yargs'
import fsExtra from 'fs-extra'
import { rollupConfigStub } from '../stubs'
import { CliError } from '../errors/CliError'
import { basePath, makeBootstrapFile } from '../utils'
import { CommandOptions, CommandOutput } from '@stone-js/node-cli-adapter'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'

const { outputFileSync, pathExistsSync } = fsExtra

export const exportCommandOptions: CommandOptions = {
  name: 'export',
  alias: 'e',
  args: ['[module]'],
  desc: 'Useful to export Stone.js or third party config/options',
  options: (yargs: Argv) => {
    return yargs
      .positional('module', {
        type: 'string',
        default: 'app',
        desc: 'module or config name to export. e.g. app, cli, rollup'
      })
      .option('force', {
        alias: 'f',
        type: 'boolean',
        default: false,
        desc: 'Force overriding'
      })
  }
}

export class ExportCommand {
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
    if (blueprint === undefined) { throw new CliError('Blueprint is required to create a BuildCommand instance.') }
    if (commandOutput === undefined) { throw new CliError('CommandOutput is required to create a BuildCommand instance.') }

    this.blueprint = blueprint
    this.commandOutput = commandOutput
  }

  /**
   * Handle the incoming event.
   */
  async handle (event: IncomingEvent): Promise<OutgoingResponse> {
    const force = event.getMetadataValue<boolean>('force', false)
    const module = event.getMetadataValue('module', 'app') as ('app' | 'cli' | 'rollup')
    const isExported = this.getModules(force)[module]?.()

    isExported && this.commandOutput.info(`Module(${module}) exported!`)
    !isExported && this.commandOutput.error(`This module(${module}) does not exist or does not provide export options.`)

    return OutgoingResponse.create({ statusCode: 0 })
  }

  /**
   * Get modules to export.
   */
  private getModules (force?: boolean): Record<'app' | 'cli' | 'rollup', () => boolean> {
    return {
      app: () => makeBootstrapFile(this.blueprint, 'export', false, force),
      cli: () => makeBootstrapFile(this.blueprint, 'export', true, force),
      rollup: () => this.exportRollup(force)
    }
  }

  /**
   * Export rollup config.
   */
  private exportRollup (force?: boolean): boolean {
    const filename = 'rollup.config.mjs'

    if (pathExistsSync(basePath(filename)) && force === true) {
      outputFileSync(basePath(filename), rollupConfigStub, { encoding: 'utf-8' })
      return true
    } else {
      this.commandOutput.error(`Cannot override your existing (${filename}) file. Use --force to override it.`)
      return false
    }
  }
}
