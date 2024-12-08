[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / getEnvVariables

# Function: getEnvVariables()

> **getEnvVariables**(`options`): `Record`\<`string`, `string`\> \| `undefined`

Get the env variables in .env file using the Dotenv package.

## Parameters

### options

`Partial`\<[`DotenvOptions`](../../options/DotenvConfig/interfaces/DotenvOptions.md)\>

The options for loading environment variables.

## Returns

`Record`\<`string`, `string`\> \| `undefined`

The parsed environment variables.

## Defined in

[src/utils.ts:180](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/utils.ts#L180)
