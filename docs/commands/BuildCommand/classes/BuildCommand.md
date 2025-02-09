[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/BuildCommand](../README.md) / BuildCommand

# Class: BuildCommand

Defined in: [cli/src/commands/BuildCommand.ts:13](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/BuildCommand.ts#L13)

## Constructors

### new BuildCommand()

> **new BuildCommand**(`container`): [`BuildCommand`](BuildCommand.md)

Defined in: [cli/src/commands/BuildCommand.ts:25](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/BuildCommand.ts#L25)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

[`BuildAppContext`](../../../middleware/buildMiddleware/interfaces/BuildAppContext.md)

The service container to manage dependencies.

#### Returns

[`BuildCommand`](BuildCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

## Methods

### handle()

> **handle**(`_event`): `Promise`\<`OutgoingResponse`\>

Defined in: [cli/src/commands/BuildCommand.ts:36](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/BuildCommand.ts#L36)

Handle the incoming event.

#### Parameters

##### \_event

`IncomingEvent`

#### Returns

`Promise`\<`OutgoingResponse`\>

The blueprint.
