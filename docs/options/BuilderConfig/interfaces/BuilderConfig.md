[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [options/BuilderConfig](../README.md) / BuilderConfig

# Interface: BuilderConfig

Defined in: [cli/src/options/BuilderConfig.ts:55](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L55)

Configuration for building the Stone.js application.

## Properties

### appType?

> `optional` **appType**: `"react"` \| `"vue"` \| `"service"`

Defined in: [cli/src/options/BuilderConfig.ts:70](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L70)

The type of the application.

***

### browser?

> `optional` **browser**: `object`

Defined in: [cli/src/options/BuilderConfig.ts:95](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L95)

The browser configuration for the application.

#### excludedModules?

> `optional` **excludedModules**: `string`[]

Modules to be removed from the browser build.

***

### dotenv?

> `optional` **dotenv**: `Partial`\<[`DotenvConfig`](../../DotenvConfig/interfaces/DotenvConfig.md)\>

Defined in: [cli/src/options/BuilderConfig.ts:80](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L80)

Environment variable management configuration.

***

### imperative?

> `optional` **imperative**: `boolean`

Defined in: [cli/src/options/BuilderConfig.ts:75](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L75)

Whether the application is using imperative programming style.

***

### input?

> `optional` **input**: [`InputConfig`](InputConfig.md)

Defined in: [cli/src/options/BuilderConfig.ts:105](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L105)

Module autoloading configuration.

***

### nano?

> `optional` **nano**: `boolean`

Defined in: [cli/src/options/BuilderConfig.ts:60](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L60)

Whether the application is a Nano application.
TODO:// Replace by lazyViews or something like that.

***

### output?

> `optional` **output**: `string`

Defined in: [cli/src/options/BuilderConfig.ts:110](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L110)

The output file path for the production build.

***

### rollup?

> `optional` **rollup**: [`RollupConfig`](RollupConfig.md)

Defined in: [cli/src/options/BuilderConfig.ts:125](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L125)

The rollup configuration for the application.

***

### server?

> `optional` **server**: `object`

Defined in: [cli/src/options/BuilderConfig.ts:85](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L85)

The HTTP server configuration for the application.

#### printUrls?

> `optional` **printUrls**: `boolean`

Should print or not the URLs of the server.

***

### type?

> `optional` **type**: `"typescript"` \| `"javascript"`

Defined in: [cli/src/options/BuilderConfig.ts:65](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L65)

The type of the application modules.

***

### vite?

> `optional` **vite**: `Partial`\<`UserConfig`\>

Defined in: [cli/src/options/BuilderConfig.ts:130](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L130)

The Vite configuration for the application.

***

### watcher?

> `optional` **watcher**: `object`

Defined in: [cli/src/options/BuilderConfig.ts:115](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/options/BuilderConfig.ts#L115)

File watching configuration.

#### ignored?

> `optional` **ignored**: `string`[]

Files to be ignored during watching.
