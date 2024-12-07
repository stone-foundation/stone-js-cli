/**
 * App bootstrap module stub.
 */
export const appBootstrapStub = `
__app_modules_import__
import { StoneFactory, ConfigBuilder } from '@stone-js/core'

/**
 * Build Blueprint.
 * 
 * @returns {IBlueprint}
 */
const blueprint = await ConfigBuilder.create().build({ __app_module_names__ })

/**
 * Run application.
 */
export const stone = await StoneFactory.create(blueprint).run()

/**
 * Get User defined Handler name.
 */
const handlerName = blueprint.get('stone.handlerExportName', 'stone')

/**
 * Export adapter specific output.
 * Useful for FAAS handler like AWS lambda handler.
 * 
 * @returns {Object}
 */
export default { [handlerName]: stone }
`

/**
 * Console App bootstrap module stub.
 */
export const consoleBootstrapStub = `
__app_modules_import__
import { StoneFactory, ConfigBuilder } from '@stone-js/core'

/**
 * Build App Blueprint.
 * 
 * @returns {IBlueprint}
 */
const blueprint = await ConfigBuilder.create().build({ __app_module_names__ })

/**
 * Run application.
 */
StoneFactory.create(blueprint).run()
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
