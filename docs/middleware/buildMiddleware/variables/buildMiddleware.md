[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [middleware/buildMiddleware](../README.md) / buildMiddleware

# Variable: buildMiddleware

> `const` **buildMiddleware**: `Pipe`[]

Defined in: [cli/src/middleware/buildMiddleware.ts:30](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/middleware/buildMiddleware.ts#L30)

Middleware pipeline for building the application.

This pipeline includes tasks such as clearing the build directory, running Rollup builds,
setting the cache, and generating bootstrap files. It logs the progress to the command output.
