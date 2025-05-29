[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/react-utils](../README.md) / generateImperativeLazyPages

# Function: generateImperativeLazyPages()

> **generateImperativeLazyPages**(`module`, `path`, `key`): `object`

Defined in: [cli/src/react/react-utils.ts:170](https://github.com/stonemjs/cli/blob/ae332002b2560de84ae3a35accc1d91282bd1543/src/react/react-utils.ts#L170)

Generates the imperative lazy pages.

## Parameters

### module

`UseReactBlueprint`

The module to generate.

### path

`string`

The path to the module.

### key

`string`

The key to use for the module.

## Returns

`object`

The generated pages.

### adapterErrorPages

> **adapterErrorPages**: `Record`\<`string`, `MetaAdapterErrorPage`\<`unknown`, `unknown`, `unknown`\>\>

### definitions

> **definitions**: `PageRouteDefinition`\<`IIncomingEvent`, `unknown`\>[]

### errorPages

> **errorPages**: `Record`\<`string`, `MetaErrorPage`\<`ReactIncomingEvent`, `unknown`\>\>

### layouts

> **layouts**: `Record`\<`string`, `MetaPageLayout`\>
