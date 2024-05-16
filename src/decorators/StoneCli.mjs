import { cliOptions } from '@stone-js/cli/config'
import { classLevelDecoratorChecker, merge } from '@stone-js/common'

/**
 * Decorators, Useful for decorating classes.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 *
 * @namespace Decorators
 */

/**
 * App CLI Decorator: Useful for customizing classes as the main cli entry point.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 *
 * @memberOf Decorators
 * @param  {Object} options - The decorator configuration options.
 * @param  {Function[]} [options.providers] - Service providers for cli app.
 * @param  {(Function|Function[]|string|string[])} [options.middleware] - Input middleware to transform incomming event before handling.
 * @param  {Array} options.builder.pipes - Pipes for config builder.
 * @param  {string[]} options.builder.reduce - Modules du reduce and deep merge to object.
 * @param  {number} options.builder.defaultPipesPriority - Default priority for all pipes.
 * @return {Function}
 */
export const StoneCli = (options = {}) => {
  return (target) => {
    classLevelDecoratorChecker(target)

    const metadata = {
      provider: {},
      builder: merge(cliOptions.builder, {
        pipes: options.builder?.pipes ?? [],
        reduce: options.builder?.reduce ?? [],
        defaultPipesPriority: options.builder?.defaultPipesPriority ?? 10
      }),
      adapters: [
        merge(cliOptions.adapters[0], {
          app: {
            providers: options.providers ?? [],
            mapper: {
              input: {
                middleware: options.middleware ?? []
              }
            }
          }
        })
      ]
    }

    target.$$metadata$$ = merge(target.$$metadata$$ ?? {}, metadata)

    return target
  }
}
