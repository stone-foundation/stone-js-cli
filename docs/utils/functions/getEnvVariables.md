[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / getEnvVariables

# Function: getEnvVariables()

> **getEnvVariables**(`options`): `undefined` \| `Record`\<`string`, `string`\>

Defined in: [cli/src/utils.ts:75](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/utils.ts#L75)

Get the env variables in .env file using the Dotenv package.

## Parameters

### options

`Partial`\<[`DotenvOptions`](../../options/DotenvConfig/interfaces/DotenvOptions.md)\>

The options for loading environment variables.

## Returns

`undefined` \| `Record`\<`string`, `string`\>

The parsed environment variables.
