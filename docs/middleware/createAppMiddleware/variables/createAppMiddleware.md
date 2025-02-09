[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [middleware/createAppMiddleware](../README.md) / createAppMiddleware

# Variable: createAppMiddleware

> `const` **createAppMiddleware**: `object`[]

Defined in: cli/src/middleware/createAppMiddleware.ts:200

Array of builder pipes with their priorities.

## Type declaration

### pipe()

> **pipe**: (`context`, `next`) => `Promise`\<[`CreateAppContext`](../../../commands/InitCommand/interfaces/CreateAppContext.md)\> = `InstallDependenciesMiddleware`

Install dependencies.

#### Parameters

##### context

[`CreateAppContext`](../../../commands/InitCommand/interfaces/CreateAppContext.md)

Input data to transform via middleware.

##### next

(`context`) => `Promise`\<[`CreateAppContext`](../../../commands/InitCommand/interfaces/CreateAppContext.md)\>

Function to pass to the next middleware.

#### Returns

`Promise`\<[`CreateAppContext`](../../../commands/InitCommand/interfaces/CreateAppContext.md)\>

A promise resolving with the context object.

### priority

> **priority**: `number` = `1`
