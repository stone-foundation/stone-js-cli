import { Config } from '@stone-js/config';
import { Pipeline } from '@stone-js/pipeline';
import deepmerge from 'deepmerge';
import { isPlainObject, get, set } from 'lodash-es';
import NodeEventEmitter from 'node:events';
import { Container } from '@stone-js/service-container';

/**
 * Constants are defined here to prevent Circular dependency between modules
 * This pattern must be applied to all Stone libraries or third party libraries.
 */
/**
 * A unique symbol key to mark classes as the main application entry point.
 */
const MAIN_HANDLER_KEY = Symbol('MainHandler');
/**
 * A unique symbol key to mark classes as middleware.
 */
const ADAPTER_MIDDLEWARE_KEY = Symbol('AdapterMiddleware');
/**
 * A unique symbol key to mark classes as middleware.
 */
const CONFIG_MIDDLEWARE_KEY = Symbol('ConfigMiddleware');
/**
 * A unique symbol used as a key for the configuration metadata.
 */
const CONFIGURATION_KEY = Symbol('Configuration');
/**
 * A unique symbol key to mark classes as listeners.
 */
const LISTENER_KEY = Symbol('Listener');
/**
 * A unique symbol key to mark classes as middleware.
 */
const MIDDLEWARE_KEY = Symbol('Middleware');
/**
 * A unique symbol key to mark classes as providers.
 */
const PROVIDER_KEY = Symbol('Provider');
/**
 * A unique symbol key to mark classes as services.
 */
const SERVICE_KEY = Symbol('Service');
/**
 * A unique symbol key to mark classes as subscribers.
 */
const SUBSCRIBER_KEY = Symbol('Subscriber');
/**
 * A unique symbol key to mark classes as the blueprint container.
 */
const BLUEPRINT_KEY = Symbol('blueprint');

/**
 * Class representing a RuntimeError.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
class RuntimeError extends Error {
    code;
    metadata;
    /**
     * Create a RuntimeError.
     *
     * @param options - The options to create a RuntimeError.
     * @returns A new RuntimeError instance.
     */
    static create(message, options = {}) {
        return new this(message, options);
    }
    /**
     * Create a RuntimeError.
     *
     * @param message - The message to log.
     * @param options - The error options.
     */
    constructor(message, options = {}) {
        super(message);
        this.code = options.code;
        this.name = 'RuntimeError';
        this.metadata = options.metadata;
        if (options.cause !== undefined) {
            this.cause = options.cause;
        }
        if (Error.captureStackTrace !== undefined) {
            Error.captureStackTrace(this, this.constructor); // Official V8 method to capture the stack trace, excluding the constructor
        }
        else {
            this.stack = new Error(message).stack; // Fallback for environments without captureStackTrace
        }
    }
    /**
     * Converts the error to a formatted string representation.
     *
     * @param multiline - Determine if output value must be multiline or not.
     * @returns A formatted error string.
     */
    toString(multiline = false) {
        const baseMessage = `Error: ${this.name}`;
        const codeMessage = this.code !== undefined ? `Code: ${String(this.code)}` : '';
        const mainMessage = `Message: "${this.message}"`;
        const metadataMessage = this.metadata !== undefined ? `Metadata: ${JSON.stringify(this.metadata)}` : '';
        if (multiline) {
            return [baseMessage, codeMessage, mainMessage, metadataMessage]
                .filter(Boolean)
                .join('\n');
        }
        return [
            `[${this.name}]`,
            this.code !== undefined ? `Code: ${String(this.code)}` : '',
            `Message: "${this.message}"`,
            this.metadata !== undefined ? `Metadata: ${JSON.stringify(this.metadata)}` : ''
        ]
            .filter(Boolean)
            .join(', ');
    }
}

/**
 * Custom error for Setup layer operations.
 */
class SetupError extends RuntimeError {
    constructor(message, options = {}) {
        super(message, options);
        this.name = 'SetupError';
    }
}

/**
 * Merges multiple blueprints into a single application blueprint.
 *
 * This function takes any number of blueprint objects and merges them into one,
 * with later blueprints overwriting properties of earlier ones in case of conflicts.
 * It uses deep merging to ensure nested properties are also combined appropriately.
 * Note: The `deepmerge` function can lead to unexpected results if objects have circular references.
 * Consider handling such cases or documenting this behavior if it applies to your usage.
 *
 * @param blueprints - An array of blueprints to be merged.
 * @returns The merged application blueprint.
 *
 * @throws {SetupError} - If any of the provided blueprints are not valid objects.
 *
 * @example
 * ```typescript
 * const mergedBlueprint = mergeBlueprints(blueprint1, blueprint2);
 * ```
 */
const mergeBlueprints = (...blueprints) => {
    validateBlueprints(blueprints);
    return blueprints.reduce((prev, curr) => deepmerge(prev, curr, { isMergeableObject: isMergeable }), { stone: {} });
};
/**
 * Defines an application blueprint by merging user-defined blueprints with default options.
 *
 * This function allows users to define their own blueprints and merges them with
 * the default blueprint options provided by the framework.
 * It ensures that all necessary properties are available while allowing user customizations.
 *
 * @param userBlueprints - An array of partial user-defined blueprints to be merged with defaults.
 * @returns The fully defined application blueprint.
 *
 * @throws {SetupError} - If any of the provided blueprints are not valid objects.
 *
 * @example
 * ```typescript
 * const appBlueprint = defineAppBlueprint(customBlueprint1, customBlueprint2);
 * ```
 */
const defineAppBlueprint = (...userBlueprints) => {
    validateBlueprints(userBlueprints);
    return mergeBlueprints(...userBlueprints);
};
/**
 * Checks if the given value is a constructor function.
 *
 * This function determines if the provided value is a function
 * that can be used as a constructor by verifying if it has a prototype.
 *
 * @param value - The value to be checked.
 * @returns True if the value is a constructor function, false otherwise.
 *
 * @example
 * ```typescript
 * class MyClass {}
 * const result = isConstructor(MyClass); // true
 * ```
 *
 * @example
 * ```typescript
 * const notAConstructor = () => {};
 * const result = isConstructor(notAConstructor); // false
 * ```
 */
const isConstructor = (value) => {
    return typeof value === 'function' && Object.prototype.hasOwnProperty.call(value, 'prototype');
};
/**
 * Custom function to determine if an object is mergeable.
 * Helps to avoid issues with circular references.
 *
 * @param value - The value to check for mergeability.
 * @returns Whether the value is mergeable or not.
 *
 * @example
 * ```typescript
 * const canMerge = isMergeable(someValue);
 * ```
 */
const isMergeable = (value) => {
    return value !== undefined && typeof value === 'object' && !Object.isFrozen(value);
};
/**
 * Validates that the provided blueprints are valid objects.
 *
 * This function checks if each blueprint in the provided array is an object,
 * throwing a SetupError if an invalid blueprint is found.
 *
 * @param blueprints - An array of blueprints to validate.
 * @throws {SetupError} - If any of the provided blueprints are not valid objects.
 *
 * @example
 * ```typescript
 * validateBlueprints([blueprint1, blueprint2]);
 * ```
 */
const validateBlueprints = (blueprints) => {
    blueprints.forEach((blueprint, index) => {
        if (typeof blueprint !== 'object' || blueprint === null) {
            throw new SetupError(`Invalid blueprint at index ${index}. Expected an object but received ${typeof blueprint}.`);
        }
    });
};

/**
 * Set metadata on a given decorator context.
 *
 * @param context - The decorator context where metadata is being set.
 * @param key - The key for the metadata entry.
 * @param value - The value of the metadata entry.
 */
function setMetadata(context, key, value) {
    context.metadata[key] = value;
}
/**
 * Check if a class has specific metadata.
 *
 * @param Class - The class to check for metadata.
 * @param key - The key of the metadata to check.
 * @returns True if the metadata key exists on the class, false otherwise.
 */
function hasMetadata(Class, key) {
    return hasMetadataSymbol(Class) && Class[Symbol.metadata][key] !== undefined;
}
/**
 * Get the metadata value for a given key from a class.
 *
 * @param Class - The class to get the metadata from.
 * @param key - The key of the metadata to retrieve.
 * @param defaultValue - The default value to return if the metadata key is not found.
 * @returns The metadata value or the default value if the key does not exist.
 */
function getMetadata(Class, key, defaultValue) {
    return (hasMetadataSymbol(Class) ? Class[Symbol.metadata][key] : defaultValue);
}
/**
 * Get all metadata from a class.
 *
 * @param Class - The class to get all metadata from.
 * @param defaultValue - The default value to return if no metadata is found.
 * @returns All metadata or the default value if no metadata exists.
 */
function getAllMetadata(Class, defaultValue) {
    return (hasMetadataSymbol(Class) ? Class[Symbol.metadata] : defaultValue);
}
/**
 * Remove a specific metadata entry from a class.
 *
 * @param Class - The class to remove metadata from.
 * @param key - The key of the metadata to remove.
 */
function removeMetadata(Class, key) {
    if (hasMetadataSymbol(Class)) {
        Class[Symbol.metadata][key] = undefined;
    }
}
/**
 * Set metadata on a class using a class decorator.
 *
 * @param key - The key for the metadata entry.
 * @param value - The value of the metadata entry.
 * @returns A class decorator function that sets the metadata.
 */
function setClassMetadata(key, value) {
    return createMetadataSetter(key, value);
}
/**
 * Set metadata on a class method using a method decorator.
 *
 * @param key - The key for the metadata entry.
 * @param value - The value of the metadata entry.
 * @returns A method decorator function that sets the metadata.
 */
function setMethodMetadata(key, value) {
    return createMetadataSetter(key, value);
}
/**
 * Set metadata on a class field using a field decorator.
 *
 * @param key - The key for the metadata entry.
 * @param value - The value of the metadata entry.
 * @returns A field decorator function that sets the metadata.
 */
