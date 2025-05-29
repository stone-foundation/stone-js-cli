[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [middleware/BlueprintMiddleware](../README.md) / metaCLIBlueprintMiddleware

# Variable: metaCLIBlueprintMiddleware

> `const` **metaCLIBlueprintMiddleware**: `MetaPipe`\<`BlueprintContext`\<`IBlueprint`, `ClassType`\>, `IBlueprint`\>[]

Defined in: [cli/src/middleware/BlueprintMiddleware.ts:103](https://github.com/stonemjs/cli/blob/ae332002b2560de84ae3a35accc1d91282bd1543/src/middleware/BlueprintMiddleware.ts#L103)

Configuration for cli processing middleware.

This array defines a list of middleware pipes, each with a `pipe` function and a `priority`.
These pipes are executed in the order of their priority values, with lower values running first.
