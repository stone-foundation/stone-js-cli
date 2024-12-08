[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [options/StoneCliBlueprint](../README.md) / StoneCliAppConfig

# Interface: StoneCliAppConfig

App Config configuration for the Stone CLI application.

## Extends

- `Partial`\<`AppConfig`\<`IncomingEvent`, `OutgoingResponse`\>\>

## Properties

### adapter

> **adapter**: `Partial`\<`NodeCliAdapterConfig`\>

Configuration for the Node CLI adapter.

#### Overrides

`Partial.adapter`

#### Defined in

[src/options/StoneCliBlueprint.ts:32](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/options/StoneCliBlueprint.ts#L32)

***

### autoload

> **autoload**: [`AutoloadConfig`](../../AutoloadConfig/interfaces/AutoloadConfig.md)

Module autoloading configuration.

#### Defined in

[src/options/StoneCliBlueprint.ts:27](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/options/StoneCliBlueprint.ts#L27)

***

### dotenv

> **dotenv**: [`DotenvConfig`](../../DotenvConfig/interfaces/DotenvConfig.md)

Environment variable management configuration.

#### Defined in

[src/options/StoneCliBlueprint.ts:22](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/options/StoneCliBlueprint.ts#L22)
