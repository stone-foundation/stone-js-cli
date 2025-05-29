[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [create/CreateAppMiddleware](../README.md) / ConvertToVanillaMiddleware

# Function: ConvertToVanillaMiddleware()

> **ConvertToVanillaMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/create/CreateAppMiddleware.ts:92](https://github.com/stonemjs/cli/blob/ae332002b2560de84ae3a35accc1d91282bd1543/src/create/CreateAppMiddleware.ts#L92)

Convert to vanilla JavaScript.

## Parameters

### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

Input data to transform via middleware.

### next

`NextPipe`\<[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md), `IBlueprint`\>

Function to pass to the next middleware.

## Returns

`Promise`\<`IBlueprint`\>

A promise resolving with the context object.
