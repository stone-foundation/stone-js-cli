[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/TypingsCommand](../README.md) / TypingsCommand

# Class: TypingsCommand

## Constructors

### new TypingsCommand()

> **new TypingsCommand**(`container`): [`TypingsCommand`](TypingsCommand.md)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

The service container to manage dependencies.

###### blueprint

`IBlueprint`

#### Returns

[`TypingsCommand`](TypingsCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

#### Defined in

[commands/TypingsCommand.ts:35](https://github.com/stonemjs/cli/blob/b2251afafa869f82f017c134bddb19013c7883b6/src/commands/TypingsCommand.ts#L35)

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

[commands/TypingsCommand.ts:44](https://github.com/stonemjs/cli/blob/b2251afafa869f82f017c134bddb19013c7883b6/src/commands/TypingsCommand.ts#L44)
