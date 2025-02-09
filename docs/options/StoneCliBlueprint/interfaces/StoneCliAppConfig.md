[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [options/StoneCliBlueprint](../README.md) / StoneCliAppConfig

# Interface: StoneCliAppConfig

Defined in: [cli/src/options/StoneCliBlueprint.ts:20](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/options/StoneCliBlueprint.ts#L20)

App Config configuration for the Stone CLI application.

## Extends

- `Partial`\<`AppConfig`\<`IncomingEvent`, `OutgoingResponse`\>\>

## Properties

### adapter

> **adapter**: `Partial`\<`NodeCliAdapterConfig`\>

Defined in: [cli/src/options/StoneCliBlueprint.ts:39](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/options/StoneCliBlueprint.ts#L39)

Configuration for the Node CLI adapter.

#### Overrides

`Partial.adapter`

***

### adapters?

> `optional` **adapters**: `AdapterConfig`[]

Defined in: core/dist/index.d.ts:495

Adapter configurations for the application.

#### Inherited from

`Partial.adapters`

***

### aliases?

> `optional` **aliases**: `Record`\<`string`, `unknown`\>

Defined in: core/dist/index.d.ts:526

Class aliases to be registered when the application starts.
These aliases provide shorthand references to commonly used classes.

#### Inherited from

`Partial.aliases`

***

### autoload

> **autoload**: [`AutoloadConfig`](../../AutoloadConfig/interfaces/AutoloadConfig.md)

Defined in: [cli/src/options/StoneCliBlueprint.ts:29](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/options/StoneCliBlueprint.ts#L29)

Module autoloading configuration.

***

### builder?

> `optional` **builder**: `BuilderConfig`

Defined in: core/dist/index.d.ts:486

Configuration options for building the application, including middleware and pipe priorities.

#### Inherited from

`Partial.builder`

***

### createApp

> **createApp**: [`CreateAppConfig`](../../CreateAppConfig/interfaces/CreateAppConfig.md)

Defined in: [cli/src/options/StoneCliBlueprint.ts:34](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/options/StoneCliBlueprint.ts#L34)

Create app configuration

***

### debug?

> `optional` **debug**: `boolean`

Defined in: core/dist/index.d.ts:470

Determines if the application is in debug mode.
When enabled, detailed error messages with stack traces will be shown.

#### Inherited from

`Partial.debug`

***

### dotenv

> **dotenv**: [`DotenvConfig`](../../DotenvConfig/interfaces/DotenvConfig.md)

Defined in: [cli/src/options/StoneCliBlueprint.ts:24](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/options/StoneCliBlueprint.ts#L24)

Environment variable management configuration.

***

### env?

> `optional` **env**: `Environment`

Defined in: core/dist/index.d.ts:465

The current environment in which the application is running.
Possible values are development, production, and test.

#### Inherited from

`Partial.env`

***

### fallback\_locale?

> `optional` **fallback\_locale**: `string`

Defined in: core/dist/index.d.ts:482

The fallback locale used when a translation for the default locale is unavailable.

#### Inherited from

`Partial.fallback_locale`

***

### handler?

> `optional` **handler**: `EventHandler`\<`IncomingEvent`, `OutgoingResponse`\>

Defined in: core/dist/index.d.ts:536

The entry point or handler function for the application.
This is the main function that handles incoming requests.

#### Inherited from

`Partial.handler`

***

### kernel?

> `optional` **kernel**: `KernelConfig`

Defined in: core/dist/index.d.ts:499

Global middleware settings for the application kernel.

#### Inherited from

`Partial.kernel`

***

### listeners?

> `optional` **listeners**: `Record`\<`string`, (...`args`) => `IListener`[]\>

Defined in: core/dist/index.d.ts:512

Event listeners to be automatically registered when the application starts.
This allows you to specify functions to listen for specific events.

#### Inherited from

`Partial.listeners`

***

### locale?

> `optional` **locale**: `string`

Defined in: core/dist/index.d.ts:478

The default locale for the application.

#### Inherited from

`Partial.locale`

***

### logger?

> `optional` **logger**: `LoggerConfig`

Defined in: core/dist/index.d.ts:503

Logging settings, including the logger instance and error reporting configurations.

#### Inherited from

`Partial.logger`

***

### name?

> `optional` **name**: `string`

Defined in: core/dist/index.d.ts:460

The name of the application.

#### Inherited from

`Partial.name`

***

### providers?

> `optional` **providers**: (...`args`) => `IProvider`[]

Defined in: core/dist/index.d.ts:521

Service providers to be automatically loaded for each request to the application.

#### Parameters

##### args

...`any`[]

#### Returns

`IProvider`

#### Inherited from

`Partial.providers`

***

### secret?

> `optional` **secret**: `string`

Defined in: core/dist/index.d.ts:531

A secret key used for encryption purposes throughout the application.
This key should be kept secure.

#### Inherited from

`Partial.secret`

***

### services?

> `optional` **services**: `Function`[] \| `Function`[][]

Defined in: core/dist/index.d.ts:507

Services to be automatically registered when the application starts.

#### Inherited from

`Partial.services`

***

### subscribers?

> `optional` **subscribers**: (...`args`) => `ISubscriber`[]

Defined in: core/dist/index.d.ts:517

Subscribers to be automatically registered when the application starts.
Subscribers are used for handling and responding to events.

#### Parameters

##### args

...`any`[]

#### Returns

`ISubscriber`

#### Inherited from

`Partial.subscribers`

***

### timezone?

> `optional` **timezone**: `string`

Defined in: core/dist/index.d.ts:474

The default timezone for the application.

#### Inherited from

`Partial.timezone`
