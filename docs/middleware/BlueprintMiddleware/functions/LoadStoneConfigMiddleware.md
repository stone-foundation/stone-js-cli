[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [middleware/BlueprintMiddleware](../README.md) / LoadStoneConfigMiddleware

# Function: LoadStoneConfigMiddleware()

> **LoadStoneConfigMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/middleware/BlueprintMiddleware.ts:28](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/middleware/BlueprintMiddleware.ts#L28)

Middleware to load the Stone configuration from the stone.config.js or stone.config.mjs file.

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
LoadStoneConfigMiddleware(context, next)
```
