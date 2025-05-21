[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [commands/ServeCommand](../README.md) / ServeCommand

# Class: ServeCommand

Defined in: [cli/src/commands/ServeCommand.ts:40](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/commands/ServeCommand.ts#L40)

The serve command class.

## Constructors

### Constructor

> **new ServeCommand**(`context`): `ServeCommand`

Defined in: [cli/src/commands/ServeCommand.ts:48](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/commands/ServeCommand.ts#L48)

Create a new instance of ServeCommand.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

`ServeCommand`

## Methods

### handle()

> **handle**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/commands/ServeCommand.ts:57](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/commands/ServeCommand.ts#L57)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>
