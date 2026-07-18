import fsExtra from 'fs-extra'
import chalk from 'chalk'
import simpleGit from 'simple-git'
import { CliError } from '../errors/CliError'
import { tmpPath } from '@stone-js/filesystem'
import { IBlueprint, Promiseable } from '@stone-js/core'

const { existsSync, removeSync, copySync } = fsExtra

/**
 * Where the files of a starter come from.
 *
 * The CLI knows how to materialise each `type`; third-party providers pick whichever fits,
 * or ship a `custom` resolver for anything exotic. This is the extension seam that keeps the
 * CLI open for new starters and closed for modification.
 */
export type StarterSource =
  | { type: 'git', repo: string, path?: string, ref?: string }
  | { type: 'local', path: string }
  | { type: 'npm', package: string, path?: string }
  | { type: 'custom', resolve: (context: StarterMaterializeContext) => Promiseable<void> }

/**
 * A single, selectable starter.
 */
export interface Starter {
  /** Unique identifier (also the questionnaire answer value). */
  value: string
  /** Display title (may be styled with `format`). */
  title: string
  /** One-line description. */
  description?: string
  /** Free-form tags used for filtering/grouping (e.g. `api`, `spa`, `ssr`, `ssg`, `react`). */
  tags?: string[]
  /** Whether the entry is shown but not selectable. */
  disabled?: boolean
  /** How to fetch the starter's files. */
  source: StarterSource
}

/**
 * Context handed to a provider when it lists its starters.
 */
export interface StarterListContext {
  /** Chalk instance for styling titles. */
  format: typeof chalk
  /** The application blueprint (read config, e.g. a custom starters repo). */
  blueprint: IBlueprint
}

/**
 * Context handed to `materializeStarter` / a `custom` source resolver.
 */
export interface StarterMaterializeContext {
  /** Absolute destination directory for the new project. */
  destDir: string
  /** A scratch directory the resolver may use. */
  tmpDir: string
  /** Minimal logger for progress messages. */
  output: { info: (message: string) => void }
}

/**
 * A starter provider — the plugin unit.
 *
 * The official `@stone-js/starters` is registered by default; anyone can publish a package
 * exposing a `StarterProvider` and add it to `stone.createApp.starters` to make their
 * starters appear in the CLI, without touching the CLI itself.
 */
export interface StarterProvider {
  /** Provider id (e.g. `@stone-js/starters`). */
  name: string
  /** Display group label (defaults to `name`). */
  label?: string
  /** The starters, as an array or a (blueprint/format-aware) resolver. */
  starters: Starter[] | ((context: StarterListContext) => Promiseable<Starter[]>)
}

/**
 * The default GitHub repository for the official Stone.js starters.
 */
export const DEFAULT_STARTERS_REPO = 'https://github.com/stone-foundation/stone-js-starters.git'

/**
 * The official Stone.js starter provider (the default, maintained set).
 *
 * Each starter lives in a sub-folder of the starters monorepo; the repo URL is overridable
 * via `stone.createApp.startersRepo` so forks can point elsewhere.
 */
export const officialStarterProvider: StarterProvider = {
  name: '@stone-js/starters',
  label: 'Official Stone.js starters',
  starters: ({ format, blueprint }: StarterListContext): Starter[] => {
    const repo = blueprint.get<string>('stone.createApp.startersRepo', DEFAULT_STARTERS_REPO) ?? DEFAULT_STARTERS_REPO
    const make = (value: string, color: 'green' | 'blue' | 'red', label: string, tags: string[]): Starter => ({
      value,
      tags,
      title: format[color](label),
      source: { type: 'git', repo, path: value }
    })
    return [
      make('basic-service-declarative', 'green', 'Basic · service · declarative', ['api', 'service', 'declarative']),
      make('basic-service-imperative', 'green', 'Basic · service · imperative', ['api', 'service', 'imperative']),
      make('basic-react-declarative', 'green', 'Basic · React · declarative', ['react', 'spa', 'declarative']),
      make('basic-react-imperative', 'green', 'Basic · React · imperative', ['react', 'spa', 'imperative']),
      make('standard-service-declarative', 'blue', 'Standard · service · declarative', ['api', 'service', 'declarative']),
      make('standard-service-imperative', 'blue', 'Standard · service · imperative', ['api', 'service', 'imperative']),
      make('standard-react-declarative', 'blue', 'Standard · React · declarative', ['react', 'ssr', 'declarative']),
      make('standard-react-imperative', 'blue', 'Standard · React · imperative', ['react', 'ssr', 'imperative']),
      make('full-service-declarative', 'red', 'Full · service · declarative', ['api', 'service', 'declarative']),
      make('full-service-imperative', 'red', 'Full · service · imperative', ['api', 'service', 'imperative']),
      make('full-react-declarative', 'red', 'Full · React · declarative', ['react', 'ssr', 'ssg', 'declarative']),
      make('full-react-imperative', 'red', 'Full · React · imperative', ['react', 'ssr', 'ssg', 'imperative'])
    ]
  }
}

