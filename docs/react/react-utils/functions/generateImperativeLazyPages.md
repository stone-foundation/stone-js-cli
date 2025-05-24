[**CLI Documentation**](../../../README.md)

***

[CLI Documentation](../../../README.md) / [react/react-utils](../README.md) / generateImperativeLazyPages

# Function: generateImperativeLazyPages()

> **generateImperativeLazyPages**(`module`, `path`, `key`): `object`

Defined in: [cli/src/react/react-utils.ts:168](https://github.com/stonemjs/cli/blob/df49bf1f270a78a61946870e36ae0b10d02482b3/src/react/react-utils.ts#L168)

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

### definitions

> **definitions**: `PageRouteDefinition`\<`IIncomingEvent`, `unknown`\>[]

### errorPages

> **errorPages**: `Record`\<`string`, `MetaErrorPage`\<`ReactIncomingEvent`, `unknown`\>\>

### exported

> **exported**: `string`

### layouts

> **layouts**: `Record`\<`string`, `MetaPageLayout`\>
