[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [errors/CliError](../README.md) / CliError

# Class: CliError

Defined in: [cli/src/errors/CliError.ts:8](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/errors/CliError.ts#L8)

Represents an error specific to the Stone CLI.

Extends `RuntimeError` to provide a custom error type for handling CLI-related issues.

## Extends

- `RuntimeError`

## Constructors

### new CliError()

> **new CliError**(`message`, `options`?): [`CliError`](CliError.md)

Defined in: [cli/src/errors/CliError.ts:15](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/errors/CliError.ts#L15)

Creates a new instance of `CliError`.

#### Parameters

##### message

`string`

The error message describing the issue.

##### options?

`ErrorOptions`

Optional additional error options.

#### Returns

[`CliError`](CliError.md)

#### Overrides

`RuntimeError.constructor`

## Properties

### cause?

> `readonly` `optional` **cause**: `Error`

Defined in: core/dist/index.d.ts:2502

#### Inherited from

`RuntimeError.cause`

***

### code?

> `readonly` `optional` **code**: `string`

Defined in: core/dist/index.d.ts:2501

#### Inherited from

`RuntimeError.code`

***

### metadata?

> `readonly` `optional` **metadata**: `unknown`

Defined in: core/dist/index.d.ts:2503

#### Inherited from

`RuntimeError.metadata`

## Methods

### toString()

> **toString**(`multiline`?): `string`

Defined in: core/dist/index.d.ts:2524

Converts the error to a formatted string representation.

#### Parameters

##### multiline?

`boolean`

Determine if output value must be multiline or not.

#### Returns

`string`

A formatted error string.

#### Inherited from

`RuntimeError.toString`

***

### create()

> `static` **create**\<`T`\>(`message`, `options`?): `T`

Defined in: core/dist/index.d.ts:2510

Create a RuntimeError.

#### Type Parameters

• **T** *extends* `RuntimeError` = `RuntimeError`

#### Parameters

##### message

`string`

##### options?

`ErrorOptions`

The options to create a RuntimeError.

#### Returns

`T`

A new RuntimeError instance.

#### Inherited from

`RuntimeError.create`
