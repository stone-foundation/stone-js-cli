[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [server/server-utils](../README.md) / replaceProcessEnvVars

# Function: replaceProcessEnvVars()

> **replaceProcessEnvVars**(`blueprint`): `RollupReplaceOptions`

Defined in: cli/src/server/server-utils.ts:41

Generate replace options for process environment variables.

This function takes the environment variables from the `.env`
file add prefixes to them, stringify them and return the with rollup replace options plugin.

The prcocess is done only for the public environment variables during the bundled staged.

## Parameters

### blueprint

`IBlueprint`

The blueprint.

## Returns

`RollupReplaceOptions`

An object with environment variable replacement details.
