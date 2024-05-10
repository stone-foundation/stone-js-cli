import Dotenv from 'dotenv'
import { globSync } from 'glob'
import { readFileSync } from 'node:fs'
import DotenvExpand from 'dotenv-expand'
import { createHash } from 'node:crypto'
import { basePath, buildPath } from '@stone-js/common'
import { readJsonSync, pathExistsSync, outputJsonSync } from 'fs-extra/esm'

/**
 * Get Application Files.
 * Will return all application files
 * groupped by directory.
 * Configurations are set in `stone.config.mjs`
 * at the root of the application directory.
 *
 * @param   {Config} config
 * @returns {Array}
 */
export function getApplicationFiles (config) {
  return Object
    .entries(config.get('autoload.modules'))
    .map(([name, pattern]) => [name, globSync(basePath(pattern))])
}

/**
 * Get File Hash.
 * Create a file hash for caching purpose.
 *
 * @param   {string} filename
 * @returns {string}
 */
export function getFileHash (filename) {
  return createHash('md5').update(readFileSync(filename)).digest('hex')
}

/**
 * Get cache.
 * Application files's cache memory.
 *
 * @param   {Config} config
 * @returns {Object}
 */
export function getCache () {
  return pathExistsSync(buildPath('.cache'))
    ? readJsonSync(buildPath('.cache'), { throws: false })
    : {}
}

/**
 * Set cache.
 * Application files's cache memory.
 *
 * @param   {Config} config
 * @returns
 */
export function setCache (config) {
  const cache = getCache()

  getApplicationFiles(config)
    .reduce((prev, [_, files]) => prev.concat(files), [])
    .forEach((filePath) => {
      cache[filePath] = getFileHash(filePath)
    })

  outputJsonSync(buildPath('.cache'), cache)
}

/**
 * Should build application.
 * Will return `true` if anything has changed
 * from the last build.
 *
 * @param   {Container} container
 * @returns {boolean}
 */
export function shouldBuild (container) {
  const cache = getCache()

  return getApplicationFiles(container.config)
    .reduce((prev, [_, files]) => prev.concat(files), [])
    .reduce((prev, filePath, _, files) => {
      if (prev) return prev
      return Object.keys(cache).filter(v => !files.includes(v)).length > 0 || !cache[filePath] || cache[filePath] !== getFileHash(filePath)
    }, false)
}

/**
 * Get the env variables in .env file use Dotenv package.
 *
 * @param   {Object}  options
 * @param   {boolean} options.debug
 * @param   {boolean} options.expand
 * @param   {boolean} options.override
 * @param   {boolean} options.ignoreProcessEnv
 * @returns {Object}
 */
export function getEnvVariables (options) {
  options.processEnv = options.ignoreProcessEnv ? {} : process.env

  if (options.expand) {
    return DotenvExpand.expand({ ignoreProcessEnv: options.ignoreProcessEnv, parsed: Dotenv.config(options).parsed }).parsed
  }

  return Dotenv.config(options).parsed
}

/**
 * Load the env variables in .env file to process.env.
 *
 * @param {Object} options
 * @param {Object} options.options
 * @param {Object} options.private
 * @param {Object} options.public
 * @returns
 */
export function loadEnvVariables (options) {
  const publicOptions = { ...options?.options, ...options?.public }
  const privateOptions = { ...options?.options, ...options?.private }

  getEnvVariables(publicOptions)
  getEnvVariables(privateOptions)
}
