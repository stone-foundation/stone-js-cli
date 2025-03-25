import { PackageJson } from '../declarations'

/**
 * Configuration for creating a new Stone.js Application.
 * Used internally by the `init` command.
 */
export interface CreateAppConfig {
  typing: string
  testing: string
  linting: string
  srcDir?: string
  initGit: boolean
  template: string
  destDir?: string
  modules: string[]
  overwrite: boolean
  projectName: string
  startersRepo: string
  packageManager: string
  packageJson?: PackageJson
}

/**
 * Default configuration for creating a new Stone.js Application.
 */
export const createApp: CreateAppConfig = {
  modules: [],
  initGit: true,
  testing: 'vitest',
  overwrite: false,
  typing: 'vanilla',
  template: 'basic',
  linting: 'standard',
  packageManager: 'npm',
  projectName: 'stone-app',
  startersRepo: 'https://github.com/stonemjs/starters.git'
}
