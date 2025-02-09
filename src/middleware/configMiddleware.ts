import { DotenvConfig } from '../options/DotenvConfig'
import { getEnvVariables, importModule } from '../utils'
import { MixedPipe, NextPipe } from '@stone-js/pipeline'
import { StoneCliAppConfig } from '../options/StoneCliBlueprint'
import { ClassType, ConfigContext, IBlueprint } from '@stone-js/core'
import { ListCommand, listCommandOptions } from '../commands/ListCommand'
import { InitCommand, initCommandOptions } from '../commands/InitCommand'
import { BuildCommand, buildCommandOptions } from '../commands/BuildCommand'
import { CacheCommand, cacheCommandOptions } from '../commands/CacheCommand'
import { ServeCommand, serveCommandOptions } from '../commands/ServeCommand'
import { CustomCommand, customCommandOptions } from '../commands/CustomCommand'
import { ExportCommand, exportCommandOptions } from '../commands/ExportCommand'
import { TypingsCommand, typingsCommandOptions } from '../commands/TypingsCommand'
import { CommandOptions, NODE_CONSOLE_PLATFORM, NodeCliAdapterConfig } from '@stone-js/node-cli-adapter'

export const LoadStoneConfigMiddleware = async ({ modules, blueprint }: ConfigContext, next: NextPipe<ConfigContext, IBlueprint>): Promise<IBlueprint> => {
  const configPaths = ['./stone.config.mjs', './stone.config.js']

  for (const path of configPaths) {
    const module = await importModule<{ [key: string]: Partial<StoneCliAppConfig> }>(path)
    const config = Object.values(module ?? {}).shift()
    if (config !== undefined) {
      blueprint.add('stone.dotenv', config.dotenv)
      blueprint.add('stone.autoload', config.autoload)
      break
    }
  }

  return await next({ modules, blueprint })
}

export const LoadDotenvVariablesMiddleware = async ({ modules, blueprint }: ConfigContext, next: NextPipe<ConfigContext, IBlueprint>): Promise<IBlueprint> => {
  const options = blueprint.get<DotenvConfig>('stone.dotenv', {})
  const publicOptions = { ...options?.options, ...options?.public }
  const privateOptions = { ...options?.options, ...options?.private }

  getEnvVariables(publicOptions)
  getEnvVariables(privateOptions)

  return await next({ modules, blueprint })
}

export const SetCliCommandsMiddleware = ({ modules, blueprint }: ConfigContext, next: NextPipe<ConfigContext, IBlueprint>): IBlueprint | Promise<IBlueprint> => {
  const commands = [
    [InitCommand, initCommandOptions],
    [ListCommand, listCommandOptions],
    [BuildCommand, buildCommandOptions],
    [CacheCommand, cacheCommandOptions],
    [ServeCommand, serveCommandOptions],
    [CustomCommand, customCommandOptions],
    [ExportCommand, exportCommandOptions],
    [TypingsCommand, typingsCommandOptions]
  ] as Array<[ClassType, CommandOptions]>

  blueprint
    .get<NodeCliAdapterConfig[]>('stone.adapters', [])
    .filter(adapter => adapter.platform === NODE_CONSOLE_PLATFORM)
    .forEach(adapter => { adapter.commands = commands.concat(adapter.commands) })

  return next({ modules, blueprint })
}

export const cliConfigMiddleware: MixedPipe[] = [
  { priority: 1, module: SetCliCommandsMiddleware },
  { priority: 2, module: LoadStoneConfigMiddleware },
  { priority: 3, module: LoadDotenvVariablesMiddleware }
]
