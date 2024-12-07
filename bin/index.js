import fsExtra from 'fs-extra';
import { RuntimeError, OutgoingResponse, defineAppBlueprint, stoneBlueprint } from './core.js';
import { globSync } from 'glob';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { cwd, argv } from 'node:process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import DotenvExpand from 'dotenv-expand';
import Dotenv from 'dotenv';
import { Pipeline } from '@stone-js/pipeline';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import multi from '@rollup/plugin-multi-entry';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import nodeExternals from 'rollup-plugin-node-externals';
import { rollup } from 'rollup';
import spawn from 'cross-spawn';
import { watch } from 'chokidar';
import { nodeCliAdapterBlueprint, CommandRouter } from './adapter.js';

/**
 * Custom error for AWS Lambda adapter operations.
 */
class CliError extends RuntimeError {
    constructor(message, options) {
        super(message, options);
        this.name = 'CliError';
    }
}

/**
 * App bootstrap module stub.
 */
const appBootstrapStub = `
__app_modules_import__
import { StoneFactory, ConfigBuilder } from '@stone-js/core'

/**
 * Build Blueprint.
 * 
 * @returns {IBlueprint}
 */
const blueprint = await ConfigBuilder.create().build({ __app_module_names__ })

/**
 * Run application.
 */
const stone = await StoneFactory.create(blueprint).run()

/**
 * Export adapter specific output.
 * Useful for FAAS handler like AWS lambda handler.
 * 
 * @returns {Object}
 */
export { stone }
`;
/**
 * Console App bootstrap module stub.
 */
const consoleBootstrapStub = `
__app_modules_import__
import { StoneFactory, ConfigBuilder } from '@stone-js/core'

/**
 * Build App Blueprint.
 * 
 * @returns {IBlueprint}
 */
const blueprint = await ConfigBuilder.create().build({ __app_module_names__ })

/**
 * Run application.
 */
StoneFactory.create(blueprint).run()
`;
/**
 * Rollup config stub.
 */
const rollupConfigStub = `
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import multi from '@rollup/plugin-multi-entry';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import nodeExternals from 'rollup-plugin-node-externals';

export default ({ input, output, externalsOptions = {}, replaceOptions = {} }) => {
  return {
    input,
    output,
    plugins: [
      multi(),
      nodeExternals(externalsOptions), // Must always be before \`nodeResolve()\`.
      nodeResolve({
        extensions: ['.js', '.mjs', '.ts'],
        exportConditions: ['node', 'import', 'require', 'default'],
      }),
      json(),
      commonjs(),
      replace(replaceOptions),
      babel({
        babelrc: false,
        configFile: false,
        babelHelpers: 'bundled',
        extensions: ['.js', '.mjs', '.ts'],
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript',
        ],
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
        ],
      }),
    ],
  };
};
`;

const { readJsonSync: readJsonSync$1, pathExistsSync: pathExistsSync$3, outputJsonSync, outputFileSync: outputFileSync$1 } = fsExtra;
/**
 * Constructs a base path by joining the current working directory with the provided paths.
 *
 * @param paths - The paths to be joined with the current working directory.
 * @returns The resulting path after joining the current working directory with the provided paths.
 */
function basePath(...paths) {
    return join(cwd(), ...paths);
}
/**
 * Resolve path from system tmp directory.
 *
 * @param   {...string} paths
 * @returns {string}
 */
function tmpPath(...paths) {
    return join(tmpdir(), ...paths);
}
/**
 * Builds a path by appending the provided paths to a base path.
 *
 * @param paths - The paths to append to the base path.
 * @returns The constructed path.
 */
function buildPath(...paths) {
    return basePath('.stone', ...paths);
}
/**
 * Constructs a path string by appending the provided paths to the 'dist' directory.
 *
 * @param paths - The path segments to be appended to the 'dist' directory.
 * @returns The constructed path string.
 */
function distPath(...paths) {
    return basePath('dist', ...paths);
}
/**
 * Resolve path from app directory.
 *
 * @param   {...string} paths
 * @returns {string}
 */
function appPath(...paths) {
    return basePath('app', ...paths);
}
/**
 * Resolve path from config directory.
 *
 * @param   {...string} paths
 * @returns {string}
 */
