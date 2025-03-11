[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [options/AutoloadConfig](../README.md) / AutoloadConfig

# Interface: AutoloadConfig

Defined in: [cli/src/options/AutoloadConfig.ts:6](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/options/AutoloadConfig.ts#L6)

Configuration for automatically loading modules during buildtime.

Specifies glob patterns to identify modules for transpilation.

## Properties

### modules

> **modules**: `Record`\<`string`, `string`\>

Defined in: [cli/src/options/AutoloadConfig.ts:18](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/options/AutoloadConfig.ts#L18)

Glob patterns for autoloading modules.
Keys represent module categories, and values are glob patterns to match files.

***

### type

> **type**: `"typescript"` \| `"javascript"`

Defined in: [cli/src/options/AutoloadConfig.ts:12](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/options/AutoloadConfig.ts#L12)

The type of modules to autoload.
- `typescript`: Autoload TypeScript modules.
- `javascript`: Autoload JavaScript modules.
