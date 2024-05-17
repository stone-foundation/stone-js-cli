import copy from 'rollup-plugin-copy'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import multi from '@rollup/plugin-multi-entry'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import nodeExternals from 'rollup-plugin-node-externals'

const inputs = {
  config: 'src/config/*.mjs',
  decorators: 'src/decorators/*.mjs',
  index: [
    'src/App.mjs',
    'src/pipes/*.mjs',
    'src/middleware.mjs',
    'src/command/Router.mjs',
    'src/NodeConsoleAdapter.mjs',
    'src/command/AbstractCommand.mjs',
    'src/command/CommandServiceProvider.mjs',
  ],
}

export default Object.entries(inputs).map(([name, input]) => ({
	input,
	output: [
    { format: 'es', file: `dist/${name}.js` }
  ],
  plugins: [
    json(),
    multi(),
    nodeExternals({
      include: [/^[@stone-js/cli]/]
    }), // Must always be before `nodeResolve()`.
    nodeResolve({
      exportConditions: ['node', 'import', 'require', 'default']
    }),
    babel({ babelHelpers: 'bundled' }),
    commonjs(),
    copy({
      targets: [
        { src: 'src/bundler/rollup.config.mjs', dest: 'dist' }
      ]
    })
  ]
}))