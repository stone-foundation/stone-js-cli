#!/usr/bin/env node
import { App } from '@stone-js/cli'
import { getStoneOptions } from '@stone-js/core/config'

/**
 * Get stone config options.
 * 
 * @returns {Object}
 */
const stoneOptions = await getStoneOptions()

/**
 * Execute CLI application.
 */
App.createAndRun(stoneOptions)