function setFieldMetadata(key, value) {
    return createMetadataSetter(key, value);
}
/**
 * Add Blueprint on a given decorator context.
 *
 * @param Class - The class to get all metadata from.
 * @param context - The decorator context where metadata is being set.
 * @param blueprints - The list of blueprints.
 */
function addBlueprint(Class, context, ...blueprints) {
    context.metadata[BLUEPRINT_KEY] = mergeBlueprints(getMetadata(Class, BLUEPRINT_KEY, { stone: {} }), ...blueprints);
}
/**
 * Check if a class has blueprint.
 *
 * @param Class - The class to check for metadata.
 * @returns True if the metadata and BLUEPRINT_KEY keys exist on the class, false otherwise.
 */
function hasBlueprint(Class) {
    return hasMetadataSymbol(Class) && Class[Symbol.metadata][BLUEPRINT_KEY] !== undefined;
}
/**
 * Get the blueprint value from a class.
 *
 * @param Class - The class to get the blueprint from.
 * @param defaultValue - The default value to return if the blueprint key is not found.
 * @returns The blueprint value or the default value if the key does not exist.
 */
function getBlueprint(Class, defaultValue) {
    return (hasMetadataSymbol(Class) ? Class[Symbol.metadata][BLUEPRINT_KEY] : defaultValue);
}
/**
 * Type guard to check if a class has metadata.
 *
 * @param target - The target class to check.
 * @returns True if the target has metadata, false otherwise.
 */
function hasMetadataSymbol(target) {
    return target !== undefined && typeof target[Symbol.metadata] !== 'undefined';
}
/**
 * Generalized function to set metadata on a given context.
 *
 * @param key - The key for the metadata entry.
 * @param value - The value of the metadata entry.
 * @returns A decorator function that sets the metadata.
 */
function createMetadataSetter(key, value) {
    return (_, context) => setMetadata(context, key, value);
}

/**
 * Class representing a ConfigBuilder for the Stone.js framework.
 *
 * The ConfigBuilder is responsible for constructing and configuring the dynamic, complex structured options required by the Stone.js framework.
 * It inspects various modules, extracts metadata, and builds the "blueprint" object which serves as the primary configuration for the Stone.js application.
 * This class also manages middleware used to process and populate the configuration during the application setup.
 *
 * The ConfigBuilder allows users to create a unified configuration that is used to initialize and bootstrap the Stone.js application,
 * ensuring all necessary metadata is aggregated into a blueprint that can be used consistently throughout the application lifecycle.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
class ConfigBuilder {
    /**
     * The configuration options.
     */
    options;
    /**
     * Create a ConfigBuilder.
     *
     * @param options - The options to create a ConfigBuilder.
     * @returns A new ConfigBuilder instance.
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Create a ConfigBuilder.
     *
     * @param options - The options to create a ConfigBuilder.
     */
    constructor(options = { middleware: [], defaultMiddlewarePriority: 0 }) {
        this.options = options;
    }
    /**
     * Build the configuration blueprint by extracting metadata from the provided modules.
     *
     * This method processes the given raw modules, extracts metadata to populate the blueprint,
     * and returns the resulting configuration blueprint. It allows users to pass a custom blueprint
     * or use a default one if none is provided.
     *
     * @param rawModules - The modules to build the configuration from, organized by module names.
     * @param blueprint - The initial blueprint to populate, defaults to a newly created Config instance.
     * @returns A promise that resolves to the populated Blueprint object.
     *
     * @example
     * ```typescript
     * const configBuilder = ConfigBuilder.create();
     * const blueprint = await configBuilder.build(rawModules);
     * ```
     */
    async build(rawModules, blueprint = Config.create()) {
        const modules = this.extractModulesFromRaw(rawModules);
        const context = { modules, blueprint };
        const { middleware, defaultMiddlewarePriority = 10 } = this.extractOptionsFromModules(modules);
        return await Pipeline
            .create()
            .defaultPriority(defaultMiddlewarePriority)
            .send(context)
            .through(middleware)
            .then((v) => v.blueprint);
    }
    /**
     * Extract the modules from raw input.
     *
     * @param rawModules - The modules to extract.
     * @returns The list of modules extracted.
     */
    extractModulesFromRaw(rawModules) {
        return Object.values(rawModules).reduce((modules, value) => {
            return modules.concat(Object.values(value));
        }, []);
    }
    /**
     * Extract the configuration options from the modules.
     *
     * @param modules - The modules to extract options from.
     * @returns The configuration options.
     */
    extractOptionsFromModules(modules) {
        return modules.reduce((options, module) => {
            if (typeof module === 'function') {
                this.applyMetadata(module, options);
            }
            else {
                this.populateOptions(options, module.stone?.builder);
            }
            return options;
        }, { ...this.options });
    }
    /**
     * Apply metadata from a class to the options.
     *
     * @param module - The class to extract metadata from.
     * @param options - The options to populate.
     */
    applyMetadata(module, options) {
        if (hasBlueprint(module)) {
            const blueprint = getBlueprint(module);
            blueprint !== undefined && this.populateOptions(options, blueprint.stone?.builder);
        }
        else if (hasMetadata(module, CONFIG_MIDDLEWARE_KEY)) {
            const metadata = getMetadata(module, CONFIG_MIDDLEWARE_KEY);
            this.populateOptions(options, { middleware: [{ ...metadata, pipe: module }] });
        }
        else if (hasMetadata(module, CONFIGURATION_KEY)) {
            this.populateOptions(options, module.stone?.builder);
        }
    }
    /**
     * Populate the configuration options with metadata.
     *
     * @param options - The options to populate.
     * @param metadataOptions - The metadata to use for populating options.
     * @returns The updated configuration options.
     */
    populateOptions(options, metadataOptions) {
        if (Array.isArray(metadataOptions?.middleware)) {
            options.middleware = [...options.middleware, ...metadataOptions.middleware];
            options.defaultMiddlewarePriority = metadataOptions.defaultMiddlewarePriority ?? options.defaultMiddlewarePriority;
        }
        return options;
    }
}

/**
 * Custom error for Initialization layer operations.
 */
class InitializationError extends RuntimeError {
    constructor(message, options = {}) {
        super(message, options);
        this.name = 'InitializationError';
    }
}

/**
 * Class representing a CoreServiceProvider.
 *
 * The CoreServiceProvider is responsible for managing the core services,
 * listeners, subscribers, and adapters required by the application.
 * It interacts with the service container to bind and resolve dependencies,
 * ensuring all components are available when needed.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
class CoreServiceProvider {
    /**
     * Blueprint configuration used to retrieve app settings.
     */
    blueprint;
    /**
     * The service container that manages dependencies.
     */
    container;
    /**
     * The event emitter used for managing and firing events.
     */
    eventEmitter;
    /**
     * The logger
     */
    logger;
    /**
     * Create a new instance of CoreServiceProvider.
     *
     * @param container - The service container to manage dependencies.
     * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
     */
    constructor({ container, blueprint, eventEmitter, logger }) {
        if (logger === undefined) {
            throw new InitializationError('Logger is required to create a CoreServiceProvider instance.');
        }
        if (container === undefined) {
            throw new InitializationError('Container is required to create a CoreServiceProvider instance.');
        }
        if (blueprint === undefined) {
            throw new InitializationError('Blueprint is required to create a CoreServiceProvider instance.');
        }
        if (eventEmitter === undefined) {
            throw new InitializationError('EventEmitter is required to create a CoreServiceProvider instance.');
        }
        this.logger = logger;
        this.container = container;
        this.blueprint = blueprint;
        this.eventEmitter = eventEmitter;
    }
    /**
     * Get the list of services from the configuration.
     *
     * @returns A list of services or an array of service options.
     */
    get services() {
        return this.blueprint.get('stone.services', []);
    }
    /**
     * Get the list of listeners from the configuration.
     *
     * @returns A record of event listeners.
     */
    get listeners() {
        return this.blueprint.get('stone.listeners', {});
    }
    /**
     * Get the list of subscribers from the configuration.
     *
     * @returns A list of subscribers.
     */
    get subscribers() {
        return this.blueprint.get('stone.subscribers', []);
    }
    /**
     * Get the list of aliases from the configuration.
     *
     * @returns A record of class aliases.
     */
    get aliases() {
        return this.blueprint.get('stone.aliases', {});
    }
    /**
     * Register core components in the service container.
     *
     * This method registers services, listeners, adapters, and aliases in the container.
     */
    register() {
        this.registerServices()
            .registerListeners()
            .registerAliases();
    }
    /**
     * Boot core components.
     *
     * This method is used to bootstrap subscribers.
     */
    async boot() {
        await this.bootSubscribers();
    }
    /**
     * Register decorated and imported services.
     *
     * @returns This CoreServiceProvider instance for chaining.
     */
    registerServices() {
        this.services.forEach(service => {
            if (Array.isArray(service)) {
                const [Class, options] = service;
                this.container.autoBinding(Class, Class, options.singleton, options.alias);
            }
            else {
                this.container.autoBinding(service, service, true);
            }
        });
        return this;
    }
    /**
     * Register aliases in the service container.
     *
     * @returns This CoreServiceProvider instance for chaining.
     */
    registerAliases() {
        Object.entries(this.aliases).forEach(([alias, Class]) => {
            if (typeof Class === 'function' && Object.prototype.hasOwnProperty.call(Class, 'prototype')) {
                this.container.alias(Class, alias);
            }
        });
        return this;
    }
    /**
     * Register decorated and imported listeners in the event emitter.
     *
     * @returns This CoreServiceProvider instance for chaining.
     */
    registerListeners() {
        for (const [eventName, listeners] of Object.entries(this.listeners)) {
            for (const listener of listeners) {
                const instance = this.container.resolve(listener, true);
                if (instance?.handle !== undefined) {
                    /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
                    this.eventEmitter.on(eventName, async (event) => {
                        try {
                            await instance.handle(event);
                        }
                        catch (error) {
                            this.logger.error(`An error has occured with this listener (${String(listener)}) ${String(error.message)}`);
                        }
                    });
                }
            }
        }
        return this;
    }
    /**
     * Bootstrap subscribers by resolving them from the container and subscribing to the event emitter.
     *
     * @returns This CoreServiceProvider instance for chaining.
     */
    async bootSubscribers() {
        for (const subscriber of this.subscribers) {
            const instance = this.container.resolve(subscriber, true);
            try {
                await instance?.subscribe(this.eventEmitter);
            }
            catch (error) {
                this.logger.error(`An error has occured with this subscriber (${String(subscriber)}) ${String(error.message)}`);
            }
        }
    }
}

