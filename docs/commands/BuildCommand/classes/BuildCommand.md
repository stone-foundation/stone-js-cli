[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [commands/BuildCommand](../README.md) / BuildCommand

# Class: BuildCommand

Defined in: [cli/src/commands/BuildCommand.ts:43](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/commands/BuildCommand.ts#L43)

The build command class.

## Constructors

### Constructor

> **new BuildCommand**(`context`): `BuildCommand`

Defined in: [cli/src/commands/BuildCommand.ts:49](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/commands/BuildCommand.ts#L49)

Create a new instance of BuildCommand.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

`BuildCommand`

## Methods

### handle()

> **handle**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/commands/BuildCommand.ts:56](https://github.com/stonemjs/cli/blob/f139573d7f6e29779d41fb031ed261bfcad59d09/src/commands/BuildCommand.ts#L56)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

#### Returns

`Promise`\<`void`\>

The blueprint.
