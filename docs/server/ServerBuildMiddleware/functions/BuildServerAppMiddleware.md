[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [server/ServerBuildMiddleware](../README.md) / BuildServerAppMiddleware

# Function: BuildServerAppMiddleware()

> **BuildServerAppMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/server/ServerBuildMiddleware.ts:20](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/server/ServerBuildMiddleware.ts#L20)

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
