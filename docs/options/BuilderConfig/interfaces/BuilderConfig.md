[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [options/BuilderConfig](../README.md) / BuilderConfig

# Interface: BuilderConfig

Defined in: [cli/src/options/BuilderConfig.ts:55](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L55)

Configuration for building the Stone.js application.

## Properties

### browser?

> `optional` **browser**: `object`

Defined in: [cli/src/options/BuilderConfig.ts:99](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L99)

The browser configuration for the application.

#### excludedModules?

> `optional` **excludedModules**: `string`[]

Modules to be removed from the browser build.

***

### dotenv?

> `optional` **dotenv**: `Partial`\<[`DotenvConfig`](../../DotenvConfig/interfaces/DotenvConfig.md)\>

Defined in: [cli/src/options/BuilderConfig.ts:84](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L84)

Environment variable management configuration.

***

### imperative?

> `optional` **imperative**: `boolean`

Defined in: [cli/src/options/BuilderConfig.ts:79](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L79)

Whether the application is using imperative programming style.

***

### input?

> `optional` **input**: [`InputConfig`](InputConfig.md)

Defined in: [cli/src/options/BuilderConfig.ts:109](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L109)

Module autoloading configuration.

***

### language?

> `optional` **language**: `"typescript"` \| `"javascript"`

Defined in: [cli/src/options/BuilderConfig.ts:59](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L59)

The language used in the application.

***

### lazy?

> `optional` **lazy**: `boolean`

Defined in: [cli/src/options/BuilderConfig.ts:69](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L69)

Whether the application is using lazy loading for pages, error pages and layouts.

***

### output?

> `optional` **output**: `string`

Defined in: [cli/src/options/BuilderConfig.ts:114](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L114)

The output file path for the production build.

***

### rendering?

> `optional` **rendering**: `"csr"` \| `"ssr"`

Defined in: [cli/src/options/BuilderConfig.ts:74](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L74)

Whether the application is using server-side rendering.

***

### rollup?

> `optional` **rollup**: [`RollupConfig`](RollupConfig.md)

Defined in: [cli/src/options/BuilderConfig.ts:129](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L129)

The rollup configuration for the application.

***

### server?

> `optional` **server**: `object`

Defined in: [cli/src/options/BuilderConfig.ts:89](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L89)

The HTTP server configuration for the application.

#### printUrls?

> `optional` **printUrls**: `boolean`

Should print or not the URLs of the server.

***

### target?

> `optional` **target**: `"react"` \| `"service"`

Defined in: [cli/src/options/BuilderConfig.ts:64](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L64)

The application target.

***

### vite?

> `optional` **vite**: `Partial`\<`UserConfig`\>

Defined in: [cli/src/options/BuilderConfig.ts:134](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L134)

The Vite configuration for the application.

***

### watcher?

> `optional` **watcher**: `object`

Defined in: [cli/src/options/BuilderConfig.ts:119](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/BuilderConfig.ts#L119)

File watching configuration.

#### ignored?

> `optional` **ignored**: `string`[]

Files to be ignored during watching.
