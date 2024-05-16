import { Mapper } from '@stone-js/adapters'
import { IncomingEvent, NODE_CONSOLE_PLATFORM } from '@stone-js/common'
import { CommandServiceProvider, NodeConsoleAdapter, CommonInputMiddleware, cliPipes } from '@stone-js/cli'

/**
 * Cli options.
 *
 * @returns {Object}
*/
export const cliOptions = {
  // Options builder namespace.
  builder: {

    // Here you can define pipes to build the app options.
    pipes: cliPipes
  },

  // Adapters namespace
  adapters: [{
    // App namespace.
    app: {

      // Adapter options to be merged with global adapter options.
      adapter: {

        // Here you can set this adapter as preferred.
        // This value is used to force the app use this adapter.
        preferred: true,

        // Here you can define your adapter alias name.
        alias: NODE_CONSOLE_PLATFORM,

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
          resolver: (passable) => IncomingEvent.create(passable.event),

          // Input mapper middleware. Can be class constructor or alias.
          // Middleware must be registered before using it in the app middleware array.
          middleware: [CommonInputMiddleware]
        }
      },

      // Here you can register providers for all adapters.
      // The service providers listed here will be automatically loaded at each request to your application.
      providers: [CommandServiceProvider]
    }
  }]
}
