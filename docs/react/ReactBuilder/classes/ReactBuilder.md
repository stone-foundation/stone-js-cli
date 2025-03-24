[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [react/ReactBuilder](../README.md) / ReactBuilder

# Class: ReactBuilder

Defined in: [cli/src/react/ReactBuilder.ts:20](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/react/ReactBuilder.ts#L20)

The React builder class.

## Constructors

### new ReactBuilder()

> **new ReactBuilder**(`context`): [`ReactBuilder`](ReactBuilder.md)

Defined in: [cli/src/react/ReactBuilder.ts:26](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/react/ReactBuilder.ts#L26)

Creates a new React builder instance.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

[`ReactBuilder`](ReactBuilder.md)

## Methods

### build()

> **build**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/react/ReactBuilder.ts:33](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/react/ReactBuilder.ts#L33)

Builds the application.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### console()

> **console**(`_event`): `Promise`\<`void`\>

Defined in: [cli/src/react/ReactBuilder.ts:64](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/react/ReactBuilder.ts#L64)

Runs the application in the console.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### dev()

> **dev**(`_event`): `Promise`\<`void`\>

Defined in: [cli/src/react/ReactBuilder.ts:46](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/react/ReactBuilder.ts#L46)

Starts the development server.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### export()

> **export**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/react/ReactBuilder.ts:73](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/react/ReactBuilder.ts#L73)

Exports server files.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### preview()

> **preview**(`_event`): `Promise`\<`void`\>

Defined in: [cli/src/react/ReactBuilder.ts:55](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/react/ReactBuilder.ts#L55)

Previews the application.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>
