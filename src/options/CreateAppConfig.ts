import { PackageJson } from '../declarations'
import { StarterProvider } from '../create/StarterContract'

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
  /**
   * Registered starter providers (the plugin seam). Defaults to the official provider when
   * empty. Third-party packages export a {@link StarterProvider} and add it here to make
   * their starters available in the CLI — no CLI change required.
   */
  starters?: StarterProvider[]
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
  startersRepo: 'https://github.com/stone-foundation/stone-js-starters.git'
}
