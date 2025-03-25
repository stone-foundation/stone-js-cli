[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [create/CreateAppMiddleware](../README.md) / ConvertToVanillaMiddleware

# Function: ConvertToVanillaMiddleware()

> **ConvertToVanillaMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/create/CreateAppMiddleware.ts:92](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/create/CreateAppMiddleware.ts#L92)

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
