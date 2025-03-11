import chalk from 'chalk'

/**
 * Represents a single template in the list.
 */
export interface Template {
  /** The unique identifier for the template. */
  value: string

  /** The display name of the template, with formatting applied. */
  name: string

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
    value: 'basic-http',
    name: format.green('Basic HTTP starter with minimal setup and HTTP integration')
  },
  {
    value: 'basic-aws-lambda',
    name: format.green('Basic starter with minimal setup and AWS Lambda integration')
  },
  {
    value: 'basic-cli',
    name: format.green('Basic starter with minimal setup and CLI integration')
  },
  {
    value: 'nano-service-declarative-api',
    name: format.blue('Http API starter with Stone router, useful to create nano service using declarative API')
  },
  {
    value: 'nano-service-imperative-api',
    name: format.blue('Http API starter with Stone router, useful to create nano service using imperative API')
  },
  {
    value: 'react-spa-declarative-api',
    name: format.gray('React SPA starter, useful to create React single page application using declarative API')
  },
  {
    value: 'react-spa-imperative-api',
    name: format.gray('React SPA starter, useful to create React single page application using imperative API')
  },
  {
    value: 'react-ssr-declarative-api',
    name: format.gray('React SSR starter, useful to create React server-side rendering application using declarative API')
  },
  {
    value: 'react-ssr-imperative-api',
    name: format.gray('React SSR starter, useful to create React server-side rendering application using imperative API')
  },
  {
    disabled: true,
    value: 'vuejs-spa-declarative-api',
    name: format.gray('React SPA starter, useful to create Vuejs single page application using declarative API (Coming soon)')
  },
  {
    disabled: true,
    value: 'vuejs-spa-imperative-api',
    name: format.gray('React SPA starter, useful to create Vuejs single page application using imperative API (Coming soon)')
  },
  {
    disabled: true,
    value: 'vuejs-ssr-declarative-api',
    name: format.gray('React SSR starter, useful to create Vuejs server-side rendering application using declarative API (Coming soon)')
  },
  {
    disabled: true,
    value: 'vuejs-ssr-imperative-api',
    name: format.gray('React SSR starter, useful to create Vuejs server-side rendering application using imperative API (Coming soon)')
  }
]

export default templates
