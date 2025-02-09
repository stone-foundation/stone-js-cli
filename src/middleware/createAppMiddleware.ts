import fsExtra from 'fs-extra'
import { join } from 'node:path'
import simpleGit from 'simple-git'
import { writeFileSync } from 'node:fs'
import { tmpPath, basePath } from '../utils'
import { execSync } from 'node:child_process'
import { NextPipe } from '@stone-js/pipeline'
import { CliError } from '../errors/CliError'
import { CreateAppContext } from '../commands/InitCommand'

/**
 * Clone starter from GitHub.
 *
 * @param context - Input data to transform via middleware.
 * @param next - Function to pass to the next middleware.
 * @returns A promise resolving with the context object.
 */
export const CloneStarterMiddleware = async (context: CreateAppContext, next: NextPipe<CreateAppContext>): Promise<CreateAppContext> => {
  const overwrite = context.blueprint.get<boolean>('stone.createApp.overwrite', false)
  const destDir = basePath(context.blueprint.get<string>('stone.createApp.projectName', 'stone-project'))
  const startersRepo = context.blueprint.get<string>('stone.createApp.startersRepo', 'https://github.com/stonemjs/starters.git')
  const srcDir = tmpPath(
    'stone-js-starters',
    context.blueprint.get<string>('typing', 'vanilla'),
    context.blueprint.get<string>('template', 'basic')
  )

  if (!overwrite && fsExtra.pathExistsSync(destDir)) {
    throw new CliError(`Target directory (${destDir}) is not empty. Remove existing files and continue.`)
  }

  context.commandOutput.show(`Creating project in ${destDir}`)
  fsExtra.removeSync(tmpPath('stone-js-starters'))
  await simpleGit(tmpPath()).clone(startersRepo, 'stone-js-starters')
  fsExtra.copySync(srcDir, destDir)

  const packageJson = fsExtra.readJsonSync(join(destDir, 'package.json'))
  context.blueprint.add('stone.createApp', { destDir, srcDir, packageJson })

  return await next(context)
}

/**
 * Install dependencies.
 *
 * @param context - Input data to transform via middleware.
 * @param next - Function to pass to the next middleware.
 * @returns A promise resolving with the context object.
 */
export const InstallDependenciesMiddleware = async (context: CreateAppContext, next: (context: CreateAppContext) => Promise<CreateAppContext>): Promise<CreateAppContext> => {
  const destDir = context.blueprint.get<string>('stone.createApp.destDir')
  const linting = context.blueprint.get<string>('stone.createApp.linting', '')
  const testing = context.blueprint.get<string>('stone.createApp.testing', '')
  const modules = context.blueprint.get<string[]>('stone.createApp.modules', [])
  const manager = context.blueprint.get<string>('stone.createApp.packageManager', 'npm')
  const installCmd = manager === 'yarn' ? 'add' : 'install'
  const lintingDeps = linting === 'standard' ? ['@babel/eslint-parser'] : []
  const testingDeps = testing === 'jest' ? ['cross-env'] : ['@babel/register']

  context.commandOutput.show('Installing packages. This might take a while...')
  modules
    .concat(linting, testing, ...lintingDeps, ...testingDeps)
    .filter(Boolean)
    .forEach((module) => {
      execSync(`${manager} ${installCmd} ${module}`, { cwd: destDir })
    })

  return await next(context)
}

/**
 * Configure linting.
 *
 * @param context - Input data to transform via middleware.
 * @param next - Function to pass to the next middleware.
 * @returns A promise resolving with the context object.
 */
