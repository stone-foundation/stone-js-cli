# Function: resolveStarterProviders()

```ts
function resolveStarterProviders(blueprint): StarterProvider[];
```

Resolves the registered starter providers from the blueprint.

Defaults to the official provider; user/third-party providers declared under
`stone.createApp.starters` are used as-is (they may include the official one or not).

## Parameters

### blueprint

`IBlueprint`

The application blueprint.

## Returns

[`StarterProvider`](../interfaces/StarterProvider.md)[]

The list of providers.
