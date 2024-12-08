[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / checkAutoloadModule

# Function: checkAutoloadModule()

> **checkAutoloadModule**(`blueprint`, `module`, `throwError`): `boolean`

Check autoload module.

Ensures that the module is valid by checking if the module files exists.

## Parameters

### blueprint

`IBlueprint`

The configuration object.

### module

`string`

The module name to check.

### throwError

`boolean` = `false`

Whether to throw an error if the module is not found.

## Returns

`boolean`

True if the module is valid; otherwise, false.

## Throws

RuntimeError - If the module is invalid and `throwError` is true.

## Defined in

[src/utils.ts:201](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/utils.ts#L201)
