[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/ReactBuilder](../README.md) / ReactBuilder

# Class: ReactBuilder

Defined in: [cli/src/react/ReactBuilder.ts:20](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/react/ReactBuilder.ts#L20)

The React builder class.

## Constructors

### Constructor

> **new ReactBuilder**(`context`): `ReactBuilder`

Defined in: [cli/src/react/ReactBuilder.ts:26](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/react/ReactBuilder.ts#L26)

Creates a new React builder instance.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

`ReactBuilder`

## Methods

### build()

> **build**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/react/ReactBuilder.ts:33](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/react/ReactBuilder.ts#L33)

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

Defined in: [cli/src/react/ReactBuilder.ts:64](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/react/ReactBuilder.ts#L64)

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

Defined in: [cli/src/react/ReactBuilder.ts:46](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/react/ReactBuilder.ts#L46)

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

Defined in: [cli/src/react/ReactBuilder.ts:73](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/react/ReactBuilder.ts#L73)

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

Defined in: [cli/src/react/ReactBuilder.ts:55](https://github.com/stonemjs/cli/blob/a8ddb59abbd77ddb2870c689c0c7e80297d24c5a/src/react/ReactBuilder.ts#L55)

Previews the application.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>
