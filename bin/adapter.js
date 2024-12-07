import { IntegrationError, Adapter, AdapterEventBuilder, IncomingEvent, ErrorHandler, defaultKernelResolver, defaultLoggerResolver, OutgoingResponse, setClassMetadata, hasMetadata, getMetadata, AdapterHandlerMiddleware, addBlueprint } from '@stone-js/core';
import ProgressBar from 'progress';
import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import yargs from 'yargs';
import { argv } from 'node:process';
import { hideBin } from 'yargs/helpers';

/**
 * Wrapper for generic raw responses.
 *
 * The `RawResponseWrapper` is responsible for encapsulating a raw response
 * and returning it in a structure that aligns with the Stone.js framework's requirements.
 * It implements the `IRawResponseWrapper` interface, ensuring compatibility with the framework.
 */
class RawResponseWrapper {
    options;
    /**
     * Factory method to create an instance of `RawResponseWrapper`.
     *
     * This method initializes the wrapper with a set of partial response options.
     *
     * @param options - Partial options to configure the raw response.
     * @returns A new instance of `RawResponseWrapper`.
     *
     * @example
     * ```typescript
     * const responseWrapper = RawResponseWrapper.create({
     *   headers: { 'Content-Type': 'application/json' },
     *   body: { message: 'Success' },
     *   statusCode: 200,
     * });
     *
     * const response = responseWrapper.respond();
     * console.log(response); // { headers: { 'Content-Type': 'application/json' }, body: { message: 'Success' }, statusCode: 200 }
     * ```
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Constructs an instance of `RawResponseWrapper`.
     *
     * This constructor is private and should not be called directly.
     * Use the `create` method to initialize an instance.
     *
     * @param options - Partial options for configuring the raw response.
     */
    constructor(options) {
        this.options = options;
    }
    /**
     * Constructs and returns the raw response.
     *
     * The `respond` method generates and returns the raw response based on
     * the provided options. The response is returned as-is, allowing for
     * maximum flexibility in defining its structure.
     *
     * @returns A `RawResponse` object containing the response options.
     *
     * @example
     * ```typescript
     * const responseWrapper = RawResponseWrapper.create({ exitCode: 1 });
     * const response = responseWrapper.respond();
     * console.log(response); // 1
     * ```
     */
    respond() {
        return Number(this.options.exitCode);
    }
}

/**
 * Custom error for Node CLI adapter operations.
 */
class NodeCliAdapterError extends IntegrationError {
    constructor(message, options) {
        super(message, options);
        this.name = 'NodeCliAdapterError';
    }
    get exitCode() {
        return this.cause?.exitCode ?? 1;
    }
}

/**
 * Node Cli Adapter for Stone.js.
 *
 * The `NodeCliAdapter` provides seamless integration between Stone.js applications
 * and the Node Cli environment. It processes incoming events from Node Cli,
 * transforms them into `IncomingEvent` instances, and returns a `RawResponse`.
 *
 * This adapter ensures compatibility with Node Cli's execution model and
 * abstracts the event handling process for Stone.js developers.
 *
 * @template NodeCliEvent - The type of the raw event received from Node Cli.
 * @template RawResponse - The type of the response to send back to Node Cli.
 * @template NodeCliExecutionContext - The Node Cli execution context type.
 * @template IncomingEvent - The type of the processed incoming event.
 * @template IncomingEventOptions - Options used to create an incoming event.
 * @template OutgoingResponse - The type of the outgoing response after processing.
 * @template NodeCliAdapterContext - Context type specific to the adapter.
 *
 * @extends Adapter
 *
 * @example
 * ```typescript
 * import { NodeCliAdapter } from '@stone-js/node-cli-adapter';
 *
 * const adapter = NodeCliAdapter.create({...});
 *
 * const handler = await adapter.run();
 *
 * export { handler };
 * ```
 *
 * @see {@link https://stone-js.com/docs Stone.js Documentation}
 */
