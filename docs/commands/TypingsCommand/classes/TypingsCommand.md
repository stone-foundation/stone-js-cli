[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/TypingsCommand](../README.md) / TypingsCommand

# Class: TypingsCommand

Defined in: [cli/src/commands/TypingsCommand.ts:25](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/TypingsCommand.ts#L25)

## Constructors

### new TypingsCommand()

> **new TypingsCommand**(`container`): [`TypingsCommand`](TypingsCommand.md)

Defined in: [cli/src/commands/TypingsCommand.ts:42](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/TypingsCommand.ts#L42)

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

## Methods

### handle()

> **handle**(`event`): `Promise`\<`OutgoingResponse`\>

Defined in: [cli/src/commands/TypingsCommand.ts:53](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/TypingsCommand.ts#L53)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

#### Returns

`Promise`\<`OutgoingResponse`\>
