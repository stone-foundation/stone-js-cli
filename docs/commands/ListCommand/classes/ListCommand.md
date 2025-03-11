[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/ListCommand](../README.md) / ListCommand

# Class: ListCommand

Defined in: [cli/src/commands/ListCommand.ts:24](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/commands/ListCommand.ts#L24)

The list command class.

## Constructors

### new ListCommand()

> **new ListCommand**(`context`): [`ListCommand`](ListCommand.md)

Defined in: [cli/src/commands/ListCommand.ts:32](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/commands/ListCommand.ts#L32)

Create a new instance of ListCommand.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

[`ListCommand`](ListCommand.md)

## Methods

### handle()

> **handle**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/commands/ListCommand.ts:42](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/commands/ListCommand.ts#L42)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

The blueprint.