function configPath(...paths) {
    return basePath('config', ...paths);
}
/**
 * Resolve path from node_modules directory.
 *
 * @param   {...string} paths
 * @returns {string}
 */
function nodeModulesPath(...paths) {
    return basePath('node_modules', ...paths);
}
/**
 * Get Application Files.
 * Returns all application files grouped by directory.
 * Configurations are set in `stone.config.mjs`
 * at the root of the application directory.
 *
 * @param blueprint - The configuration object.
 * @returns An array of files grouped by directory.
 */
function getApplicationFiles(blueprint) {
    return Object.entries(blueprint.get('stone.autoload.modules', {}))
        .filter(([name]) => checkAutoloadModule(blueprint, name))
        .map(([name, pattern]) => [name, globSync(basePath(pattern))]);
}
/**
 * Make filename with extension.
 *
 * @param blueprint - The configuration object.
 * @param filename - The filename without extension.
 * @returns The filename with the appropriate extension.
 */
function makeFilename(blueprint, filename) {
    return filename.concat(blueprint.get('stone.autoload.type') === 'typescript' ? '.ts' : '.mjs');
}
/**
 * Get File Hash.
 * Creates a file hash for caching purposes.
 *
 * @param filename - The path to the file.
 * @returns The MD5 hash of the file content.
 */
function getFileHash(filename) {
    return createHash('md5').update(readFileSync(filename)).digest('hex');
}
/**
 * Get cache.
 * Application files' cache memory.
 *
 * @returns The cache object.
 */
function getCache() {
    return pathExistsSync$3(buildPath('.cache'))
        ? (readJsonSync$1(buildPath('.cache'), { throws: false }) ?? {})
        : {};
}
/**
 * Set cache.
 * Stores application files' hash in the cache.
 *
 * @param blueprint - The configuration object.
 */
function setCache(blueprint) {
    const cache = getCache();
    getApplicationFiles(blueprint)
        .reduce((prev, [_, files]) => prev.concat(files), [])
        .forEach((filePath) => {
        cache[filePath] = getFileHash(filePath);
    });
    outputJsonSync(buildPath('.cache'), cache);
}
/**
 * Should build application.
 * Determines whether the application should be rebuilt.
 *
 * @param blueprint - The container object with config.
 * @returns True if the application should be rebuilt; otherwise, false.
 */
function shouldBuild(blueprint) {
    const cache = getCache();
    return getApplicationFiles(blueprint)
        .reduce((prev, [_, files]) => prev.concat(files), [])
        .reduce((prev, filePath, _, files) => {
        if (prev)
            return prev;
        return Object.keys(cache).filter((v) => !files.includes(v)).length > 0 || cache[filePath] !== undefined || cache[filePath] !== getFileHash(filePath);
    }, false);
}
/**
 * Get the env variables in .env file using the Dotenv package.
 *
 * @param options - The options for loading environment variables.
 * @returns The parsed environment variables.
 */
function getEnvVariables(options) {
    const processEnv = (options.ignoreProcessEnv === true ? {} : process.env);
    if (options.expand === true) {
        return DotenvExpand.expand(Dotenv.config({ ...options, processEnv })).parsed;
    }
    return Dotenv.config({ ...options, processEnv }).parsed;
}
/**
 * Check autoload module.
 *
 * @param blueprint - The configuration object.
 * @param module - The module name to check.
 * @param throwError - Whether to throw an error if the module is not found.
 * @returns True if the module is valid; otherwise, false.
 * @throws RuntimeError - If the module is invalid and `throwError` is true.
 */
function checkAutoloadModule(blueprint, module, throwError = false) {
    const autoload = `stone.autoload.modules.${module}`;
    if (!blueprint.has(autoload)) {
        throw new CliError(`No ${autoload} option found in 'stone.config' file.`);
    }
    const pattern = blueprint.get(autoload);
    const files = globSync(basePath(pattern));
    if (files[0] === undefined || !pathExistsSync$3(files[0])) {
        if (throwError) {
            throw new CliError(`Your ${String(pattern.split('/').shift())} directory cannot be empty.`);
        }
        else {
            return false;
        }
    }
    return true;
}
/**
 * Builds an application pipeline using the provided blueprint and middleware.
 *
 * @param blueptint - The blueprint object to be processed through the pipeline.
 * @param middleware - An array of middleware functions to process the blueprint.
 * @param onComplete - A callback function to be executed once the pipeline processing is complete.
 * @returns The resulting pipeline after processing the blueprint through the middleware.
 */
