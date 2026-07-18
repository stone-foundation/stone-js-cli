# Interface: StarterMaterializeContext

Context handed to `materializeStarter` / a `custom` source resolver.

## Properties

### destDir

```ts
destDir: string;
```

Absolute destination directory for the new project.

***

### output

```ts
output: object;
```

Minimal logger for progress messages.

#### info

```ts
info: (message) => void;
```

##### Parameters

###### message

`string`

##### Returns

`void`

***

### tmpDir

```ts
tmpDir: string;
```

A scratch directory the resolver may use.
