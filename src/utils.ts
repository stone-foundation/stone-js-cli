import fsExtra from 'fs-extra'
import deepmerge from 'deepmerge'
import process from 'node:process'
import { glob, globSync } from 'glob'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import DotenvExpand from 'dotenv-expand'
import { ChildProcess } from 'node:child_process'
import { basename, dirname, join } from 'node:path'
import Dotenv, { DotenvPopulateInput } from 'dotenv'
import { builder, BuilderConfig } from './options/BuilderConfig'
import { IBlueprint, IncomingEvent, isNotEmpty } from '@stone-js/core'
import { basePath, buildPath, importModule } from '@stone-js/filesystem'
import { DotenvConfig, DotenvFiles, DotenvOptions } from './options/DotenvConfig'

const { readJsonSync, pathExistsSync, outputJsonSync, outputFileSync } = fsExtra

/**
 * Resolve path from file directory.
 *
 * @param   {...string} paths
 * @returns {string}
 */
export function dirPath (...paths: string[]): string {
  return join(dirname(fileURLToPath(import.meta.url)), ...paths)
}

/**
 * Get File Hash.
 * Creates a file hash for caching purposes.
 *
 * @param filename - The path to the file.
 * @returns The MD5 hash of the file content.
 */
export function getFileHash (filename: string): string {
  return createHash('md5').update(readFileSync(filename)).digest('hex')
}

/**
 * Get cache.
 * Application files' cache memory.
 *
 * @returns The cache object.
 */
export function getCache (): Record<string, string> {
  return pathExistsSync(buildPath('.cache'))
    ? (readJsonSync(buildPath('.cache'), { throws: false }) ?? {})
    : {}
}

/**
 * Set cache.
 * Stores application files' hash in the cache.
 *
 * @param pattern - The glob pattern to match files.
 */
export function setCache (pattern: string): void {
  const cache = getCache()

  globSync(basePath(pattern)).forEach((filePath) => {
    cache[filePath] = getFileHash(filePath)
  })

  outputJsonSync(buildPath('.cache'), cache)
}

/**
 * Should build application.
 * Determines whether the application should be rebuilt.
 *
 * @param pattern - The glob pattern to match files.
 * @returns True if the application should be rebuilt; otherwise, false.
 */
export function shouldBuild (pattern: string): boolean {
  const cache = getCache()

  return globSync(basePath(pattern)).some((filePath, _, paths) => {
    return !Object.keys(cache).every(v => paths.includes(v)) || cache[filePath] === undefined || cache[filePath] !== getFileHash(filePath)
  })
}

/**
 * Get the env variables in .env file using the Dotenv package.
 *
 * @param options - The options for loading environment variables.
 * @returns The parsed environment variables.
 */
export function getEnvVariables (options: Partial<DotenvOptions>): Record<string, string> | undefined {
  const processEnv = (options.ignoreProcessEnv === true ? {} : process.env) as DotenvPopulateInput
  const output = Dotenv.config({ ...options, processEnv })

  if (options.expand === true) {
    return DotenvExpand.expand({ ...output, processEnv }).parsed
  }

  return output.parsed
}

/**
 * Get the public env options.
 *
 * @returns The public environment options.
 */
export function getDefaultPublicEnvOptions (): Record<string, DotenvFiles> {
  return glob.sync(
    [basePath('.env.public'), basePath('.env.public.*')]
  ).reduce((prev, file) => {
    const name = basename(file).replace(/\.env\.public\.?/, '').trim()
    const env = name.length > 0 ? name : 'default'

    return {
      ...prev,
      [env]: {
        path: file,
        override: false,
        default: env === 'default'
      }
    }
  }, {})
}

/**
 * Generates environment files for the browser environment.
 *
 * @param blueprint - The blueprint object.
 * @param baseOutputPath - The base output path.
 * @returns True if the environment files were generated; otherwise, false.
 */
export function generatePublicEnviromentsFile (blueprint: IBlueprint, baseOutputPath: string): boolean {
  let generated: boolean = false

  const dotenv = blueprint.get<DotenvConfig>('stone.builder.dotenv', {})
  const options = dotenv.options ?? {}

  Object.entries(dotenv.public ?? getDefaultPublicEnvOptions()).forEach(([env, value]) => {
    options.ignoreProcessEnv = true
    options.path = value.path ?? '.env.public'
    options.override = value.override ?? options.override ?? false

    const content = `window.process = window.process || {}
window.process.env = {
  ...window.process.env,
  ...JSON.parse('${JSON.stringify(getEnvVariables(options) ?? {})}')
}`

    outputFileSync(join(baseOutputPath, `enviroments.${env}.js`), content, 'utf-8')

    if (value.default === true) {
      generated = true
      outputFileSync(join(baseOutputPath, 'enviroments.js'), content, 'utf-8')
    }
  })

  return generated
}

/**
 * Setup process signal handlers.
 *
 * @param serverProcess - The server process to terminate.
 */
export function setupProcessSignalHandlers (serverProcess?: ChildProcess): void {
  const terminate = (): void => {
    serverProcess?.kill('SIGTERM') // Gracefully terminate the child process
    // process.exit(0) // Exit the parent process
  }

  // Handle termination signals
  process
    .on('exit', terminate)
    .on('SIGINT', terminate)
    .on('SIGTERM', terminate)
}

/**
 * Determines if the application is using TypeScript.
 *
 * @param blueprint The blueprint object.
 * @returns True if the application is using TypeScript.
 */
export const isTypescriptApp = (blueprint: IBlueprint): boolean => {
  const files = glob.sync(basePath(blueprint.get('stone.builder.input.all', 'app/**/*.{tsx,ts}')))
  return blueprint.get<string>('stone.builder.type') === 'typescript' || files.length > 0
}

/**
 * Determines if the application is using React.
 *
 * @param blueprint The blueprint object.
 * @returns True if the application is using React.
 */
export const isReactApp = (blueprint: IBlueprint, event: IncomingEvent): boolean => {
  const files = glob.sync(basePath(blueprint.get('stone.builder.input.views', 'app/**/*.{tsx,jsx,mjsx}')))
  return event.get('app-type') === 'react' || blueprint.get<string>('stone.builder.appType') === 'react' || files.length > 0
}

/**
 * Define user configuration.
 *
 * @param config - The user configuration.
 * @returns The user configuration.
 */
export const defineConfig = (config: Partial<BuilderConfig>): Partial<BuilderConfig> => config

/**
 * Get the Stone.js builder configuration.
 *
 * @returns The Stone.js builder configuration.
 */
export const getStoneBuilderConfig = async (): Promise<BuilderConfig> => {
  const configPaths = ['./stone.config.mjs', './stone.config.js']

  for (const path of configPaths) {
    const module = await importModule<Record<string, BuilderConfig>>(path)
    const config = Object.values(module ?? {}).shift()
    if (isNotEmpty<BuilderConfig>(config)) {
      return deepmerge<BuilderConfig>(builder, config)
    }
  }

  return builder
}
