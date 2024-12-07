[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / makeBootstrapFile

# Function: makeBootstrapFile()

> **makeBootstrapFile**(`blueprint`, `action`, `isConsole`, `force`): `boolean`

Make App bootstrap module from stub.
In .stone directory for build action.
And at the root of the project for export action.

## Parameters

### blueprint

`IBlueprint`

The blueprint object.

### action

Action can be: `build` or `export`.

`"build"` | `"export"`

### isConsole

`boolean` = `false`

Build for console.

### force

`boolean` = `false`

Force file override if exists.

## Returns

`boolean`

Whether the bootstrap file was successfully created.

## Defined in

[utils.ts:294](https://github.com/stonemjs/cli/blob/b2251afafa869f82f017c134bddb19013c7883b6/src/utils.ts#L294)
