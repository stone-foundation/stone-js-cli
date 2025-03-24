[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/InitCommand](../README.md) / InitCommand

# Class: InitCommand

Defined in: [cli/src/commands/InitCommand.ts:40](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/commands/InitCommand.ts#L40)

The init command class.

## Constructors

### new InitCommand()

> **new InitCommand**(`context`): [`InitCommand`](InitCommand.md)

Defined in: [cli/src/commands/InitCommand.ts:46](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/commands/InitCommand.ts#L46)

Create a new instance of CoreServiceProvider.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

[`InitCommand`](InitCommand.md)

## Methods

### handle()

> **handle**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/commands/InitCommand.ts:51](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/commands/InitCommand.ts#L51)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

#### Returns

`Promise`\<`void`\>
