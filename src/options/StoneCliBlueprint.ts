import { DotenvConfig, dotenv } from './DotenvConfig'
import { AutoloadConfig, autoload } from './AutoloadConfig'
import { CreateAppConfig, createApp } from './CreateAppConfig'
import { NODE_CONSOLE_PLATFORM } from '@stone-js/node-cli-adapter'
import { MetaCLIBlueprintMiddleware } from '../middleware/BlueprintMiddleware'
import { AppConfig, IncomingEvent, OutgoingResponse, StoneBlueprint } from '@stone-js/core'
import { MetaEnsureStoneProjectMiddleware } from '../middleware/EnsureStoneProjectMiddleware'

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
   * Create app configuration
   */
  createApp: CreateAppConfig
}

/**
 * Blueprint configuration for the Stone CLI application.
 */
export interface StoneCliBlueprint extends StoneBlueprint {
  stone: StoneCliAppConfig
}

/**
 * Default blueprint configuration for the Stone CLI.
 */
export const stoneCliBlueprint: StoneCliBlueprint = {
  stone: {
    dotenv,
    autoload,
    createApp,
    adapter: {
      platform: NODE_CONSOLE_PLATFORM
    },
    builder: {
      middleware: MetaCLIBlueprintMiddleware
    },
    kernel: {
      middleware: [
        MetaEnsureStoneProjectMiddleware
      ]
    }
  }
}
