[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/ReactDevMiddleware](../README.md) / GenerateDevServerMiddleware

# Function: GenerateDevServerMiddleware()

> **GenerateDevServerMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/react/ReactDevMiddleware.ts:90](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/react/ReactDevMiddleware.ts#L90)

Generates a development server for the application.

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
