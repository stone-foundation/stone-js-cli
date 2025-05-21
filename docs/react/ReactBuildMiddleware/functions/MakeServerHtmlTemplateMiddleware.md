[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/ReactBuildMiddleware](../README.md) / MakeServerHtmlTemplateMiddleware

# Function: MakeServerHtmlTemplateMiddleware()

> **MakeServerHtmlTemplateMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/react/ReactBuildMiddleware.ts:336](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/react/ReactBuildMiddleware.ts#L336)

Makes the server HTML template.

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
