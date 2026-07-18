# Type Alias: StarterSource

```ts
type StarterSource = 
  | {
  path?: string;
  ref?: string;
  repo: string;
  type: "git";
}
  | {
  path: string;
  type: "local";
}
  | {
  package: string;
  path?: string;
  type: "npm";
}
  | {
  resolve: (context) => Promiseable<void>;
  type: "custom";
};
```

Where the files of a starter come from.

The CLI knows how to materialise each `type`; third-party providers pick whichever fits,
or ship a `custom` resolver for anything exotic. This is the extension seam that keeps the
CLI open for new starters and closed for modification.
