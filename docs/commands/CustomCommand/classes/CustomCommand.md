[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/CustomCommand](../README.md) / CustomCommand

# Class: CustomCommand

## Constructors

### new CustomCommand()

> **new CustomCommand**(`container`): [`CustomCommand`](CustomCommand.md)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

The service container to manage dependencies.

###### blueprint

`IBlueprint`

#### Returns

[`CustomCommand`](CustomCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

#### Defined in

commands/CustomCommand.ts:29

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

commands/CustomCommand.ts:41
