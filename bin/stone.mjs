#!/usr/bin/env node

/**
 * Entry Point for the Stone.js CLI Application
 * 
 * This script serves as the main entry point for running a Stone.js application in a CLI environment.
 * It initializes the necessary configuration, resolves the current adapter, and executes the CLI application.
 * 
 * @see {@link https://stonejs.com/docs Stone.js Documentation}
 */
import { stoneCliBlueprint } from '../dist/index.js';
import { stoneBlueprint, stoneApp } from '@stone-js/core';
import { MetaCommandRouterEventHandler, nodeCliAdapterBlueprint } from '@stone-js/node-cli-adapter';

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
  const blueprints = [stoneBlueprint, nodeCliAdapterBlueprint, stoneCliBlueprint]
  
  /**
   * Execute the CLI application.
   * 
   * Initializes the Stone.js application using the resolved blueprint and executes the CLI commands.
   */
  await stoneApp()
    .use(...blueprints)
    .set(
      'stone.kernel.eventHandler',
      MetaCommandRouterEventHandler
    )
    .run();
} catch (error) {
  console.error('Error running Stone commands:\n', error);
  process.exit(1);
}
