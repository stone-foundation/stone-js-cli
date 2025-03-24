[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [react/react-utils](../README.md) / getViteConfig

# Function: getViteConfig()

> **getViteConfig**(`command`, `mode`): `Promise`\<`UserConfig`\>

Defined in: [cli/src/react/react-utils.ts:23](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/react/react-utils.ts#L23)

Gets the Vite configuration.

## Parameters

### command

The command to run.

`"build"` | `"serve"`

### mode

The mode to run.

`"production"` | `"development"`

## Returns

`Promise`\<`UserConfig`\>

The Vite configuration.
