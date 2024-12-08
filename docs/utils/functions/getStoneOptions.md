[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / getStoneOptions

# Function: getStoneOptions()

> **getStoneOptions**(`throwException`): `Promise`\<`Partial`\<[`StoneCliAppConfig`](../../options/StoneCliBlueprint/interfaces/StoneCliAppConfig.md)\>\>

Asynchronously retrieves the Stone configuration options from the specified configuration files.

This function attempts to import the configuration from either `stone.config.mjs` or `stone.config.js`
located at the root of the application. If neither file is found and `throwException` is set to `true`,
a `TypeError` is thrown.

## Parameters

### throwException

`boolean` = `true`

A boolean flag indicating whether to throw an exception if the configuration file is not found. Defaults to `true`.

## Returns

`Promise`\<`Partial`\<[`StoneCliAppConfig`](../../options/StoneCliBlueprint/interfaces/StoneCliAppConfig.md)\>\>

A promise that resolves to the configuration options if found, or `null` if not found and `throwException` is `false`.

## Throws

If the configuration file is not found and `throwException` is `true`.

## Defined in

[src/utils.ts:276](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/utils.ts#L276)
