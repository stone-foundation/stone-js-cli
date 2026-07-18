# Function: findStarter()

```ts
function findStarter(
   value, 
   providers, 
context): Promise<Starter | undefined>;
```

Finds a starter by its value across all providers.

## Parameters

### value

`string`

The starter id.

### providers

[`StarterProvider`](../interfaces/StarterProvider.md)[]

The providers to search.

### context

[`StarterListContext`](../interfaces/StarterListContext.md)

The listing context.

## Returns

`Promise`\<[`Starter`](../interfaces/Starter.md) \| `undefined`\>

The matching starter, or `undefined`.
