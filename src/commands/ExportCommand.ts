import { Argv } from 'yargs'
import { rollupConfigStub } from '../stubs'
import { CliError } from '../errors/CliError'
import { CommandOptions, CommandOutput } from '@stone-js/node-cli-adapter'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'
import { copySync, outputFileSync, pathExistsSync, readJsonSync } from 'fs-extra'
import { basePath, configPath, makeBootstrapFile, makeFilename, nodeModulesPath } from '../utils'

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
        desc: 'module or package name to export. e.g. app, cli, rollup, @stone-js/node-adapter'
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

    this.blueprint = blueprint
    this.commandOutput = commandOutput
  }

  /**
   * Handle the incoming event.
   */
  async handle (event: IncomingEvent): Promise<OutgoingResponse> {
    const force = event.getMetadataValue('force', false) as boolean
    const module = event.getMetadataValue('module', 'app') as ('app' | 'cli' | 'rollup')
    const modules = {
      app: () => makeBootstrapFile(this.blueprint, 'export', false, force),
      cli: () => makeBootstrapFile(this.blueprint, 'export', true, force),
      rollup: () => this.exportRollup(force)
    }
    const isExported = modules[module]?.()

    isExported && this.commandOutput.info(`Module(${module}) exported!`)
    isExported === undefined && this.commandOutput.error(`This module(${module}) does not exist or does not provide export options.`)

    return OutgoingResponse.create({ statusCode: 0 })
  }

  /**
   * Export rollup config.
   */
  private exportRollup (force: boolean): boolean {
    const filename = 'rollup.config.mjs'

    if (pathExistsSync(basePath(filename)) && !force) {
      outputFileSync(basePath(filename), rollupConfigStub, { encoding: 'utf-8' })
      return true
    } else {
      this.commandOutput.error(`Cannot override your existing (${filename}) file. Use --force to override it.`)
      return false
    }
  }

  /**
   * Export modules config/options.
   */
  private exportModuleConfig (module: string, force: boolean): boolean {
    let isExported = false

    if (!pathExistsSync(nodeModulesPath(module, 'package.json'))) {
      this.commandOutput.error(`This module(${module}) does not exist or does not provide export options.`)
      return false
    }

    const packageJson = readJsonSync(nodeModulesPath(module, 'package.json'), { throws: false })

    const make = packageJson.stone?.config?.make ?? {}

    Object.entries(make).forEach(([filename, optionsPath]) => {
      if (filename === undefined) {
        this.commandOutput.error(`No configurations maker defined for this module(${module})`)
        return false
      }

      const originPath = nodeModulesPath(module, optionsPath as string)
      const destPath = configPath(makeFilename(this.blueprint, filename))

      if (!pathExistsSync(originPath)) {
        this.commandOutput.error(`No options file(${filename}) found for this module(${module}).`)
        return false
      }

      try {
        copySync(originPath, destPath, { overwrite: force, errorOnExist: true })
      } catch (_) {
        this.commandOutput.error(`Cannot override an existing file(${filename}) for this module(${module}). Use --force to override it.`)
        return false
      }

      isExported = true
    })

    return isExported
  }
}
