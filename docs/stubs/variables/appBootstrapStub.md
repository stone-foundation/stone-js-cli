[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [stubs](../README.md) / appBootstrapStub

# Variable: appBootstrapStub

> `const` **appBootstrapStub**: "\n\_\_app\_modules\_import\_\_\nimport \{ StoneFactory, ConfigBuilder \} from '@stone-js/core'\n\n/\*\*\n \* Build Blueprint.\n \* \n \* @returns \{IBlueprint\}\n \*/\nconst blueprint = await ConfigBuilder.create().build(\{ \_\_app\_module\_names\_\_ \})\n\n/\*\*\n \* Run application.\n \*/\nconst app = await StoneFactory.create(blueprint).run()\n\n/\*\*\n \* Export adapter specific output.\n \* Useful for FAAS handler like AWS lambda handler.\n \* \n \* @returns \{Object\}\n \*/\nexport \{ app \}\n"

App bootstrap module stub.

## Defined in

[src/stubs.ts:4](https://github.com/stonemjs/cli/blob/7903e21087d732d9d42947a348eb3c473963e042/src/stubs.ts#L4)
