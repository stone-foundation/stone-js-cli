[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [middleware/BlueprintMiddleware](../README.md) / metaCLIBlueprintMiddleware

# Variable: metaCLIBlueprintMiddleware

> `const` **metaCLIBlueprintMiddleware**: `MetaPipe`\<`BlueprintContext`\<`IBlueprint`, `ClassType`\>, `IBlueprint`\>[]

Defined in: [cli/src/middleware/BlueprintMiddleware.ts:105](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/middleware/BlueprintMiddleware.ts#L105)

Configuration for cli processing middleware.

This array defines a list of middleware pipes, each with a `pipe` function and a `priority`.
These pipes are executed in the order of their priority values, with lower values running first.
