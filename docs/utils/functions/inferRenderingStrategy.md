# Function: inferRenderingStrategy()

```ts
function inferRenderingStrategy(content): "ssr" | "csr" | undefined;
```

Determines the rendering strategy based on the content of the file.

## Parameters

### content

`string`

The content of the file.

## Returns

`"ssr"` \| `"csr"` \| `undefined`

The rendering strategy: 'csr' or 'ssr'.
