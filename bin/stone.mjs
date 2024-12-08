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
import { StoneFactory, stoneBlueprint, mergeBlueprints, resolveCurrentAdapter } from '@stone-js/core';

/**
 * Merge and create the application blueprint.
 * 
 * Combines multiple blueprints into a single blueprint object.
 * Blueprints include:
 * - `stoneBlueprint`: The core blueprint for Stone.js.
 * - `nodeCliAdapterBlueprint`: Adapter blueprint for Node.js CLI environment.
 * - `stoneCliBlueprint`: Stone CLI-specific configuration and commands.
 * 
 * @returns The complete application blueprint.
 */
const blueprint = Config.create(
  mergeBlueprints(
    stoneBlueprint,
    nodeCliAdapterBlueprint,
    stoneCliBlueprint
  )
);

/**
 * Resolve the current adapter based on the application blueprint.
 * 
 * This step ensures the correct adapter is selected for the Node.js CLI environment.
 */
resolveCurrentAdapter(blueprint);

/**
 * Execute the CLI application.
 * 
 * Initializes the Stone.js application using the resolved blueprint and executes the CLI commands.
 */
await StoneFactory.create({ blueprint }).run();
