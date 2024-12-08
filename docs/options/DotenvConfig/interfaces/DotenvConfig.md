[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [options/DotenvConfig](../README.md) / DotenvConfig

# Interface: DotenvConfig

Complete configuration for managing environment variables.

## Properties

### options?

> `optional` **options**: `Partial`\<[`DotenvOptions`](DotenvOptions.md)\>

Options for loading and expanding `.env` files.

#### Defined in

[src/options/DotenvConfig.ts:63](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/options/DotenvConfig.ts#L63)

***

### private?

> `optional` **private**: `Partial`\<[`DotenvFiles`](DotenvFiles.md)\>

Configuration for private `.env` files (not included in the bundle).

#### Defined in

[src/options/DotenvConfig.ts:68](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/options/DotenvConfig.ts#L68)

***

### public?

> `optional` **public**: `Partial`\<[`DotenvFiles`](DotenvFiles.md)\>

Configuration for public `.env` files (included in the bundle).

#### Defined in

[src/options/DotenvConfig.ts:73](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/options/DotenvConfig.ts#L73)

***

### replace?

> `optional` **replace**: `Partial`\<[`DotenvReplaceOptions`](DotenvReplaceOptions.md)\>

Options for replacing variables during the build process.

#### Defined in

[src/options/DotenvConfig.ts:58](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/options/DotenvConfig.ts#L58)
