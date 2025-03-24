[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [middleware/EnsureStoneProjectMiddleware](../README.md) / EnsureStoneProjectMiddleware

# Class: EnsureStoneProjectMiddleware\<IncomingEventType, OutgoingResponseType\>

Defined in: [cli/src/middleware/EnsureStoneProjectMiddleware.ts:13](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/middleware/EnsureStoneProjectMiddleware.ts#L13)

Middleware to ensure the current directory is a Stone project.

## Type Parameters

• **IncomingEventType** *extends* `IncomingEvent`

• **OutgoingResponseType** *extends* `OutgoingResponse`

## Constructors

### new EnsureStoneProjectMiddleware()

> **new EnsureStoneProjectMiddleware**\<`IncomingEventType`, `OutgoingResponseType`\>(): [`EnsureStoneProjectMiddleware`](EnsureStoneProjectMiddleware.md)\<`IncomingEventType`, `OutgoingResponseType`\>

#### Returns

[`EnsureStoneProjectMiddleware`](EnsureStoneProjectMiddleware.md)\<`IncomingEventType`, `OutgoingResponseType`\>

## Methods

### handle()

> **handle**(`event`, `next`): `Promise`\<`OutgoingResponseType`\>

Defined in: [cli/src/middleware/EnsureStoneProjectMiddleware.ts:26](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/middleware/EnsureStoneProjectMiddleware.ts#L26)

Handles the incoming event, processes it, and invokes the next middleware in the pipeline.

#### Parameters

##### event

`IncomingEventType`

The incoming event.

##### next

`NextPipe`\<`IncomingEventType`, `OutgoingResponseType`\>

The next middleware in the pipeline.

#### Returns

`Promise`\<`OutgoingResponseType`\>

A promise that resolves to the outgoing response after processing.

#### Throws

If no router or event handler is provided.
