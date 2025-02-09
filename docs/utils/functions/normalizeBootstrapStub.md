[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / normalizeBootstrapStub

# Function: normalizeBootstrapStub()

> **normalizeBootstrapStub**(`blueprint`, `stub`, `action`, `exclude`): `string`

Defined in: [cli/src/utils.ts:302](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/utils.ts#L302)

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
