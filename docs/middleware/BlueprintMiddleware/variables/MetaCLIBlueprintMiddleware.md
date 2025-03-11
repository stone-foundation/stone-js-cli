[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [middleware/BlueprintMiddleware](../README.md) / MetaCLIBlueprintMiddleware

# Variable: MetaCLIBlueprintMiddleware

> `const` **MetaCLIBlueprintMiddleware**: `MetaPipe`\<`BlueprintContext`\<`IBlueprint`, `ClassType`\>, `IBlueprint`\>[]

Defined in: cli/src/middleware/BlueprintMiddleware.ts:116

Configuration for cli processing middleware.

This array defines a list of middleware pipes, each with a `pipe` function and a `priority`.
These pipes are executed in the order of their priority values, with lower values running first.
