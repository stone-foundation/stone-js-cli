[**CLI Documentation**](../../README.md)

***

[CLI Documentation](../../README.md) / [utils](../README.md) / inferRenderingStrategy

# Function: inferRenderingStrategy()

> **inferRenderingStrategy**(`content`): `undefined` \| `"csr"` \| `"ssr"`

Defined in: [cli/src/utils.ts:291](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/utils.ts#L291)

Determines the rendering strategy based on the content of the file.

## Parameters

### content

`string`

The content of the file.

## Returns

`undefined` \| `"csr"` \| `"ssr"`

The rendering strategy: 'csr' or 'ssr'.
