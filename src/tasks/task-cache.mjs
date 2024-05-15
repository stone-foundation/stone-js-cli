import { emptyDirSync } from 'fs-extra/esm'
import { buildPath } from '@stone-js/common'

/**
 * Cache task.
 * Usefull for cache management
 *
 * @param {Container} container
 * @param {IncomingEvent} event
 * @returns
 */
export const cacheTask = async (_container, event) => {
  if (event.get('action') === 'clear') {
    emptyDirSync(buildPath())
    return console.log('Cache deleted!')
  }
}
