[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [StoneCliServiceProvider](../README.md) / StoneCliServiceProvider

# Class: StoneCliServiceProvider

Stone CLI Service Provider.

## Implements

- `IProvider`

## Constructors

### new StoneCliServiceProvider()

> **new StoneCliServiceProvider**(): [`StoneCliServiceProvider`](StoneCliServiceProvider.md)

#### Returns

[`StoneCliServiceProvider`](StoneCliServiceProvider.md)

## Methods

### beforeHandle()

> **beforeHandle**(): `void`

Hook that runs before the main handler is invoked.

#### Returns

`void`

#### Implementation of

`IProvider.beforeHandle`

#### Defined in

StoneCliServiceProvider.ts:45

***

### onInit()

> `static` **onInit**(`blueprint`): `void`

Hook that runs once before everything.

#### Parameters

##### blueprint

`IBlueprint`

#### Returns

`void`

#### Defined in

StoneCliServiceProvider.ts:14
