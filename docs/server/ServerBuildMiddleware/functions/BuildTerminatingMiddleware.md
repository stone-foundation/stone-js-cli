[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [server/ServerBuildMiddleware](../README.md) / BuildTerminatingMiddleware

# Function: BuildTerminatingMiddleware()

> **BuildTerminatingMiddleware**(`blueprint`, `next`): `Promise`\<`IBlueprint`\>

Defined in: cli/src/server/ServerBuildMiddleware.ts:101

Build terminating middleware.

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
