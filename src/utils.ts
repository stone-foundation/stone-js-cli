import fsExtra from 'fs-extra'
import { globSync } from 'glob'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import process from 'node:process'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import DotenvExpand from 'dotenv-expand'
import { IBlueprint } from '@stone-js/core'
import { CliError } from './errors/CliError'
import { ChildProcess } from 'node:child_process'
import Dotenv, { DotenvPopulateInput } from 'dotenv'
import { DotenvOptions } from './options/DotenvConfig'
import { appBootstrapStub, consoleBootstrapStub } from './stubs'
import { MixedPipe, NextPipe, Passable, Pipe, Pipeline } from '@stone-js/pipeline'

const { readJsonSync, pathExistsSync, outputJsonSync, outputFileSync } = fsExtra

/**
 * Constructs a base path by joining the current working directory with the provided paths.
 *
 * @param paths - The paths to be joined with the current working directory.
 * @returns The resulting path after joining the current working directory with the provided paths.
 */
export function basePath (...paths: string[]): string {
  return join(process.cwd(), ...paths)
}

/**
 * Resolve path from system tmp directory.
 *
 * @param   {...string} paths
 * @returns {string}
 */
export function tmpPath (...paths: string[]): string {
  return join(tmpdir(), ...paths)
}

/**
 * Builds a path by appending the provided paths to a base path.
 *
 * @param paths - The paths to append to the base path.
 * @returns The constructed path.
 */
export function buildPath (...paths: string[]): string {
  return basePath('.stone', ...paths)
}

/**
 * Constructs a path string by appending the provided paths to the 'dist' directory.
 *
 * @param paths - The path segments to be appended to the 'dist' directory.
 * @returns The constructed path string.
 */
export function distPath (...paths: string[]): string {
  return basePath('dist', ...paths)
}

/**
 * Resolve path from app directory.
 *
 * @param   {...string} paths
 * @returns {string}
 */
export function appPath (...paths: string[]): string {
  return basePath('app', ...paths)
}

/**
 * Resolve path from config directory.
 *
 * @param   {...string} paths
 * @returns {string}
 */
export function configPath (...paths: string[]): string {
  return basePath('config', ...paths)
}

/**
 * Resolve path from node_modules directory.
 *
 * @param   {...string} paths
 * @returns {string}
 */
export function nodeModulesPath (...paths: string[]): string {
  return basePath('node_modules', ...paths)
}

/**
 * Make filename with extension.
 *
 * @param blueprint - The configuration object.
 * @param filename - The filename without extension.
 * @returns The filename with the appropriate extension.
 */
export function makeFilename (blueprint: IBlueprint, filename: string): string {
  return filename.concat(blueprint.get<string>('stone.autoload.type') === 'typescript' ? '.ts' : '.mjs')
}

/**
 * Get Application Files.
 * Returns all application files grouped by directory.
 * Configurations are set in `stone.config.mjs`
 * at the root of the application directory.
 *
 * @param blueprint - The configuration object.
 * @returns An array of files grouped by directory.
 */
