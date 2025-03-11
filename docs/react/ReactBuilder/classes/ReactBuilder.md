[**CLI Documentation v0.0.0**](../../../README.md)

***

[CLI Documentation](../../../modules.md) / [react/ReactBuilder](../README.md) / ReactBuilder

# Class: ReactBuilder

Defined in: cli/src/react/ReactBuilder.ts:15

The React builder class.

## Constructors

### new ReactBuilder()

> **new ReactBuilder**(`context`): [`ReactBuilder`](ReactBuilder.md)

Defined in: cli/src/react/ReactBuilder.ts:24

Creates a new React builder instance.

#### Parameters

##### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

The service container to manage dependencies.

#### Returns

[`ReactBuilder`](ReactBuilder.md)

## Methods

### build()

> **build**(`event`): `Promise`\<`void`\>

Defined in: cli/src/react/ReactBuilder.ts:34

Builds the application.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### console()

> **console**(`_event`): `Promise`\<`void`\>

Defined in: cli/src/react/ReactBuilder.ts:64

Runs the application in the console.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### dev()

> **dev**(`_event`): `Promise`\<`void`\>

Defined in: cli/src/react/ReactBuilder.ts:46

Starts the development server.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### exportIndexDevHtml()

> **exportIndexDevHtml**(`event`): `Promise`\<`void`\>

Defined in: cli/src/react/ReactBuilder.ts:89

Exports the development index HTML file.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### exportIndexDevJs()

> **exportIndexDevJs**(`event`): `Promise`\<`void`\>

Defined in: cli/src/react/ReactBuilder.ts:118

Exports the development index JS file.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### exportIndexHtml()

> **exportIndexHtml**(`event`): `Promise`\<`void`\>

Defined in: cli/src/react/ReactBuilder.ts:73

Exports the application.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### exportIndexJs()

> **exportIndexJs**(`event`): `Promise`\<`void`\>

Defined in: cli/src/react/ReactBuilder.ts:105

Exports the index JS file.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### exportViteConfig()

> **exportViteConfig**(`event`): `Promise`\<`void`\>

Defined in: cli/src/react/ReactBuilder.ts:131

Exports the Vite configuration file.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### exportVitestConfig()

> **exportVitestConfig**(`event`): `Promise`\<`void`\>

Defined in: cli/src/react/ReactBuilder.ts:144

Exports the Vitest configuration file.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>

***

### preview()

> **preview**(`_event`): `Promise`\<`void`\>

Defined in: cli/src/react/ReactBuilder.ts:55

Previews the application.

#### Parameters

##### \_event

`IncomingEvent`

The incoming event.

#### Returns

`Promise`\<`void`\>
