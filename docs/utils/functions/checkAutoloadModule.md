[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / checkAutoloadModule

# Function: checkAutoloadModule()

> **checkAutoloadModule**(`blueprint`, `module`, `throwError`): `boolean`

Defined in: [cli/src/utils.ts:201](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/utils.ts#L201)

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
