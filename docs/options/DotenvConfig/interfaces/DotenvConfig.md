[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [options/DotenvConfig](../README.md) / DotenvConfig

# Interface: DotenvConfig

Defined in: [cli/src/options/DotenvConfig.ts:41](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/DotenvConfig.ts#L41)

Complete configuration for managing environment variables.

## Properties

### options?

> `optional` **options**: [`DotenvOptions`](DotenvOptions.md)

Defined in: [cli/src/options/DotenvConfig.ts:46](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/DotenvConfig.ts#L46)

Options for loading and expanding `.env` files.

***

### private?

> `optional` **private**: [`DotenvFiles`](DotenvFiles.md)

Defined in: [cli/src/options/DotenvConfig.ts:51](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/DotenvConfig.ts#L51)

Configuration for private `.env` files (not included in the bundle).

***

### public?

> `optional` **public**: `Record`\<`string`, [`DotenvFiles`](DotenvFiles.md)\>

Defined in: [cli/src/options/DotenvConfig.ts:56](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/options/DotenvConfig.ts#L56)

Configuration for public `.env` files (included in the bundle).
