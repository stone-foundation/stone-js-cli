import fsExtra from 'fs-extra'
import { CliError } from './errors/CliError'
import { IncomingEvent } from '@stone-js/core'
import { basePath } from '@stone-js/filesystem'
import { initCommandOptions } from './commands/InitCommand'

const { pathExistsSync, readJsonSync } = fsExtra

/**
 * Ensure that the current directory is a Stone project.
 *
 * @param event - The incoming event.
 */
export async function EnsureStoneProjectHook ({ event }: { event: IncomingEvent }): Promise<void> {
  const task = event.get<string>('_task') ?? ''
  const { name, alias = '' } = initCommandOptions
  const isStoneProject = (): boolean => {
    const dependencies = readJsonSync(basePath('package.json'), { throws: false })?.dependencies
    return dependencies?.['@stone-js/core'] !== undefined || pathExistsSync(basePath('stone.config.js')) || pathExistsSync(basePath('stone.config.mjs'))
  }

  if (![name, alias].includes(task) && !isStoneProject()) {
    throw new CliError('This is not a Stone project. Please run this command in a Stone project directory.')
  }
}
