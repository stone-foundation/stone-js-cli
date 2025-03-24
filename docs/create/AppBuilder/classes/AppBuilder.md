[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [create/AppBuilder](../README.md) / AppBuilder

# Class: AppBuilder

Defined in: [cli/src/create/AppBuilder.ts:17](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/create/AppBuilder.ts#L17)

The App builder class.

## Constructors

### new AppBuilder()

> **new AppBuilder**(`context`): [`AppBuilder`](AppBuilder.md)

Defined in: [cli/src/create/AppBuilder.ts:23](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/create/AppBuilder.ts#L23)

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

Defined in: [cli/src/create/AppBuilder.ts:30](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/create/AppBuilder.ts#L30)

Builds the application.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>
