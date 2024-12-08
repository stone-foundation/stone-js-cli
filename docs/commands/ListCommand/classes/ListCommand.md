[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/ListCommand](../README.md) / ListCommand

# Class: ListCommand

## Constructors

### new ListCommand()

> **new ListCommand**(`container`): [`ListCommand`](ListCommand.md)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

The service container to manage dependencies.

###### blueprint

`IBlueprint`

#### Returns

[`ListCommand`](ListCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

#### Defined in

[src/commands/ListCommand.ts:26](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/commands/ListCommand.ts#L26)

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

[src/commands/ListCommand.ts:38](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/commands/ListCommand.ts#L38)
