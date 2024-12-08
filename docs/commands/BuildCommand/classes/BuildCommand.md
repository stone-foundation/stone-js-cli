[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/BuildCommand](../README.md) / BuildCommand

# Class: BuildCommand

## Constructors

### new BuildCommand()

> **new BuildCommand**(`container`): [`BuildCommand`](BuildCommand.md)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

The service container to manage dependencies.

###### blueprint

`IBlueprint`

#### Returns

[`BuildCommand`](BuildCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

#### Defined in

[src/commands/BuildCommand.ts:25](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/commands/BuildCommand.ts#L25)

## Methods

### handle()

> **handle**(`_event`): `Promise`\<`OutgoingResponse`\>

Handle the incoming event.

#### Parameters

##### \_event

`IncomingEvent`

#### Returns

`Promise`\<`OutgoingResponse`\>

The blueprint.

#### Defined in

[src/commands/BuildCommand.ts:36](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/commands/BuildCommand.ts#L36)
