[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/ListCommand](../README.md) / ListCommand

# Class: ListCommand

Defined in: [cli/src/commands/ListCommand.ts:16](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/ListCommand.ts#L16)

## Constructors

### new ListCommand()

> **new ListCommand**(`container`): [`ListCommand`](ListCommand.md)

Defined in: [cli/src/commands/ListCommand.ts:38](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/ListCommand.ts#L38)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

[`BuildAppContext`](../../../middleware/buildMiddleware/interfaces/BuildAppContext.md)

The service container to manage dependencies.

#### Returns

[`ListCommand`](ListCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

## Methods

### handle()

> **handle**(`_event`): `Promise`\<`OutgoingResponse`\>

Defined in: [cli/src/commands/ListCommand.ts:54](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/ListCommand.ts#L54)

Handle the incoming event.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`OutgoingResponse`\>

The blueprint.