async function buildApp(blueptint, middleware, onComplete) {
    await Pipeline
        .create()
        .send(blueptint)
        .through(middleware)
        .then(async (passable) => await onComplete(passable));
}
/**
 * Pipeable middleware.
 *
 * @param handler - The middleware handler.
 * @returns The middleware function.
 */
function pipeable(handler) {
    return async (blueptint, next) => {
        await handler(blueptint);
        await next(blueptint);
    };
}
/**
 * Asynchronously imports a module given its relative path.
 *
 * @param {string} relativePath - The relative path to the module to be imported.
 * @returns {Promise<any>} A promise that resolves to the imported module, or null if the import fails.
 */
async function importModule(relativePath) {
    try {
        return await import(new URL(join(cwd(), relativePath), 'file://').href);
    }
    catch (_) {
    }
}
/**
 * Asynchronously retrieves the Stone configuration options from the specified configuration files.
 *
 * This function attempts to import the configuration from either `stone.config.mjs` or `stone.config.js`
 * located at the root of the application. If neither file is found and `throwException` is set to `true`,
 * a `TypeError` is thrown.
 *
 * @param throwException - A boolean flag indicating whether to throw an exception if the configuration file is not found. Defaults to `true`.
 * @returns A promise that resolves to the configuration options if found, or `null` if not found and `throwException` is `false`.
 * @throws {TypeError} If the configuration file is not found and `throwException` is `true`.
 */
async function getStoneOptions(throwException = true) {
    const options = await importModule('./stone.config.mjs') ?? await importModule('./stone.config.js');
    if (options === undefined && throwException) {
        throw new TypeError('You must defined a `stone.config.mjs` file at the root of your application.');
    }
    return Object.values(options).shift();
}
/**
 * Make App bootstrap module from stub.
 * In .stone directory for build action.
 * And at the root of the project for export action.
 *
 * @param blueprint - The blueprint object.
 * @param action - Action can be: `build` or `export`.
 * @param isConsole - Build for console.
 * @param force - Force file override if exists.
 * @returns Whether the bootstrap file was successfully created.
 */
function makeBootstrapFile(blueprint, action, isConsole = false, force = false) {
    let stub = isConsole ? consoleBootstrapStub : appBootstrapStub;
    const filename = isConsole ? 'cli.bootstrap.mjs' : 'app.bootstrap.mjs';
    if (action === 'export') {
        if (pathExistsSync$3(basePath(filename)) && !force) {
            console.log(`Cannot override an existing file(${filename}). Use --force to override it.`);
            return false;
        }
        else {
            outputFileSync$1(basePath(filename), normalizeBootstrapStub(blueprint, stub, action));
        }
    }
    else {
        stub = pathExistsSync$3(basePath(filename)) ? readFileSync(basePath(filename), 'utf-8') : stub;
        outputFileSync$1(buildPath(filename), normalizeBootstrapStub(blueprint, stub, action));
    }
    return true;
}
/**
 * Normalize bootstrap content by replacing module import statements.
 *
 * @param blueprint - The blueprint object.
 * @param stub - The stub content to normalize.
 * @param action - Action can be: `build` or `export`.
 * @param exclude - Modules to exclude from import.
 * @returns The normalized stub content.
 */
function normalizeBootstrapStub(blueprint, stub, action, exclude = []) {
    const modules = Object.keys(blueprint.get('stone.autoload.modules', {}))
        .filter((name) => checkAutoloadModule(blueprint, name))
        .filter((name) => !exclude.includes(name));
    const statement = modules.map((name) => `import * as ${name} from './${name}.mjs'`);
    stub = stub
        .replace('__app_module_names__', modules.join(', '))
        .replace('__app_modules_import__', statement.join('\n'));
    if (action === 'export') {
        return stub.trim().replaceAll('./', './.stone/');
    }
    else {
        return stub.trim().replaceAll('./.stone/', './');
    }
}

