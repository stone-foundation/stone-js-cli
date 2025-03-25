[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/ReactDevMiddleware](../README.md) / GenerateReactConsoleFileMiddleware

# Function: GenerateReactConsoleFileMiddleware()

> **GenerateReactConsoleFileMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/react/ReactDevMiddleware.ts:109](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/react/ReactDevMiddleware.ts#L109)

Generates console index file for all modules in the application.

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
