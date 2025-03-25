[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [server/server-utils](../README.md) / replaceProcessEnvVars

# Function: replaceProcessEnvVars()

> **replaceProcessEnvVars**(`blueprint`): `RollupReplaceOptions`

Defined in: [cli/src/server/server-utils.ts:46](https://github.com/stonemjs/cli/blob/c980e34c3e365606f5472998f0ccb119c79896c3/src/server/server-utils.ts#L46)

Generate replace options for process environment variables.

This function takes the environment variables from the `.env`
file add prefixes to them, stringify them and return them with rollup replace options plugin.

The prcocess is done only for the public environment variables during the bundled staged.

## Parameters

### blueprint

`IBlueprint`

The blueprint.

## Returns

`RollupReplaceOptions`

An object with environment variable replacement details.
