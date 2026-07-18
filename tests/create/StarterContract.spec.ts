import fsExtra from 'fs-extra'
import simpleGit from 'simple-git'
import { CliError } from '../../src/errors/CliError'
import {
  listStarters,
  findStarter,
  materializeStarter,
  officialStarterProvider,
  DEFAULT_STARTERS_REPO,
  resolveStarterProviders,
  Starter,
  StarterProvider
} from '../../src/create/StarterContract'

vi.mock('fs-extra', () => ({
  default: { existsSync: vi.fn(), removeSync: vi.fn(), copySync: vi.fn() }
}))

vi.mock('simple-git', () => ({
  default: vi.fn(() => ({ clone: vi.fn() }))
}))

vi.mock('@stone-js/filesystem', () => ({
  tmpPath: (...args: string[]) => `/tmp/${args.join('/')}`
}))

const format: any = { green: (v: string) => v, blue: (v: string) => v, red: (v: string) => v }
const makeBlueprint = (values: Record<string, any> = {}): any => ({
  get: vi.fn((key: string, fallback?: any) => (key in values ? values[key] : fallback))
})

beforeEach(() => { vi.clearAllMocks() })

describe('resolveStarterProviders', () => {
  it('falls back to the official provider when none are configured', () => {
    expect(resolveStarterProviders(makeBlueprint())).toEqual([officialStarterProvider])
  })

  it('is defensive when the blueprint returns undefined', () => {
    const blueprint: any = { get: vi.fn(() => undefined) }
    expect(resolveStarterProviders(blueprint)).toEqual([officialStarterProvider])
  })

  it('returns the configured providers when present', () => {
    const custom: StarterProvider = { name: 'x', starters: [] }
    expect(resolveStarterProviders(makeBlueprint({ 'stone.createApp.starters': [custom] }))).toEqual([custom])
  })
})

describe('officialStarterProvider', () => {
  it('maps templates to git sources on the configured repo', async () => {
    const blueprint = makeBlueprint({ 'stone.createApp.startersRepo': 'https://example.com/x.git' })
    const starters = await listStarters([officialStarterProvider], { format, blueprint })
    expect(starters).toHaveLength(12)
    expect(starters[0].source).toEqual({ type: 'git', repo: 'https://example.com/x.git', path: starters[0].value })
  })

  it('defaults the repo when not configured', async () => {
    const starters = await listStarters([officialStarterProvider], { format, blueprint: makeBlueprint() })
    expect((starters[0].source as any).repo).toBe(DEFAULT_STARTERS_REPO)
  })
})

describe('listStarters / findStarter', () => {
  const arrayProvider: StarterProvider = { name: 'a', starters: [{ value: 'a1', title: 'A1', source: { type: 'local', path: '/a' } }] }
  const fnProvider: StarterProvider = { name: 'b', starters: () => [{ value: 'b1', title: 'B1', source: { type: 'local', path: '/b' } }] }

  it('aggregates array and function providers', async () => {
    const starters = await listStarters([arrayProvider, fnProvider], { format, blueprint: makeBlueprint() })
    expect(starters.map(s => s.value)).toEqual(['a1', 'b1'])
  })

  it('finds a starter by value, or returns undefined', async () => {
    const ctx = { format, blueprint: makeBlueprint() }
    expect((await findStarter('b1', [arrayProvider, fnProvider], ctx))?.value).toBe('b1')
    expect(await findStarter('nope', [arrayProvider, fnProvider], ctx)).toBeUndefined()
  })
})

describe('materializeStarter', () => {
  const context = { destDir: '/dest', tmpDir: '/tmp', output: { info: vi.fn() } }

  it('materialises a local source by copying', async () => {
    await materializeStarter({ value: 'l', title: 'L', source: { type: 'local', path: '/src' } }, context)
    expect(fsExtra.copySync).toHaveBeenCalledWith('/src', '/dest')
  })

  it('materialises a custom source via its resolver', async () => {
    const resolve = vi.fn()
    await materializeStarter({ value: 'c', title: 'C', source: { type: 'custom', resolve } }, context)
    expect(resolve).toHaveBeenCalledWith(context)
  })

  it('rejects the not-yet-supported npm source', async () => {
    await expect(materializeStarter({ value: 'n', title: 'N', source: { type: 'npm', package: 'x' } }, context)).rejects.toThrow(CliError)
  })

  it('materialises a git source (with path + ref) and copies the sub-folder', async () => {
    vi.mocked(fsExtra.existsSync).mockReturnValue(true)
    const clone = vi.fn()
    ;(simpleGit as any).mockReturnValue({ clone })

    const starter: Starter = { value: 'g', title: 'G', source: { type: 'git', repo: 'r.git', path: 'sub', ref: 'main' } }
    await materializeStarter(starter, context)

    expect(clone).toHaveBeenCalledWith('r.git', 'stone-js-starter-src', ['--branch', 'main'])
    expect(fsExtra.copySync).toHaveBeenCalledWith('/tmp/stone-js-starter-src/sub', '/dest')
  })

  it('materialises a git source without a path (whole repo, no ref)', async () => {
    vi.mocked(fsExtra.existsSync).mockReturnValue(true)
    const clone = vi.fn()
    ;(simpleGit as any).mockReturnValue({ clone })

    await materializeStarter({ value: 'g', title: 'G', source: { type: 'git', repo: 'r.git' } }, context)

    expect(clone).toHaveBeenCalledWith('r.git', 'stone-js-starter-src', [])
    expect(fsExtra.copySync).toHaveBeenCalledWith('/tmp/stone-js-starter-src', '/dest')
  })

  it('throws when the git sub-folder is missing', async () => {
    vi.mocked(fsExtra.existsSync).mockReturnValue(false)
    ;(simpleGit as any).mockReturnValue({ clone: vi.fn() })

    const starter: Starter = { value: 'g', title: 'G', source: { type: 'git', repo: 'r.git', path: 'missing' } }
    await expect(materializeStarter(starter, context)).rejects.toThrow(CliError)
  })
})