/**
 * Log level enumeration to define possible log levels.
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["TRACE"] = "trace";
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));

/**
 * Console Logger class.
 *
 * This class implements the ILogger interface and uses either the native console object or a custom logging tool.
 *
 * @example
 * ```typescript
 * const logger = ConsoleLogger.create({ blueprint });
 * logger.info('Application started');
 * ```
 */
class ConsoleLogger {
    blueprint;
    /**
     * Create a new ConsoleLogger instance.
     *
     * @param {LoggerOptions} options - Options for creating the ConsoleLogger.
     * @returns {ConsoleLogger} - A new instance of ConsoleLogger.
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Constructs a ConsoleLogger instance.
     *
     * @param {LoggerOptions} options - Options for creating the ConsoleLogger.
     */
    constructor({ blueprint }) {
        if (blueprint === undefined) {
            throw new RuntimeError('Blueprint is required to create a ConsoleLogger instance.');
        }
        this.blueprint = blueprint;
    }
    /**
     * Logs informational messages.
     *
     * @param {string} message - The message to log.
     * @param {...unknown[]} optionalParams - Optional parameters to log.
     */
    info(message, ...optionalParams) {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(this.formatMessage(message), ...optionalParams);
        }
    }
    /**
     * Logs debug-level messages, used for debugging purposes.
     *
     * @param {string} message - The message to log.
     * @param {...unknown[]} optionalParams - Optional parameters to log.
     */
    debug(message, ...optionalParams) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(this.formatMessage(message), ...optionalParams);
        }
    }
    /**
     * Logs warnings, used to indicate potential issues.
     *
     * @param {string} message - The warning message to log.
     * @param {...unknown[]} optionalParams - Optional parameters to log.
     */
    warn(message, ...optionalParams) {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage(message), ...optionalParams);
        }
    }
    /**
     * Logs errors, used to report errors or exceptions.
     *
     * @param {string} message - The error message to log.
     * @param {...unknown[]} optionalParams - Optional parameters to log.
     */
    error(message, ...optionalParams) {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(this.formatMessage(message), ...optionalParams);
        }
    }
    /**
     * Logs general messages, similar to `info` but less specific.
     *
     * @param {string} message - The message to log.
     * @param {...unknown[]} optionalParams - Optional parameters to log.
     */
    log(message, ...optionalParams) {
        if (this.shouldLog(LogLevel.INFO)) {
            console.log(this.formatMessage(message), ...optionalParams);
        }
    }
    /**
     * Determines if the specified log level should be logged based on the current log level setting.
     *
     * @param {'trace' | 'debug' | 'info' | 'warn' | 'error'} level - The log level to check.
     * @returns {boolean} - True if the specified log level should be logged, otherwise false.
     */
    shouldLog(level) {
        const levels = ['trace', 'debug', 'info', 'warn', 'error'];
        const requestedLevelIndex = levels.indexOf(level);
        const currentLevelIndex = levels.indexOf(this.blueprint.get('stone.logger.level', 'info'));
        return requestedLevelIndex >= currentLevelIndex;
    }
    /**
     * Formats the log message by optionally adding a timestamp.
     *
     * @param {string} message - The message to format.
     * @returns {string} - The formatted message.
     */
    formatMessage(message) {
        if (this.blueprint.get('stone.logger.useTimestamp', false)) {
            return `[${new Date().toISOString()}] ${message}`;
        }
        return message;
    }
}

/**
 * Custom error for Integration layer operations.
 */
class IntegrationError extends RuntimeError {
    constructor(message, options = {}) {
        super(message, options);
        this.name = 'IntegrationError';
    }
}

/**
 * Class representing an ErrorHandler.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
class ErrorHandler {
    /**
     * The logger instance.
     */
    logger;
    /**
     * The log levels configured for error classes.
     */
    levels;
    /**
     * List of error classes to ignore.
     */
    dontReport;
    /**
     * Set of errors that have been reported.
     */
    reportedError;
    /**
     * Whether to avoid reporting duplicate errors.
     */
    withoutDuplicates;
    /**
     * Handler to provide the render return response.
     */
    renderResponseResolver;
    /**
     * Create an ErrorHandler.
     *
     * @param options - The options to create an ErrorHandler.
     * @returns A new ErrorHandler instance.
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Create an ErrorHandler.
     *
     * @param container - Service container to resolve dependencies.
     */
    constructor({ blueprint, logger, renderResponseResolver }) {
        if (logger === undefined) {
            throw new IntegrationError('Logger is required to create an ErrorHandler instance.');
        }
        if (blueprint === undefined) {
            throw new IntegrationError('Blueprint is required to create an ErrorHandler instance.');
        }
        if (renderResponseResolver === undefined) {
            throw new IntegrationError('RenderResponseResolver is required to create an ErrorHandler instance.');
        }
        this.logger = logger;
        this.reportedError = new Set();
        this.renderResponseResolver = renderResponseResolver;
        this.withoutDuplicates = blueprint.get('stone.errorHandler.dontReport', true);
        this.dontReport = blueprint.get('stone.errorHandler.dontReport', new Set());
        this.levels = blueprint.get('stone.errorHandler.levels', { debug: [], info: [], warn: [], error: [], trace: [] });
    }
    /**
     * Determine log level by error class.
     *
     * @param Class - The error class.
     * @param level - The log level.
     * @returns This ErrorHandler instance.
     */
    level(Class, level) {
        this.levels[level] ??= [];
        this.levels[level].push(Class);
        return this;
    }
    /**
     * Do not report this error class.
     *
     * @param Class - The error class to ignore.
     * @returns This ErrorHandler instance.
     */
    ignore(Class) {
        this.dontReport.add(Class);
        return this;
    }
    /**
     * Stop ignoring this error class.
     *
     * @param Class - The error class to stop ignoring.
     * @returns This ErrorHandler instance.
     */
    stopIgnoring(Class) {
        this.dontReport.delete(Class);
        return this;
    }
    /**
     * Report this error class multiple times.
     *
     * @returns This ErrorHandler instance.
     */
    reportDuplicates() {
        this.withoutDuplicates = false;
        return this;
    }
    /**
     * Do not report this error class multiple times.
     *
     * @returns This ErrorHandler instance.
     */
    dontReportDuplicates() {
        this.withoutDuplicates = true;
        return this;
    }
    /**
     * Check if this error instance should be reported or not.
     *
     * @param error - The error instance to check.
     * @returns Whether the error should be reported.
     */
    shouldReport(error) {
        if (this.withoutDuplicates && this.reportedError.has(error)) {
            return false;
        }
        return !Array.from(this.dontReport).some((Class) => error instanceof Class);
    }
    /**
     * Report this error instance.
     *
     * @param error - The error instance to report.
     * @returns This ErrorHandler instance.
     */
    report(error) {
        if (this.shouldReport(error)) {
            this.reportError(error);
        }
        return this;
    }
    /**
     * Prepare this error instance for rendering.
     *
     * @param error - The error instance to prepare.
     * @returns The rendered error object.
     */
    render(error) {
        return this.renderResponseResolver(error);
    }
    /**
     * Report this error instance.
     *
     * @param error - The error instance to report.
     */
    reportError(error) {
        this.reportedError.add(error);
        const errorContext = this.buildErrorContext(error);
        const level = Object.entries(this.levels).find(([, classes]) => classes.find(Class => error instanceof Class))?.[0] ?? 'error';
        if (level in this.logger) {
            this.logger[level]?.(error.message, errorContext);
        }
        else {
            this.logger.error(error.message, errorContext);
        }
    }
    /**
     * Build error context object.
     *
     * @param error - The error instance to build context for.
     * @returns The error context object.
     */
    buildErrorContext(error) {
        const context = [{ error }];
        if ('context' in error)
            context.push(error.context);
        if ('metadata' in error)
            context.push(error.metadata);
        return context;
    }
}

/**
 * Class representing an Event.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
class Event {
    /**
     * The type of the event.
     */
    type;
    /**
     * The metadata associated with the event.
     */
    metadata;
    /**
     * The source of the event.
     */
    source;
    /**
     * The timestamp of the event creation.
     */
    timeStamp;
    /**
     * Create an Event.
     *
     * @param options - The options to create an Event.
     */
    constructor({ type = '', metadata = {}, source, timeStamp = Date.now() }) {
        this.type = type;
        this.source = source;
        this.timeStamp = timeStamp;
        this.metadata = isPlainObject(metadata) ? metadata : {};
    }
    /**
     * Get data from metadata.
     *
     * @param key - The key to retrieve from metadata.
     * @param fallback - The fallback value if the key is not found.
     * @returns The value associated with the key or the fallback.
     */
    getMetadataValue(key, fallback = null) {
        return get(this.metadata, key, fallback);
    }
    /**
     * Add data to metadata.
     *
     * @param key - The key or object to add to metadata.
     * @param value - The value to associate with the key.
     * @returns This Event instance.
     */
    setMetadataValue(key, value = null) {
        Object.entries(isPlainObject(key) ? key : { [key]: value }).forEach(([name, val]) => set(this.metadata, name, val));
        return this;
    }
    /**
     * Return a cloned instance.
     *
     * @returns A cloned instance of the current class.
     */
    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

