[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [options/BuilderConfig](../README.md) / BuilderConfig

# Interface: BuilderConfig

Defined in: cli/src/options/BuilderConfig.ts:55

Configuration for building the Stone.js application.

## Properties

### appType?

> `optional` **appType**: `"react"` \| `"vue"` \| `"service"`

Defined in: cli/src/options/BuilderConfig.ts:64

The type of the application.

***

### browser?

> `optional` **browser**: `object`

Defined in: cli/src/options/BuilderConfig.ts:89

The browser configuration for the application.

#### excludedModules?

> `optional` **excludedModules**: `string`[]

Modules to be removed from the browser build.

***

### dotenv?

> `optional` **dotenv**: `Partial`\<[`DotenvConfig`](../../DotenvConfig/interfaces/DotenvConfig.md)\>

Defined in: cli/src/options/BuilderConfig.ts:74

Environment variable management configuration.

***

### imperative?

> `optional` **imperative**: `boolean`

Defined in: cli/src/options/BuilderConfig.ts:69

Whether the application is using imperative programming style.

***

### input?

> `optional` **input**: [`InputConfig`](InputConfig.md)

Defined in: cli/src/options/BuilderConfig.ts:99

Module autoloading configuration.

***

### output?

> `optional` **output**: `string`

Defined in: cli/src/options/BuilderConfig.ts:104

The output file path for the production build.

***

### rollup?

> `optional` **rollup**: [`RollupConfig`](RollupConfig.md)

Defined in: cli/src/options/BuilderConfig.ts:119

The rollup configuration for the application.

***

### server?

> `optional` **server**: `object`

Defined in: cli/src/options/BuilderConfig.ts:79

The HTTP server configuration for the application.

#### printUrls?

> `optional` **printUrls**: `boolean`

Should print or not the URLs of the server.

***

### type?

> `optional` **type**: `"typescript"` \| `"javascript"`

Defined in: cli/src/options/BuilderConfig.ts:59

The type of the application modules.

***

### vite?

> `optional` **vite**: `Partial`\<`UserConfig`\>

Defined in: cli/src/options/BuilderConfig.ts:124

The Vite configuration for the application.

***

### vitest?

> `optional` **vitest**: `Partial`\<`UserConfig`\>

Defined in: cli/src/options/BuilderConfig.ts:129

The Vitest configuration for the application.

***

### watcher?

> `optional` **watcher**: `object`

Defined in: cli/src/options/BuilderConfig.ts:109

File watching configuration.

#### ignored?

> `optional` **ignored**: `string`[]

Files to be ignored during watching.
