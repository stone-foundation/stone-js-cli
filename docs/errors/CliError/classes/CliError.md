[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [errors/CliError](../README.md) / CliError

# Class: CliError

Represents an error specific to the Stone CLI.

Extends `RuntimeError` to provide a custom error type for handling CLI-related issues.

## Extends

- `RuntimeError`

## Constructors

### new CliError()

> **new CliError**(`message`, `options`?): [`CliError`](CliError.md)

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

#### Defined in

[src/errors/CliError.ts:15](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/errors/CliError.ts#L15)