export function getApplicationFiles (blueprint: IBlueprint): Array<[string, string[]]> {
  return Object.entries(blueprint.get<Record<string, string>>('stone.autoload.modules', {}))
    .filter(([name]) => checkAutoloadModule(blueprint, name))
    .map(([name, pattern]) => [name, globSync(basePath(pattern))])
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
 * @param blueprint - The configuration object.
 */
export function setCache (blueprint: IBlueprint): void {
  const cache = getCache()

  getApplicationFiles(blueprint)
    .reduce<string[]>((prev, [_, files]) => prev.concat(files), [])
    .forEach((filePath) => {
      cache[filePath] = getFileHash(filePath)
    })

  outputJsonSync(buildPath('.cache'), cache)
}

/**
 * Should build application.
 * Determines whether the application should be rebuilt.
 *
 * @param blueprint - The container object with config.
 * @returns True if the application should be rebuilt; otherwise, false.
 */
export function shouldBuild (blueprint: IBlueprint): boolean {
  const cache = getCache()

  return getApplicationFiles(blueprint)
    .reduce<string[]>((prev, [_, files]) => prev.concat(files), [])
    .reduce((prev, filePath, _, files) => {
      if (prev) return prev
      return Object.keys(cache).filter((v) => !files.includes(v)).length > 0 || cache[filePath] === undefined || cache[filePath] !== getFileHash(filePath)
    }, false)
}

/**
 * Get the env variables in .env file using the Dotenv package.
 *
 * @param options - The options for loading environment variables.
 * @returns The parsed environment variables.
 */
export function getEnvVariables (options: Partial<DotenvOptions>): Record<string, string> | undefined {
  const processEnv = (options.ignoreProcessEnv === true ? {} : process.env) as DotenvPopulateInput

  if (options.expand === true) {
    return DotenvExpand.expand(Dotenv.config({ ...options, processEnv })).parsed
  }

  return Dotenv.config({ ...options, processEnv }).parsed
}

/**
 * Check autoload module.
 *
 * Ensures that the module is valid by checking if the module files exists.
 *
 * @param blueprint - The configuration object.
 * @param module - The module name to check.
 * @param throwError - Whether to throw an error if the module is not found.
 * @returns True if the module is valid; otherwise, false.
 * @throws RuntimeError - If the module is invalid and `throwError` is true.
 */
export function checkAutoloadModule (blueprint: IBlueprint, module: string, throwError = false): boolean {
  const autoload = `stone.autoload.modules.${module}`

  if (!blueprint.has(autoload)) {
    throw new CliError(`No ${autoload} option found in 'stone.config' file.`)
  }

  const pattern = blueprint.get<string>(autoload, '')
  const files = globSync(basePath(pattern))

  if (files[0] === undefined || !pathExistsSync(files[0])) {
    if (throwError) {
      throw new CliError(`Your ${String(pattern.split('/').shift())} directory cannot be empty.`)
    } else {
      return false
    }
  }

  return true
}

/**
 * Processes a context object through a pipeline of middleware.
 *
 * @template TContext - The type of the context object that extends `Passable`.
 * @param context - The context object to process through the pipeline.
 * @param middleware - An array of middleware functions (pipes) to process the context.
 * @returns A promise that resolves once the context has been processed by all middleware.
 */
export async function processThroughPipeline<TContext extends Passable> (context: TContext, middleware: MixedPipe[]): Promise<void> {
  await Pipeline
    .create<TContext, string>()
    .send(context)
    .through(middleware)
    .then(() => '')
}

/**
 * Pipeable middleware.
 *
 * @param handler - The middleware handler.
 * @returns The middleware function.
 */
export function pipeable <TContext extends Passable> (handler: (context: TContext) => Promise<unknown> | unknown): Pipe {
  return async (context: TContext, next: NextPipe<TContext>) => {
    await handler(context)
    await next(context)
  }
}

/**
 * Asynchronously imports a module given its relative path.
 *
 * @param {string} relativePath - The relative path to the module to be imported.
 * @returns {Promise<any>} A promise that resolves to the imported module, or null if the import fails.
 */
export async function importModule<R> (relativePath: string): Promise<R | undefined> {
  try {
    return await import(new URL(join(process.cwd(), relativePath), 'file://').href)
  } catch (_) {}
}

/**
 * Make App bootstrap module from stub.
 * In .stone directory for build action.
 * And at the root of the project for export action.
 *
 * @param blueprint - The blueprint object.
 * @param action - Action can be: `build` or `export`.
 * @param isConsole - Build for console.
 * @param force - Force file override if exists.
 * @returns Whether the bootstrap file was successfully created.
 */
export function makeBootstrapFile (blueprint: IBlueprint, action: 'build' | 'export', isConsole = false, force = false): boolean {
  let stub = isConsole ? consoleBootstrapStub : appBootstrapStub
  const filename = isConsole ? 'cli.bootstrap.mjs' : 'app.bootstrap.mjs'

  if (action === 'export') {
    if (pathExistsSync(basePath(filename)) && !force) {
      console.log(`Cannot override an existing file(${filename}). Use --force to override it.`)
      return false
    } else {
      outputFileSync(basePath(filename), normalizeBootstrapStub(blueprint, stub, action))
    }
  } else {
    stub = pathExistsSync(basePath(filename)) ? readFileSync(basePath(filename), 'utf-8') : stub
    outputFileSync(buildPath(filename), normalizeBootstrapStub(blueprint, stub, action))
  }

  return true
}

/**
 * Normalize bootstrap content by replacing module import statements.
 *
 * @param blueprint - The blueprint object.
 * @param stub - The stub content to normalize.
 * @param action - Action can be: `build` or `export`.
 * @param exclude - Modules to exclude from import.
 * @returns The normalized stub content.
 */
export function normalizeBootstrapStub (blueprint: IBlueprint, stub: string, action: 'build' | 'export', exclude: string[] = []): string {
  const modules = Object.keys(blueprint.get<Record<string, string>>('stone.autoload.modules', {}))
    .filter((name) => checkAutoloadModule(blueprint, name))
    .filter((name) => !exclude.includes(name))

  const statement = modules.map((name) => `import * as ${name} from './${name}.mjs'`)

  stub = stub
    .replace('__app_module_names__', modules.join(', '))
    .replace('__app_modules_import__', statement.join('\n'))

  if (action === 'export') {
    return stub.trim().replaceAll('./', './.stone/')
  } else {
    return stub.trim().replaceAll('./.stone/', './')
  }
}

export function setupProcessSignalHandlers (serverProcess?: ChildProcess): void {
  const terminate = (): void => {
    serverProcess?.kill('SIGINT') // Gracefully terminate the child process
    process.exit(0) // Exit the parent process
  }

  // Handle termination signals
  process.on('SIGINT', () => terminate())
  process.on('SIGTERM', () => terminate())
}
