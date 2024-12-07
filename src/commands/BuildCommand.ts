import { emptyDirSync } from 'fs-extra'
import { CliError } from '../errors/CliError'
import { CommandOptions } from '@stone-js/node-cli-adapter'
import { rollupBuild, rollupBundle } from '../bundler/rollupjs'
import { IBlueprint, IncomingEvent, OutgoingResponse } from '@stone-js/core'
import { buildApp, buildPath, distPath, makeBootstrapFile, pipeable, setCache } from '../utils'

export const buildCommandOptions: CommandOptions = {
  name: 'build',
  alias: 'b',
  desc: 'Build project'
}

export class BuildCommand {
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
    if (blueprint === undefined) { throw new CliError('Blueprint is required to create a BuildCommand instance.') }

    this.blueprint = blueprint
  }

  /**
   * Handle the incoming event.
   *
   * @param _event - The incoming event.
   * @returns The blueprint.
   */
  async handle (_event: IncomingEvent): Promise<OutgoingResponse> {
    await buildApp(this.blueprint, buildPipes.concat(bundlePipes), v => v)
    return OutgoingResponse.create({ statusCode: 0 })
  }
}

export const buildPipes = [
  pipeable(() => console.info('Building...')),
  pipeable(() => emptyDirSync(buildPath())),
  pipeable(async (blueprint: IBlueprint) => await rollupBuild(blueprint)),
  pipeable((blueprint: IBlueprint) => setCache(blueprint)),
  pipeable((blueprint: IBlueprint) => makeBootstrapFile(blueprint, 'build')),
  pipeable((blueprint: IBlueprint) => makeBootstrapFile(blueprint, 'build', true)),
  pipeable(() => console.info('Build finished'))
]

export const bundlePipes = [
  pipeable(() => console.info('Bundling...')),
  pipeable(() => emptyDirSync(distPath())),
  pipeable(async (blueprint: IBlueprint) => await rollupBundle(blueprint))
]
