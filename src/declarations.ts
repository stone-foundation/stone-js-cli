import { RollupOptions } from 'rollup'
import { RollupReplaceOptions } from '@rollup/plugin-replace'
import { ExternalsOptions } from 'rollup-plugin-node-externals'

export interface DotenvReplaceOptions {
  preventAssignment: boolean
}

export interface DotenvOptions {
  debug: boolean
  expand: boolean
  override: boolean
  ignoreProcessEnv: boolean
}

export interface DotenvFiles {
  path: string[]
  override?: boolean
}

export interface DotenvConfig {
  replace?: Partial<DotenvReplaceOptions>
  options?: Partial<DotenvOptions>
  private?: Partial<DotenvFiles>
  public?: Partial<DotenvFiles>
}

export interface StoneRollupOptions extends RollupOptions {
  replaceOptions?: RollupReplaceOptions
  externalsOptions?: ExternalsOptions
}
