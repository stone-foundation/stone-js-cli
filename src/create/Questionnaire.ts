import fsExtra from 'fs-extra'
import templates from './templates'
import { IBlueprint } from '@stone-js/core'
import { basePath } from '@stone-js/filesystem'
import { ConsoleContext } from '../declarations'
import { CommandInput, CommandOutput } from '@stone-js/node-cli-adapter'

/**
 * Represents a Questionnaire to guide users in creating a Stone.js application.
 */
export class Questionnaire {
  private readonly blueprint: IBlueprint
  private readonly commandInput: CommandInput
  private readonly commandOutput: CommandOutput

  /**
   * Factory method to create a new Questionnaire instance.
   *
   * @param options - The options to create a Questionnaire.
   * @returns A new instance of Questionnaire.
   */
  static create (options: ConsoleContext): Questionnaire {
    return new this(options)
  }

  /**
   * Initializes a new Questionnaire instance.
   *
   * @param options - The options to create a Questionnaire.
   */
  constructor ({ blueprint, commandInput, commandOutput }: ConsoleContext) {
    this.blueprint = blueprint
    this.commandInput = commandInput
    this.commandOutput = commandOutput
  }

  /**
   * Returns the available templates.
   */
  private get templates (): Array<Record<'value' | 'title', string>> {
    return templates({ format: this.commandOutput.format })
  }

  /**
   * Returns the available typing options.
   */
  private get typings (): Array<Record<'value' | 'title', string>> {
    return [
      { value: 'vanilla', title: 'None (Vanilla)' },
      { value: 'typescript', title: 'TypeScript' }
    ]
  }

  /**
   * Returns the available package managers.
   */
  private get packageManagers (): Array<Record<'value' | 'title', string>> {
    return [
      { value: 'npm', title: 'Npm' },
      { value: 'yarn', title: 'Yarn' },
      { value: 'pnpm', title: 'Pnpm' }
    ]
  }

  /**
   * Returns the available Stone.js modules.
   */
  private get stoneModules (): Array<Record<'value' | 'title', string>> {
    return [
      { value: '@stone-js/env', title: 'Stone.js Dotenv' },
      { value: '@stone-js/router', title: 'Stone.js Router' },
      { value: '@stone-js/aws-lambda-adapter', title: 'AWS Lambda Adapter' },
      { value: '@stone-js/aws-lambda-http-adapter', title: 'AWS Lambda HTTP Adapter' }
    ]
  }

  /**
   * Returns the available linting tools.
   */
  private get lintingTools (): Array<Record<'value' | 'title', string>> {
    return [
      { value: '', title: 'None' },
      { value: 'standard', title: 'Eslint (Standard)' },
      { value: 'prettier', title: 'Prettier' }
    ]
  }

  /**
   * Returns the available testing frameworks.
   */
  private get testingFrameworks (): Array<Record<'value' | 'title', string>> {
    return [
      { value: '', title: 'None' },
      { value: 'vitest', title: 'Vitest' },
      { value: 'mocha', title: 'Mocha' }
    ]
  }

  /**
   * Returns the messages for prompts.
   */
  private get messages (): Record<string, string> {
    return {
      projectName: 'Project name: ',
      template: 'Starter template: ',
      typing: 'Static type checker: ',
      packageManager: 'Package manager: ',
      modules: 'Stone modules: ',
      linting: 'Linting tools: ',
      testing: 'Testing framework: ',
      initGit: 'Initialize Git repository? ',
      overwrite: 'Overwrite directory: '
    }
  }

  /**
   * Runs the questionnaire and collects user answers.
   *
   * @returns A promise that resolves with the user's answers.
   */
  async getAnswers (): Promise<Record<string, unknown>> {
    const answers: Record<string, string | boolean | string[]> = {}

    answers.projectName = await this.commandInput.ask(
      this.messages.projectName,
      this.blueprint.get<string>('project.projectName')
    )

    const projectPath = basePath(answers.projectName)

    if (fsExtra.pathExistsSync(projectPath)) {
      answers.overwrite = await this.commandInput.confirm(
        this.getOverwriteMessage(answers.projectName)
      )

      if (!answers.overwrite) {
        throw new Error('Operation cancelled by the user.')
      }
    }

    answers.template = await this.commandInput.choice(
      this.messages.template,
      this.templates,
      [0]
    )

    answers.typing = await this.commandInput.choice(
      this.messages.typing,
      this.typings,
      [0]
    )

    answers.packageManager = await this.commandInput.choice(
      this.messages.packageManager,
      this.packageManagers,
      [0]
    )

    answers.modules = await this.commandInput.choice(
      this.messages.modules,
      this.stoneModules,
      [],
      true
    )

    answers.linting = await this.commandInput.choice(
      this.messages.linting,
      this.lintingTools,
      [0]
    )

    answers.testing = await this.commandInput.choice(
      this.messages.testing,
      this.testingFrameworks,
      [0]
    )

    answers.initGit = await this.commandInput.confirm(
      this.messages.initGit
    )

    answers.confirmation = await this.commandInput.confirm(
      this.getConfirmationMessage(answers)
    )

    if (!answers.confirmation) {
      throw new Error('Operation cancelled by the user.')
    }

    return answers
  }

  /**
   * Generates a message to confirm overwriting a directory.
   *
   * @param projectName - The project name.
   * @returns The confirmation message.
   */
  private getOverwriteMessage (projectName: string): string {
    return `Target directory (${basePath(projectName)}) is not empty. Remove existing files and continue?`
  }

  /**
   * Generates a summary of the user's answers for confirmation.
   *
   * @param answers - The user's answers.
   * @returns The confirmation message.
   */
  private getConfirmationMessage (answers: Record<string, any>): string {
    const message = Object.entries(answers)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${String(this.messages[key])}${String(value ?? 'None')}`)
      .join('\n')

    return `Project will be generated with the following configurations:\n${this.commandOutput.format.blue(message)}\nDo you confirm?`
  }
}
