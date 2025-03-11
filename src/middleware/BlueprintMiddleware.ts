import { getEnvVariables } from '../utils'
import { importModule } from '@stone-js/filesystem'
import { DotenvConfig } from '../options/DotenvConfig'
import { MetaPipe, NextPipe } from '@stone-js/pipeline'
import { StoneCliAppConfig } from '../options/StoneCliBlueprint'
import { NODE_CONSOLE_PLATFORM } from '@stone-js/node-cli-adapter'
import { BlueprintContext, ClassType, IBlueprint } from '@stone-js/core'
import { ListCommand, listCommandOptions } from '../commands/ListCommand'
import { InitCommand, initCommandOptions } from '../commands/InitCommand'
import { BuildCommand, buildCommandOptions } from '../commands/BuildCommand'
import { CacheCommand, cacheCommandOptions } from '../commands/CacheCommand'
import { ServeCommand, serveCommandOptions } from '../commands/ServeCommand'
import { CustomCommand, customCommandOptions } from '../commands/CustomCommand'
import { ExportCommand, exportCommandOptions } from '../commands/ExportCommand'
import { TypingsCommand, typingsCommandOptions } from '../commands/TypingsCommand'
import { PreviewCommand, previewCommandOptions } from '../commands/PreviewCommand'

/**
 * Middleware to load the Stone configuration from the stone.config.js or stone.config.mjs file.
 *
 * @param context - The configuration context containing modules and blueprint.
 * @param next - The next pipeline function to continue processing.
 * @returns The updated blueprint or a promise resolving to it.
 *
 * @example
 * ```typescript
 * LoadStoneConfigMiddleware(context, next)
 * ```
 */
export const LoadStoneConfigMiddleware = async (
  context: BlueprintContext<IBlueprint, ClassType>,
  next: NextPipe<BlueprintContext<IBlueprint, ClassType>, IBlueprint>
): Promise<IBlueprint> => {
  const configPaths = ['./stone.config.mjs', './stone.config.js']

  for (const path of configPaths) {
    const module = await importModule<{ [key: string]: Partial<StoneCliAppConfig> }>(path)
    const config = Object.values(module ?? {}).shift()
    if (config !== undefined) {
      context.blueprint.add('stone.dotenv', config.dotenv)
      context.blueprint.add('stone.autoload', config.autoload)
      break
    }
  }

  return await next(context)
}

/**
 * Middleware to load the environment variables from the .env file.
 *
 * @param context - The configuration context containing modules and blueprint.
 * @param next - The next pipeline function to continue processing.
 * @returns The updated blueprint or a promise resolving to it.
 *
 * @example
 * ```typescript
 * LoadDotenvVariablesMiddleware(context, next)
 * ```
 */
export const LoadDotenvVariablesMiddleware = async (
  context: BlueprintContext<IBlueprint, ClassType>,
  next: NextPipe<BlueprintContext<IBlueprint, ClassType>, IBlueprint>
): Promise<IBlueprint> => {
  const options = context.blueprint.get<DotenvConfig>('stone.dotenv', {})
  const publicOptions = { ...options?.options, ...options?.public }
  const privateOptions = { ...options?.options, ...options?.private }

  getEnvVariables(publicOptions)
  getEnvVariables(privateOptions)

  return await next(context)
}

/**
 * Middleware to set cli commands for Node CLI adapters.
 *
 * @param context - The configuration context containing modules and blueprint.
 * @param next - The next pipeline function to continue processing.
 * @returns The updated blueprint or a promise resolving to it.
 *
 * @example
 * ```typescript
 * SetCliCommandsMiddleware(context, next)
 * ```
 */
export const SetCliCommandsMiddleware = async (
  context: BlueprintContext<IBlueprint, ClassType>,
  next: NextPipe<BlueprintContext<IBlueprint, ClassType>, IBlueprint>
): Promise<IBlueprint> => {
  const commands = [
    { module: InitCommand, options: initCommandOptions, isClass: true },
    { module: ListCommand, options: listCommandOptions, isClass: true },
    { module: BuildCommand, options: buildCommandOptions, isClass: true },
    { module: CacheCommand, options: cacheCommandOptions, isClass: true },
    { module: ServeCommand, options: serveCommandOptions, isClass: true },
    { module: CustomCommand, options: customCommandOptions, isClass: true },
    { module: ExportCommand, options: exportCommandOptions, isClass: true },
    { module: TypingsCommand, options: typingsCommandOptions, isClass: true },
    { module: PreviewCommand, options: previewCommandOptions, isClass: true }
  ]

  if (context.blueprint.get<string>('stone.adapter.platform') === NODE_CONSOLE_PLATFORM) {
    context.blueprint.add('stone.adapter.commands', commands)
  }

  return await next(context)
}

/**
 * Configuration for cli processing middleware.
 *
 * This array defines a list of middleware pipes, each with a `pipe` function and a `priority`.
 * These pipes are executed in the order of their priority values, with lower values running first.
 */
export const MetaCLIBlueprintMiddleware: Array<MetaPipe<BlueprintContext<IBlueprint, ClassType>, IBlueprint>> = [
  { priority: 1, module: SetCliCommandsMiddleware },
  { priority: 2, module: LoadStoneConfigMiddleware },
  { priority: 3, module: LoadDotenvVariablesMiddleware }
]
