import fsExtra from 'fs-extra'
import { IBlueprint } from '@stone-js/core'
import { rollupBuild, rollupBundle } from '../bundler/rollupjs'
import { pipeable, buildPath, setCache, makeBootstrapFile, distPath } from '../utils'

const { emptyDirSync } = fsExtra

export const buildPipes = [
  pipeable(() => console.info('Building...')),
  pipeable(() => emptyDirSync(buildPath())),
  pipeable(async (blueprint: IBlueprint) => await rollupBuild(blueprint)),
  pipeable((blueprint: IBlueprint) => setCache(blueprint)),
  pipeable((blueprint: IBlueprint) => makeBootstrapFile(blueprint, 'build')),
  pipeable((blueprint: IBlueprint) => makeBootstrapFile(blueprint, 'build', true)),
  pipeable(() => console.info('Build finished'))
]

export const bundlePipes = [
  pipeable(() => console.info('Bundling...')),
  pipeable(() => emptyDirSync(distPath())),
  pipeable(async (blueprint: IBlueprint) => await rollupBundle(blueprint))
]