/**
 * Class representing a kernel Event.
 *
 * @extends Event
 */
class KernelEvent extends Event {
    /**
     * RESPONSE_PREPARED Event name, fires before preparing the response.
     *
     * @event KernelEvent#RESPONSE_PREPARED
     */
    static RESPONSE_PREPARED = 'stonejs@kernel.response_prepared';
    /**
     * PREPARING_RESPONSE Event name, fires after the response was prepared.
     *
     * @event KernelEvent#PREPARING_RESPONSE
     */
    static PREPARING_RESPONSE = 'stonejs@kernel.preparing_response';
    /**
     * Create a KernelEvent.
     *
     * @param options - The options to create a KernelEvent.
     * @returns A new KernelEvent instance.
     */
    static create(options) {
        return new this(options);
    }
}

/**
 * EVENT_EMITTER_ALIAS.
 */
const EVENT_EMITTER_ALIAS = 'eventEmitter';
/**
 * Class representing an EventEmitter.
 */
class EventEmitter extends NodeEventEmitter {
    /**
     * Overloaded emit method to accept either a custom Event or event name and arguments.
     *
     * @param event - The event name or an instance of Event.
     * @param args - Additional arguments to pass when emitting.
     */
    emit(event, ...args) {
        if (event instanceof Event) {
            return super.emit(event.type, event);
        }
        else {
            return super.emit(event, ...args);
        }
    }
}

/**
 * Class representing a Kernel.
 *
 * The Kernel class is responsible for managing the main lifecycle of the application, including middleware
 * registration and provider management. It manages the initialization, registration, and booting of the
 * components required for a fully functional application.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
class Kernel {
    logger;
    container;
    blueprint;
    providers;
    eventEmitter;
    registeredProviders;
    /**
     * Create a Kernel.
     *
     * @param options - Kernel configuration options.
     * @returns A new Kernel instance.
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Create a Kernel.
     *
     * @param options - Kernel configuration options.
     */
    constructor({ blueprint, container, eventEmitter, logger }) {
        if (!(blueprint instanceof Config)) {
            throw new InitializationError('Blueprint is required to create a Kernel instance.');
        }
        if (!(container instanceof Container)) {
            throw new InitializationError('Container is required to create a Kernel instance.');
        }
        if (!(eventEmitter instanceof EventEmitter)) {
            throw new InitializationError('EventEmitter is required to create a Kernel instance.');
        }
        this.logger = logger;
        this.providers = new Set();
        this.blueprint = blueprint;
        this.container = container;
        this.eventEmitter = eventEmitter;
        this.registeredProviders = new Set();
        this.registerBaseBindings();
    }
    /**
     * Get all middleware.
     */
    get middleware() {
        return this.blueprint.get('stone.kernel.middleware', []);
    }
    /**
     * Get terminate middleware.
     */
    get terminateMiddleware() {
        return this.middleware.filter((middleware) => {
            const pipe = typeof middleware.pipe === 'function'
                ? middleware.pipe
                : (typeof middleware === 'function' ? middleware : undefined);
            return typeof pipe?.prototype?.terminate === 'function';
        });
    }
    /**
     * Hook that runs before handling each event.
     * Useful to initialize things at each event.
     */
    async beforeHandle() {
        this.resolveProviders();
        for (const provider of this.providers) {
            await provider.beforeHandle?.();
        }
        await this.onRegister();
    }
    /**
     * Handle IncomingEvent.
     *
     * @param event - The incoming event to handle.
     * @returns The outgoing response.
     */
    async handle(event) {
        await this.onBootstrap(event);
        return await this.sendEventThroughDestination(event);
    }
    /**
     * Hook that runs just before or just after returning the response.
     * Useful to perform cleanup.
     */
    async onTerminate() {
        for (const provider of this.providers) {
            await provider.onTerminate?.();
        }
        const event = this.container.make('event');
        const response = this.container.has('response') ? this.container.make('response') : undefined;
        await Pipeline
            .create(this.makePipelineOptions())
            .send({ event, response })
            .via('terminate')
            .through(this.terminateMiddleware)
            .thenReturn();
    }
    /**
     * Register services to the container.
     */
    async onRegister() {
        await this.registerProviders();
    }
    /**
     * Hook that runs at each event and just before running the action handler.
     * Useful to bootstrap things at each event.
     *
     * @param event - The incoming event.
     * @throws {InitializationError} If no event is provided.
     */
    async onBootstrap(event) {
        if (event === undefined) {
            throw new InitializationError('No IncomingEvent provided.');
        }
        this.container.instance('event', event).instance('request', event);
        if (typeof event.clone === 'function') {
            this.container.instance('originalEvent', event.clone());
        }
        await this.bootProviders();
    }
    /**
     * Send event to the destination.
     *
     * @param event - The incoming event.
     * @returns The prepared response.
     */
    async sendEventThroughDestination(event) {
        return await Pipeline
            .create(this.makePipelineOptions())
            .send({ event })
            .through(this.middleware)
            .then(async (context) => await this.prepareResponse(context));
    }
    /**
     * Prepare response before sending
     *
     * @protected
     * @param context - The Kernel event context.
     * @returns The prepared response.
     */
    async prepareResponse(context) {
        if (context.response === undefined) {
            throw new InitializationError('No response was returned');
        }
        if (typeof context.response.prepare !== 'function') {
            throw new InitializationError('Return response must be an instance of `OutgoingResponse` or a subclass of it.');
        }
        const metadata = { ...context };
        this.container.instance('response', context.response);
        this.eventEmitter.emit(KernelEvent.create({ type: KernelEvent.PREPARING_RESPONSE, source: this, metadata }));
        context.response = await context.response.prepare(context.event, this.blueprint);
        this.eventEmitter.emit(KernelEvent.create({ type: KernelEvent.RESPONSE_PREPARED, source: this, metadata }));
        return context.response;
    }
    /**
     * Creates pipeline options for the Kernel.
     *
     * @protected
     * @returns The pipeline options for configuring middleware.
     */
    makePipelineOptions() {
        return {
            resolver: (middleware) => {
                if (isConstructor(middleware)) {
                    return this.container.resolve(middleware, true);
                }
            }
        };
    }
    /**
     * Registers the base bindings into the container.
     *
     * @private
     * @returns The Kernel instance.
     */
    registerBaseBindings() {
        this.container
            .instance(Config, this.blueprint)
            .instance(Container, this.container)
            .instance(ConsoleLogger, this.logger)
            .instance(EventEmitter, this.eventEmitter)
            .alias(Config, 'config')
            .alias(Config, 'blueprint')
            .alias(Container, 'container')
            .alias(EventEmitter, 'events')
            .alias(ConsoleLogger, 'logger')
            .alias(EventEmitter, 'eventEmitter');
        return this;
    }
    /**
     * Resolves all providers defined in the blueprint.
     *
     * @private
     * @returns The Kernel instance.
     */
    resolveProviders() {
        this.blueprint.get('stone.providers', [])
            .map((provider) => this.container.resolve(provider, true))
            .filter((provider) => provider.mustSkip === undefined || !(provider.mustSkip?.()))
            .forEach((provider) => this.providers.add(provider));
        return this;
    }
    /**
     * Registers the providers.
     *
     * @private
     * @returns A promise that resolves when all providers are registered.
     */
    async registerProviders() {
        for (const provider of this.providers) {
            if (provider.register === undefined || this.registeredProviders.has(provider.constructor.name)) {
                continue;
            }
            await provider.register();
            this.registeredProviders.add(provider.constructor.name);
        }
    }
    /**
     * Boots the providers.
     *
     * @private
     * @returns A promise that resolves when all providers have been booted.
     */
    async bootProviders() {
        for (const provider of this.providers) {
            await provider.boot?.();
        }
    }
}

/**
 * Class representing StoneFactory.
 *
 * The StoneFactory is responsible for creating and running the main application by resolving
 * the appropriate adapter from the provided blueprint. It handles the core setup of the application.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
class StoneFactory {
    /**
     * The blueprint configuration for the application.
     */
    blueprint;
    /**
     * Create a new StoneFactory instance.
     *
     * @param options - The options to create the StoneFactory.
     * @returns A new StoneFactory instance.
     *
     * @example
     * ```typescript
     * const factory = StoneFactory.create({ blueprint });
     * ```
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Create a new instance of StoneFactory.
     *
     * @param options - The options to create the StoneFactory.
     */
    constructor({ blueprint }) {
        if (blueprint === undefined) {
            throw new RuntimeError('Blueprint is required to create a StoneFactory instance.');
        }
        this.blueprint = blueprint;
    }
    /**
     * Run the application by resolving and executing the adapter.
     *
     * @returns A promise that resolves to the result of the adapter's `run` method.
     * @throws {IntegrationError} If no adapter resolver or adapter is provided in the blueprint.
     *
     * @example
     * ```typescript
     * await factory.run();
     * ```
     */
    async run() {
        return await this.makeAdapter().run();
    }
    /**
     * Resolve and create the appropriate adapter from the blueprint.
     *
     * @returns The resolved adapter instance.
     * @throws {IntegrationError} If no adapter resolver or adapter is provided in the blueprint.
     */
    makeAdapter() {
        const resolver = this.blueprint.get('stone.adapter.resolver');
        if (resolver === undefined) {
            throw new IntegrationError('No adapter resolver provided. Ensure that a valid adapter resolver is configured under "stone.adapter.resolver" in the blueprint configuration.');
        }
        const adapter = resolver(this.blueprint);
        if (adapter === undefined) {
            throw new IntegrationError('No adapters provided. Stone.js needs at least one adapter to run.');
        }
        return adapter;
    }
}

