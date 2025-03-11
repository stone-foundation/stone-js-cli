[**CLI Documentation v0.0.0**](../../README.md)

***

[CLI Documentation](../../modules.md) / [stubs](../README.md) / consoleBootstrapStub

# Variable: consoleBootstrapStub

> `const` **consoleBootstrapStub**: "\n\_\_app\_modules\_import\_\_\nimport \{ NODE\_CONSOLE\_PLATFORM \} from '@stone-js/node-cli-adapter';\nimport \{ StoneFactory, BlueprintBuilder, resolveCurrentAdapter \} from '@stone-js/core'\n\ntry \{\n  /\*\*\n   \* Build App Blueprint.\n   \* \n   \* @returns \{IBlueprint\}\n   \*/\n  const blueprint = await BlueprintBuilder.create().build(\{ \_\_app\_module\_names\_\_ \})\n\n  /\*\*\n   \* Resolve the current adapter based on the application blueprint.\n   \* \n   \* This step ensures the correct adapter is selected for the Node.js CLI environment.\n   \*/\n  resolveCurrentAdapter(blueprint, NODE\_CONSOLE\_PLATFORM);\n\n  /\*\*\n   \* Execute the CLI application.\n   \* \n   \* Initializes the Stone.js application using the resolved blueprint and executes the CLI commands.\n   \*/\n  await StoneFactory.create(\{ blueprint \}).run()\n\} catch (error) \{\n  console.error('Error running Stone commands:', error)\n  process.exit(1)\n\}\n"

Defined in: [cli/src/stubs.ts:32](https://github.com/stonemjs/cli/blob/918c4879f2a7715f30d46038936ca1a10bb41202/src/stubs.ts#L32)

Console App bootstrap module stub.
