[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [options/DotenvConfig](../README.md) / DotenvConfig

# Interface: DotenvConfig

Defined in: [cli/src/options/DotenvConfig.ts:41](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/options/DotenvConfig.ts#L41)

Complete configuration for managing environment variables.

## Properties

### options?

> `optional` **options**: [`DotenvOptions`](DotenvOptions.md)

Defined in: [cli/src/options/DotenvConfig.ts:46](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/options/DotenvConfig.ts#L46)

Options for loading and expanding `.env` files.

***

### private?

> `optional` **private**: [`DotenvFiles`](DotenvFiles.md)

Defined in: [cli/src/options/DotenvConfig.ts:51](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/options/DotenvConfig.ts#L51)

Configuration for private `.env` files (not included in the bundle).

***

### public?

> `optional` **public**: `Record`\<`string`, [`DotenvFiles`](DotenvFiles.md)\>

Defined in: [cli/src/options/DotenvConfig.ts:56](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/options/DotenvConfig.ts#L56)

Configuration for public `.env` files (included in the bundle).
