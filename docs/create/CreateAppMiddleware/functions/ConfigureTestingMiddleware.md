[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [create/CreateAppMiddleware](../README.md) / ConfigureTestingMiddleware

# Function: ConfigureTestingMiddleware()

> **ConfigureTestingMiddleware**(`context`, `next`): `Promise`\<[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)\>

Defined in: cli/src/create/CreateAppMiddleware.ts:129

Configure testing.

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
