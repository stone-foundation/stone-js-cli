# Function: ConfigureTestingMiddleware()

```ts
function ConfigureTestingMiddleware(context, next): Promise<IBlueprint>;
```

Configure testing.

## Parameters

### context

[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md)

Input data to transform via middleware.

### next

`NextPipe`\<[`ConsoleContext`](../../../declarations/interfaces/ConsoleContext.md), `IBlueprint`\>

Function to pass to the next middleware.

## Returns

`Promise`\<`IBlueprint`\>

A promise resolving with the context object.