/**
 * Default logger resolver function.
 *
 * This function resolves the logger for the application, using the blueprint configuration.
 * By default, it creates a `ConsoleLogger` instance with the provided blueprint.
 *
 * @param {IBlueprint} blueprint - The blueprint configuration to use for the logger.
 * @returns {ConsoleLogger} - A `ConsoleLogger` instance.
 */
function defaultLoggerResolver(blueprint) {
    return ConsoleLogger.create({ blueprint });
}
/**
 * Default error handler resolver function.
 *
 * This function resolves the error handler for the application, using the blueprint configuration.
 * It creates an `ErrorHandler` instance with the given blueprint, logger, and a response rendering resolver.
 *
 * @param {IBlueprint} blueprint - The blueprint configuration to use for the error handler.
 * @returns {ErrorHandler<string>} - An `ErrorHandler` instance configured to handle errors.
 */
function defaultErrorHandlerResolver(blueprint) {
    const renderResponseResolver = (error) => error.message;
    const loggerResolver = blueprint.get('stone.logger.resolver', defaultLoggerResolver);
    return ErrorHandler.create({ blueprint, logger: loggerResolver(blueprint), renderResponseResolver });
}
/**
 * Default kernel resolver function.
 *
 * This function resolves the kernel for the application, using the blueprint configuration.
 * It creates a `Kernel` instance with the given blueprint, logger, container, and an event emitter.
 *
 * @template U, V
 * @param {IBlueprint} blueprint - The blueprint configuration to use for the kernel.
 * @returns {Kernel<U extends IncomingEvent, V extends OutgoingResponse>} - A `Kernel` instance configured with the provided blueprint.
 */
function defaultKernelResolver(blueprint) {
    const loggerResolver = blueprint.get('stone.logger.resolver', defaultLoggerResolver);
    return Kernel.create({ blueprint, logger: loggerResolver(blueprint), container: Container.create(), eventEmitter: new EventEmitter() });
}

/**
 * Class representing an Adapter.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 *
 * @template RawEventType
 * @template RawResponseType
 * @template ExecutionContextType
 * @template IncomingEventType
 * @template IncomingEventOptionsType
 * @template OutgoingResponseType
 * @template AdapterContextType
 */
class Adapter {
    logger;
    hooks;
    blueprint;
    errorHandler;
    handlerResolver;
    /**
     * Create an Adapter.
     *
     * @param options - Adapter options.
     */
    constructor({ hooks, logger, blueprint, errorHandler, handlerResolver }) {
        if (logger === undefined) {
            throw new IntegrationError('Logger is required to create an Adapter instance.');
        }
        if (errorHandler === undefined) {
            throw new IntegrationError('ErrorHandler is required to create an Adapter instance.');
        }
        if (blueprint?.get === undefined) {
            throw new IntegrationError('Blueprint is required to create an Adapter instance.');
        }
        if (typeof handlerResolver !== 'function') {
            throw new IntegrationError(`The 'handlerResolver' expects a function or a class, but provided: ${typeof handlerResolver}.`);
        }
        this.logger = logger;
        this.hooks = hooks ?? [];
        this.blueprint = blueprint;
        this.errorHandler = errorHandler;
        this.handlerResolver = handlerResolver;
    }
    /**
     * Incoming message listener.
     *
     * @param context - The event context.
     * @returns Platform-specific output.
     */
    async sendEventThroughDestination(context) {
        let result;
        const eventHandler = this.handlerResolver(this.blueprint);
        try {
            if (eventHandler === undefined) {
                throw new IntegrationError('No eventHandler provided');
            }
            await this.beforeHandle(eventHandler);
            const rawResponseWrapper = await Pipeline
                .create(this.makePipelineOptions(eventHandler))
                .send(context)
                .through(this.blueprint.get('stone.adapter.middleware', []))
                .then((context) => {
                if (context.rawResponseBuilder?.build === undefined) {
                    throw new IntegrationError('No RawResponseBuilder provided');
                }
                return context.rawResponseBuilder.build();
            });
            if (rawResponseWrapper?.respond === undefined) {
                throw new IntegrationError('No RawResponseWrapper provided');
            }
            result = await rawResponseWrapper.respond();
        }
        catch (e) {
            const error = IntegrationError.create(e.message, { cause: e, metadata: context });
            result = this.errorHandler.report(error).render(error);
        }
        finally {
            try {
                await this.onTerminate(eventHandler, context);
            } catch (e) {
                const error = IntegrationError.create(e.message, { cause: e, metadata: context });
                result = this.errorHandler.report(error).render(error);
            }
        }
        return result;
    }
    /**
     * Hook that runs once before everything.
     */
    async onInit() {
        await this.executeHooks('onInit');
    }
    /**
     * Hook that runs before handling each event.
     *
     * @param eventHandler - Action handler to be run.
     */
    async beforeHandle(eventHandler) {
        await this.executeHooks('beforeHandle');
        if (typeof eventHandler.beforeHandle === 'function') {
            await eventHandler.beforeHandle();
        }
    }
    /**
     * Hook that runs after running the action handler.
     *
     * @param eventHandler - Action handler to be run.
     * @param _adapterContext - The event context.
     */
    async onTerminate(eventHandler, _adapterContext) {
        await this.executeHooks('onTerminate');
        if (typeof eventHandler?.onTerminate === 'function') {
            await eventHandler.onTerminate();
        }
    }
    /**
     * Execute lifecycle hooks.
     *
     * @param hook - The hook to execute.
     */
    async executeHooks(hook) {
        if (Array.isArray(this.hooks[hook])) {
            for (const listener of this.hooks[hook]) {
                await listener(this.blueprint);
            }
        }
    }
    /**
     * Create pipeline options for the Adapter.
     *
     * @returns The pipeline options for transforming the event.
     */
    makePipelineOptions(eventHandler) {
        return {
            resolver: (middleware) => {
                if (isConstructor(middleware)) {
                    return Reflect.construct(middleware, [{ eventHandler, blueprint: this.blueprint, logger: this.logger }]);
                }
            }
        };
    }
}

/**
 * Class representing a generic AdapterEventBuilder.
 *
 * This class provides a builder pattern to construct an object of type `R` based on options of type `V`.
 * It is intended to handle complex object creation by allowing flexible modification of options and resolving the final object.
 *
 * @template V - The type of the options used to build the final object. Must be an object.
 * @template R - The type of the final object that will be built.
 */
class AdapterEventBuilder {
    /**
     * The options used for building the final object.
     */
    options;
    /**
     * The resolver function that takes the options and returns the final object of type `R`.
     */
    resolver;
    /**
     * Static method to create a new AdapterEventBuilder instance.
     *
     * @param options - The options for creating the AdapterEventBuilder instance, including the initial options and the resolver function.
     * @returns A new instance of AdapterEventBuilder.
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Constructs an AdapterEventBuilder.
     *
     * @param options - The options for creating the AdapterEventBuilder instance, including the initial options and the resolver function.
     * @protected
     */
    constructor({ options, resolver }) {
        if (typeof resolver !== 'function') {
            throw new IntegrationError('Resolver is required to create an AdapterEventBuilder instance.');
        }
        this.resolver = resolver;
        /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */
        this.options = options ?? {};
    }
    /**
     * Adds or updates a key-value pair in the options.
     *
     * @param key - The key in the options to be updated.
     * @param value - The value to set for the given key.
     * @returns This instance of AdapterEventBuilder for method chaining.
     */
    add(key, value) {
        Reflect.set(this.options, key, value);
        return this;
    }
    /**
     * Builds the final object by using the resolver function with the current options.
     *
     * @returns The final object of type `R`.
     */
    build() {
        return this.resolver(this.options);
    }
}

/**
 * ConfigMiddleware decorator to mark a class as middleware within the Stone.js framework.
 *
 * This decorator is used to customize classes as middleware, allowing them to be registered and managed
 * as part of the request/response lifecycle or other layers such as adapter, kernel, or router.
 *
 * @param options - The configuration options for the middleware, including platform, priority, singleton registration, alias, layer, and type.
 * @returns A decorator function to set metadata on the target class.
 *
 * @example
 * ```typescript
 * @ConfigMiddleware({ priority: 1, singleton: true })
 * class MyMiddleware {
 *   // ConfigMiddleware class logic here.
 * }
 * ```
 */
const ConfigMiddleware = (options = {}) => {
    return setClassMetadata(CONFIG_MIDDLEWARE_KEY, options);
};

/**
 * AdapterMiddleware decorator to mark a class as middleware within the Stone.js framework.
 *
 * This decorator is used to customize classes as middleware, allowing them to be registered and managed
 * as part of the request/response lifecycle or other layers such as adapter, kernel, or router.
 *
 * @param options - The configuration options for the middleware, including platform, priority, singleton registration, alias, layer, and type.
 * @returns A decorator function to set metadata on the target class.
 *
 * @example
 * ```typescript
 * @AdapterMiddleware({ priority: 1, singleton: true })
 * class MyMiddleware {
 *   // AdapterMiddleware class logic here.
 * }
 * ```
 */
const AdapterMiddleware = (options = {}) => {
    return setClassMetadata(ADAPTER_MIDDLEWARE_KEY, options);
};

/**
 * Configuration decorator to set imperative configuration.
 *
 * @example
 * ```typescript
 * @Configuration()
 * class MyClass {
 *   // ...
 * }
 * ```
 *
 * @param options - The configuration options.
 * @returns A class decorator function that sets the metadata using the provided options.
 */
const Configuration = (options = {}) => {
    return setClassMetadata(CONFIGURATION_KEY, options);
};

/**
 * Service decorator to mark a class as a service and automatically bind it to the container.
 *
 * This decorator is useful for marking classes that should be treated as services by the Stone.js framework,
 * making them easily injectable and manageable by the service container.
 *
 * @param options - The configuration options for the service, including singleton and alias settings.
 * @returns A decorator function to set metadata on the target class.
 *
 * @example
 * ```typescript
 * @Service({ singleton: true, alias: 'MyService' })
 * class MyService {
 *   // Service class logic here.
 * }
 * ```
 */
