[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / makeBootstrapFile

# Function: makeBootstrapFile()

> **makeBootstrapFile**(`blueprint`, `action`, `isConsole`, `force`): `boolean`

Defined in: [cli/src/utils.ts:274](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/utils.ts#L274)

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
