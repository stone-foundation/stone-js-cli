[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/ReactBuilder](../README.md) / ReactBuilder

# Class: ReactBuilder

Defined in: [cli/src/react/ReactBuilder.ts:21](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/react/ReactBuilder.ts#L21)

The React builder class.

## Constructors

### Constructor

> **new ReactBuilder**(`context`): `ReactBuilder`

Defined in: [cli/src/react/ReactBuilder.ts:27](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/react/ReactBuilder.ts#L27)

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

Defined in: [cli/src/react/ReactBuilder.ts:34](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/react/ReactBuilder.ts#L34)

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

Defined in: [cli/src/react/ReactBuilder.ts:65](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/react/ReactBuilder.ts#L65)

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

Defined in: [cli/src/react/ReactBuilder.ts:47](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/react/ReactBuilder.ts#L47)

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

Defined in: [cli/src/react/ReactBuilder.ts:74](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/react/ReactBuilder.ts#L74)

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

Defined in: [cli/src/react/ReactBuilder.ts:56](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/react/ReactBuilder.ts#L56)

Previews the application.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>
