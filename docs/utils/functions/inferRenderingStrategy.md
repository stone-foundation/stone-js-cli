[**CLI Documentation**](../../README.md)

***

[CLI Documentation](../../README.md) / [utils](../README.md) / inferRenderingStrategy

# Function: inferRenderingStrategy()

> **inferRenderingStrategy**(`content`): `undefined` \| `"csr"` \| `"ssr"`

Defined in: [cli/src/utils.ts:303](https://github.com/stonemjs/cli/blob/ae332002b2560de84ae3a35accc1d91282bd1543/src/utils.ts#L303)

Determines the rendering strategy based on the content of the file.

## Parameters

### content

`string`

The content of the file.

## Returns

`undefined` \| `"csr"` \| `"ssr"`

The rendering strategy: 'csr' or 'ssr'.
