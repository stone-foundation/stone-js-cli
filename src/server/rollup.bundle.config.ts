import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import nodeExternals from 'rollup-plugin-node-externals'
import { defineConfig, RollupLog, LoggingFunction } from 'rollup'

/**
 * Generate Rollup bundle options for the entire application.
*/
export default defineConfig({
  input: 'app/**/*.ts',
  context: 'globalThis',
  output: {
    format: 'es',
    file: 'dist/app.mjs'
  },
  external: ['@libsql/client', 'bcrypt'],
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