class NodeCliAdapter extends Adapter {
    /**
     * Creates an instance of the `NodeCliAdapter`.
     *
     * This factory method allows developers to instantiate the adapter with
     * the necessary configuration options, ensuring it is correctly set up for
     * Node Cli usage.
     *
     * @param options - The configuration options for the adapter, including
     *                  handler resolver, error handling, and other settings.
     * @returns A fully initialized `NodeCliAdapter` instance.
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Executes the adapter and provides an Node Cli-compatible handler function.
     *
     * The `run` method processes events, manages context, and returns the appropriate response.
     *
     * @template ExecutionResultType - The type representing the Node Cli event handler function.
     * @returns A promise resolving to the Node Cli handler function.
     * @throws {NodeCliAdapterError} If used outside the Node Cli environment.
     */
    async run() {
        await this.onInit();
        const executionContext = this.blueprint.get('stone.adapter.commandBuilder');
        if (executionContext === undefined) {
            throw new NodeCliAdapterError('Command builder is required to run the Node Cli Adapter, set it in CLI blueprint `stone.adapter.commandBuilder`.');
        }
        const rawEvent = await this.makeRawEvent(executionContext);
        return await this.eventListener(rawEvent, executionContext);
    }
    /**
     * Initializes the adapter and validates its execution context.
     *
     * Ensures the adapter is running in an Node Cli environment. If not, it
     * throws an error to prevent misuse.
     *
     * @throws {NodeCliAdapterError} If executed outside an Node Cli context (e.g., browser).
     */
    async onInit() {
        if (typeof window === 'object') {
            throw new NodeCliAdapterError('This `NodeCliAdapter` must be used only in Node Cli context.');
        }
        await super.onInit();
    }
    /**
     * Processes an incoming Node Cli event.
     *
     * This method transforms the raw Node Cli event into a Stone.js `IncomingEvent`,
     * processes it through the pipeline, and generates a `RawResponse` to send back.
     *
     * @param rawEvent - The raw Node Cli event to be processed.
     * @param executionContext - The Node Cli execution context for the event.
     * @returns A promise resolving to the processed `RawResponse`.
     */
    async eventListener(rawEvent, executionContext) {
        const incomingEventBuilder = AdapterEventBuilder.create({
            resolver: (options) => IncomingEvent.create(options)
        });
        const rawResponseBuilder = AdapterEventBuilder.create({
            resolver: (options) => RawResponseWrapper.create(options)
        });
        const rawResponse = 0;
        return await this.sendEventThroughDestination({
            rawEvent,
            rawResponse,
            executionContext,
            rawResponseBuilder,
            incomingEventBuilder
        });
    }
    async makeRawEvent(builder) {
        const argv = await builder.argv;
        const args = Object.fromEntries(Object.entries(argv).filter(([key]) => !['_', '$0'].includes(key)));
        return {
            ...args,
            __extra: argv._,
            __script: argv.$0
        };
    }
}

/**
 * A constant representing the Node Cli platform identifier.
 *
 * This constant is used as an alias for the Node Cli Adapter within the Stone.js framework.
 * It helps in identifying and configuring platform-specific adapters or components for handling
 * incoming requests and responses.
 */
const NODE_CONSOLE_PLATFORM = 'node_console';

/**
 * Resolves a logger for a blueprint.
 *
 * @param blueprint - The `IBlueprint` to retrieve the logger resolver from.
 * @returns A `LoggerResolver` for the given blueprint.
 */
const loggerResolver = (blueprint) => {
    return blueprint.get('stone.logger.resolver', defaultLoggerResolver);
};
/**
 * Error handler resolver for generic Node Cli adapter.
 *
 * Creates and configures an `ErrorHandler` for managing errors in the generic Node Cli adapter.
 *
 * @param blueprint - The `IBlueprint` providing configuration and dependencies.
 * @returns An `ErrorHandler` instance for handling Node Cli errors.
 */
