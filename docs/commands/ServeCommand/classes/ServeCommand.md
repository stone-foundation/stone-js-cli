[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/ServeCommand](../README.md) / ServeCommand

# Class: ServeCommand

## Constructors

### new ServeCommand()

> **new ServeCommand**(`container`): [`ServeCommand`](ServeCommand.md)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

The service container to manage dependencies.

###### blueprint

`IBlueprint`

###### commandOutput

`CommandOutput`

#### Returns

[`ServeCommand`](ServeCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

#### Defined in

[commands/ServeCommand.ts:39](https://github.com/stonemjs/cli/blob/b2251afafa869f82f017c134bddb19013c7883b6/src/commands/ServeCommand.ts#L39)

## Methods

### handle()

> **handle**(`_event`): `Promise`\<`OutgoingResponse`\>

Handle the incoming event.

#### Parameters

##### \_event

`IncomingEvent`

#### Returns

`Promise`\<`OutgoingResponse`\>

#### Defined in

[commands/ServeCommand.ts:49](https://github.com/stonemjs/cli/blob/b2251afafa869f82f017c134bddb19013c7883b6/src/commands/ServeCommand.ts#L49)
