[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [options/DotenvConfig](../README.md) / DotenvConfig

# Interface: DotenvConfig

Defined in: [cli/src/options/DotenvConfig.ts:54](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/options/DotenvConfig.ts#L54)

Complete configuration for managing environment variables.

## Properties

### options?

> `optional` **options**: `Partial`\<[`DotenvOptions`](DotenvOptions.md)\>

Defined in: [cli/src/options/DotenvConfig.ts:63](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/options/DotenvConfig.ts#L63)

Options for loading and expanding `.env` files.

***

### private?

> `optional` **private**: `Partial`\<[`DotenvFiles`](DotenvFiles.md)\>

Defined in: [cli/src/options/DotenvConfig.ts:68](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/options/DotenvConfig.ts#L68)

Configuration for private `.env` files (not included in the bundle).

***

### public?

> `optional` **public**: `Partial`\<[`DotenvFiles`](DotenvFiles.md)\>

Defined in: [cli/src/options/DotenvConfig.ts:73](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/options/DotenvConfig.ts#L73)

Configuration for public `.env` files (included in the bundle).

***

### replace?

> `optional` **replace**: `Partial`\<[`DotenvReplaceOptions`](DotenvReplaceOptions.md)\>

Defined in: [cli/src/options/DotenvConfig.ts:58](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/options/DotenvConfig.ts#L58)

Options for replacing variables during the build process.
