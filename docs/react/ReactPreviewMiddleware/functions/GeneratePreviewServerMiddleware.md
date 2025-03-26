[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/ReactPreviewMiddleware](../README.md) / GeneratePreviewServerMiddleware

# Function: GeneratePreviewServerMiddleware()

> **GeneratePreviewServerMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/react/ReactPreviewMiddleware.ts:17](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/react/ReactPreviewMiddleware.ts#L17)

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
