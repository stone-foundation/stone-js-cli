[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/ReactBuildMiddleware](../README.md) / GenerateLazyPageMiddleware

# Function: GenerateLazyPageMiddleware()

> **GenerateLazyPageMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/react/ReactBuildMiddleware.ts:111](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/react/ReactBuildMiddleware.ts#L111)

Lazy: Generates a lazy pages file.

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
