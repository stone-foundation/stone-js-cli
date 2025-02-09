[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [middleware/buildMiddleware](../README.md) / bundleMiddleware

# Variable: bundleMiddleware

> `const` **bundleMiddleware**: `Pipe`[]

Defined in: [cli/src/middleware/buildMiddleware.ts:85](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/middleware/buildMiddleware.ts#L85)

Middleware pipeline for bundling the application.

This pipeline includes tasks such as clearing the distribution directory,
running Rollup bundling, and logging progress to the command output.
