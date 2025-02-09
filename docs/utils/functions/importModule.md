[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / importModule

# Function: importModule()

> **importModule**\<`R`\>(`relativePath`): `Promise`\<`R` \| `undefined`\>

Defined in: [cli/src/utils.ts:257](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/utils.ts#L257)

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
