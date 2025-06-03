[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [create/CreateAppMiddleware](../README.md) / ConfigureTestingMiddleware

# Function: ConfigureTestingMiddleware()

> **ConfigureTestingMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/create/CreateAppMiddleware.ts:126](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/create/CreateAppMiddleware.ts#L126)

Configure testing.

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
