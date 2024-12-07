[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [stubs](../README.md) / appBootstrapStub

# Variable: appBootstrapStub

> `const` **appBootstrapStub**: "\n\_\_app\_modules\_import\_\_\nimport \{ StoneFactory, ConfigBuilder \} from '@stone-js/core'\n\n/\*\*\n \* Build Blueprint.\n \* \n \* @returns \{IBlueprint\}\n \*/\nconst blueprint = await ConfigBuilder.create().build(\{ \_\_app\_module\_names\_\_ \})\n\n/\*\*\n \* Run application.\n \*/\nconst stone = await StoneFactory.create(blueprint).run()\n\n/\*\*\n \* Export adapter specific output.\n \* Useful for FAAS handler like AWS lambda handler.\n \* \n \* @returns \{Object\}\n \*/\nexport \{ stone \}\n"

App bootstrap module stub.

## Defined in

[stubs.ts:4](https://github.com/stonemjs/cli/blob/b2251afafa869f82f017c134bddb19013c7883b6/src/stubs.ts#L4)
