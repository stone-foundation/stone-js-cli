[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / pipeable

# Function: pipeable()

> **pipeable**\<`TContext`\>(`handler`): `Pipe`

Defined in: [cli/src/utils.ts:244](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/utils.ts#L244)

Pipeable middleware.

## Type Parameters

• **TContext** *extends* `Passable`

## Parameters

### handler

(`context`) => `unknown`

The middleware handler.

## Returns

`Pipe`

The middleware function.
