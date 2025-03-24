[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [create/CreateAppMiddleware](../README.md) / FinalizeMiddleware

# Function: FinalizeMiddleware()

> **FinalizeMiddleware**(`context`, `next`): `Promise`\<[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)\>

Defined in: [cli/src/create/CreateAppMiddleware.ts:172](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/create/CreateAppMiddleware.ts#L172)

Finalize setup.

## Parameters

### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

Input data to transform via middleware.

### next

`NextPipe`\<[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)\>

Function to pass to the next middleware.

## Returns

`Promise`\<[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)\>

A promise resolving with the context object.