/**
 * Resolves the registered starter providers from the blueprint.
 *
 * Defaults to the official provider; user/third-party providers declared under
 * `stone.createApp.starters` are used as-is (they may include the official one or not).
 *
 * @param blueprint - The application blueprint.
 * @returns The list of providers.
 */
export function resolveStarterProviders (blueprint: IBlueprint): StarterProvider[] {
  const providers = blueprint.get<StarterProvider[]>('stone.createApp.starters', []) ?? []
  return providers.length > 0 ? providers : [officialStarterProvider]
}

/**
 * Flattens all starters from all providers.
 *
 * @param providers - The providers to list from.
 * @param context - The listing context (format + blueprint).
 * @returns The aggregated starters.
 */
export async function listStarters (providers: StarterProvider[], context: StarterListContext): Promise<Starter[]> {
  const all: Starter[] = []
  for (const provider of providers) {
    const starters = typeof provider.starters === 'function' ? await provider.starters(context) : provider.starters
    all.push(...starters)
  }
  return all
}

/**
 * Finds a starter by its value across all providers.
 *
 * @param value - The starter id.
 * @param providers - The providers to search.
 * @param context - The listing context.
 * @returns The matching starter, or `undefined`.
 */
export async function findStarter (value: string, providers: StarterProvider[], context: StarterListContext): Promise<Starter | undefined> {
  return (await listStarters(providers, context)).find(starter => starter.value === value)
}

/**
 * Materialises a starter's files into the destination directory.
 *
 * Handles every built-in source type; `custom` sources delegate to their own resolver.
 *
 * @param starter - The starter to materialise.
 * @param context - The materialisation context.
 * @throws {CliError} For unsupported/not-yet-implemented sources.
 */
export async function materializeStarter (starter: Starter, context: StarterMaterializeContext): Promise<void> {
  const source = starter.source

  switch (source.type) {
    case 'git':
      await materializeGit(source, context)
      break
    case 'local':
      copySync(source.path, context.destDir)
      break
    case 'custom':
      await source.resolve(context)
      break
    case 'npm':
      throw new CliError('The "npm" starter source is not supported yet. Use a "git", "local" or "custom" source.')
    /* v8 ignore next 2 -- exhaustive guard: unreachable while StarterSource stays a closed union. */
    default:
      throw new CliError(`Unknown starter source type "${String((source as { type: string }).type)}".`)
  }
}

/**
 * Materialises a git-hosted starter: clone the repo into a scratch dir, then copy the
 * (optional) sub-folder into the destination.
 *
 * @param source - The git source.
 * @param context - The materialisation context.
 */
async function materializeGit (
  source: { repo: string, path?: string, ref?: string },
  context: StarterMaterializeContext
): Promise<void> {
  const cloneDir = tmpPath('stone-js-starter-src')

  existsSync(cloneDir) && removeSync(cloneDir)

  context.output.info(`Fetching starter from ${source.repo}`)

  const options = source.ref !== undefined ? ['--branch', source.ref] : []
  await simpleGit(tmpPath()).clone(source.repo, 'stone-js-starter-src', options)

  const srcDir = source.path !== undefined ? tmpPath('stone-js-starter-src', source.path) : cloneDir

  if (!existsSync(srcDir)) {
    throw new CliError(`Starter path "${String(source.path)}" was not found in ${source.repo}.`)
  }

  copySync(srcDir, context.destDir)
  removeSync(cloneDir)
}
