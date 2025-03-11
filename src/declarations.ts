import { IBlueprint } from '@stone-js/core'
import { CommandInput, CommandOutput } from '@stone-js/node-cli-adapter'

/**
 * Represents the context for the console.
*/
export interface ConsoleContext {
  blueprint: IBlueprint
  commandInput: CommandInput
  commandOutput: CommandOutput
}
