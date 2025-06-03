[**CLI Documentation**](../../README.md)

***

[CLI Documentation](../../README.md) / [utils](../README.md) / getEnvVariables

# Function: getEnvVariables()

> **getEnvVariables**(`options`): `undefined` \| `Record`\<`string`, `string`\>

Defined in: [cli/src/utils.ts:89](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/utils.ts#L89)

Get the env variables in .env file using the Dotenv package.

## Parameters

### options

`Partial`\<[`DotenvOptions`](../../options/DotenvConfig/interfaces/DotenvOptions.md)\>

The options for loading environment variables.

## Returns

`undefined` \| `Record`\<`string`, `string`\>

The parsed environment variables.