export const ConfigureLintingMiddleware = async (context: CreateAppContext, next: (context: CreateAppContext) => Promise<CreateAppContext>): Promise<CreateAppContext> => {
  const linting = context.blueprint.get<string>('stone.createApp.linting')
  const testing = context.blueprint.get<string>('stone.createApp.testing')
  const destDir = context.blueprint.get<string>('stone.createApp.destDir', '')
  const packageJson = context.blueprint.get<Record<string, any>>('stone.createApp.packageJson', {})

  if (linting === 'standard') {
    packageJson.scripts = {
      ...packageJson.scripts,
      lint: 'standard app'
    }
    if (testing === 'jest') {
      packageJson.standard = {
        parser: '@babel/eslint-parser',
        globals: ['it', 'jest', 'test', 'expect', 'describe', 'afterEach', 'beforeEach']
      }
    }
  } else if (linting === 'prettier') {
    packageJson.scripts = {
      ...packageJson.scripts,
      format: 'prettier --write "app/**/*.js"',
      'format:check': 'prettier --check "app/**/*.js"'
    }
    const prettierConfig = `
    {
      "singleQuote": true,
      "semi": false
    }
    `
    writeFileSync(join(destDir, '.prettierrc'), prettierConfig)
  }

  return await next(context)
}

/**
 * Configure testing.
 *
 * @param context - Input data to transform via middleware.
 * @param next - Function to pass to the next middleware.
 * @returns A promise resolving with the context object.
 */
export const ConfigureTestingMiddleware = async (context: CreateAppContext, next: (context: CreateAppContext) => Promise<CreateAppContext>): Promise<CreateAppContext> => {
  const testing = context.blueprint.get<string>('stone.createApp.testing')
  const destDir = context.blueprint.get<string>('stone.createApp.destDir', '')
  const packageJson = context.blueprint.get<Record<string, any>>('stone.createApp.packageJson', {})

  if (testing === 'jest') {
    packageJson.scripts = {
      ...packageJson.scripts,
      test: 'cross-env NODE_OPTIONS=--experimental-vm-modules jest'
    }
    const jestConfig = {
      roots: ['app/', 'tests/'],
      transform: {},
      collectCoverageFrom: ['app/**/*.{js,mjs}'],
      coverageThreshold: {
        global: {
          lines: 80,
          branches: 80,
          functions: 80
        }
      }
    }
    fsExtra.writeJsonSync(join(destDir, 'jest.blueprint.json'), jestConfig)
  } else if (testing === 'mocha') {
    packageJson.scripts = {
      ...packageJson.scripts,
      test: 'mocha --require @babel/register'
    }
  }

  return await next(context)
}

/**
 * Finalize setup.
 *
 * @param context - Input data to transform via middleware.
 * @param next - Function to pass to the next middleware.
 * @returns A promise resolving with the context object.
 */
export const FinalizeMiddleware = async (context: CreateAppContext, next: (context: CreateAppContext) => Promise<CreateAppContext>): Promise<CreateAppContext> => {
  const destDir = context.blueprint.get<string>('stone.createApp.destDir', '')
  const packageJson = context.blueprint.get<Record<string, any>>('stone.createApp.packageJson', {})
  const manager = context.blueprint.get<string>('stone.createApp.packageManager', 'npm')
  const scriptPrefix = manager === 'yarn' ? 'yarn' : `${manager} run`
  const projectName = destDir.split('/').pop()
  const changeDir = context.blueprint.get<string>('stone.createApp.projectName')

  fsExtra.writeJsonSync(join(destDir, 'package.json'), packageJson)

  const git = simpleGit(destDir)
  await git.init()
  await git.add('.')
  await git.commit('Initial commit')

  context.commandOutput.breakLine(1)
  context.commandOutput.succeed(`Successfully created Stone's project "${String(projectName)}"`)
  context.commandOutput.show(`
  🎉 Happy coding!

  To get started:

    cd ${String(changeDir)}/
    ${scriptPrefix} start

  To build for production:

    ${scriptPrefix} build

  Documentation:

    Check https://stonejs.com
  `)

  return await next(context)
}

/**
 * Array of builder pipes with their priorities.
 */
export const createAppMiddleware = [
  { priority: 0, pipe: CloneStarterMiddleware },
  { priority: 1, pipe: InstallDependenciesMiddleware },
  { priority: 2, pipe: ConfigureLintingMiddleware },
  { priority: 2, pipe: ConfigureTestingMiddleware },
  { priority: 3, pipe: FinalizeMiddleware }
]