const { pathExistsSync: pathExistsSync$2 } = fsExtra;
/**
 * Ensure that the current directory is a Stone project.
 */
const ensureStoneProject = () => {
    if (!pathExistsSync$2(basePath('stone.config.js')) && !pathExistsSync$2(basePath('stone.config.mjs'))) {
        throw new CliError('This is not a Stone project. Please run this command in a Stone project directory.');
    }
};
/**
 * Load the env variables in .env file to process.env.
 *
 * @returns This StoneCliServiceProvider instance for chaining.
 */
const loadDotenvVariables = (blueprint) => {
    const options = blueprint.get('stone.dotenv', {});
    const publicOptions = { ...options?.options, ...options?.public };
    const privateOptions = { ...options?.options, ...options?.private };
    getEnvVariables(publicOptions);
    getEnvVariables(privateOptions);
};
/**
 * Hook that runs once before everything.
 */
const onInit = [ensureStoneProject, loadDotenvVariables];

var rollupConfig = ({ input, output, externalsOptions = {}, replaceOptions = {} }) => {
    return {
        input,
        output,
        plugins: [
            multi(),
            nodeExternals(externalsOptions), // Must always be before `nodeResolve()`.
            nodeResolve({
                extensions: ['.js', '.mjs', '.ts'],
                exportConditions: ['node', 'import', 'require', 'default']
            }),
            json(),
            commonjs(),
            replace(replaceOptions),
            babel({
                babelrc: false,
                configFile: false,
                babelHelpers: 'bundled',
                extensions: ['.js', '.mjs', '.ts'],
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-typescript'
                ],
                plugins: [
                    ['@babel/plugin-proposal-decorators', { version: '2023-11' }]
                ]
            })
        ]
    };
};

const { pathExistsSync: pathExistsSync$1 } = fsExtra;
/**
 * Rollup build process.
 *
 * @param blueprint - The blueprint.
 */
async function rollupBuild(blueprint) {
    const options = await makeBuildOptions(blueprint);
    for (const option of options) {
        const bundle = await rollup(option);
        if (Array.isArray(option.output)) {
            await Promise.all(option.output?.map(bundle.write.bind(bundle)));
        }
    }
}
/**
 * Rollup bundle process.
 *
 * @param blueprint - The blueprint.
 */
async function rollupBundle(blueprint) {
    const options = await makeBundleOptions(blueprint);
    const bundle = await rollup(options);
    if (Array.isArray(options.output)) {
        await Promise.all(options.output.map(bundle.write.bind(bundle)));
    }
}
/**
 * Generate Rollup build options based on the configuration.
 *
 * @param blueprint - The blueprint.
 * @returns An array of Rollup build options.
 */
async function makeBuildOptions(blueprint) {
    const rollupOptionsFactory = await getRollupConfig();
    return Object.entries(blueprint.get('stone.autoload.modules', {}))
        .filter(([name]) => checkAutoloadModule(blueprint, name))
        .map(([name, input]) => rollupOptionsFactory({
        input: basePath(input),
        output: [
            {
                format: 'es',
                file: buildPath(`${name}.mjs`)
            }
        ],
        plugins: [],
        replaceOptions: { preventAssignment: true }
    }));
}
/**
 * Generate Rollup bundle options for the entire application.
 *
 * @param blueprint - The blueprint.
 * @returns A single RollupOptions object for bundling.
 */
async function makeBundleOptions(blueprint) {
    const rollupOptionsFactory = await getRollupConfig();
    const bundleExcludes = ['babel', 'multi-entry'];
    const options = rollupOptionsFactory({
        input: buildPath('app.bootstrap.mjs'),
        output: [
            {
                format: 'es',
                file: distPath('stone.mjs')
            }
        ],
        plugins: [],
        externalsOptions: { deps: false },
        replaceOptions: replaceProcessEnvVars(blueprint)
    });
    if (Array.isArray(options.plugins)) {
        options.plugins = options.plugins?.filter((plugin) => bundleExcludes.includes(plugin?.name));
    }
    return options;
}
/**
 * Retrieve Rollup configuration.
 *
 * @param blueprint - The blueprint (optional for backward compatibility).
 * @returns A function to generate RollupOptions objects.
 */
