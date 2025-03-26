[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [options/BuilderConfig](../README.md) / BuilderConfig

# Interface: BuilderConfig

Defined in: [cli/src/options/BuilderConfig.ts:55](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L55)

Configuration for building the Stone.js application.

## Properties

### appType?

> `optional` **appType**: `"react"` \| `"vue"` \| `"service"`

Defined in: [cli/src/options/BuilderConfig.ts:69](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L69)

The type of the application.

***

### browser?

> `optional` **browser**: `object`

Defined in: [cli/src/options/BuilderConfig.ts:94](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L94)

The browser configuration for the application.

#### excludedModules?

> `optional` **excludedModules**: `string`[]

Modules to be removed from the browser build.

***

### dotenv?

> `optional` **dotenv**: `Partial`\<[`DotenvConfig`](../../DotenvConfig/interfaces/DotenvConfig.md)\>

Defined in: [cli/src/options/BuilderConfig.ts:79](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L79)

Environment variable management configuration.

***

### imperative?

> `optional` **imperative**: `boolean`

Defined in: [cli/src/options/BuilderConfig.ts:74](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L74)

Whether the application is using imperative programming style.

***

### input?

> `optional` **input**: [`InputConfig`](InputConfig.md)

Defined in: [cli/src/options/BuilderConfig.ts:104](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L104)

Module autoloading configuration.

***

### nano?

> `optional` **nano**: `boolean`

Defined in: [cli/src/options/BuilderConfig.ts:59](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L59)

Whether the application is a Nano application.

***

### output?

> `optional` **output**: `string`

Defined in: [cli/src/options/BuilderConfig.ts:109](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L109)

The output file path for the production build.

***

### rollup?

> `optional` **rollup**: [`RollupConfig`](RollupConfig.md)

Defined in: [cli/src/options/BuilderConfig.ts:124](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L124)

The rollup configuration for the application.

***

### server?

> `optional` **server**: `object`

Defined in: [cli/src/options/BuilderConfig.ts:84](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L84)

The HTTP server configuration for the application.

#### printUrls?

> `optional` **printUrls**: `boolean`

Should print or not the URLs of the server.

***

### type?

> `optional` **type**: `"typescript"` \| `"javascript"`

Defined in: [cli/src/options/BuilderConfig.ts:64](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L64)

The type of the application modules.

***

### vite?

> `optional` **vite**: `Partial`\<`UserConfig`\>

Defined in: [cli/src/options/BuilderConfig.ts:129](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L129)

The Vite configuration for the application.

***

### vitest?

> `optional` **vitest**: `Partial`\<`UserConfig`\>

Defined in: [cli/src/options/BuilderConfig.ts:134](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L134)

The Vitest configuration for the application.

***

### watcher?

> `optional` **watcher**: `object`

Defined in: [cli/src/options/BuilderConfig.ts:114](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/options/BuilderConfig.ts#L114)

File watching configuration.

#### ignored?

> `optional` **ignored**: `string`[]

Files to be ignored during watching.
