/**
 * Options for the `@rollup/plugin-replace` plugin.
 */
export interface DotenvReplaceOptions {
  /**
   * Prevents assignment expressions in replacement values.
   */
  preventAssignment: boolean
}

/**
 * Configuration options for `dotenv` and `dotenv-expand`.
 */
export interface DotenvOptions {
  /**
   * Enables debug mode for logging errors.
   */
  debug: boolean

  /**
   * Expands variables within values in the `.env` file.
   */
  expand: boolean

  /**
   * Overrides existing environment variables with values from the `.env` file.
   */
  override: boolean

  /**
   * Ignores the process environment variables.
   */
  ignoreProcessEnv: boolean
}

/**
 * Specifies `.env` file paths and options.
 */
export interface DotenvFiles {
  /**
   * Paths to `.env` files.
   */
  path: string[]

  /**
   * Whether to override existing values.
   */
  override?: boolean
}

/**
 * Complete configuration for managing environment variables.
 */
export interface DotenvConfig {
  /**
   * Options for replacing variables during the build process.
   */
  replace?: Partial<DotenvReplaceOptions>

  /**
   * Options for loading and expanding `.env` files.
   */
  options?: Partial<DotenvOptions>

  /**
   * Configuration for private `.env` files (not included in the bundle).
   */
  private?: Partial<DotenvFiles>

  /**
   * Configuration for public `.env` files (included in the bundle).
   */
  public?: Partial<DotenvFiles>
}

/**
 * Default configuration for environment variable management.
 */
export const dotenv: DotenvConfig = {
  replace: {
    preventAssignment: true
  },
  options: {
    debug: false,
    expand: true,
    override: false,
    ignoreProcessEnv: false
  },
  private: {
    path: ['.env']
  },
  public: {
    override: true,
    path: ['.env.public']
  }
}
