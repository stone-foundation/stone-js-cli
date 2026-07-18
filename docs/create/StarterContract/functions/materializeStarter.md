# Function: materializeStarter()

```ts
function materializeStarter(starter, context): Promise<void>;
```

Materialises a starter's files into the destination directory.

Handles every built-in source type; `custom` sources delegate to their own resolver.

## Parameters

### starter

[`Starter`](../interfaces/Starter.md)

The starter to materialise.

### context

[`StarterMaterializeContext`](../interfaces/StarterMaterializeContext.md)

The materialisation context.

## Returns

`Promise`\<`void`\>

## Throws

For unsupported/not-yet-implemented sources.
