import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import multi from '@rollup/plugin-multi-entry'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import nodeExternals from 'rollup-plugin-node-externals'

export default ({ input, output, externaleOptions, replaceOptions }) => {
  return {
    input,
    output,
    plugins: [
      multi(),
      nodeExternals(externaleOptions), // Must always be before `nodeResolve()`.
      nodeResolve({
        extensions: ['.js', '.mjs', '.ts'],
        exportConditions: ['node', 'import', 'require', 'default']
      }),
      json(),
      commonjs(),
      replace(replaceOptions),
      babel({
        babelrc: false,
        configFile: false,
        babelHelpers: 'bundled',
        extensions: ['.js', '.mjs', '.ts'],
        presets: [
          '@babel/preset-env',
          '@babel/preset-flow',
          '@babel/preset-typescript'
        ],
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-11' }]
        ]
      })
    ]
  }
}
