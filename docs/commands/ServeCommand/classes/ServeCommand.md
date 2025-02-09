[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/ServeCommand](../README.md) / ServeCommand

# Class: ServeCommand

Defined in: [cli/src/commands/ServeCommand.ts:17](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/ServeCommand.ts#L17)

## Constructors

### new ServeCommand()

> **new ServeCommand**(`container`): [`ServeCommand`](ServeCommand.md)

Defined in: [cli/src/commands/ServeCommand.ts:39](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/ServeCommand.ts#L39)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

[`BuildAppContext`](../../../middleware/buildMiddleware/interfaces/BuildAppContext.md)

The service container to manage dependencies.

#### Returns

[`ServeCommand`](ServeCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

## Methods

### handle()

> **handle**(`_event`): `Promise`\<`OutgoingResponse`\>

Defined in: [cli/src/commands/ServeCommand.ts:53](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/ServeCommand.ts#L53)

Handle the incoming event.

#### Parameters

##### \_event

`IncomingEvent`

#### Returns

`Promise`\<`OutgoingResponse`\>