async function getRollupConfig(_blueprint) {
    if (pathExistsSync$1(basePath('rollup.config.mjs'))) {
        const module = await importModule('rollup.config.mjs');
        const config = Object.values(module ?? {}).shift();
        return typeof config === 'function' ? config : rollupConfig;
    }
    return rollupConfig;
}
/**
 * Generate replace options for process environment variables.
 *
 * @param blueprint - The blueprint.
 * @returns An object with environment variable replacement details.
 */
function replaceProcessEnvVars(blueprint) {
    const options = blueprint.get('stone.dotenv', {});
    const publicOptions = { ...options.options, ...options.public };
    const prefix = publicOptions.prefix ?? 'window.__stone_env__';
    const publicEnv = getEnvVariables(publicOptions) ?? {};
    const values = prefix.endsWith('.') === true
        ? Object.entries(publicEnv).reduce((acc, [key, value]) => ({ ...acc, [`${String(prefix)}${String(key)}`]: JSON.stringify(value) }), {})
        : { [prefix]: JSON.stringify(publicEnv) };
    return {
        values,
        ...options.replace
    };
}

const { emptyDirSync: emptyDirSync$1 } = fsExtra;
const buildCommandOptions = {
    name: 'build',
    alias: 'b',
    desc: 'Build project'
};
class BuildCommand {
    /**
     * Blueprint configuration used to retrieve app settings.
     */
    blueprint;
    /**
     * Create a new instance of CoreServiceProvider.
     *
     * @param container - The service container to manage dependencies.
     * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
     */
    constructor({ blueprint }) {
        if (blueprint === undefined) {
            throw new CliError('Blueprint is required to create a BuildCommand instance.');
        }
        this.blueprint = blueprint;
    }
    /**
     * Handle the incoming event.
     *
     * @param _event - The incoming event.
     * @returns The blueprint.
     */
    async handle(_event) {
        await buildApp(this.blueprint, buildPipes.concat(bundlePipes), v => v);
        return OutgoingResponse.create({ statusCode: 0 });
    }
}
const buildPipes = [
    pipeable(() => console.info('Building...')),
    pipeable(() => emptyDirSync$1(buildPath())),
    pipeable(async (blueprint) => await rollupBuild(blueprint)),
    pipeable((blueprint) => setCache(blueprint)),
    pipeable((blueprint) => makeBootstrapFile(blueprint, 'build')),
    pipeable((blueprint) => makeBootstrapFile(blueprint, 'build', true)),
    pipeable(() => console.info('Build finished'))
];
const bundlePipes = [
    pipeable(() => console.info('Bundling...')),
    pipeable(() => emptyDirSync$1(distPath())),
    pipeable(async (blueprint) => await rollupBundle(blueprint))
];

const { emptyDirSync } = fsExtra;
const cacheCommandOptions = {
    name: 'cache',
    alias: 'c',
    desc: 'Manage app cache',
    options: (yargs) => {
        return yargs
            .option('clear', {
            alias: 'c',
            type: 'boolean',
            default: false,
            desc: 'Clear cache'
        });
    }
};
class CacheCommand {
    /**
     * Blueprint configuration used to retrieve app settings.
     */
    blueprint;
    /**
     * Output used to print data in console.
     */
    commandOutput;
    /**
     * Create a new instance of CoreServiceProvider.
     *
     * @param container - The service container to manage dependencies.
     * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
     */
    constructor({ blueprint, commandOutput }) {
        if (blueprint === undefined) {
            throw new CliError('Blueprint is required to create a BuildCommand instance.');
        }
        this.blueprint = blueprint;
        this.commandOutput = commandOutput;
    }
    /**
     * Handle the incoming event.
     */
    handle(event) {
        if (event.getMetadataValue('clear', false) === true) {
            emptyDirSync(buildPath());
            this.commandOutput.info('Cache deleted!');
        }
        return OutgoingResponse.create({ statusCode: 0 });
    }
}

