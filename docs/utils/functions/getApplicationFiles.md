[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / getApplicationFiles

# Function: getApplicationFiles()

> **getApplicationFiles**(`blueprint`): [`string`, `string`[]][]

Get Application Files.
Returns all application files grouped by directory.
Configurations are set in `stone.config.mjs`
at the root of the application directory.

## Parameters

### blueprint

`IBlueprint`

The configuration object.

## Returns

[`string`, `string`[]][]

An array of files grouped by directory.

## Defined in

[src/utils.ts:98](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/utils.ts#L98)
