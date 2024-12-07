import { ErrorOptions, RuntimeError } from '@stone-js/core'

/**
 * Custom error for AWS Lambda adapter operations.
 */
export class CliError extends RuntimeError {
  constructor (message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'CliError'
  }
}
