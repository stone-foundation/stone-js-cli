[**CLI Documentation**](../../README.md)

***

[CLI Documentation](../../README.md) / [utils](../README.md) / inferRenderingStrategy

# Function: inferRenderingStrategy()

> **inferRenderingStrategy**(`content`): `undefined` \| `"csr"` \| `"ssr"`

Defined in: [cli/src/utils.ts:303](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/utils.ts#L303)

Determines the rendering strategy based on the content of the file.

## Parameters

### content

`string`

The content of the file.

## Returns

`undefined` \| `"csr"` \| `"ssr"`

The rendering strategy: 'csr' or 'ssr'.
