[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [middleware/BlueprintMiddleware](../README.md) / LoadDotenvVariablesMiddleware

# Function: LoadDotenvVariablesMiddleware()

> **LoadDotenvVariablesMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/middleware/BlueprintMiddleware.ts:50](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/middleware/BlueprintMiddleware.ts#L50)

Middleware to load the environment variables from the .env file.
So the environment variables can be accessed using `process.env`.

## Parameters

### context

`BlueprintContext`\<`IBlueprint`, `ClassType`\>

The configuration context containing modules and blueprint.

### next

`NextPipe`\<`BlueprintContext`\<`IBlueprint`, `ClassType`\>, `IBlueprint`\>

The next pipeline function to continue processing.

## Returns

`Promise`\<`IBlueprint`\>

The updated blueprint or a promise resolving to it.

## Example

```typescript
LoadDotenvVariablesMiddleware(context, next)
```