const Service = (options = {}) => {
    return setClassMetadata(SERVICE_KEY, options);
};

/**
 * Injectable decorator to mark a class as a service and automatically bind it to the container.
 *
 * This decorator can be used to easily mark a class as injectable within the Stone.js framework,
 * allowing it to be managed by the service container.
 *
 * @param options - The configuration options for the service.
 * @returns A function to set the class as a service.
 *
 * @example
 * ```typescript
 * @Injectable({ singleton: true, alias: 'MyInjectableService' })
 * class MyInjectableService {
 *   // Service class logic here.
 * }
 * ```
 */
const Injectable = Service;

/**
 * Listener decorator to mark a class as a listener for a specific event.
 *
 * This decorator is useful for customizing classes that need to listen for specific events within the Stone.js framework.
 * It allows the class to be recognized and managed by the event-handling system.
 *
 * @param options - The configuration options for the listener, including the event to listen for.
 * @returns A decorator function to set metadata on the target class.
 *
 * @example
 * ```typescript
 * @Listener({ event: 'UserRegistered' })
 * class UserRegisteredListener {
 *   // Listener class logic here.
 * }
 * ```
 */
const Listener = (options) => {
    return setClassMetadata(LISTENER_KEY, options);
};

/**
 * Middleware decorator to mark a class as middleware within the Stone.js framework.
 *
 * This decorator is used to customize classes as middleware, allowing them to be registered and managed
 * as part of the request/response lifecycle or other layers such as adapter, kernel, or router.
 *
 * @param options - The configuration options for the middleware, including platform, priority, singleton registration, alias, layer, and type.
 * @returns A decorator function to set metadata on the target class.
 *
 * @example
 * ```typescript
 * @Middleware({ platform: 'node', priority: 1, singleton: true, alias: 'MyMiddleware', layer: 'adapter', type: 'input' })
 * class MyMiddleware {
 *   // Middleware class logic here.
 * }
 * ```
 */
const Middleware = (options = {}) => {
    return setClassMetadata(MIDDLEWARE_KEY, options);
};

/**
 * Subscriber decorator to mark a class as a subscriber.
 *
 * This decorator is useful for customizing classes as subscribers within the Stone.js framework,
 * allowing them to listen for events or perform specific tasks based on their subscription.
 *
 * @param options - The configuration options for the subscriber.
 * @returns A decorator function to set metadata on the target class.
 *
 * @example
 * ```typescript
 * @Subscriber({ event: 'UserCreated' })
 * class UserCreatedSubscriber {
 *   // Subscriber class logic here.
 * }
 * ```
 */
const Subscriber = (options = {}) => {
    return setClassMetadata(SUBSCRIBER_KEY, options);
};

/**
 * **Default Logger Configuration**
 *
 * The `logger` constant provides a default setup for the logger.
 * It includes the following default settings:
 *
 * - **Log Level**: `'error'` — Only logs error messages.
 * - **Color Output**: Disabled — Logs are displayed without color formatting.
 * - **Timestamp**: Disabled — Timestamps are not included in log messages.
 * - **Resolver**: `defaultLoggerResolver` — Uses the default logger resolver function.
 *
 * This default configuration can be overridden by providing a custom `LoggerConfig` object.
 */
const logger = {
    level: 'error',
    useColors: false,
    useTimestamp: false,
    resolver: defaultLoggerResolver
};

/**
 * Class representing the KernelHandlerMiddleware.
 *
 * This middleware is responsible for handling routing and event processing within the kernel context.
 * It uses routers and event handlers to process incoming events and generate responses.
 *
 * @template IncomingEventType - The type of incoming event, extending IncomingEvent.
 * @template OutgoingResponseType - The type of outgoing response, extending OutgoingResponse.
 * @template KernelContextType - The type of kernel context, default is KernelContext.
 */
class KernelHandlerMiddleware {
    /**
     * The service container for dependency injection.
     */
    container;
    /**
     * The blueprint for resolving configuration and dependencies.
     */
    blueprint;
    /**
     * Constructor for the KernelHandlerMiddleware.
     *
     * @param {container, blueprint} options - The container used for dependency injection.
     */
    constructor({ container, blueprint }) {
        this.container = container;
        this.blueprint = blueprint;
    }
    /**
     * Handles the incoming event, processes it, and invokes the next middleware in the pipeline.
     *
     * @param context - The kernel context containing the incoming event and other data.
     * @param next - The next middleware in the pipeline.
     * @returns A promise that resolves to the outgoing response after processing.
     *
     * @throws {InitializationError} If no router or event handler is provided.
     */
    async handle(context, next) {
        const router = this.getRouter();
        if (router !== undefined) {
            context.response = await router.dispatch(context.event);
            return await next(context);
        }
        const handler = this.resolveHandler();
        if (handler !== undefined) {
            context.response = await this.executeHandler(handler, context.event);
            return await next(context);
        }
        throw new InitializationError('No routers nor handlers have been provided.');
    }
    /**
     * Retrieves the router instance from the container.
     *
     * @returns The router instance if available, otherwise undefined.
     */
    getRouter() {
        if (this.container.has('router')) {
            return this.container.make('router');
        }
        return undefined;
    }
    /**
     * Resolves the event handler from the blueprint.
     *
     * @returns The resolved event handler or undefined if not found.
     */
    resolveHandler() {
        const handler = this.blueprint.get('stone.handler');
        if (isConstructor(handler)) {
            return this.container.resolve(handler, true);
        }
        return handler;
    }
    /**
     * Executes the resolved event handler for the given event.
     *
     * @param handler - The event handler to execute.
     * @param event - The incoming event to be processed.
     * @returns A promise that resolves to the outgoing response.
     */
    async executeHandler(handler, event) {
        if (typeof handler.handle === 'function') {
            try {
                return await handler.handle(event);
            } catch (error) {
                throw InitializationError.create(error.message, { cause: error, metadata: { handler, event } });
            }
        }
        return await handler(event);
    }
}

/**
 * Global app-level settings for all adapters.
 *
 * This object defines the kernel-level settings for middleware, which apply to all adapters.
 * It allows you to configure middleware behavior, including event processing, response handling,
 * and termination processing.
 */
const kernel = {
    // Global middleware settings for all adapters.// Example:
    // Example:
    // event: [KernelHandlerMiddleware, (...) => ...],
    middleware: [
        { priority: 100, pipe: KernelHandlerMiddleware }
    ],
    // The default kernel resolver
    resolver: defaultKernelResolver
};

/**
 * Middleware to build a blueprint from provided modules and pass it to the next pipeline step.
 *
 * This middleware processes each module to extract its blueprint or configuration metadata, merges
 * them into a single meta blueprint, and sets the resulting blueprint in the provided context.
 * It uses `Promise.all()` to execute the module processing concurrently for better performance.
 *
 * @param context - The configuration context containing modules and blueprint.
 * @param next - The next function in the pipeline.
 * @returns A promise that resolves to the updated blueprint.
 *
 * @example
 * ```typescript
 * await BlueprintMiddleware({ modules, blueprint }, next);
 * ```
 */
const BlueprintMiddleware = async ({ modules, blueprint }, next) => {
    const declarativeBlueprints = modules.map((module) => hasBlueprint(module) ? getBlueprint(module) : ({ stone: {} }));
    const imperativeBlueprints = await Promise.all(modules.map(async (module) => await extractImperativeBlueprintFromModule(module)));
    blueprint.set(mergeBlueprints(...declarativeBlueprints, ...imperativeBlueprints));
    return await next({ modules, blueprint });
};
/**
 * Middleware to assign the main handler for the application from the provided modules.
 *
 * This middleware finds a module marked as the main application entry point and assigns it as
 * the handler in the blueprint. Throws an error if no main handler is found.
 *
 * @param context - The configuration context containing modules and blueprint.
 * @param next - The next function in the pipeline.
 * @returns The updated blueprint.
 *
 * @example
 * ```typescript
 * MainHandlerMiddleware({ modules, blueprint }, next);
 * ```
 */
const MainHandlerMiddleware = ({ modules, blueprint }, next) => {
    const mainHandler = modules.find(module => typeof module === 'function' && hasMetadata(module, MAIN_HANDLER_KEY));
    if (mainHandler === undefined) {
        throw new SetupError('No Main handler provided');
    }
    blueprint.set('stone.handler', mainHandler);
    return next({ modules, blueprint });
};
/**
 * Middleware to set the current adapter configuration in the blueprint.
 *
 * This middleware looks for the preferred adapter, followed by the adapter with the matching alias,
 * and finally the default adapter. The selected adapter is then set in the blueprint.
 *
 * @param context - The configuration context containing the modules and blueprint.
 * @param next - The next function in the pipeline to continue processing.
 * @returns The updated blueprint or a promise resolving to the updated blueprint.
 *
 * @example
 * ```typescript
 * await SetCurrentAdapterMiddleware({ modules, blueprint }, next);
 * ```
 */
const SetCurrentAdapterMiddleware = ({ modules, blueprint }, next) => {
    const adapters = blueprint.get('stone.adapters', []);
    const currentAlias = blueprint.get('stone.adapter.alias');
    const adapter = adapters?.find(v => v.preferred === true) ?? adapters?.find(v => v.current === true) ?? adapters?.find(v => v.alias === currentAlias) ?? adapters?.find(v => v.default === true);
    blueprint.set('stone.adapter', adapter);
    return next({ modules, blueprint });
};
/**
 * Middleware to add service providers to the blueprint.
 *
 * This middleware identifies modules marked as service providers and adds them to the blueprint's
 * list of providers.
 *
 * @param context - The configuration context containing modules and blueprint.
 * @param next - The next function in the pipeline.
 * @returns The updated blueprint.
 *
 * @example
 * ```typescript
 * ProviderMiddleware({ modules, blueprint }, next);
 * ```
 */
