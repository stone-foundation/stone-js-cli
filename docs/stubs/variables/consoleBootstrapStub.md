[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [stubs](../README.md) / consoleBootstrapStub

# Variable: consoleBootstrapStub

> `const` **consoleBootstrapStub**: "\n\_\_app\_modules\_import\_\_\nimport \{ StoneFactory, ConfigBuilder \} from '@stone-js/core'\n\n/\*\*\n \* Build App Blueprint.\n \* \n \* @returns \{IBlueprint\}\n \*/\nconst blueprint = await ConfigBuilder.create().build(\{ \_\_app\_module\_names\_\_ \})\n\n/\*\*\n \* Run application.\n \*/\nStoneFactory.create(blueprint).run()\n"

Console App bootstrap module stub.

## Defined in

[src/stubs.ts:32](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/stubs.ts#L32)