const customCommandOptions = {
    name: '*',
    desc: 'Build the Stone project.'
};
class CustomCommand {
    /**
     * Blueprint configuration used to retrieve app settings.
     */
    blueprint;
    /**
     * Create a new instance of CoreServiceProvider.
     *
     * @param container - The service container to manage dependencies.
     * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
     */
    constructor({ blueprint }) {
        if (blueprint === undefined) {
            throw new CliError('Blueprint is required to create a BuildCommand instance.');
        }
        this.blueprint = blueprint;
    }
    /**
     * Handle the incoming event.
     *
     * @param _event - The incoming event.
     * @returns The blueprint.
     */
    async handle(_event) {
        if (shouldBuild(this.blueprint)) {
            await buildApp(this.blueprint, buildPipes, (blueprint) => {
                this.startProcess();
                return blueprint;
            });
        }
        else {
            this.startProcess();
        }
        return OutgoingResponse.create({ statusCode: 0 });
    }
    /**
     * Start Process.
     */
    startProcess() {
        spawn('node', [buildPath('cli.bootstrap.mjs'), ...argv.slice(2)], { stdio: 'inherit' });
    }
}

const { copySync, outputFileSync, pathExistsSync, readJsonSync } = fsExtra;
const exportCommandOptions = {
    name: 'export',
    alias: 'e',
    args: ['[module]'],
    desc: 'Useful to export Stone.js or third party config/options',
    options: (yargs) => {
        return yargs
            .positional('module', {
            type: 'string',
            default: 'app',
            desc: 'module or package name to export. e.g. app, cli, rollup, @stone-js/node-adapter'
        })
            .option('force', {
            alias: 'f',
            type: 'boolean',
            default: false,
            desc: 'Force overriding'
        });
    }
};
class ExportCommand {
    /**
     * Blueprint configuration used to retrieve app settings.
     */
    blueprint;
    /**
     * Output used to print data in console.
     */
    commandOutput;
    /**
     * Create a new instance of CoreServiceProvider.
     *
     * @param container - The service container to manage dependencies.
     * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
     */
    constructor({ blueprint, commandOutput }) {
        if (blueprint === undefined) {
            throw new CliError('Blueprint is required to create a BuildCommand instance.');
        }
        this.blueprint = blueprint;
        this.commandOutput = commandOutput;
    }
    /**
     * Handle the incoming event.
     */
    async handle(event) {
        const force = event.getMetadataValue('force', false);
        const module = event.getMetadataValue('module', 'app');
        const modules = {
            app: () => makeBootstrapFile(this.blueprint, 'export', false, force),
            cli: () => makeBootstrapFile(this.blueprint, 'export', true, force),
            rollup: () => this.exportRollup(force)
        };
        const isExported = modules[module]?.();
        isExported && this.commandOutput.info(`Module(${module}) exported!`);
        isExported === undefined && this.commandOutput.error(`This module(${module}) does not exist or does not provide export options.`);
        return OutgoingResponse.create({ statusCode: 0 });
    }
    /**
     * Export rollup config.
     */
    exportRollup(force) {
        const filename = 'rollup.config.mjs';
        if (pathExistsSync(basePath(filename)) && !force) {
            outputFileSync(basePath(filename), rollupConfigStub, { encoding: 'utf-8' });
            return true;
        }
        else {
            this.commandOutput.error(`Cannot override your existing (${filename}) file. Use --force to override it.`);
            return false;
        }
    }
    /**
     * Export modules config/options.
     */
    exportModuleConfig(module, force) {
        let isExported = false;
        if (!pathExistsSync(nodeModulesPath(module, 'package.json'))) {
            this.commandOutput.error(`This module(${module}) does not exist or does not provide export options.`);
            return false;
        }
        const packageJson = readJsonSync(nodeModulesPath(module, 'package.json'), { throws: false });
        const make = packageJson.stone?.config?.make ?? {};
        Object.entries(make).forEach(([filename, optionsPath]) => {
            if (filename === undefined) {
                this.commandOutput.error(`No configurations maker defined for this module(${module})`);
                return false;
            }
            const originPath = nodeModulesPath(module, optionsPath);
            const destPath = configPath(makeFilename(this.blueprint, filename));
            if (!pathExistsSync(originPath)) {
                this.commandOutput.error(`No options file(${filename}) found for this module(${module}).`);
                return false;
            }
            try {
                copySync(originPath, destPath, { overwrite: force, errorOnExist: true });
            }
            catch (_) {
                this.commandOutput.error(`Cannot override an existing file(${filename}) for this module(${module}). Use --force to override it.`);
                return false;
            }
            isExported = true;
        });
        return isExported;
    }
}

