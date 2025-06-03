import fsExtra from 'fs-extra'
import simpleGit from 'simple-git'
import { execSync } from 'child_process'
import { CliError } from '../../src/errors/CliError'
import { CloneStarterMiddleware, ConfigureTestingMiddleware, FinalizeMiddleware, InstallDependenciesMiddleware } from '../../src/create/CreateAppMiddleware'

vi.mock('fs-extra', () => ({
  default: {
    copySync: vi.fn(),
    existsSync: vi.fn(),
    removeSync: vi.fn(),
    renameSync: vi.fn(),
    readJsonSync: vi.fn(),
    writeJsonSync: vi.fn(),
    pathExistsSync: vi.fn()
  }
}))

vi.mock('node:child_process', () => ({
  execSync: vi.fn()
}))

vi.mock('simple-git', () => ({
  default: vi.fn(() => ({
    clone: vi.fn()
  }))
}))

vi.mock('@stone-js/filesystem', async () => ({
  basePath: (...args: string[]) => `/dest/${args.join('/')}`,
  tmpPath: (...args: string[]) => `/tmp/${args.join('/')}`
}))

const mockContext: any = {
  blueprint: {
    get: vi.fn(() => ({
      overwrite: false,
      projectName: 'my-app',
      template: 'basic-service-declarative',
      startersRepo: 'https://example.com/repo.git'
    })),
    add: vi.fn()
  },
  commandOutput: {
    info: vi.fn()
  }
}

const next: any = vi.fn(async () => 'next-called')

describe('CloneStarterMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws if destination exists and overwrite is false', async () => {
    vi.mocked(fsExtra.pathExistsSync).mockReturnValue(true)

    await expect(CloneStarterMiddleware(mockContext, next)).rejects.toThrow(CliError)
    expect(fsExtra.pathExistsSync).toHaveBeenCalled()
  })

  it('clones, copies files, and adds to blueprint', async () => {
    vi.mocked(fsExtra.existsSync).mockReturnValue(true)
    vi.mocked(fsExtra.pathExistsSync).mockReturnValue(false)
    const clone = vi.fn()
    ;(simpleGit as any).mockReturnValue({ clone })

    vi.mocked(fsExtra.readJsonSync).mockReturnValue({ name: 'test' })

    const result = await CloneStarterMiddleware(mockContext, next)

    expect(fsExtra.removeSync).toHaveBeenCalled()
    expect(clone).toHaveBeenCalledWith('https://example.com/repo.git', 'stone-js-starters')
    expect(fsExtra.copySync).toHaveBeenCalled()
    expect(fsExtra.readJsonSync).toHaveBeenCalled()
    expect(mockContext.blueprint.add).toHaveBeenCalledWith('stone.createApp', expect.objectContaining({
      destDir: expect.any(String),
      srcDir: expect.any(String),
      packageJson: { name: 'test' }
    }))
    expect(result).toBe('next-called')
  })
})

describe('InstallDependenciesMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(mockContext.blueprint.get).mockReturnValue({
      testing: 'vitest',
      destDir: '/dest/my-app',
      modules: ['@stone-js/core'],
      packageManager: 'npm'
    })
  })

  it('executes install command with testing dependencies using npm', async () => {
    const result = await InstallDependenciesMiddleware(mockContext, next)

    expect(mockContext.commandOutput.info).toHaveBeenCalledWith('Installing packages. This might take a while...')
    expect(execSync).toHaveBeenCalledWith(
      'npm install @stone-js/core vitest @vitest/coverage-v8',
      { cwd: '/dest/my-app' }
    )
    expect(result).toBe('next-called')
  })

  it('uses yarn if selected as package manager', async () => {
    mockContext.blueprint.get.mockReturnValue({
      testing: 'jest',
      destDir: '/dest/my-app',
      modules: ['@stone-js/core'],
      packageManager: 'yarn'
    })

    await InstallDependenciesMiddleware(mockContext, next)

    expect(execSync).toHaveBeenCalledWith(
      'yarn add @stone-js/core jest',
      { cwd: '/dest/my-app' }
    )
  })
})

describe('ConfigureTestingMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockContext.blueprint.get.mockReturnValue({
      typing: 'vanilla',
      testing: 'vitest',
      destDir: '/dest/my-app',
      packageJson: {
        scripts: {
          test: 'vitest run',
          'test:cvg': 'vitest run --coverage'
        }
      }
    })
  })

  it('renames vitest config to JS if typing is vanilla and testing is vitest', async () => {
    await ConfigureTestingMiddleware(mockContext, next)

    expect(fsExtra.renameSync).toHaveBeenCalledWith(
      '/dest/my-app/vitest.config.ts',
      '/dest/my-app/vitest.config.js'
    )
    expect(fsExtra.removeSync).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(mockContext)
  })

  it('removes test scripts and vitest config if testing is not vitest', async () => {
    mockContext.blueprint.get.mockReturnValue({
      testing: 'none',
      destDir: '/dest/my-app',
      packageJson: {
        scripts: {
          test: 'vitest run',
          'test:cvg': 'vitest run --coverage'
        }
      }
    })

    await ConfigureTestingMiddleware(mockContext, next)

    expect(fsExtra.removeSync).toHaveBeenCalledWith('/dest/my-app/vitest.config.ts')
    expect(mockContext.blueprint.get().packageJson.scripts).not.toHaveProperty('test')
    expect(mockContext.blueprint.get().packageJson.scripts).not.toHaveProperty('test:cvg')
  })
})

describe('FinalizeMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockContext.commandOutput.breakLine = vi.fn()
    mockContext.commandOutput.succeed = vi.fn()
    mockContext.commandOutput.show = vi.fn()

    mockContext.blueprint.get.mockReturnValue({
      packageJson: { name: 'my-app' },
      destDir: '/path/to/my-app',
      projectName: 'my-app',
      packageManager: 'npm',
      initGit: true
    })
  })

  it('writes package.json and initializes git repo if requested', async () => {
    const mockGit = {
      init: vi.fn().mockResolvedValue(undefined),
      add: vi.fn().mockResolvedValue(undefined),
      commit: vi.fn().mockResolvedValue(undefined)
    }

    vi.mocked(simpleGit).mockReturnValue(mockGit as any)

    await FinalizeMiddleware(mockContext, next)

    expect(fsExtra.writeJsonSync).toHaveBeenCalledWith(
      '/path/to/my-app/package.json',
      { name: 'my-app' },
      { spaces: 2 }
    )

    expect(mockGit.init).toHaveBeenCalled()
    expect(mockGit.add).toHaveBeenCalledWith('.')
    expect(mockGit.commit).toHaveBeenCalledWith('Initial commit')
    expect(mockContext.commandOutput.succeed).toHaveBeenCalledWith(
      'Successfully created Stone\'s project "my-app"'
    )
    expect(next).toHaveBeenCalledWith(mockContext)
  })

  it('skips git initialization if initGit is false', async () => {
    mockContext.blueprint.get.mockReturnValue({
      packageJson: { name: 'my-app' },
      destDir: '/path/to/my-app',
      projectName: 'my-app',
      packageManager: 'yarn',
      initGit: false
    })

    await FinalizeMiddleware(mockContext, next)

    expect(fsExtra.writeJsonSync).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(mockContext)
  })
})
