[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/CacheCommand](../README.md) / CacheCommand

# Class: CacheCommand

## Constructors

### new CacheCommand()

> **new CacheCommand**(`container`): [`CacheCommand`](CacheCommand.md)

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

#### Defined in

[src/commands/CacheCommand.ts:37](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/commands/CacheCommand.ts#L37)

## Methods

### handle()

> **handle**(`event`): `OutgoingResponse`

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

#### Returns

`OutgoingResponse`

#### Defined in

[src/commands/CacheCommand.ts:46](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/commands/CacheCommand.ts#L46)
