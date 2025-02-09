[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/CacheCommand](../README.md) / CacheCommand

# Class: CacheCommand

Defined in: [cli/src/commands/CacheCommand.ts:25](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/CacheCommand.ts#L25)

## Constructors

### new CacheCommand()

> **new CacheCommand**(`container`): [`CacheCommand`](CacheCommand.md)

Defined in: [cli/src/commands/CacheCommand.ts:37](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/CacheCommand.ts#L37)

Create a new instance of CoreServiceProvider.

#### Parameters

##### container

The service container to manage dependencies.

###### commandOutput

`CommandOutput`

#### Returns

[`CacheCommand`](CacheCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

## Methods

### handle()

> **handle**(`event`): `OutgoingResponse`

Defined in: [cli/src/commands/CacheCommand.ts:46](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/commands/CacheCommand.ts#L46)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

#### Returns

`OutgoingResponse`
