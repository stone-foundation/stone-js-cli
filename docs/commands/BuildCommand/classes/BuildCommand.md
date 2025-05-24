[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [commands/BuildCommand](../README.md) / BuildCommand

# Class: BuildCommand

Defined in: [cli/src/commands/BuildCommand.ts:52](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/commands/BuildCommand.ts#L52)

The build command class.

## Constructors

### Constructor

> **new BuildCommand**(`context`): `BuildCommand`

Defined in: [cli/src/commands/BuildCommand.ts:58](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/commands/BuildCommand.ts#L58)

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

Defined in: [cli/src/commands/BuildCommand.ts:65](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/commands/BuildCommand.ts#L65)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

#### Returns

`Promise`\<`void`\>

The blueprint.
