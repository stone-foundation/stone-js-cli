[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [middleware/BlueprintMiddleware](../README.md) / LoadDotenvVariablesMiddleware

# Function: LoadDotenvVariablesMiddleware()

> **LoadDotenvVariablesMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/middleware/BlueprintMiddleware.ts:51](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/middleware/BlueprintMiddleware.ts#L51)

Middleware to load the environment variables from the .env file.
So the environment variables can be accessed using `process.env`.
Only applies server-side.

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
