[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [server/ServerDevMiddleware](../README.md) / BuildDevServerAppMiddleware

# Function: BuildDevServerAppMiddleware()

> **BuildDevServerAppMiddleware**(`blueprint`, `next`): `Promise`\<`IBlueprint`\>

Defined in: cli/src/server/ServerDevMiddleware.ts:21

Builds the server application using Rollup.

## Parameters

### blueprint

`IBlueprint`

The blueprint object.

### next

`NextPipe`\<`IBlueprint`, `IBlueprint`\>

The next pipe function.

## Returns

`Promise`\<`IBlueprint`\>

The updated blueprint object.
