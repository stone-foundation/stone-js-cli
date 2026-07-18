# Function: listStarters()

```ts
function listStarters(providers, context): Promise<Starter[]>;
```

Flattens all starters from all providers.

## Parameters

### providers

[`StarterProvider`](../interfaces/StarterProvider.md)[]

The providers to list from.

### context

[`StarterListContext`](../interfaces/StarterListContext.md)

The listing context (format + blueprint).

## Returns

`Promise`\<[`Starter`](../interfaces/Starter.md)[]\>

The aggregated starters.
