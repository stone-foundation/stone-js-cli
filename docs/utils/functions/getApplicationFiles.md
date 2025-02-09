[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / getApplicationFiles

# Function: getApplicationFiles()

> **getApplicationFiles**(`blueprint`): \[`string`, `string`[]\][]

Defined in: [cli/src/utils.ts:109](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/utils.ts#L109)

Get Application Files.
Returns all application files grouped by directory.
Configurations are set in `stone.config.mjs`
at the root of the application directory.

## Parameters

### blueprint

`IBlueprint`

The configuration object.

## Returns

\[`string`, `string`[]\][]

An array of files grouped by directory.
