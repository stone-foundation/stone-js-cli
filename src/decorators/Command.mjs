import { classLevelDecoratorChecker, merge } from '@stone-js/common'

/**
 * Command Decorator: Useful for customizing classes as Command.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 *
 * @memberOf Decorators
 * @param  {Object} options - The decorator configuration options.
 * @param  {string} options.name - The name of the command.
 * @param  {string|string[]} [options.args] - List of positional arguments.
 * @param  {string|string[]} [options.alias] - Command alias names.
 * @param  {string} [options.desc] - Command description.
 * @param  {Object} [options.options] - Command options.
 * @return {Function}
 */
export const Command = (options) => {
  return (target) => {
    classLevelDecoratorChecker(target)

    const metadata = {
      command: options
    }

    target.prototype.$$metadata$$ = options
    target.$$metadata$$ = merge(target.$$metadata$$ ?? {}, metadata)

    return target
  }
}
