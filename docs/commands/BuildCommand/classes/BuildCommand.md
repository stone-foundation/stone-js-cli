[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [commands/BuildCommand](../README.md) / BuildCommand

# Class: BuildCommand

Defined in: [cli/src/commands/BuildCommand.ts:43](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/commands/BuildCommand.ts#L43)

The build command class.

## Constructors

### new BuildCommand()

> **new BuildCommand**(`context`): [`BuildCommand`](BuildCommand.md)

Defined in: [cli/src/commands/BuildCommand.ts:49](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/commands/BuildCommand.ts#L49)

Create a new instance of BuildCommand.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

[`BuildCommand`](BuildCommand.md)

## Methods

### handle()

> **handle**(`event`): `Promise`\<`void`\>

Defined in: [cli/src/commands/BuildCommand.ts:56](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/commands/BuildCommand.ts#L56)

Handle the incoming event.

#### Parameters

##### event

`IncomingEvent`

#### Returns

`Promise`\<`void`\>

The blueprint.
