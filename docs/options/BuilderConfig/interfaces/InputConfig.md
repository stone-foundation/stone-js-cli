[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [options/BuilderConfig](../README.md) / InputConfig

# Interface: InputConfig

Defined in: cli/src/options/BuilderConfig.ts:11

Configuration for automatically loading modules during buildtime.

Specifies glob patterns to identify modules for transpilation.

## Properties

### all?

> `optional` **all**: `string`

Defined in: cli/src/options/BuilderConfig.ts:15

The input path pattern for the entire application.

***

### app?

> `optional` **app**: `string`

Defined in: cli/src/options/BuilderConfig.ts:22

The input path pattern for the application modules expect views.
We need to separate the rest of the application modules from the views
For the lazy loading of views.

***

### mainCSS?

> `optional` **mainCSS**: `string`

Defined in: cli/src/options/BuilderConfig.ts:34

The input path for the application Main CSS stylesheet.

***

### views?

> `optional` **views**: `string`

Defined in: cli/src/options/BuilderConfig.ts:29

The input path pattern for only the application views.
We need to separate views from the rest of the application modules
For the lazy loading of views.
