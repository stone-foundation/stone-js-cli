[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/ReactBuildMiddleware](../README.md) / GenerateViewsIndexMiddleware

# Function: GenerateViewsIndexMiddleware()

> **GenerateViewsIndexMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/react/ReactBuildMiddleware.ts:26](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/react/ReactBuildMiddleware.ts#L26)

Generates an index file for all views in the application.

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
