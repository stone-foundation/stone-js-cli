/**
 * Merge cli class definitions modules with app modules.
 * This is an initializer pipe and must have low priotity.
 *
 * @param   {Passable} passable - Input data to transform via middleware.
 * @param   {Function} next - Pass to next middleware.
 * @returns {Passable}
 */
export const MergeWithAppModulesPipe = (passable, next) => {
  passable.app = passable.app.concat(passable.commands)
  return next(passable)
}

/**
 * Handle Command decorator.
 *
 * @param   {Passable} passable - Input data to transform via middleware.
 * @param   {Function} next - Pass to next middleware.
 * @returns {Passable}
 */
export const CommandPipe = (passable, next) => {
  const modules = passable.commands.filter(module => module.$$metadata$$?.command)
  passable.options.app.commands = modules.concat(passable.options.app.commands ?? [])
  return next(passable)
}

/** @returns {Array} */
export const cliPipes = [
  { pipe: MergeWithAppModulesPipe, priority: 0.1 },
  { pipe: CommandPipe, priority: 1 }
]
