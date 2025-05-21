[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/ReactBuildMiddleware](../README.md) / GenerateReactServerFileMiddleware

# Function: GenerateReactServerFileMiddleware()

> **GenerateReactServerFileMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/react/ReactBuildMiddleware.ts:202](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/react/ReactBuildMiddleware.ts#L202)

Generates a server file for all modules in the application.

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
