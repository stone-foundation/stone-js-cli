[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [options/BuilderConfig](../README.md) / InputConfig

# Interface: InputConfig

Defined in: [cli/src/options/BuilderConfig.ts:11](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/options/BuilderConfig.ts#L11)

Configuration for automatically loading modules during buildtime.

Specifies glob patterns to identify modules for transpilation.

## Properties

### all?

> `optional` **all**: `string`

Defined in: [cli/src/options/BuilderConfig.ts:15](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/options/BuilderConfig.ts#L15)

The input path pattern for the entire application.

***

### app?

> `optional` **app**: `string`

Defined in: [cli/src/options/BuilderConfig.ts:22](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/options/BuilderConfig.ts#L22)

The input path pattern for the application modules expect views.
We need to separate the rest of the application modules from the views
For the lazy loading of views.

***

### mainCSS?

> `optional` **mainCSS**: `string`

Defined in: [cli/src/options/BuilderConfig.ts:34](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/options/BuilderConfig.ts#L34)

The input path for the application Main CSS stylesheet.

***

### views?

> `optional` **views**: `string`

Defined in: [cli/src/options/BuilderConfig.ts:29](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/options/BuilderConfig.ts#L29)

The input path pattern for only the application views.
We need to separate views from the rest of the application modules
For the lazy loading of views.
