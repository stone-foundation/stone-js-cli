[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [utils](../README.md) / processThroughPipeline

# Function: processThroughPipeline()

> **processThroughPipeline**\<`TContext`\>(`context`, `middleware`): `Promise`\<`void`\>

Defined in: [cli/src/utils.ts:230](https://github.com/stonemjs/cli/blob/f877eea0c25a2644820eb8dfcb0babef674d570d/src/utils.ts#L230)

Processes a context object through a pipeline of middleware.

## Type Parameters

• **TContext** *extends* `Passable`

The type of the context object that extends `Passable`.

## Parameters

### context

`TContext`

The context object to process through the pipeline.

### middleware

`MixedPipe`[]

An array of middleware functions (pipes) to process the context.

## Returns

`Promise`\<`void`\>

A promise that resolves once the context has been processed by all middleware.
