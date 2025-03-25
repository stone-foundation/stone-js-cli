[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [server/ServerDevMiddleware](../README.md) / GenerateDevServerFileMiddleware

# Function: GenerateDevServerFileMiddleware()

> **GenerateDevServerFileMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/server/ServerDevMiddleware.ts:57](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/server/ServerDevMiddleware.ts#L57)

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
