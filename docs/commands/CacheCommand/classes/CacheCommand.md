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

###### blueprint

`IBlueprint`

###### commandOutput

`CommandOutput`

#### Returns

[`CacheCommand`](CacheCommand.md)

#### Throws

If the Blueprint config or EventEmitter is not bound to the container.

#### Defined in

[commands/CacheCommand.ts:42](https://github.com/stonemjs/cli/blob/b2251afafa869f82f017c134bddb19013c7883b6/src/commands/CacheCommand.ts#L42)

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

[commands/CacheCommand.ts:52](https://github.com/stonemjs/cli/blob/b2251afafa869f82f017c134bddb19013c7883b6/src/commands/CacheCommand.ts#L52)
