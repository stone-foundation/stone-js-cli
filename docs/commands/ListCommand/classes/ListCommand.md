[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [commands/ListCommand](../README.md) / ListCommand

# Class: ListCommand

Defined in: [cli/src/commands/ListCommand.ts:24](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/commands/ListCommand.ts#L24)

The list command class.

## Constructors

### Constructor

> **new ListCommand**(`context`): `ListCommand`

Defined in: [cli/src/commands/ListCommand.ts:32](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/commands/ListCommand.ts#L32)

Create a new instance of ListCommand.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

`ListCommand`

## Methods

### handle()

> **handle**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/commands/ListCommand.ts:42](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/commands/ListCommand.ts#L42)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

The blueprint.
