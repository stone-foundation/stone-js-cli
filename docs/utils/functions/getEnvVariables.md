[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / getEnvVariables

# Function: getEnvVariables()

> **getEnvVariables**(`options`): `Record`\<`string`, `string`\> \| `undefined`

Defined in: [cli/src/utils.ts:180](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/utils.ts#L180)

Get the env variables in .env file using the Dotenv package.

## Parameters

### options

`Partial`\<[`DotenvOptions`](../../options/DotenvConfig/interfaces/DotenvOptions.md)\>

The options for loading environment variables.

## Returns

`Record`\<`string`, `string`\> \| `undefined`

The parsed environment variables.