const initCommandOptions = {
    name: 'init',
    alias: 'i',
    args: ['[project-name]'],
    desc: 'Create a fresh Stone app',
    options: (yargs) => {
        return yargs
            .positional('project-name', {
            type: 'string',
            default: 'stone-project',
            desc: 'your project name'
        })
            .option('yes', {
            alias: 'y',
            default: false,
            type: 'boolean',
            desc: 'create with default values'
        })
            .option('force', {
            alias: 'f',
            type: 'boolean',
            default: false,
            desc: 'Force overriding'
        });
    }
};
class InitCommand {
    /**
     * Handle the incoming event.
     */
    async handle(event) {
        await this.launchStarter(event);
        return OutgoingResponse.create({ statusCode: 0 });
    }
    /**
     * Launch Stone.js starter.
     */
    async launchStarter(event) {
        const args = [event.getMetadataValue('project-name'), '--'];
        event.getMetadataValue('yes') !== undefined && args.push('--yes', event.getMetadataValue('yes'));
        event.getMetadataValue('force') !== undefined && args.push('--force', event.getMetadataValue('force'));
        spawn('npm', ['create', '@stone-js@latest'].concat(args), { stdio: 'inherit' });
    }
}

const listCommandOptions = {
    name: 'list',
    alias: 'ls',
    desc: 'List all custom commands'
};
class ListCommand {
    /**
     * Blueprint configuration used to retrieve app settings.
     */
    blueprint;
    /**
     * Create a new instance of CoreServiceProvider.
     *
     * @param container - The service container to manage dependencies.
     * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
     */
    constructor({ blueprint }) {
        if (blueprint === undefined) {
            throw new CliError('Blueprint is required to create a BuildCommand instance.');
        }
        this.blueprint = blueprint;
    }
    /**
     * Handle the incoming event.
     *
     * @param _event - The incoming event.
     * @returns The blueprint.
     */
    async handle(_event) {
        if (shouldBuild(this.blueprint)) {
            await buildApp(this.blueprint, buildPipes, (blueprint) => {
                this.startProcess();
                return blueprint;
            });
        }
        else {
            this.startProcess();
        }
        return OutgoingResponse.create({ statusCode: 0 });
    }
    /**
     * Start Process.
     */
    startProcess() {
        spawn('node', [buildPath('cli.bootstrap.mjs'), '--help'], { stdio: 'inherit' });
    }
}

const serveCommandOptions = {
    name: 'serve',
    alias: 's',
    desc: 'Serve project'
};
class ServeCommand {
    /**
     * Server process.
     */
    serverProcess;
    /**
     * Blueprint configuration used to retrieve app settings.
     */
    blueprint;
    /**
     * Output used to print data in console.
     */
    commandOutput;
    /**
     * Create a new instance of CoreServiceProvider.
     *
     * @param container - The service container to manage dependencies.
     * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
     */
    constructor({ blueprint, commandOutput }) {
        if (blueprint === undefined) {
            throw new CliError('Blueprint is required to create a ServeCommand instance.');
        }
        this.blueprint = blueprint;
        this.commandOutput = commandOutput;
    }
    /**
     * Handle the incoming event.
     */
    async handle(_event) {
        // Build and run app.
        await buildApp(this.blueprint, buildPipes, (blueprint) => {
            this.serverProcess = this.startProcess(this.serverProcess);
            return blueprint;
        });
        // Rebuild and restart app on files changed.
        this.appWatcher(async () => await buildApp(this.blueprint, buildPipes, (blueprint) => {
            this.serverProcess = this.startProcess(this.serverProcess);
            return blueprint;
        }));
        return OutgoingResponse.create({ statusCode: 0 });
    }
    /**
     * App watcher.
     */
    appWatcher(handler) {
        const watcher = watch('.', {
            ignored: ['node_modules/**', 'dist/**', '.stone/**'],
            cwd: basePath(),
            persistent: true,
            ignoreInitial: true,
            followSymlinks: false,
            depth: undefined
        });
        /* eslint-disable @typescript-eslint/no-misused-promises */
        watcher.on('change', async (path) => {
            this.commandOutput.info(`File ${path} changed`);
            await handler();
        });
        /* eslint-disable @typescript-eslint/no-misused-promises */
        watcher.on('add', async (path) => {
            this.commandOutput.info(`File ${path} has been added`);
            await handler();
        });
    }
    /**
     * Start Process.
     */
    startProcess(serverProcess) {
        serverProcess?.kill();
        return spawn('node', [buildPath('app.bootstrap.mjs'), ...argv.slice(2)], { stdio: 'inherit' });
    }
}