const nodeCliErrorHandlerResolver = (blueprint) => {
    return ErrorHandler.create({
        blueprint,
        logger: loggerResolver(blueprint)(blueprint),
        renderResponseResolver: (error) => error.exitCode
    });
};
/**
 * Adapter resolver for generic Node Cli adapter.
 *
 * Creates and configures an `NodeCliAdapter` for handling generic events in Node Cli.
 *
 * @param blueprint - The `IBlueprint` providing configuration and dependencies.
 * @returns An `NodeCliAdapter` instance.
 */
const nodeCliAdapterResolver = (blueprint) => {
    const hooks = blueprint.get('stone.adapter.hooks', {});
    const handlerResolver = blueprint.get('stone.kernel.resolver', defaultKernelResolver);
    const errorHandlerResolver = blueprint.get('stone.adapter.errorHandler.resolver', nodeCliErrorHandlerResolver);
    return NodeCliAdapter.create({
        hooks,
        blueprint,
        handlerResolver,
        logger: loggerResolver(blueprint)(blueprint),
        errorHandler: errorHandlerResolver(blueprint)
    });
};

/**
 * Class representing a CommandInput Facade.
 * Handles user interactions through prompts, such as questions, confirmations, and choices.
 */
class CommandInput {
    /**
     * A reference to the `prompt` method from the `inquirer` library.
     * This property is used to prompt the user for input in the command line interface.
     */
    _prompt;
    /**
     * Create a CommandInput instance.
     *
     * @param options - The options for creating the CommandInput instance.
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Create a CommandInput instance.
     *
     * @param options - The options for creating the CommandInput instance.
     */
    constructor({ prompt }) {
        this._prompt = prompt;
    }
    /**
     * Displays a questionnaire.
     *
     * @param questions - An array of question objects to be displayed.
     * @returns The response from the prompt.
     */
    questionnaire(questions) {
        return this._prompt(questions);
    }
    /**
     * Prompts the user with a single question.
     *
     * @param question - The question object to display.
     * @returns The user's response.
     */
    async prompt(question) {
        return (await this.questionnaire([{ ...question, name: 'value' }])).value;
    }
    /**
     * Asks a basic question with an optional fallback.
     *
     * @param message - The message to display.
     * @param fallback - The fallback value if no response is provided.
     * @returns The user's response.
     */
    async ask(message, fallback) {
        return await this.prompt({ type: 'input', message, default: fallback });
    }
    /**
     * Asks a numeric question with an optional fallback.
     *
     * @param message - The message to display.
     * @param fallback - The fallback value if no response is provided.
     * @returns The user's response as a number.
     */
    async askNumber(message, fallback) {
        return await this.prompt({ type: 'number', message, default: fallback });
    }
    /**
     * Asks for a secret input (e.g., password).
     *
     * @param message - The message to display.
     * @returns The user's response as a string.
     */
    async secret(message) {
        return await this.prompt({ type: 'password', message });
    }
    /**
     * Asks for a confirmation.
     *
     * @param message - The message to display.
     * @param fallback - The fallback value if no response is provided.
     * @returns The user's response as a boolean.
     */
    async confirm(message, fallback = false) {
        return await this.prompt({ type: 'confirm', message, default: fallback });
    }
    /**
     * Asks the user to make a choice from a list.
     *
     * @param message - The message to display.
     * @param choices - The array of choices to present.
     * @param fallbackIndex - The default selected index if no response is provided.
     * @param multiple - Whether to allow multiple selections.
     * @returns The user's response.
     */
    async choice(message, choices, fallbackIndex = 0, multiple = false) {
        return await this.prompt({
            type: multiple ? 'checkbox' : 'rawlist',
            choices,
            message,
            default: fallbackIndex
        });
    }
    /**
     * Opens an editor for the user to input text.
     *
     * @param message - The message to display.
     * @param fallback - The fallback value if no response is provided.
     * @returns The user's response as a string.
     */
    async editor(message, fallback) {
        return await this.prompt({ type: 'editor', message, default: fallback });
    }
}

/**
 * Class representing a CommandOutput Facade.
 * Provides utility methods for logging, colored outputs, spinners, and progress bars.
 */
