[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/ReactBuildMiddleware](../README.md) / BuildViewsMiddleware

# Function: BuildViewsMiddleware()

> **BuildViewsMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/react/ReactBuildMiddleware.ts:69](https://github.com/stonemjs/cli/blob/ae332002b2560de84ae3a35accc1d91282bd1543/src/react/ReactBuildMiddleware.ts#L69)

Lazy: Builds the views using Vite.

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
