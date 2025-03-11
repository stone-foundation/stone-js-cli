import fsExtra from 'fs-extra'
import { IBlueprint } from '@stone-js/core'
import { viteServerTemplate } from './stubs'
import { buildPath } from '@stone-js/filesystem'
import { MetaPipe, NextPipe } from '@stone-js/pipeline'

const { outputFileSync } = fsExtra

/**
 * Generates a preview server for the application.
 *
 * @param blueprint The blueprint object.
 * @param next The next pipe function.
 * @returns The updated blueprint object.
 */
export const GeneratePreviewServerMiddleware = async (
  blueprint: IBlueprint,
  next: NextPipe<IBlueprint, IBlueprint>
): Promise<IBlueprint> => {
  outputFileSync(
    buildPath('preview.mjs'),
    viteServerTemplate('runPreviewServer'),
    'utf-8'
  )
  return await next(blueprint)
}

/**
 * Middleware for building React applications.
 */
export const ReactPreviewMiddleware: Array<MetaPipe<IBlueprint>> = [
  { module: GeneratePreviewServerMiddleware, priority: 0 }
]
