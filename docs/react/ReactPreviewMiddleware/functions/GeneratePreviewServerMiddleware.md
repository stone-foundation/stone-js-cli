[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/ReactPreviewMiddleware](../README.md) / GeneratePreviewServerMiddleware

# Function: GeneratePreviewServerMiddleware()

> **GeneratePreviewServerMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/react/ReactPreviewMiddleware.ts:17](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/react/ReactPreviewMiddleware.ts#L17)

Generates a preview server for the application.

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
