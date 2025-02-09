[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/ExportCommand](../README.md) / ExportCommand

# Class: ExportCommand

Defined in: [cli/src/commands/ExportCommand.ts:32](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/ExportCommand.ts#L32)

## Constructors

### new ExportCommand()

> **new ExportCommand**(`container`): [`ExportCommand`](ExportCommand.md)

Defined in: [cli/src/commands/ExportCommand.ts:49](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/ExportCommand.ts#L49)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

The service container to manage dependencies.

###### blueprint

`IBlueprint`

###### commandOutput

`CommandOutput`

#### Returns

[`ExportCommand`](ExportCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

## Methods

### handle()

> **handle**(`event`): `Promise`\<`OutgoingResponse`\>

Defined in: [cli/src/commands/ExportCommand.ts:60](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/ExportCommand.ts#L60)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

#### Returns

`Promise`\<`OutgoingResponse`\>
