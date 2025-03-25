[**CLI Documentation**](../../README.md)

***

[CLI Documentation](../../README.md) / [ConsoleErrorHandler](../README.md) / ConsoleErrorHandler

# Class: ConsoleErrorHandler

Defined in: cli/src/ConsoleErrorHandler.ts:10

Class representing an ConsoleErrorHandler.

Kernel level error handler for CLI applications.

## Implements

- `IErrorHandler`\<`IncomingEvent`\>

## Constructors

### Constructor

> **new ConsoleErrorHandler**(`context`): `ConsoleErrorHandler`

Defined in: cli/src/ConsoleErrorHandler.ts:16

Create an ConsoleErrorHandler.

#### Parameters

##### context

[`ConsoleContext`](../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

`ConsoleErrorHandler`

## Methods

### handle()

> **handle**(`error`): `OutgoingResponse`

Defined in: cli/src/ConsoleErrorHandler.ts:24

Handle an error.

#### Parameters

##### error

[`CliError`](../../errors/CliError/classes/CliError.md)

The error to handle.

#### Returns

`OutgoingResponse`

The outgoing http response.

#### Implementation of

`IErrorHandler.handle`
