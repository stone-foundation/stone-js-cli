[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/InitCommand](../README.md) / InitCommand

# Class: InitCommand

Defined in: [cli/src/commands/InitCommand.ts:42](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/InitCommand.ts#L42)

## Constructors

### new InitCommand()

> **new InitCommand**(`container`): [`InitCommand`](InitCommand.md)

Defined in: [cli/src/commands/InitCommand.ts:64](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/InitCommand.ts#L64)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

The service container to manage dependencies.

###### blueprint

`IBlueprint`

###### commandOutput

`CommandOutput`

###### container

[`CreateAppContext`](../interfaces/CreateAppContext.md)

#### Returns

[`InitCommand`](InitCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

## Methods

### handle()

> **handle**(`event`): `Promise`\<`OutgoingResponse`\>

Defined in: [cli/src/commands/InitCommand.ts:77](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/InitCommand.ts#L77)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

#### Returns

`Promise`\<`OutgoingResponse`\>
