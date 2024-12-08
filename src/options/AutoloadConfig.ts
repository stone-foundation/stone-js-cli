/**
 * Configuration for automatically loading modules during buildtime.
 *
 * Specifies glob patterns to identify modules for transpilation.
 */
export interface AutoloadConfig {
  /**
   * Glob patterns for autoloading modules.
   * Keys represent module categories, and values are glob patterns to match files.
   */
  modules: Record<string, string>
}

/**
 * Default autoload configuration for building and loading application modules.
 * - `app`: Matches all `.js`, `.mjs`, `.ts` and `.json` files in the `app` directory.
 * - `options`: Matches all `.js`, `.mjs`, `.ts` and `.json` files in the `config` directory.
 */
export const autoload: AutoloadConfig = {
  modules: {
    app: 'app/**/*.(js|mjs|ts|json)',
    options: 'config/*.(js|mjs|ts|json)'
  }
}
