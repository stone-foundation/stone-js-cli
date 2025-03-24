[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/ServeCommand](../README.md) / ServeCommand

# Class: ServeCommand

Defined in: [cli/src/commands/ServeCommand.ts:40](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/commands/ServeCommand.ts#L40)

The serve command class.

## Constructors

### new ServeCommand()

> **new ServeCommand**(`context`): [`ServeCommand`](ServeCommand.md)

Defined in: [cli/src/commands/ServeCommand.ts:48](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/commands/ServeCommand.ts#L48)

Create a new instance of ServeCommand.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

[`ServeCommand`](ServeCommand.md)

## Methods

### handle()

> **handle**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/commands/ServeCommand.ts:57](https://github.com/stonemjs/cli/blob/9e518a2b8256b5ebc9e0e69a80ac84eb1fb59bf9/src/commands/ServeCommand.ts#L57)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>
