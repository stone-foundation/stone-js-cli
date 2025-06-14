import templates from '../../src/create/templates'

describe('templates', () => {
  const format: any = {
    green: vi.fn((txt: string) => `[green] ${txt}`),
    blue: vi.fn((txt: string) => `[blue] ${txt}`),
    red: vi.fn((txt: string) => `[red] ${txt}`)
  }

  it('should return 12 templates with correct values and formatted titles', () => {
    const result = templates({ format })

    expect(result).toHaveLength(12)

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: 'basic-service-declarative',
          title: '[green] Basic starter with minimal setup and declarative API'
        }),
        expect.objectContaining({
          value: 'standard-react-declarative',
          title: '[blue] Standard React starter with common setup and declarative API'
        }),
        expect.objectContaining({
          value: 'full-service-imperative',
          title: '[red] Full featured starter with complete setup and imperative API'
        })
      ])
    )

    // Ensure format functions were called with expected strings
    expect(format.green).toHaveBeenCalledWith(
      'Basic starter with minimal setup and declarative API'
    )
    expect(format.green).toHaveBeenCalledWith(
      'Basic React starter with minimal setup and imperative API'
    )
    expect(format.blue).toHaveBeenCalledWith(
      'Standard React starter with common setup and imperative API'
    )
    expect(format.red).toHaveBeenCalledWith(
      'Full featured React starter with complete setup and declarative API'
    )
  })
})
