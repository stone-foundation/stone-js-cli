[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [server/ServerBuildMiddleware](../README.md) / GenerateServerFileMiddleware

# Function: GenerateServerFileMiddleware()

> **GenerateServerFileMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/server/ServerBuildMiddleware.ts:54](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/server/ServerBuildMiddleware.ts#L54)

Generates a server file.

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
