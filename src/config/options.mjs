import deepmerge from 'deepmerge'
import { Mapper } from '@stone-js/adapters'
import { mapperInputResolver } from '../resolvers.mjs'
import { NODE_CONSOLE_PLATFORM } from '../constants.mjs'
import { CommonInputMiddleware } from '../middleware.mjs'
import { NodeConsoleAdapter } from '../NodeConsoleAdapter.mjs'
import { CommandServiceProvider } from '../command/CommandServiceProvider.mjs'

/**
 * Add console options to app options.
 * And merge it with previous console options so we can add NodeConsoleAdapter only at run time.
 *
 * @param   {Object} appOptions - Application options.
 * @param   {boolean} currentAdapter - Set this as the current decorator.
 * @returns {Object}
 */
export function addConsoleOptions (appOptions, currentAdapter = false) {
  if (appOptions.adapters?.find(v => v.app.adapter.alias === NODE_CONSOLE_PLATFORM)) {
    appOptions.adapters = appOptions.adapters.map(v => {
      if (v.app.adapter.alias === NODE_CONSOLE_PLATFORM) {
        return deepmerge(v, consoleOptions)
      } else {
        return v
      }
    })
  } else {
    appOptions.adapters?.push(consoleOptions)
  }

  if (currentAdapter && appOptions.app?.adapter) {
    appOptions.app.adapter.current = NODE_CONSOLE_PLATFORM
  }

  return appOptions
}

/**
 * Console options.
 *
 * @returns {Object}
*/
export const consoleOptions = {
  // App namespace.
  app: {

    // Adapter options to be merged with global adapter options.
    adapter: {

      // Here you can define your adapter alias name.
      alias: NODE_CONSOLE_PLATFORM,

      // Here you can define your default adapter
      default: true,

      // Adapter class constructor.
      type: NodeConsoleAdapter
    },

    // Adapter mapper options.
    mapper: {

      // Input mapper options.
      // Use this mapper for incomming platform event.
      input: {

        // Mapper class constructor.
        type: Mapper,

        // Output mapper resolve.
        resolver: mapperInputResolver,

        // Input mapper middleware. Can be class constructor or alias.
        // Middleware must be registered before using it in the app middleware array.
        middleware: [CommonInputMiddleware]
      }
    },

    // Here you can register providers for all adapters.
    // The service providers listed here will be automatically loaded at each request to your application.
    providers: [CommandServiceProvider]
  }
}
