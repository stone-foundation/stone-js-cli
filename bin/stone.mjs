#!/usr/bin/env node
import { StoneFactory } from './core.js'
import { Config } from '@stone-js/config'
import { stoneCliBlueprint } from '../dist/index.js'

/**
 * Make blueprint.
 */
const blueprint = Config.create(stoneCliBlueprint)

/**
 * Execute CLI application.
 */
await StoneFactory.create({ blueprint }).run()