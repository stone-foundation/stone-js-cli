import { setCache } from '../utils.mjs'
import { emptyDirSync } from 'fs-extra/esm'
import { Pipeline } from '@stone-js/pipeline'
import { makeBootstrapFile } from './stubs.mjs'
import { buildPath, distPath } from '@stone-js/common'
import { rollupBuild, rollupBundle } from '../bundler/rollupjs.mjs'

/** @returns {pipeable[]} */
const buildPipes = [
  pipeable(() => console.info('Building...')),
  pipeable(() => emptyDirSync(buildPath())),
  pipeable((container) => rollupBuild(container.config)),
  pipeable((container) => setCache(container.config)),
  pipeable((container) => makeBootstrapFile(container.config, 'build')),
  pipeable((container) => makeBootstrapFile(container.config, 'build', true)),
  pipeable(() => console.info('Build finished'))
]

/** @returns {pipeable[]} */
const bundlePipes = [
  pipeable(() => console.info('Bundling...')),
  pipeable(() => emptyDirSync(distPath())),
  pipeable((container) => rollupBundle(container.config))
]

/**
 * Build task.
 *
 * @param   {Container} container
 * @param   {IncomingEvent} [event]
 * @returns {*}
 */
export function buildTask (container) {
  return Pipeline
    .create()
    .send(container)
    .through(buildPipes.concat(bundlePipes))
    .thenReturn()
}

/**
 * Build app.
 *
 * @param   {Container} container
 * @param   {Function} onComplete
 * @returns {*}
 */
export function buildApp (container, onComplete) {
  return Pipeline
    .create()
    .send(container)
    .through(buildPipes)
    .then((passable) => onComplete(passable))
}

/**
 * Pipeable.
 *
 * @param   {Function} handler
 * @returns {Function}
 */
function pipeable (handler) {
  return async (container, next) => {
    await handler(container)
    next(container)
  }
}
