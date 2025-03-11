[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [stubs](../README.md) / appBootstrapStub

# Variable: appBootstrapStub

> `const` **appBootstrapStub**: "\n\_\_app\_modules\_import\_\_\nimport \{ StoneFactory, BlueprintBuilder \} from '@stone-js/core'\n\n/\*\*\n \* Build Blueprint.\n \* \n \* @returns \{IBlueprint\}\n \*/\nconst blueprint = await BlueprintBuilder.create().build(\{ \_\_app\_module\_names\_\_ \})\n\n/\*\*\n \* Run application.\n \*/\nconst output = await StoneFactory.create(\{ blueprint \}).run()\n\n/\*\*\n \* Export adapter specific output.\n \* Useful for FAAS handler like AWS lambda handler.\n \* \n \* @returns \{Object\}\n \*/\nexport \{ output \}\n"

Defined in: [cli/src/stubs.ts:4](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/stubs.ts#L4)

App bootstrap module stub.