class CommandOutput {
    /**
     * A formatting library (e.g., `chalk`).
     */
    format;
    /**
     * A console object for standard output (e.g., global console).
     */
    stdConsole;
    /**
     * A smart console utility (e.g., `ora` spinner).
     */
    smartConsole;
    /**
     * Create a CommandOutput instance.
     *
     * @param options - The options for creating the CommandOutput instance.
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Create a CommandOutput instance.
     *
     * @param stdConsole - The console object (e.g., global console).
     * @param smartConsole - A smart console utility (e.g., `ora` spinner).
     * @param format - A formatting library (e.g., `chalk`).
     */
    constructor({ stdConsole, smartConsole, format }) {
        this.format = format;
        this.stdConsole = stdConsole;
        this.smartConsole = smartConsole;
    }
    /**
     * Output uncolored text.
     *
     * @param value - The text to display.
     * @returns The current instance for chaining.
     */
    show(value) {
        this.stdConsole.log(value);
        return this;
    }
    /**
     * Output a table.
     *
     * @param value - The value to display as a table.
     * @returns The current instance for chaining.
     */
    table(value) {
        this.stdConsole.table(value);
        return this;
    }
    /**
     * Output a line break.
     *
     * @param value - The number of newlines to add.
     * @returns The current instance for chaining.
     */
    breakLine(value) {
        this.stdConsole.log(Array(value).join('\n'));
        return this;
    }
    /**
     * Output info-colored text.
     *
     * @param value - The text to display.
     * @param color - Whether to color the text. Defaults to true.
     * @returns The current instance for chaining.
     */
    info(value, color = true) {
        this.smartConsole(color ? this.format.blueBright(value) : value).info();
        return this;
    }
    /**
     * Output error-colored text.
     *
     * @param value - The text to display.
     * @param color - Whether to color the text. Defaults to true.
     * @returns The current instance for chaining.
     */
    error(value, color = true) {
        this.smartConsole(color ? this.format.redBright(value) : value).fail();
        return this;
    }
    /**
     * Output warn-colored text.
     *
     * @param value - The text to display.
     * @param color - Whether to color the text. Defaults to true.
     * @returns The current instance for chaining.
     */
    warn(value, color = true) {
        this.smartConsole(color ? this.format.yellowBright(value) : value).warn();
        return this;
    }
    /**
     * Output success-colored text.
     *
     * @param value - The text to display.
     * @param color - Whether to color the text. Defaults to true.
     * @returns The current instance for chaining.
     */
    succeed(value, color = true) {
        this.smartConsole(color ? this.format.greenBright(value) : value).succeed();
        return this;
    }
    /**
     * Output a spinner.
     *
     * @param value - The spinner's initial message. Defaults to null.
     * @returns The spinner instance started.
     */
    spin(value) {
        return this.spinner(value).start();
    }
    /**
     * Creates a spinner instance.
     *
     * @param value - The spinner's initial message. Defaults to null.
     * @returns The spinner instance.
     */
    spinner(value) {
        return this.smartConsole(value);
    }
    /**
     * Create a progress bar.
     *
     * @param tokens - The template string for the progress bar.
     * @param options - Configuration options for the progress bar.
     * @returns A new ProgressBar instance.
     */
    progressBar(tokens, options) {
        return new ProgressBar(tokens, options);
    }
}

/**
 * Class representing a CommandRouter.
 * Responsible for finding and dispatching commands based on incoming events.
 *
 * @author
 * Mr. Stone <evensstone@gmail.com>
 */