const typingsCommandOptions = {
    name: 'typings',
    alias: 't',
    desc: 'Check code typings for typescript or flow project.',
    options: (yargs) => {
        return yargs
            .option('watch', {
            alias: 'w',
            type: 'boolean',
            default: false,
            desc: 'Launch checker in watch mode. Only for Typescript.'
        });
    }
};
class TypingsCommand {
    /**
     * Blueprint configuration used to retrieve app settings.
     */
    blueprint;
    /**
     * Create a new instance of CoreServiceProvider.
     *
     * @param container - The service container to manage dependencies.
     * @throws {InitializationError} If the Blueprint config or EventEmitter is not bound to the container.
     */
    constructor({ blueprint }) {
        if (blueprint === undefined) {
            throw new CliError('Blueprint is required to create a BuildCommand instance.');
        }
        this.blueprint = blueprint;
    }
    /**
     * Handle the incoming event.
     */
    async handle(event) {
        this.typeCheckerProcess(event.getMetadataValue('watch', false));
        return OutgoingResponse.create({ statusCode: 0 });
    }
    /**
     * Type checker watcher Process.
     */
    typeCheckerProcess(watch) {
        if (watch) {
            if (this.blueprint.get('stone.autoload.type') === 'typescript') {
                spawn('node', [nodeModulesPath('.bin/tsc'), '--noEmit', '--watch'], { stdio: 'inherit' });
            }
        }
        else {
            if (this.blueprint.get('stone.autoload.type') === 'typescript') {
                spawn('node', [nodeModulesPath('.bin/tsc'), '--noEmit'], { stdio: 'inherit' });
            }
        }
    }
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var cjs = deepmerge_1;

var deepmerge$1 = /*@__PURE__*/getDefaultExportFromCjs(cjs);

/**
 * Configuration for the Stone Cli Adapter.
 */
const stoneCliAdapterConfig = {
    hooks: { onInit },
    router: CommandRouter,
    commands: [
        [InitCommand, initCommandOptions],
        [ListCommand, listCommandOptions],
        [BuildCommand, buildCommandOptions],
        [CacheCommand, cacheCommandOptions],
        [ServeCommand, serveCommandOptions],
        [CustomCommand, customCommandOptions],
        [ExportCommand, exportCommandOptions],
        [TypingsCommand, typingsCommandOptions]
    ]
};
/**
 * Blueprint configuration for the Stone Cli.
 */
const stoneCliBlueprint = defineAppBlueprint(stoneBlueprint, nodeCliAdapterBlueprint, {
    stone: {
        adapter: deepmerge$1(nodeCliAdapterBlueprint.stone.adapters[0], stoneCliAdapterConfig)
    }
});

export { BuildCommand, CacheCommand, CliError, CustomCommand, ExportCommand, InitCommand, ListCommand, ServeCommand, TypingsCommand, appBootstrapStub, appPath, basePath, buildApp, buildCommandOptions, buildPath, buildPipes, bundlePipes, cacheCommandOptions, checkAutoloadModule, configPath, consoleBootstrapStub, customCommandOptions, distPath, exportCommandOptions, getApplicationFiles, getCache, getEnvVariables, getFileHash, getStoneOptions, importModule, initCommandOptions, listCommandOptions, makeBootstrapFile, makeFilename, nodeModulesPath, normalizeBootstrapStub, onInit, pipeable, rollupBuild, rollupBundle, rollupConfigStub, serveCommandOptions, setCache, shouldBuild, stoneCliBlueprint, tmpPath, typingsCommandOptions };
