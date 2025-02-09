[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/CustomCommand](../README.md) / CustomCommand

# Class: CustomCommand

Defined in: [cli/src/commands/CustomCommand.ts:15](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/CustomCommand.ts#L15)

## Constructors

### new CustomCommand()

> **new CustomCommand**(`container`): [`CustomCommand`](CustomCommand.md)

Defined in: [cli/src/commands/CustomCommand.ts:37](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/CustomCommand.ts#L37)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

[`BuildAppContext`](../../../middleware/buildMiddleware/interfaces/BuildAppContext.md)

The service container to manage dependencies.

#### Returns

[`CustomCommand`](CustomCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

## Methods

### handle()

> **handle**(`_event`): `Promise`\<`OutgoingResponse`\>

Defined in: [cli/src/commands/CustomCommand.ts:53](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/CustomCommand.ts#L53)

Handle the incoming event.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`OutgoingResponse`\>

The blueprint.