class CommandRouter {
    /**
     * Blueprint configuration used to retrieve app settings.
     */
    blueprint;
    /**
     * The service container that manages dependencies.
     */
    container;
    /**
     * Create a new instance of CommandRouter.
     *
     * @param container - The container instance for dependency resolution.
     */
    constructor({ blueprint, container }) {
        this.blueprint = blueprint;
        this.container = container;
    }
    /**
     * Retrieves the list of registered command classes.
     *
     * @returns An array of command constructor functions.
     */
    get commands() {
        return this.blueprint.get('stone.adapter.commands', []);
    }
    /**
     * Dispatches an event to the appropriate command.
     *
     * @param event - The incoming event to be dispatched.
     * @returns The result of the command execution.
     */
    async dispatch(event) {
        return await this.runCommand(event, this.findCommand(event));
    }
    /**
     * Finds a command that matches the given event.
     *
     * @param event - The incoming event to match against commands.
     * @returns The matching command, or undefined if no match is found.
     */
    findCommand(event) {
        return this.commands
            .map(([commandClass, options]) => ({ options, command: this.resolveCommand(commandClass) }))
            .find(({ command, options }) => this.checkCommandMatch(command, event, options))?.command;
    }
    /**
     * Runs the given command with the provided event.
     *
     * @param event - The event to handle.
     * @param command - The command to execute.
     * @returns The result of the command execution, or void if no command is found.
     */
    async runCommand(event, command) {
        if (command === undefined) {
            this.showHelp();
            return OutgoingResponse.create({ content: '', statusCode: 1 });
        }
        else if (typeof command.handle === 'function') {
            return await command.handle(event);
        }
        else {
            throw new NodeCliAdapterError('Command does not implement a "handle" method.');
        }
    }
    /**
     * Resolves a command instance from the container.
     *
     * @param commandClass - The command constructor function.
     * @returns The resolved command instance.
     */
    resolveCommand(commandClass) {
        let command;
        if (typeof commandClass === 'function') {
            command = Object.prototype.hasOwnProperty.call(commandClass, 'prototype')
                ? this.container.resolve(commandClass, true)
                : { handle: commandClass };
        }
        if (command === undefined) {
            throw new NodeCliAdapterError(`Failed to resolve command: ${commandClass.name}`);
        }
        return command;
    }
    /**
     * Checks if a command matches the given event.
     *
     * @param command - The command to check.
     * @param event - The event to match.
     * @returns True if the command matches; otherwise, false.
     */
    checkCommandMatch(command, event, options) {
        if (typeof command.match === 'function') {
            return command.match(event);
        }
        else {
            return event.getMetadataValue('task') === options.name || options.alias?.includes(event.getMetadataValue('task')) === true;
        }
    }
    /**
     * Displays help information when no command matches the event.
     */
    showHelp() {
        const builder = this.blueprint.get('stone.adapter.commandBuilder')
        if (builder !== undefined) {
            builder.showHelp().scriptName('stone')
        } else {
            console.error('No help available.')
        }
    }
}

/**
 * Class representing a CommandServiceProvider.
 * Responsible for registering router and application commands.
 *
 * @author
 * Mr. Stone <evensstone@gmail.com>
 */
