#!/usr/bin/env node

/**
 * Entry Point for the Stone.js CLI Application
 * 
 * This script serves as the main entry point for running a Stone.js application in a CLI environment.
 * It initializes the necessary configuration, resolves the current adapter, and executes the CLI application.
 * 
 * @see {@link https://stonejs.com/docs Stone.js Documentation}
 */

import { Config } from '@stone-js/config';
import { stoneCliBlueprint } from '../dist/index.js';
import { nodeCliAdapterBlueprint } from '@stone-js/node-cli-adapter';
import { StoneFactory, ConfigBuilder, mergeBlueprints, stoneBlueprint } from '@stone-js/core';

try {
  /**
   * Merge and create the initial application blueprint.
   * 
   * Combines multiple blueprints into a single blueprint object.
   * Blueprints include:
   * - `stoneBlueprint`: The core blueprint for Stone.js.
   * - `nodeCliAdapterBlueprint`: Adapter blueprint for Node.js CLI environment.
   * - `stoneCliBlueprint`: Stone CLI-specific configuration and commands.
   * 
   * @returns The initial application blueprint.
   */
  const initialBlueprint = Config.create(
    mergeBlueprints(
      stoneBlueprint,
      nodeCliAdapterBlueprint,
      stoneCliBlueprint
    )
  );

  /**
   * Create the final application blueprint.
   * Mandatory to execute config middleware and resolve the final blueprint.
   * 
   * @returns The complete application blueprint.
   */
  const blueprint = await ConfigBuilder.create(stoneCliBlueprint.stone.builder).build({}, initialBlueprint)

  /**
   * Execute the CLI application.
   * 
   * Initializes the Stone.js application using the resolved blueprint and executes the CLI commands.
   */
  await StoneFactory.create({ blueprint }).run();
} catch (error) {
  console.error('Error running Stone commands:\n', error);
  process.exit(1);
}
