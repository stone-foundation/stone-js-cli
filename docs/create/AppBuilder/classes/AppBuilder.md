[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [create/AppBuilder](../README.md) / AppBuilder

# Class: AppBuilder

Defined in: [cli/src/create/AppBuilder.ts:17](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/create/AppBuilder.ts#L17)

The App builder class.

## Constructors

### Constructor

> **new AppBuilder**(`context`): `AppBuilder`

Defined in: [cli/src/create/AppBuilder.ts:23](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/create/AppBuilder.ts#L23)

Creates a new App builder instance.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

`AppBuilder`

## Methods

### build()

> **build**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/create/AppBuilder.ts:30](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/create/AppBuilder.ts#L30)

Builds the application.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>
