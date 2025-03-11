[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [server/ServerBuilder](../README.md) / ServerBuilder

# Class: ServerBuilder

Defined in: cli/src/server/ServerBuilder.ts:17

The Server builder class.

## Constructors

### new ServerBuilder()

> **new ServerBuilder**(`context`): [`ServerBuilder`](ServerBuilder.md)

Defined in: cli/src/server/ServerBuilder.ts:23

Creates a new Server builder instance.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

[`ServerBuilder`](ServerBuilder.md)

## Methods

### build()

> **build**(`_event`): `Promise`\<`void`\>

Defined in: cli/src/server/ServerBuilder.ts:30

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

Defined in: cli/src/server/ServerBuilder.ts:61

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

Defined in: cli/src/server/ServerBuilder.ts:40

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

Defined in: cli/src/server/ServerBuilder.ts:70

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

Defined in: cli/src/server/ServerBuilder.ts:50

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

Defined in: cli/src/server/ServerBuilder.ts:94

Server Files watcher.

#### Parameters

##### cb

() => `void` \| `Promise`\<`void`\>

The callback function.

#### Returns

`void`
