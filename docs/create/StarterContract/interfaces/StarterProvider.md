# Interface: StarterProvider

A starter provider — the plugin unit.

The official `@stone-js/starters` is registered by default; anyone can publish a package
exposing a `StarterProvider` and add it to `stone.createApp.starters` to make their
starters appear in the CLI, without touching the CLI itself.

## Properties

### label?

```ts
optional label?: string;
```

Display group label (defaults to `name`).

***

### name

```ts
name: string;
```

Provider id (e.g. `@stone-js/starters`).

***

### starters

```ts
starters: 
  | Starter[]
  | ((context) => Promiseable<Starter[]>);
```

The starters, as an array or a (blueprint/format-aware) resolver.
