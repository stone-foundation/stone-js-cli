[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [middleware/BlueprintMiddleware](../README.md) / SetCliCommandsMiddleware

# Function: SetCliCommandsMiddleware()

> **SetCliCommandsMiddleware**(`context`, `next`): `Promise`\<`IBlueprint`\>

Defined in: [cli/src/middleware/BlueprintMiddleware.ts:76](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/middleware/BlueprintMiddleware.ts#L76)

Middleware to set cli commands for Node CLI adapters.

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
SetCliCommandsMiddleware(context, next)
```
