[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [server/ServerDevMiddleware](../README.md) / BuildDevServerAppMiddleware

# Function: BuildDevServerAppMiddleware()

> **BuildDevServerAppMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/server/ServerDevMiddleware.ts:21](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/server/ServerDevMiddleware.ts#L21)

Builds the server application using Rollup.

## Parameters

### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The console context.

### next

`NextPipe`\<[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md), `IBlueprint`\>

The next pipe function.

## Returns

`Promise`\<`IBlueprint`\>

The updated blueprint object.
