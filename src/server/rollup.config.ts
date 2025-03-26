import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import multi from '@rollup/plugin-multi-entry'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import nodeExternals from 'rollup-plugin-node-externals'
import { defineConfig, RollupLog, LoggingFunction } from 'rollup'

/**
 * Generate Rollup build options for the entire application.
*/
export const rollupBuildConfig = defineConfig({
  input: 'app/**/*.ts',
  context: 'globalThis',
  output: {
    format: 'es',
    file: 'dist/app.mjs'
  },
  plugins: [
    multi(),
    nodeExternals(), // Must always be before `nodeResolve()`.
    nodeResolve({
      extensions: ['.js', '.mjs', '.ts', '.json'],
      exportConditions: ['node', 'import', 'require', 'default']
    }),
    json(),
    commonjs({ include: /node_modules/, transformMixedEsModules: true }),
    babel({
      babelrc: false,
      configFile: false,
      babelHelpers: 'bundled',
      extensions: ['.js', '.mjs', '.ts'],
      presets: [
        ['@babel/preset-env', {
          targets: { node: '20' },
          bugfixes: true,
          modules: false,
          useBuiltIns: false
        }],
        '@babel/preset-typescript'
      ],
      plugins: [['@babel/plugin-proposal-decorators', { version: '2023-11' }]]
    })
  ]
})

/**
 * Generate Rollup bundle options for the entire application.
*/
export const rollupBundleConfig = defineConfig({
  input: 'app/**/*.ts',
  context: 'globalThis',
  output: {
    format: 'es',
    file: 'dist/app.mjs'
  },
  plugins: [
    nodeExternals({ deps: false }), // Must always be before `nodeResolve()`.
    nodeResolve({
      extensions: ['.js', '.mjs', '.ts', '.json'],
      exportConditions: ['node', 'import', 'require', 'default']
    }),
    json(),
    commonjs({ include: /node_modules/, transformMixedEsModules: true })
  ],
  onwarn (warning: RollupLog, warn: LoggingFunction) {
    // Suppress only circular dependency warning
    if (
      warning.code === 'CIRCULAR_DEPENDENCY' &&
      /node_modules[/\\]/.test(warning.message)
    ) { return }

    warn(warning)
  }
})
