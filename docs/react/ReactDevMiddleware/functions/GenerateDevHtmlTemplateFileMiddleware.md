[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [react/ReactDevMiddleware](../README.md) / GenerateDevHtmlTemplateFileMiddleware

# Function: GenerateDevHtmlTemplateFileMiddleware()

> **GenerateDevHtmlTemplateFileMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/react/ReactDevMiddleware.ts:60](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/react/ReactDevMiddleware.ts#L60)

Generates an index HTML file for the application.

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
