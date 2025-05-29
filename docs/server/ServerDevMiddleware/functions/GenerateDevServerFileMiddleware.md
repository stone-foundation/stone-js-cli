[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [server/ServerDevMiddleware](../README.md) / GenerateDevServerFileMiddleware

# Function: GenerateDevServerFileMiddleware()

> **GenerateDevServerFileMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/server/ServerDevMiddleware.ts:51](https://github.com/stonemjs/cli/blob/ae332002b2560de84ae3a35accc1d91282bd1543/src/server/ServerDevMiddleware.ts#L51)

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
