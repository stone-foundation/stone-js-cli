import spawn from 'cross-spawn'
import { nodeModulesPath } from '@stone-js/common'

/**
 * Typings task.
 *
 * @param   {Container} container
 * @param   {IncomingEvent} event
 * @returns
 */
export const typingsTask = async (container, event) => {
  typeCheckerProcess(container.config, event.get('watch'))
}

/**
 * Type checker watcher Process.
 *
 * @private
 * @param   {Config} config
 * @param   {boolean} watch
 * @returns {Object}
 */
function typeCheckerProcess (config, watch) {
  if (watch) {
    if (config.get('autoload.type') === 'typescript') {
      return spawn('node', [nodeModulesPath('.bin/tsc'), '--noEmit', '--watch'], { stdio: 'inherit' })
    } else if (config.get('autoload.type') === 'flow') {
      return console.info('Watch mode is not yet supported for flow.')
    }
  } else {
    if (config.get('autoload.type') === 'typescript') {
      return spawn('node', [nodeModulesPath('.bin/tsc'), '--noEmit'], { stdio: 'inherit' })
    } else if (config.get('autoload.type') === 'flow') {
      return spawn('node', [nodeModulesPath('.bin/flow'), 'check'], { stdio: 'inherit' })
    }
  }
}
