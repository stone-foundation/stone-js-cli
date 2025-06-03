[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [commands/CustomCommand](../README.md) / CustomCommand

# Class: CustomCommand

Defined in: [cli/src/commands/CustomCommand.ts:23](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/commands/CustomCommand.ts#L23)

The custom command class.

## Constructors

### Constructor

> **new CustomCommand**(`context`): `CustomCommand`

Defined in: [cli/src/commands/CustomCommand.ts:31](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/commands/CustomCommand.ts#L31)

Create a new instance of CustomCommand.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

`CustomCommand`

## Methods

### handle()

> **handle**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/commands/CustomCommand.ts:41](https://github.com/stonemjs/cli/blob/83156d7f07cad6e0545ad29ba32878fdd248ede2/src/commands/CustomCommand.ts#L41)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

The blueprint.
