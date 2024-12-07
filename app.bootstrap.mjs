import { StoneFactory, ConfigBuilder } from '@stone-js/core'

/**
 * Build Blueprint.
 * 
 * @returns {IBlueprint}
 */
const blueprint = await ConfigBuilder.create().build({  })

/**
 * Run application.
 */
const stone = await StoneFactory.create(blueprint).run()

/**
 * Export adapter specific output.
 * Useful for FAAS handler like AWS lambda handler.
 * 
 * @returns {Object}
 */
export { stone }