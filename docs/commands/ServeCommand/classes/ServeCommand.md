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

[src/commands/ServeCommand.ts:39](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/commands/ServeCommand.ts#L39)

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

[src/commands/ServeCommand.ts:50](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/commands/ServeCommand.ts#L50)
