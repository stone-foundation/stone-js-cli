import spawn from 'cross-spawn'
import { argv } from 'node:process'
import { buildApp } from './task-build.mjs'
import { buildPath } from '@stone-js/common'
import { checkAutoloadModule, shouldBuild } from '../utils.mjs'

/**
 * Custom task.
 *
 * @param   {Container} container
 * @param   {IncomingEvent} [event]
 * @param   {boolean} [showHelp=false]
 * @returns
 */
export const customTask = async (container, _event, showHelp = false) => {
  if (!checkAutoloadModule(container.config, 'commands')) {
    container.output.error('No custom commands found!')
    return container.builder.showHelp()
  }

  if (shouldBuild(container)) {
    await buildApp(container, () => startProcess(showHelp))
  } else {
    startProcess(showHelp)
  }
}

/**
 * Start Process.
 *
 * @private
 * @param {boolean} showHelp
 * @returns
 */
function startProcess (showHelp) {
  const args = showHelp ? ['--help'] : argv.slice(2)
  spawn('node', [buildPath('cli.bootstrap.mjs'), ...args], { stdio: 'inherit' })
}
