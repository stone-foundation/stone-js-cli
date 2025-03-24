import chalk from 'chalk'

/**
 * Represents a single template in the list.
 */
export interface Template {
  /** The unique identifier for the template. */
  value: string

  /** The display name of the template, with formatting applied. */
  title: string

  /** Whether the template is disabled (optional). */
  disabled?: boolean
}

/**
 * Returns the available template list.
 *
 * @param params - An object containing format utilities.
 * @param params.format - The format utilities for styling text.
 * @returns An array of available templates.
 */
const templates = ({ format }: { format: typeof chalk }): Template[] => [
  {
    value: 'basic-service-declarative-api',
    title: format.green('Basic starter with minimal setup and declarative API')
  },
  {
    value: 'basic-service-imperative-api',
    title: format.green('Basic starter with minimal setup and imperative API')
  },
  {
    value: 'basic-react-declarative-api',
    title: format.green('Basic React starter with minimal setup and declarative API')
  },
  {
    value: 'basic-react-imperative-api',
    title: format.green('Basic React starter with minimal setup and imperative API')
  },
  {
    value: 'standard-service-declarative-api',
    title: format.blue('Standard starter with common setup and declarative API')
  },
  {
    value: 'standard-service-imperative-api',
    title: format.blue('Standard starter with common setup and imperative API')
  },
  {
    value: 'standard-react-declarative-api',
    title: format.blue('Standard React starter with common setup and declarative API')
  },
  {
    value: 'standard-react-imperative-api',
    title: format.blue('Standard React starter with common setup and imperative API')
  },
  {
    value: 'full-service-declarative-api',
    title: format.red('Full featured starter with complete setup and declarative API')
  },
  {
    value: 'full-service-imperative-api',
    title: format.red('Full featured starter with complete setup and imperative API')
  },
  {
    value: 'full-react-declarative-api',
    title: format.red('Full featured React starter with complete setup and declarative API')
  },
  {
    value: 'full-react-imperative-api',
    title: format.red('Full featured React starter with complete setup and imperative API')
  }
]

// Export the templates
export default templates