const ProviderMiddleware = ({ modules, blueprint }, next) => {
    const providers = modules.filter(module => typeof module === 'function' && hasMetadata(module, PROVIDER_KEY));
    blueprint.add('stone.providers', providers);
    return next({ modules, blueprint });
};
/**
 * Middleware to register service providers to the `onInit` hook of the current adapter.
 *
 * This middleware filters modules to identify service providers that implement the `onInit` hook,
 * and adds them to the `onInit` lifecycle event of the current adapter.
 *
 * @param {ConfigContext} context - The configuration context containing the modules and blueprint.
 * @param {NextPipe<ConfigContext, IBlueprint>} next - The next function in the middleware pipeline.
 * @returns {IBlueprint | Promise<IBlueprint>} - Returns the updated blueprint or a promise resolving to it.
 *
 * @example
 * ```typescript
 * await RegisterProviderToOnInitHookMiddleware({ modules, blueprint }, next);
 * ```
 */
const RegisterProviderToOnInitHookMiddleware = ({ modules, blueprint }, next) => {
    const adapter = blueprint.get('stone.adapter');
    const providers = modules.filter(module => typeof module === 'function' && hasMetadata(module, PROVIDER_KEY));
    if (adapter?.hooks !== undefined) {
        providers
            .map(provider => provider)
            .filter((provider) => provider.onInit !== undefined)
            .forEach((provider) => {
            adapter.hooks.onInit = [...(adapter.hooks.onInit ?? []), (v) => provider.onInit(v)];
        });
    }
    return next({ modules, blueprint });
};
/**
 * Middleware to add services to the blueprint.
 *
 * This middleware identifies modules marked as services and adds them to the blueprint's list
 * of services.
 *
 * @param context - The configuration context containing modules and blueprint.
 * @param next - The next function in the pipeline.
 * @returns The updated blueprint.
 *
 * @example
 * ```typescript
 * ServiceMiddleware({ modules, blueprint }, next);
 * ```
 */
const ServiceMiddleware = ({ modules, blueprint }, next) => {
    modules
        .filter(module => typeof module === 'function' && hasMetadata(module, SERVICE_KEY))
        .forEach(module => {
        const options = getMetadata(module, SERVICE_KEY, { alias: '' });
        blueprint.add('stone.services', [[module, options]]);
    });
    return next({ modules, blueprint });
};
/**
 * Middleware to add listeners to the blueprint.
 *
 * This middleware processes modules marked as listeners and associates them with the relevant
 * events within the blueprint. Throws an error if no event name is provided for a listener.
 *
 * @param context - The configuration context containing modules and blueprint.
 * @param next - The next function in the pipeline.
 * @returns The updated blueprint.
 *
 * @example
 * ```typescript
 * ListenerMiddleware({ modules, blueprint }, next);
 * ```
 */
const ListenerMiddleware = ({ modules, blueprint }, next) => {
    modules
        .filter(module => typeof module === 'function' && hasMetadata(module, LISTENER_KEY))
        .forEach(module => {
        const { event } = getMetadata(module, LISTENER_KEY, { event: '' });
        if (event === undefined || event.length === 0) {
            throw new SetupError(`No event name provided for this listener ${String(typeof module)}`);
        }
        blueprint.add(`stone.listeners.${event}`, [module]);
    });
    return next({ modules, blueprint });
};
/**
 * Middleware to add subscribers to the blueprint.
 *
 * This middleware identifies modules marked as subscribers and adds them to the blueprint's
 * list of subscribers.
 *
 * @param context - The configuration context containing modules and blueprint.
 * @param next - The next function in the pipeline.
 * @returns The updated blueprint.
 *
 * @example
 * ```typescript
 * SubscriberMiddleware({ modules, blueprint }, next);
 * ```
 */
const SubscriberMiddleware = ({ modules, blueprint }, next) => {
    const subscribers = modules.filter(module => typeof module === 'function' && hasMetadata(module, SUBSCRIBER_KEY));
    blueprint.add('stone.subscribers', subscribers);
    return next({ modules, blueprint });
};
/**
 * Middleware to add adapter-specific middleware to the blueprint.
 *
 * This middleware processes modules marked as adapter middleware and associates them with the
 * appropriate adapter configuration in the blueprint.
 *
 * @param context - The configuration context containing modules and blueprint.
 * @param next - The next function in the pipeline.
 * @returns The updated blueprint.
 *
 * @example
 * ```typescript
 * AdapterMiddlewareMiddleware({ modules, blueprint }, next);
 * ```
 */
const AdapterMiddlewareMiddleware = ({ modules, blueprint }, next) => {
    modules
        .filter(module => typeof module === 'function' && hasMetadata(module, ADAPTER_MIDDLEWARE_KEY))
        .map(module => module)
        .forEach(module => {
        const { platform, priority, params } = getMetadata(module, ADAPTER_MIDDLEWARE_KEY, {});
        const middleware = { priority, params, pipe: module };
        const adapters = blueprint.get('stone.adapters', []);
        adapters?.forEach(adapter => {
            adapter.middleware ??= [];
            if (platform === undefined) {
                adapter.middleware.push(middleware);
            }
            else if (platform === adapter.alias) {
                adapter.middleware.push(middleware);
            }
        });
    });
    return next({ modules, blueprint });
};
/**
 * Middleware to add global and specific middleware to the kernel blueprint.
 *
 * This middleware processes modules marked as general middleware and associates them with the
 * kernel's configuration in the blueprint.
 *
 * @param context - The configuration context containing modules and blueprint.
 * @param next - The next function in the pipeline.
 * @returns The updated blueprint.
 *
 * @example
 * ```typescript
 * MiddlewareMiddleware({ modules, blueprint }, next);
 * ```
 */
const MiddlewareMiddleware = ({ modules, blueprint }, next) => {
    modules
        .filter(module => typeof module === 'function' && hasMetadata(module, MIDDLEWARE_KEY))
        .map(module => module)
        .forEach(module => {
        const { global = false, priority, params } = getMetadata(module, MIDDLEWARE_KEY, {});
        const middleware = { priority, params, pipe: module };
        global && blueprint.add('stone.kernel.middleware', [middleware]);
    });
    return next({ modules, blueprint });
};
/**
 * Processes a module to extract its imperative blueprint.
 *
 * @param
 module - The module to be processed.
 * @returns A promise that resolves to the updated meta blueprint.
 *
 * @example
 * ```typescript
 * const updatedBlueprint = await extractImperativeBlueprintFromModule(myModule);
 * ```
 */
async function extractImperativeBlueprintFromModule(module) {
    if (isConstructor(module) && hasMetadata(module, CONFIGURATION_KEY)) {
        try {
            const loadedOptions = (await module.load?.()) ?? { stone: {} };
            const moduleOptions = Object.fromEntries(Object.entries(module).filter(([key]) => key !== 'load'));
            return mergeBlueprints(moduleOptions, loadedOptions);
        }
        catch (error) {
            console.error(`Error loading options from module: ${String(module)}`, error);
        }
    }
    return { stone: {} };
}
/**
 * Array representing the core configuration middleware for the application.
 *
 * This array contains the list of core middleware functions that are used to process the application
 * configuration in a specific order. Each middleware is associated with a priority that determines
 * the sequence in which it is executed. Middleware functions are used to build the application's blueprint,
 * set up the adapter, register providers, and handle other essential configuration steps.
 *
 * @type {MixedPipe[]}
 * @example
 * ```typescript
 * import { coreConfigMiddleware } from './coreConfigMiddleware';
 *
 * // The middleware will be used to configure the application's settings before it starts.
 * ```
 */
const coreConfigMiddleware = [
    { pipe: BlueprintMiddleware, priority: 0 },
    { pipe: MainHandlerMiddleware, priority: 0.1 },
    { pipe: SetCurrentAdapterMiddleware, priority: 0.5 },
    { pipe: ProviderMiddleware, priority: 0.6 },
    { pipe: ServiceMiddleware, priority: 0.7 },
    { pipe: ListenerMiddleware, priority: 0.7 },
    { pipe: SubscriberMiddleware, priority: 0.7 },
    { pipe: RegisterProviderToOnInitHookMiddleware, priority: 0.7 },
    { pipe: AdapterMiddlewareMiddleware, priority: 3 },
    { pipe: MiddlewareMiddleware, priority: 3 }
];

/**
 * Options builder namespace.
 *
 * This object defines the main builder options for constructing the blueprint.
 * It includes middleware definitions and the default priority for those pipes.
 */
const builder = {
    // Here you can define middleware to build the Blueprint.
    // Middleware consists of core pipes and custom pipes used in the blueprint construction process.
    middleware: [
        ...coreConfigMiddleware
    ],
    // Here you can define the default priority for pipes.
    // It will be used when a pipe does not have a priority.
    defaultMiddlewarePriority: 10
};

/**
 * Common adapters settings.
 *
 * This array defines the collection of adapters and their respective configurations.
 */
const adapters = [];

/**
 * Environment settings.
 */
var Environment;
(function (Environment) {
    Environment["Development"] = "development";
    Environment["Production"] = "production";
    Environment["Test"] = "test";
})(Environment || (Environment = {}));
/**
 * Stone main options.
 *
 * This object defines the main configuration options for the Stone.js framework.
 * It includes settings for middleware, adapters, application-level configurations,
 * logging, services, listeners, subscribers, providers, and aliases.
 *
 * @returns {StoneBlueprint}
 */
