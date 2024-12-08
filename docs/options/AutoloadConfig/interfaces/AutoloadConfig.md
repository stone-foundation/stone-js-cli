[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [options/AutoloadConfig](../README.md) / AutoloadConfig

# Interface: AutoloadConfig

Configuration for automatically loading modules during buildtime.

Specifies glob patterns to identify modules for transpilation.

## Properties

### modules

> **modules**: `Record`\<`string`, `string`\>

Glob patterns for autoloading modules.
Keys represent module categories, and values are glob patterns to match files.

#### Defined in

[src/options/AutoloadConfig.ts:11](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/options/AutoloadConfig.ts#L11)
