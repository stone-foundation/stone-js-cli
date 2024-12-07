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

commands/BuildCommand.ts:26

## Methods

### handle()

> **handle**(`_event`): `Promise`\<`OutgoingResponse`\>

Handle the incoming event.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`OutgoingResponse`\>

The blueprint.

#### Defined in

commands/BuildCommand.ts:38
