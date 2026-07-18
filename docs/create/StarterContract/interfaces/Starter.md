# Interface: Starter

A single, selectable starter.

## Properties

### description?

```ts
optional description?: string;
```

One-line description.

***

### disabled?

```ts
optional disabled?: boolean;
```

Whether the entry is shown but not selectable.

***

### source

```ts
source: StarterSource;
```

How to fetch the starter's files.

***

### tags?

```ts
optional tags?: string[];
```

Free-form tags used for filtering/grouping (e.g. `api`, `spa`, `ssr`, `ssg`, `react`).

***

### title

```ts
title: string;
```

Display title (may be styled with `format`).

***

### value

```ts
value: string;
```

Unique identifier (also the questionnaire answer value).
