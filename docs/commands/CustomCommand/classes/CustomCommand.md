[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/CustomCommand](../README.md) / CustomCommand

# Class: CustomCommand

Defined in: [cli/src/commands/CustomCommand.ts:23](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/commands/CustomCommand.ts#L23)

The custom command class.

## Constructors

### new CustomCommand()

> **new CustomCommand**(`context`): [`CustomCommand`](CustomCommand.md)

Defined in: [cli/src/commands/CustomCommand.ts:31](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/commands/CustomCommand.ts#L31)

Create a new instance of CustomCommand.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

[`CustomCommand`](CustomCommand.md)

## Methods

### handle()

> **handle**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/commands/CustomCommand.ts:41](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/commands/CustomCommand.ts#L41)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

The blueprint.
