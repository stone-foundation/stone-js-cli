[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [server/ServerBuildMiddleware](../README.md) / BundleServerAppMiddleware

# Function: BundleServerAppMiddleware()

> **BundleServerAppMiddleware**(`blueprint`, `next`): `Promise`\<`IBlueprint`\>

Defined in: cli/src/server/ServerBuildMiddleware.ts:71

Bundles the server application using Rollup.

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
