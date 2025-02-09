
export interface CreateAppConfig {
  initGit: boolean
  testing: string
  typing: string
  template: string
  linting: string
  modules: string[]
  packageManager: string
  overwrite: boolean
  projectName: string
  startersRepo: string
  destDir?: string
  srcDir?: string
  packageJson?: Record<string, unknown>
}

export const createApp: CreateAppConfig = {
  modules: [],
  initGit: true,
  testing: 'mocha',
  overwrite: false,
  typing: 'vanilla',
  template: 'basic',
  linting: 'standard',
  packageManager: 'npm',
  projectName: 'stone-app',
  startersRepo: 'https://github.com/stonemjs/starters.git'
}