class CommandServiceProvider {
    /**
     * Blueprint configuration used to retrieve app settings.
     */
    blueprint;
    /**
     * The service container that manages dependencies.
     */
    container;
    /**
     * Create a new instance of CommandServiceProvider.
     *
     * @param container - The container instance for dependency resolution.
     */
    constructor({ container, blueprint }) {
        if (container === undefined) {
            throw new NodeCliAdapterError('Container is required to create a CoreServiceProvider instance.');
        }
        if (blueprint === undefined) {
            throw new NodeCliAdapterError('Blueprint is required to create a CoreServiceProvider instance.');
        }
        this.container = container;
        this.blueprint = blueprint;
    }
    /**
     * Retrieves the list of registered command classes.
     *
     * @returns An array of command constructor functions.
     */
    get commands() {
        return this.blueprint.get('stone.adapter.commands', []);
    }
    /**
     * Retrieves the router classes.
     *
     * @returns Command Router constructor functions.
     */
    get router() {
        return this.blueprint.get('stone.adapter.router');
    }
    /**
     * Determines if this provider should be skipped.
     * Useful for registering the provider based on platform.
     *
     * @returns True if the provider should be skipped; otherwise, false.
     */
    mustSkip() {
        return this.blueprint.get('stone.adapter.platform') !== NODE_CONSOLE_PLATFORM;
    }
    /**
     * Registers router components and application commands in the service container.
     */
    register() {
        this
            .registerCommandUtils() // Must be registered first or always before the app commands.
            .registerRouter()
            .registerAppCommands();
    }
    /**
     * Registers the router in the service container.
     */
    registerRouter() {
        if (this.router !== undefined) {
            this
                .container
                .singletonIf(this.router, (container) => Reflect.construct(this.router, [container]))
                .alias(this.router, 'router');
        }
        return this;
    }
    /**
     * Registers application commands in the service container.
     */
    registerAppCommands() {
        this
            .commands
            .map(([commandClass, options]) => ({ options, command: this.resolveCommand(commandClass) }))
            .forEach(({ options }) => this.registerCommand(options));
        return this;
    }
    /**
     * Resolves a command instance from the container.
     *
     * @param commandClass - The command constructor function.
     * @returns The resolved command instance.
     */
    resolveCommand(commandClass) {
        let command;
        if (typeof commandClass === 'function') {
            command = Object.prototype.hasOwnProperty.call(commandClass, 'prototype')
                ? this.container.resolve(commandClass, true)
                : { handle: commandClass };
        }
        if (command === undefined) {
            throw new NodeCliAdapterError(`Failed to resolve command: ${commandClass.name}`);
        }
        return command;
    }
    /**
     * Registers a single command using its `registerCommand` method.
     *
     * @param command - The command instance to register.
     */
    registerCommand(options) {
        const builder = this.blueprint.get('stone.adapter.commandBuilder');
        if (builder === undefined) {
            throw new NodeCliAdapterError('Command builder is required by command service provider, set it in CLI blueprint `stone.adapter.commandBuilder`.');
        }
        builder
            .command([options.name].concat(options.args ?? []).join(' '), options.desc ?? '', {
            builder: options.options ?? {}
        });
        return this;
    }
    /**
     * Registers command utilities in the service container.
     */
    registerCommandUtils() {
        this.container.singleton(CommandInput, () => CommandInput.create({ prompt: inquirer.createPromptModule() })).alias(CommandInput, 'commandInput');
        this.container.singleton(CommandOutput, () => CommandOutput.create({ stdConsole: console, smartConsole: ora, format: chalk })).alias(CommandOutput, 'commandOutput');
        return this;
    }
}

/**
 * Constants are defined here to prevent Circular dependency between modules
 * This pattern must be applied to all Stone libraries or third party libraries.
 */
/**
 * A unique symbol key to mark classes as command.
 */
const COMMAND_KEY = Symbol('Command');

/**
 * Command decorator to mark a class as a command and automatically bind it to the container.
 *
 * This decorator is useful for marking classes that should be treated as commands by the Stone.js framework,
 * making them easily injectable and manageable by the command container.
 *
 * @param options - The configuration options for the command, including singleton and alias settings.
 * @returns A decorator function to set metadata on the target class.
 *
 * @example
 * ```typescript
 * @Command({ alias: 'MyCommand' })
 * class MyCommand {
 *   // Command class logic here.
 * }
 * ```
 */
const Command = (options = {}) => {
    return setClassMetadata(COMMAND_KEY, options);
};

/**
 * Middleware to process and register modules as command handlers.
 *
 * @param configContext - The configuration context containing the modules and blueprint.
 * @param next - The next middleware in the pipeline to call.
 * @returns The updated blueprint or a promise resolving to it.
 */
const CommandMiddleware = ({ modules, blueprint }, next) => {
    const commands = modules.filter(module => typeof module === 'function' && hasMetadata(module, COMMAND_KEY));
    commands.forEach(module => {
        const options = getMetadata(module, COMMAND_KEY, { name: '', args: [] });
        blueprint.set('stone.adapter.commands', [[module, options]].concat(blueprint.get('stone.adapter.commands', [])));
    });
    if (commands.length > 0 && !blueprint.has('stone.adapter.router')) {
        blueprint.add('stone.adapter.router', CommandRouter);
    }
    return next({ modules, blueprint });
};

