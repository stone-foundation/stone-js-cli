import deepmerge from 'deepmerge'
import { classLevelDecoratorChecker, NODE_CONSOLE_PLATFORM } from '@stone-js/common'

/**
 * NodeConsole Decorator: Useful for customizing classes to ensure applications run smoothly on node.js platforms.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 *
 * @memberOf Decorators
 * @param  {adapterOptions} options
 * @param  {(Function|Function[]|string|string[])} [options.middleware] - Input middleware to transform incomming event before handling.
 * @return {Function}
 */
export const NodeConsole = (options = {}) => {
  return (target) => {
    classLevelDecoratorChecker(target)

    const metadata = {
      adapter: {
        app: {
          adapter: {
            default: true,
            alias: NODE_CONSOLE_PLATFORM
          },
          mapper: {
            input: {
              middleware: [].concat(options.middleware ?? [])
            }
          }
        }
      }
    }

    target.$$metadata$$ = deepmerge(target.$$metadata$$ ?? {}, metadata)

    return target
  }
}
