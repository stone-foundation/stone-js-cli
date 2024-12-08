import { onInit } from '../hooks'
import { DotenvConfig, dotenv } from './DotenvConfig'
import { AutoloadConfig, autoload } from './AutoloadConfig'
import { ListCommand, listCommandOptions } from '../commands/ListCommand'
import { InitCommand, initCommandOptions } from '../commands/InitCommand'
import { BuildCommand, buildCommandOptions } from '../commands/BuildCommand'
import { CacheCommand, cacheCommandOptions } from '../commands/CacheCommand'
import { ServeCommand, serveCommandOptions } from '../commands/ServeCommand'
import { CustomCommand, customCommandOptions } from '../commands/CustomCommand'
import { ExportCommand, exportCommandOptions } from '../commands/ExportCommand'
import { TypingsCommand, typingsCommandOptions } from '../commands/TypingsCommand'
import { AppConfig, IncomingEvent, OutgoingResponse, StoneBlueprint } from '@stone-js/core'
import { NodeCliAdapterConfig, CommandRouter, NODE_CONSOLE_PLATFORM } from '@stone-js/node-cli-adapter'

/**
 * App Config configuration for the Stone CLI application.
 */
export interface StoneCliAppConfig extends Partial<AppConfig<IncomingEvent, OutgoingResponse>> {
  /**
   * Environment variable management configuration.
   */
  dotenv: DotenvConfig

  /**
   * Module autoloading configuration.
   */
  autoload: AutoloadConfig

  /**
   * Configuration for the Node CLI adapter.
   */
  adapter: Partial<NodeCliAdapterConfig>
}

/**
 * Blueprint configuration for the Stone CLI application.
 */
export interface StoneCliBlueprint extends StoneBlueprint {
  stone: StoneCliAppConfig
}

/**
 * Configuration for the Node CLI adapter, defining hooks, routing, and commands.
 */
const adapter: Partial<NodeCliAdapterConfig> = {
  hooks: { onInit },
  router: CommandRouter,
  platform: NODE_CONSOLE_PLATFORM,
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
 * Default blueprint configuration for the Stone CLI.
 */
export const stoneCliBlueprint: StoneCliBlueprint = {
  stone: {
    dotenv,
    adapter,
    autoload
  }
}
