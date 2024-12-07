import { defineAppBlueprint, stoneBlueprint } from '@stone-js/core'
import { StoneCliServiceProvider } from '../StoneCliServiceProvider'
import { ListCommand, listCommandOptions } from '../commands/ListCommand'
import { InitCommand, initCommandOptions } from '../commands/InitCommand'
import { BuildCommand, buildCommandOptions } from '../commands/BuildCommand'
import { CacheCommand, cacheCommandOptions } from '../commands/CacheCommand'
import { ServeCommand, serveCommandOptions } from '../commands/ServeCommand'
import { CustomCommand, customCommandOptions } from '../commands/CustomCommand'
import { ExportCommand, exportCommandOptions } from '../commands/ExportCommand'
import { TypingsCommand, typingsCommandOptions } from '../commands/TypingsCommand'
import { NodeCliAdapterConfig, CommandRouter, nodeCliAdapterBlueprint } from '@stone-js/node-cli-adapter'

/**
 * Configuration for the Stone Cli Adapter.
 */
const stoneCliAdapterConfig: Partial<NodeCliAdapterConfig> = {
  router: CommandRouter,
  commands: [
    [InitCommand, initCommandOptions],
    [ListCommand, listCommandOptions],
    [BuildCommand, buildCommandOptions],
    [CacheCommand, cacheCommandOptions],
    [ServeCommand, serveCommandOptions],
    [CustomCommand, customCommandOptions],
    [ExportCommand, exportCommandOptions],
    [TypingsCommand, typingsCommandOptions]
  ]
}

/**
 * Blueprint configuration for the Stone Cli.
 */
export const stoneCliBlueprint = defineAppBlueprint(stoneBlueprint, nodeCliAdapterBlueprint, {
  stone: {
    adapter: stoneCliAdapterConfig,
    providers: [StoneCliServiceProvider]
  }
})
