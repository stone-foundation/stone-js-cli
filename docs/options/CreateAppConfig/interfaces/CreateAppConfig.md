# Interface: CreateAppConfig

Configuration for creating a new Stone.js Application.
Used internally by the `init` command.

## Properties

### destDir?

```ts
optional destDir?: string;
```

***

### initGit

```ts
initGit: boolean;
```

***

### linting

```ts
linting: string;
```

***

### modules

```ts
modules: string[];
```

***

### overwrite

```ts
overwrite: boolean;
```

***

### packageJson?

```ts
optional packageJson?: PackageJson;
```

***

### packageManager

```ts
packageManager: string;
```

***

### projectName

```ts
projectName: string;
```

***

### srcDir?

```ts
optional srcDir?: string;
```

***

### starters?

```ts
optional starters?: StarterProvider[];
```

Registered starter providers (the plugin seam). Defaults to the official provider when
empty. Third-party packages export a [StarterProvider](../../../create/StarterContract/interfaces/StarterProvider.md) and add it here to make
their starters available in the CLI — no CLI change required.

***

### startersRepo

```ts
startersRepo: string;
```

***

### template

```ts
template: string;
```

***

### testing

```ts
testing: string;
```

***

### typing

```ts
typing: string;
```
