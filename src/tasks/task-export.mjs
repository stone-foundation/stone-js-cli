import { makeBootstrapFile } from './stubs.mjs'
import { checkAutoloadModule } from '../utils.mjs'

/**
 * Export task.
 * Usefull to export app cli.bootstrap.mjs and app.bootstrap.mjs
 * For customization.
 *
 * @param {Container} container
 * @param {IncomingEvent} event
 * @returns
 */
export const exportTask = async (container, event) => {
  let isExported = false
  const config = container.config
  const force = event.get('force', false)
  const module = event.get('module', 'app')
  const modules = module === 'all' ? ['app', 'cli'] : [module]

  modules.forEach(mod => {
    const isConsole = mod === 'cli'
    if (isConsole && !checkAutoloadModule(config, 'commands')) {
      console.error('Cannot export `cli.bootstrap.mjs` file when commands folder is empty.')
    } else {
      isExported = makeBootstrapFile(config, 'export', isConsole, force)
    }
  })

  isExported && console.log('Module(s) exported!')
}
