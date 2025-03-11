[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [create/AppBuilder](../README.md) / AppBuilder

# Class: AppBuilder

Defined in: cli/src/create/AppBuilder.ts:17

The App builder class.

## Constructors

### new AppBuilder()

> **new AppBuilder**(`context`): [`AppBuilder`](AppBuilder.md)

Defined in: cli/src/create/AppBuilder.ts:23

Creates a new App builder instance.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

[`AppBuilder`](AppBuilder.md)

## Methods

### build()

> **build**(`event`): `Promise`\<`void`\>

Defined in: cli/src/create/AppBuilder.ts:30

Builds the application.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>
