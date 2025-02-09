import json from '@rollup/plugin-json'
import { RollupOptions } from 'rollup'
import babel from '@rollup/plugin-babel'
import multi from '@rollup/plugin-multi-entry'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace, { RollupReplaceOptions } from '@rollup/plugin-replace'
import { removeCliDecorators } from '../plugins/removeCommandDecorator'
import nodeExternals, { ExternalsOptions } from 'rollup-plugin-node-externals'

export interface StoneRollupOptions extends RollupOptions {
  replaceOptions?: RollupReplaceOptions
  externalsOptions?: ExternalsOptions
}

export default ({ input, output, externalsOptions = {}, replaceOptions = {} }: StoneRollupOptions): StoneRollupOptions => {
  return {
    input,
    output,
    plugins: [
      multi(),
      nodeExternals(externalsOptions), // Must always be before `nodeResolve()`.
      nodeResolve({
        extensions: ['.js', '.mjs', '.ts', '.json'],
        exportConditions: ['node', 'import', 'require', 'default']
      }),
      json(),
      commonjs(),
      removeCliDecorators(),
      replace(replaceOptions),
      babel({
        babelrc: false,
        configFile: false,
        babelHelpers: 'bundled',
        extensions: ['.js', '.mjs', '.ts'],
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript'
        ],
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-11' }]
        ]
      })
    ]
  }
}
