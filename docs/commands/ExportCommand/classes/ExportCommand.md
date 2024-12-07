[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/ExportCommand](../README.md) / ExportCommand

# Class: ExportCommand

## Constructors

### new ExportCommand()

> **new ExportCommand**(`container`): [`ExportCommand`](ExportCommand.md)

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

#### Defined in

[commands/ExportCommand.ts:49](https://github.com/stonemjs/cli/blob/b2251afafa869f82f017c134bddb19013c7883b6/src/commands/ExportCommand.ts#L49)

## Methods

### handle()

> **handle**(`event`): `Promise`\<`OutgoingResponse`\>

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

#### Returns

`Promise`\<`OutgoingResponse`\>

#### Defined in

[commands/ExportCommand.ts:59](https://github.com/stonemjs/cli/blob/b2251afafa869f82f017c134bddb19013c7883b6/src/commands/ExportCommand.ts#L59)
