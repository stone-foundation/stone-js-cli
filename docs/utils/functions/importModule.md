[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / importModule

# Function: importModule()

> **importModule**\<`R`\>(`relativePath`): `Promise`\<`R` \| `undefined`\>

Asynchronously imports a module given its relative path.

## Type Parameters

• **R**

## Parameters

### relativePath

`string`

The relative path to the module to be imported.

## Returns

`Promise`\<`R` \| `undefined`\>

A promise that resolves to the imported module, or null if the import fails.

## Defined in

[src/utils.ts:257](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/utils.ts#L257)