const stoneBlueprint = {
    // App namespace.
    // Here you can define application-level settings.
    stone: {
        // The name of your application.
        name: 'Stone.js',
        // The "environment" your application is currently running in (e.g., development, production).
        env: Environment.Production,
        // Whether your application is in debug mode.
        // Useful for showing detailed error messages with stack traces.
        debug: false,
        // The default timezone for your application.
        timezone: 'UTC',
        // The default locale for your application.
        locale: 'en',
        // The fallback locale for your application.
        fallback_locale: 'en',
        // Options builder namespace.
        builder,
        // Adapters namespace.
        // Here you can define adapter settings.
        adapters,
        // Global app-level settings for all adapters.
        kernel,
        // Logging settings for all adapters.
        logger,
        // Services to be automatically registered when the application starts.
        services: [],
        // Listeners to be automatically registered when the application starts.
        listeners: {},
        // Subscribers to be automatically registered when the application starts.
        subscribers: [],
        // Service providers to be automatically loaded at each request to your application.
        providers: [
            CoreServiceProvider
        ],
        // Class aliases to be registered when the application starts.
        aliases: {}
    }
};

/**
 * StoneApp decorator to mark a class as the main application entry point.
 *
 * This decorator is useful for customizing classes that should be treated as the primary entry point for the Stone.js framework.
 * It allows for configuring the main application settings via the provided options.
 *
 * @param options - The configuration options for the application, based on StoneOptions.
 * @returns A decorator function to set metadata on the target class.
 *
 * @example
 * ```typescript
 * @StoneApp({ name: 'MyApplication', env: Environment.Development })
 * class MyApp {
 *   // Application logic here.
 * }
 * ```
 */
const StoneApp = (options = {}, blueprints = []) => {
    return (target, context) => {
        setMetadata(context, PROVIDER_KEY, {});
        setMetadata(context, MAIN_HANDLER_KEY, {});
        addBlueprint(target, context, stoneBlueprint, ...blueprints, { stone: options });
    };
};

/**
 * Provider decorator to mark a class as a ServiceProvider and automatically bind its services to the container.
 *
 * This decorator is useful for marking classes as service providers within the Stone.js framework,
 * allowing them to manage and provide their services to the service container.
 *
 * @param options - The configuration options for the provider.
 * @returns A decorator function to set metadata on the target class.
 *
 * @example
 * ```typescript
 * @Provider({ singleton: true })
 * class MyServiceProvider {
 *   // Service provider logic here.
 * }
 * ```
 */
const Provider = (options = {}) => {
    return setClassMetadata(PROVIDER_KEY, options);
};

/**
 * Class representing the AdapterHandlerMiddleware.
 *
 * This middleware is responsible for processing incoming events and generating outgoing responses.
 * It interacts with the lifecycle event handlers and manages the flow of incoming and outgoing events.
 *
 * @template RawEventType - The type of the raw event.
 * @template RawResponseType - The type of the raw response.
 * @template ExecutionContextType - The type of the execution context.
 * @template IncomingEventType - The type of the incoming event, extending IncomingEvent.
 * @template IncomingEventOptionsType - The type of incoming event options, extending IncomingEventOptions.
 * @template OutgoingResponseType - The type of the outgoing response, extending OutgoingResponse.
 * @template DestinationType - The type of the destination response wrapper, default is IRawResponseWrapper.
 * @template AdapterContextType - The type of adapter context, default is AdapterContext.
 */
class AdapterHandlerMiddleware {
    /**
     * The event handler responsible for handling incoming events and generating responses.
     */
    eventHandler;
    /**
     * Constructor for the AdapterHandlerMiddleware.
     *
     * @param {LoggerOptions} options - Options for creating the AdapterHandlerMiddleware.
     */
    constructor({ eventHandler }) {
        this.eventHandler = eventHandler;
    }
    /**
     * Handles the incoming event, processes it, and invokes the next middleware in the pipeline.
     *
     * @param context - The adapter context containing the raw event, execution context, and other data.
     * @param next - The next middleware to be invoked in the pipeline.
     * @returns A promise that resolves to the destination type after processing.
     *
     * @throws {IntegrationError} If required components such as the incomingEventResolver or IncomingEventBuilder are not provided.
     */
    async handle(context, next) {
        const lifecycleHandler = this.eventHandler;
        if (context.incomingEventBuilder?.build === undefined) {
            throw new IntegrationError('No IncomingEventBuilder provided');
        }
        const incomingEvent = context.incomingEventBuilder.build();
        if (incomingEvent === undefined) {
            throw new IntegrationError('No IncomingEvent provided');
        }
        const outgoingResponse = typeof lifecycleHandler.handle === 'function'
            ? await lifecycleHandler.handle(incomingEvent)
            : await this.eventHandler(incomingEvent);
        return await next({ ...context, incomingEvent, outgoingResponse });
    }
}

/**
 * Logging settings for all adapters.
 *
 * This object defines the global logging settings for all adapters in the application.
 * It allows configuration of the logger instance, error reporting behavior, and error class log levels.
 */
const errorHandler = {
    // The class type resolver used to create instances of the errorHandler.
    resolver: defaultErrorHandlerResolver,
    // Define error class log levels. For example: { 'warn': [TypeError] }.
    levels: {},
    // Error classes that should not be reported. For example: new Set([TypeError]).
    dontReport: new Set(),
    // Whether to report an error multiple times if it has already been reported.
    withoutDuplicates: false
};

/**
 * Class representing an IncomingEvent.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 *
 * @extends Event
 */
class IncomingEvent extends Event {
    /**
     * INCOMING_EVENT Event name, fires on platform message.
     *
     * @event IncomingEvent#INCOMING_EVENT
     */
    static INCOMING_EVENT = 'stonejs@incoming_event';
    /**
     * The locale of the event.
     */
    locale;
    /**
     * Create an IncomingEvent.
     *
     * @param options - The options to create an IncomingEvent.
     * @returns A new IncomingEvent instance.
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Create an IncomingEvent.
     *
     * @param options - The options to create an IncomingEvent.
     */
    constructor({ source, locale = 'en', metadata = {}, timeStamp = Date.now(), type = IncomingEvent.INCOMING_EVENT }) {
        super({ type, metadata, source, timeStamp });
        this.locale = locale;
    }
}

/**
 * Class representing an OutgoingResponse.
 *
 * @extends Event
 */
class OutgoingResponse extends Event {
    /**
     * OUTGOING_RESPONSE Event name, fires on response to the incoming event.
     *
     * @event OutgoingResponse#OUTGOING_RESPONSE
     */
    static OUTGOING_RESPONSE = 'stonejs@outgoing_response';
    /**
     * The original content of the response.
     */
    originalContent;
    /**
     * The content of the response.
     */
    _content;
    /**
     * The status code of the response.
     */
    _statusCode;
    /**
     * The status message of the response.
     */
    _statusMessage;
    /**
     * Create an OutgoingResponse.
     *
     * @param options - The options to create an OutgoingResponse.
     * @returns A new OutgoingResponse instance.
     */
    static create(options) {
        return new this(options);
    }
    /**
     * Create an OutgoingResponse.
     *
     * @param options - The options to create an OutgoingResponse.
     */
    constructor({ source, content, metadata = {}, timeStamp = Date.now(), statusCode = undefined, statusMessage = undefined, type = OutgoingResponse.OUTGOING_RESPONSE }) {
        super({ type, metadata, source, timeStamp });
        this._content = content;
        this._statusCode = statusCode;
        this.originalContent = content;
        this._statusMessage = statusMessage;
    }
    /**
     * Gets the status code of the outgoing response.
     *
     * @returns The status code of the response, or undefined if not set.
     */
    get statusCode() {
        return this._statusCode;
    }
    /**
     * Gets the status message of the outgoing response.
     *
     * @returns The status message of the response, or undefined if not set.
     */
    get statusMessage() {
        return this._statusMessage;
    }
    /**
     * Gets the content of the outgoing response.
     *
     * @returns The content of the outgoing response.
     */
    get content() {
        return this._content;
    }
    /**
     * Prepare response before sending it.
     *
     * @param _event - The incoming event associated with this response.
     * @param _blueprint - The blueprint.
     * @returns This OutgoingResponse instance.
     */
    prepare(_event, _blueprint) {
        // Add logic to modify the response based on the incoming event if needed
        return this;
    }
}

export { ADAPTER_MIDDLEWARE_KEY, Adapter, AdapterEventBuilder, AdapterHandlerMiddleware, AdapterMiddleware, AdapterMiddlewareMiddleware, BLUEPRINT_KEY, BlueprintMiddleware, CONFIGURATION_KEY, CONFIG_MIDDLEWARE_KEY, ConfigBuilder, ConfigMiddleware, Configuration, ConsoleLogger, CoreServiceProvider, EVENT_EMITTER_ALIAS, Environment, ErrorHandler, Event, EventEmitter, IncomingEvent, InitializationError, Injectable, IntegrationError, Kernel, KernelEvent, KernelHandlerMiddleware, LISTENER_KEY, Listener, ListenerMiddleware, LogLevel, MAIN_HANDLER_KEY, MIDDLEWARE_KEY, MainHandlerMiddleware, Middleware, MiddlewareMiddleware, OutgoingResponse, PROVIDER_KEY, Provider, ProviderMiddleware, RegisterProviderToOnInitHookMiddleware, RuntimeError, SERVICE_KEY, SUBSCRIBER_KEY, Service, ServiceMiddleware, SetCurrentAdapterMiddleware, SetupError, StoneApp, StoneFactory, Subscriber, SubscriberMiddleware, adapters, addBlueprint, builder, coreConfigMiddleware, defaultErrorHandlerResolver, defaultKernelResolver, defaultLoggerResolver, defineAppBlueprint, errorHandler, getAllMetadata, getBlueprint, getMetadata, hasBlueprint, hasMetadata, isConstructor, kernel, logger, mergeBlueprints, removeMetadata, setClassMetadata, setFieldMetadata, setMetadata, setMethodMetadata, stoneBlueprint };
