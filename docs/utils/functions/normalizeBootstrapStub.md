[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / normalizeBootstrapStub

# Function: normalizeBootstrapStub()

> **normalizeBootstrapStub**(`blueprint`, `stub`, `action`, `exclude`): `string`

Normalize bootstrap content by replacing module import statements.

## Parameters

### blueprint

`IBlueprint`

The blueprint object.

### stub

`string`

The stub content to normalize.

### action

Action can be: `build` or `export`.

`"build"` | `"export"`

### exclude

`string`[] = `[]`

Modules to exclude from import.

## Returns

`string`

The normalized stub content.

## Defined in

utils.ts:320
