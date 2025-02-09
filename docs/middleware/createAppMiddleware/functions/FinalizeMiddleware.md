[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [middleware/createAppMiddleware](../README.md) / FinalizeMiddleware

# Function: FinalizeMiddleware()

> **FinalizeMiddleware**(`context`, `next`): `Promise`\<[`CreateAppContext`](../../../commands/InitCommand/interfaces/CreateAppContext.md)\>

Defined in: cli/src/middleware/createAppMiddleware.ts:160

Finalize setup.

## Parameters

### context

[`CreateAppContext`](../../../commands/InitCommand/interfaces/CreateAppContext.md)

Input data to transform via middleware.

### next

(`context`) => `Promise`\<[`CreateAppContext`](../../../commands/InitCommand/interfaces/CreateAppContext.md)\>

Function to pass to the next middleware.

## Returns

`Promise`\<[`CreateAppContext`](../../../commands/InitCommand/interfaces/CreateAppContext.md)\>

A promise resolving with the context object.
