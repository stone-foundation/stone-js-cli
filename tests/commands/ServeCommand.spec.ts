import { Argv } from 'yargs'
import { IncomingEvent } from '@stone-js/core'

vi.mock('../../src/utils', async () => {
  const actual = await vi.importActual<any>('../../src/utils')
  return {
    ...actual,
    isReactApp: vi.fn(),
    setupProcessSignalHandlers: vi.fn()
  }
})

const ReactBuilderDev = vi.fn()
const ServerBuilderDev = vi.fn()
const ServerBuilderWatchFiles = vi.fn()

vi.mock('../../src/react/ReactBuilder', () => ({
  ReactBuilder: class {
    dev = ReactBuilderDev
  }
}))

vi.mock('../../src/server/ServerBuilder', () => ({
  ServerBuilder: class {
    dev = ServerBuilderDev
    watchFiles = ServerBuilderWatchFiles
  }
}))

vi.mock('@stone-js/filesystem', () => ({
  buildPath: vi.fn()
}))

describe('ServeCommand', async () => {
  let ServeCommand: any
  let serveCommandOptions: any
  let ServerBuilder: any
  let buildPath: any
  let spawnMock: any
  let context: any
  let event: IncomingEvent

  beforeEach(async () => {
    vi.resetModules()

    spawnMock = vi.fn(() => ({
      kill: vi.fn(),
      on: vi.fn()
    }))

    vi.doMock('cross-spawn', () => ({
      default: spawnMock
    }))

    const mod = await import('../../src/commands/ServeCommand')
    ServeCommand = mod.ServeCommand
    serveCommandOptions = mod.serveCommandOptions

    ServerBuilder = (await import('../../src/server/ServerBuilder')).ServerBuilder
    buildPath = (await import('@stone-js/filesystem')).buildPath

    const utils = await import('../../src/utils')
    vi.mocked(utils.isReactApp).mockReturnValue(true)
    buildPath.mockReturnValue('/dist/server.mjs')

    context = {
      blueprint: {},
      commandOutput: {
        show: vi.fn(),
        error: vi.fn(),
        format: {
          yellow: (txt: string) => `yellow(${txt})`
        }
      }
    }

    event = {
      type: 'cli',
      payload: {}
    } as unknown as IncomingEvent
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should start react dev server when isReactApp is true', async () => {
    const cmd = new ServeCommand(context)
    await cmd.handle(event)

    expect(ReactBuilderDev).toHaveBeenCalledWith(event)
    expect(spawnMock).toHaveBeenCalledWith(
      'node',
      ['/dist/server.mjs', ...process.argv.slice(2)],
      { stdio: 'inherit' }
    )
  })

  it('should start backend dev server and watch files when isReactApp is false', async () => {
    const utils = await import('../../src/utils')
    vi.mocked(utils.isReactApp).mockReturnValue(false)

    const cmd = new ServeCommand(context)
    await cmd.handle(event)

    expect(ServerBuilderDev).toHaveBeenCalledWith(event)
    expect(ServerBuilderWatchFiles).toHaveBeenCalled()
    expect(context.commandOutput.show).toHaveBeenCalledWith('yellow(⚡ Building application...)')
    expect(spawnMock).toHaveBeenCalled()
  })

  it('should call startProcess in file watcher success and error', async () => {
    const utils = await import('../../src/utils')
    vi.mocked(utils.isReactApp).mockReturnValue(false)

    const cmd = new ServeCommand(context)
    await cmd.handle(event)

    const instance = new ServerBuilder()

    // Simulate file change - success
    const cb = instance.watchFiles.mock.calls[0][0]
    await cb()
    expect(ServerBuilderDev).toHaveBeenCalledWith(event, true)
    expect(spawnMock).toHaveBeenCalledTimes(2)

    // Simulate file change - error
    instance.dev.mockRejectedValueOnce(new Error('fail'))
    await cb()
    expect(context.commandOutput.error).toHaveBeenCalledWith('Error: fail')
  })

  it('should kill existing process before spawning new one', async () => {
    const proc = { kill: vi.fn(), on: vi.fn() }
    spawnMock.mockReturnValueOnce(proc)

    const cmd = new ServeCommand(context)
    cmd.serverProcess = proc
    await cmd.startProcess()

    expect(proc.kill).toHaveBeenCalledWith('SIGTERM')
    expect(spawnMock).toHaveBeenCalled()
  })

  it('should expose correct command metadata and yargs options', () => {
    expect(serveCommandOptions.name).toBe('serve')
    expect(serveCommandOptions.alias).toBe('dev')
    expect(serveCommandOptions.args).toEqual(['[target]'])
    expect(serveCommandOptions.desc).toBe('Run project in dev mode')
  })

  it('should configure yargs options correctly with cast', () => {
    const yargs = {
      positional: vi.fn().mockReturnThis(),
      option: vi.fn().mockReturnThis()
    }

    const fn = serveCommandOptions.options as ((args: Argv<any>) => Argv<any>)
    const result = fn(yargs as any)

    expect(yargs.positional).toHaveBeenCalledWith('target', {
      type: 'string',
      desc: 'app target to serve',
      choices: ['server', 'react']
    })

    expect(yargs.option).toHaveBeenCalledWith('language', {
      alias: 'lang',
      type: 'string',
      desc: 'language to use',
      choices: ['javascript', 'typescript']
    })

    expect(yargs.option).toHaveBeenCalledWith('rendering', {
      alias: 'r',
      type: 'string',
      desc: 'web rendering type',
      choices: ['csr', 'ssr']
    })

    expect(yargs.option).toHaveBeenCalledWith('imperative', {
      alias: 'i',
      type: 'boolean',
      desc: 'imperative api'
    })

    expect(result).toBe(yargs)
  })
})