/**
 * Middleware for handling incoming events in the Node CLI adapter.
 *
 * This middleware processes the incoming event and prepares it for the next middleware in the pipeline.
 */
class IncomingEventMiddleware {
    /**
     * Handles the incoming event, processes it, and invokes the next middleware in the pipeline.
     *
     * @param context - The adapter context containing the raw event, execution context, and other data.
     * @param next - The next middleware to be invoked in the pipeline.
     * @returns A promise that resolves to the processed context.
     * @throws {NodeCliAdapterError} If required components are missing in the context.
     */
    async handle(context, next) {
        if ((context.rawEvent == null) || ((context.incomingEventBuilder?.add) == null)) {
            throw new NodeCliAdapterError('The context is missing required components.');
        }
        context
            .incomingEventBuilder
            .add('source', context.executionContext)
            .add('metadata', { args: context.rawEvent, task: context.rawEvent.__extra.shift() });
        return await next(context);
    }
}

/**
 * Default blueprint configuration for the Node Cli Adapter.
 *
 * This blueprint defines the initial configuration for the Node Cli adapter
 * within the Stone.js framework. It includes:
 * - An alias for the Node Cli platform (`Node_CLI_PLATFORM`).
 * - A default resolver function (currently a placeholder).
 * - Middleware, hooks, and state flags (`current`, `default`, `preferred`).
 */
const nodeCliAdapterBlueprint = {
    stone: {
        builder: {
            middleware: [
                { priority: 5, pipe: CommandMiddleware }
            ]
        },
        providers: [
            CommandServiceProvider
        ],
        adapters: [
            {
                platform: NODE_CONSOLE_PLATFORM,
                resolver: nodeCliAdapterResolver,
                middleware: [
                    { priority: 0, pipe: IncomingEventMiddleware },
                    { priority: 100, pipe: AdapterHandlerMiddleware }
                ],
                hooks: {},
                errorHandler: {
                    resolver: nodeCliErrorHandlerResolver
                },
                commandBuilder: yargs(hideBin(argv)),
                current: false,
                default: false,
                preferred: false,
                commands: []
            }
        ]
    }
};

/**
 * A Stone.js decorator that integrates the Node Cli Adapter with a class.
 *
 * This decorator modifies the class to seamlessly enable Node Cli as the
 * execution environment for a Stone.js application. By applying this decorator,
 * the class is automatically configured with the necessary blueprint for Node Cli.
 *
 * @template T - The type of the class being decorated. Defaults to `ClassType`.
 * @param options - Optional configuration to customize the Node Cli Adapter.
 *
 * @returns A class decorator that applies the Node Cli adapter configuration.
 *
 * @example
 * ```typescript
 * import { NodeConsoleAdapter } from '@stone-js/node-cli-adapter';
 *
 * @NodeConsoleAdapter({
 *   alias: 'NodeConsoleAdapter',
 * })
 * class App {
 *   // Your application logic here
 * }
 * ```
 */
const NodeConsoleAdapter = (options = {}) => {
    return (target, context) => {
        if (nodeCliAdapterBlueprint.stone?.adapters?.[0] !== undefined) {
            // Merge provided options with the default Node Cli adapter blueprint.
            nodeCliAdapterBlueprint.stone.adapters[0] = {
                ...nodeCliAdapterBlueprint.stone.adapters[0],
                ...options
            };
        }
        // Add the modified blueprint to the target class.
        addBlueprint(target, context, nodeCliAdapterBlueprint);
    };
};

export { COMMAND_KEY, Command, CommandInput, CommandMiddleware, CommandOutput, CommandRouter, CommandServiceProvider, IncomingEventMiddleware, NODE_CONSOLE_PLATFORM, NodeCliAdapter, NodeCliAdapterError, NodeConsoleAdapter, RawResponseWrapper, nodeCliAdapterBlueprint, nodeCliAdapterResolver, nodeCliErrorHandlerResolver };
