import fsExtra from 'fs-extra'
import { join } from 'node:path'
import simpleGit from 'simple-git'
import { CliError } from '../errors/CliError'
import { execSync } from 'node:child_process'
import { MetaPipe, NextPipe } from '@stone-js/pipeline'
import { IBlueprint, isNotEmpty } from '@stone-js/core'
import { basePath, tmpPath } from '@stone-js/filesystem'
import { CreateAppConfig } from '../options/CreateAppConfig'
import { ConsoleContext, PackageJson } from '../declarations'

const { pathExistsSync, existsSync, renameSync, removeSync, copySync, readJsonSync, writeJsonSync } = fsExtra

/**
 * Clone starter from GitHub.
 *
 * @param context - Input data to transform via middleware.
 * @param next - Function to pass to the next middleware.
 * @returns A promise resolving with the context object.
 */
export const CloneStarterMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  const {
    overwrite = false,
    projectName = 'stone-project',
    template = 'basic-service-declarative',
    startersRepo = 'https://github.com/stonemjs/starters.git'
  } = context.blueprint.get<CreateAppConfig>('stone.createApp', {} as any)

  const destDir = basePath(projectName)
  const srcDir = tmpPath('stone-js-starters', template)

  if (!overwrite && pathExistsSync(destDir)) {
    throw new CliError(`Target directory (${destDir}) is not empty. Remove existing files and continue.`)
  }

  context.commandOutput.info(`Creating project in ${destDir}`)

  existsSync(destDir) && removeSync(destDir)
  existsSync(tmpPath('stone-js-starters')) && removeSync(tmpPath('stone-js-starters'))

  await simpleGit(tmpPath()).clone(startersRepo, 'stone-js-starters')

  copySync(srcDir, destDir)

  const packageJson = readJsonSync(join(destDir, 'package.json'))

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
export const InstallDependenciesMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  const {
    testing,
    destDir,
    modules = [],
    packageManager
  } = context.blueprint.get<CreateAppConfig>('stone.createApp', {} as any)

  const installCmd = packageManager === 'yarn' ? 'add' : 'install'
  const testingDeps = testing === 'vitest' ? ['@vitest/coverage-v8'] : []

  context.commandOutput.info('Installing packages. This might take a while...')

  const packages = [modules, testing, testingDeps].flat()

  execSync(`${packageManager} ${installCmd} ${packages.join(' ')}`, { cwd: destDir })

  return await next(context)
}

/**
 * Convert to vanilla JavaScript.
 *
 * @param context - Input data to transform via middleware.
 * @param next - Function to pass to the next middleware.
 * @returns A promise resolving with the context object.
 */
export const ConvertToVanillaMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  // const {
  //   // typing,
  //   // destDir = ''
  // } = context.blueprint.get<CreateAppConfig>('stone.createApp', {} as any)

  // TODO: Implement this feature
  // if (typing === 'vanilla') {
  //   createAppRollupConfig.input = join(destDir, 'app/**/*.ts')

  //   if (isNotEmpty<OutputOptions>(createAppRollupConfig.output)) {
  //     process.chdir(destDir)
  //     createAppRollupConfig.output.dir = join(destDir, '.tmp')
  //     const builder = await rollup(createAppRollupConfig)
  //     await builder.write(createAppRollupConfig.output)
  //   }

  //   removeSync(join(destDir, 'app'))
  //   renameSync(join(destDir, '.tmp'), join(destDir, 'app'))
  // }

  return await next(context)
}

/**
 * Configure testing.
 *
 * @param context - Input data to transform via middleware.
 * @param next - Function to pass to the next middleware.
 * @returns A promise resolving with the context object.
 */
export const ConfigureTestingMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  const {
    typing,
    testing,
    packageJson,
    destDir = ''
  } = context.blueprint.get<CreateAppConfig>('stone.createApp', {} as any)

  if (testing !== 'vitest') {
    if (isNotEmpty<PackageJson>(packageJson)) {
      delete packageJson.scripts.test
      delete packageJson.scripts['test:cvg']
    }
    removeSync(join(destDir, 'vitest.config.ts'))
  } else if (typing === 'vanilla') {
    renameSync(join(destDir, 'vitest.config.ts'), join(destDir, 'vitest.config.js'))
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
export const FinalizeMiddleware = async (
  context: ConsoleContext,
  next: NextPipe<ConsoleContext, IBlueprint>
): Promise<IBlueprint> => {
  const {
    packageJson,
    destDir = '',
    packageManager,
    initGit = false,
    projectName: changeDir = ''
  } = context.blueprint.get<CreateAppConfig>('stone.createApp', {} as any)
  const projectName = destDir.split('/').pop()
  const scriptPrefix = packageManager === 'yarn' ? 'yarn' : `${packageManager} run`

  writeJsonSync(join(destDir, 'package.json'), packageJson, { spaces: 2 })

  if (initGit) {
    const git = simpleGit(destDir)
    await git.init()
    await git.add('.')
    await git.commit('Initial commit')
  }

  context.commandOutput.breakLine(1)
  context.commandOutput.succeed(`Successfully created Stone's project "${String(projectName)}"`)
  context.commandOutput.show(`
  🎉 Happy coding!

  To get started:

    cd ${String(changeDir)}/
    ${scriptPrefix} dev

  To build for production:

    ${scriptPrefix} build

  To preview production build:

    ${scriptPrefix} preview

  Documentation:

    Check https://stonejs.com
  `)

  return await next(context)
}

/**
 * Array of builder pipes with their priorities.
 */
export const CreateAppMiddleware: Array<MetaPipe<ConsoleContext, IBlueprint>> = [
  { priority: 0, module: CloneStarterMiddleware },
  { priority: 1, module: InstallDependenciesMiddleware },
  // { priority: 2, module: ConvertToVanillaMiddleware },
  { priority: 2, module: ConfigureTestingMiddleware },
  { priority: 3, module: FinalizeMiddleware }
]
