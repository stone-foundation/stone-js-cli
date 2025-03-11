import { glob, globSync } from 'glob'
import fsExtra from 'fs-extra'
import process from 'node:process'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import DotenvExpand from 'dotenv-expand'
import { ChildProcess } from 'node:child_process'
import Dotenv, { DotenvPopulateInput } from 'dotenv'
import { DotenvOptions } from './options/DotenvConfig'
import { basePath, buildPath } from '@stone-js/filesystem'
import { IBlueprint, IncomingEvent } from '@stone-js/core'

const { readJsonSync, pathExistsSync, outputJsonSync } = fsExtra

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

  if (options.expand === true) {
    return DotenvExpand.expand(Dotenv.config({ ...options, processEnv })).parsed
  }

  return Dotenv.config({ ...options, processEnv }).parsed
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
  const files = glob.sync(basePath(blueprint.get('stone.autoload.all', 'app/**/*.{tsx,ts}')))
  return blueprint.get<string>('stone.autoload.type') === 'typescript' || files.length > 0
}

/**
 * Determines if the application is using TypeScript.
 *
 * @param blueprint The blueprint object.
 * @returns True if the application is using TypeScript.
 */
export const isReactApp = (blueprint: IBlueprint, event: IncomingEvent): boolean => {
  const files = glob.sync(basePath(blueprint.get('stone.autoload.all', 'app/**/*.{tsx,jsx,mjsx}')))
  return event.get('app-type') === 'react' || blueprint.get<string>('stone.autoload.appType') === 'react' || files.length > 0
}
