[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / checkAutoloadModule

# Function: checkAutoloadModule()

> **checkAutoloadModule**(`blueprint`, `module`, `throwError`): `boolean`

Check autoload module.

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

[utils.ts:198](https://github.com/stonemjs/cli/blob/b2251afafa869f82f017c134bddb19013c7883b6/src/utils.ts#L198)
