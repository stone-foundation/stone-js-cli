/**
 * App bootstrap module stub.
 */
export const appBootstrapStub = `
__app_modules_import__
import { StoneFactory, BlueprintBuilder } from '@stone-js/core'

/**
 * Build Blueprint.
 * 
 * @returns {IBlueprint}
 */
const blueprint = await BlueprintBuilder.create().build({ __app_module_names__ })

/**
 * Run application.
 */
const output = await StoneFactory.create({ blueprint }).run()

/**
 * Export adapter specific output.
 * Useful for FAAS handler like AWS lambda handler.
 * 
 * @returns {Object}
 */
export { output }
`

/**
 * Console App bootstrap module stub.
 */
export const consoleBootstrapStub = `
__app_modules_import__
import { NODE_CONSOLE_PLATFORM } from '@stone-js/node-cli-adapter';
import { StoneFactory, BlueprintBuilder, resolveCurrentAdapter } from '@stone-js/core'

try {
  /**
   * Build App Blueprint.
   * 
   * @returns {IBlueprint}
   */
  const blueprint = await BlueprintBuilder.create().build({ __app_module_names__ })

  /**
   * Resolve the current adapter based on the application blueprint.
   * 
   * This step ensures the correct adapter is selected for the Node.js CLI environment.
   */
  resolveCurrentAdapter(blueprint, NODE_CONSOLE_PLATFORM);

  /**
   * Execute the CLI application.
   * 
   * Initializes the Stone.js application using the resolved blueprint and executes the CLI commands.
   */
  await StoneFactory.create({ blueprint }).run()
} catch (error) {
  console.error('Error running Stone commands:', error)
  process.exit(1)
}
`

/**
 * Rollup config stub.
 */
export const rollupConfigStub = `
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import multi from '@rollup/plugin-multi-entry';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import nodeExternals from 'rollup-plugin-node-externals';

export default ({ input, output, externalsOptions = {}, replaceOptions = {} }) => {
  return {
    input,
    output,
    plugins: [
      multi(),
      nodeExternals(externalsOptions), // Must always be before \`nodeResolve()\`.
      nodeResolve({
        extensions: ['.js', '.mjs', '.ts'],
        exportConditions: ['node', 'import', 'require', 'default'],
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
          '@babel/preset-typescript',
        ],
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
        ],
      }),
    ],
  };
};
`
