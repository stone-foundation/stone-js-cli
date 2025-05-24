[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [server/ServerBuilder](../README.md) / ServerBuilder

# Class: ServerBuilder

Defined in: [cli/src/server/ServerBuilder.ts:18](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/server/ServerBuilder.ts#L18)

The Server builder class.

## Constructors

### Constructor

> **new ServerBuilder**(`context`): `ServerBuilder`

Defined in: [cli/src/server/ServerBuilder.ts:24](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/server/ServerBuilder.ts#L24)

Creates a new Server builder instance.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

`ServerBuilder`

## Methods

### build()

> **build**(`_event`): `Promise`\<`void`\>

Defined in: [cli/src/server/ServerBuilder.ts:31](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/server/ServerBuilder.ts#L31)

Builds the application.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### console()

> **console**(`_event`): `Promise`\<`void`\>

Defined in: [cli/src/server/ServerBuilder.ts:63](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/server/ServerBuilder.ts#L63)

Runs the application in the console.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### dev()

> **dev**(`_event`, `restart`?): `Promise`\<`void`\>

Defined in: [cli/src/server/ServerBuilder.ts:41](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/server/ServerBuilder.ts#L41)

Starts the development server.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

##### restart?

`boolean`

Whether to restart the server.

#### Returns

`Promise`\<`void`\>

***

### export()

> **export**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/server/ServerBuilder.ts:72](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/server/ServerBuilder.ts#L72)

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

Defined in: [cli/src/server/ServerBuilder.ts:51](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/server/ServerBuilder.ts#L51)

Previews the application.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### watchFiles()

> **watchFiles**(`cb`): `void`

Defined in: [cli/src/server/ServerBuilder.ts:95](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/server/ServerBuilder.ts#L95)

Server Files watcher.

#### Parameters

##### cb

() => `void` \| `Promise`\<`void`\>

The callback function.

#### Returns

`void`
