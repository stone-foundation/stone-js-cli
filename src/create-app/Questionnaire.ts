import fsExtra from 'fs-extra'
import { basePath } from '../utils'
import templates from './templates'
import { IBlueprint } from '@stone-js/core'
import { CommandInput, CommandOutput } from '@stone-js/node-cli-adapter'

/**
 * Represents the options for the Questionnaire class.
 */
export interface QuestionnaireOptions {
  blueprint: IBlueprint
  commandInput: CommandInput
  commandOutput: CommandOutput
}

/**
 * Represents a Questionnaire to guide users in creating a Stone.js application.
 */
export class Questionnaire {
  /**
   * Output used to print data in console.
   */
  private readonly commandOutput: CommandOutput

  /**
   * Blueprint used to get configuration.
   */
  private readonly blueprint: IBlueprint

  /**
   * Input used to get user input.
   */
  private readonly commandInput: CommandInput

  /**
   * Factory method to create a new Questionnaire instance.
   *
   * @param options - The options to create a Questionnaire.
   * @returns A new instance of Questionnaire.
   */
  static create (options: QuestionnaireOptions): Questionnaire {
    return new this(options)
  }

  /**
   * Initializes a new Questionnaire instance.
   *
   * @param options - The options to create a Questionnaire.
   */
  constructor ({ blueprint, commandInput, commandOutput }: QuestionnaireOptions) {
    this.blueprint = blueprint
    this.commandInput = commandInput
    this.commandOutput = commandOutput
  }

  /**
   * Returns the available templates.
   */
  private get templates (): Array<Record<'value' | 'name', string>> {
    return templates({ format: this.commandOutput.format })
  }

  /**
   * Returns the available typing options.
   */
  private get typings (): Array<Record<'value' | 'name', string>> {
    return [
      { value: 'vanilla', name: 'None (Vanilla)' },
      { value: 'typescript', name: 'TypeScript' }
    ]
  }

  /**
   * Returns the available package managers.
   */
  private get packageManagers (): Array<Record<'value' | 'name', string>> {
    return [
      { value: 'npm', name: 'Npm' },
      { value: 'yarn', name: 'Yarn' },
      { value: 'pnpm', name: 'Pnpm' }
    ]
  }

  /**
   * Returns the available Stone.js modules.
   */
  private get stoneModules (): Array<Record<'value' | 'name', string>> {
    return [
      { value: '@stone-js/env', name: 'Stone.js Dotenv' },
      { value: '@stone-js/router', name: 'Stone.js Router' },
      { value: '@stone-js/aws-lambda-adapter', name: 'AWS Lambda Adapter' }
    ]
  }

  /**
   * Returns the available linting tools.
   */
  private get lintingTools (): Array<Record<'value' | 'name', string>> {
    return [
      { value: '', name: 'None' },
      { value: 'standard', name: 'Eslint (Standard)' },
      { value: 'prettier', name: 'Prettier' }
    ]
  }

  /**
   * Returns the available testing frameworks.
   */
  private get testingFrameworks (): Array<Record<'value' | 'name', string>> {
    return [
      { value: '', name: 'None' },
      { value: 'vitest', name: 'Vitest' },
      { value: 'mocha', name: 'Mocha' }
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
    return await this.commandInput.questionnaire([
      {
        type: 'input',
        name: 'projectName',
        message: this.messages.projectName,
        default: this.blueprint.get<string>('project.projectName')
      },
      {
        type: 'confirm',
        name: 'overwrite',
        message: (v) => this.getOverwriteMessage(v.projectName),
        when: (v) => fsExtra.pathExistsSync(basePath(v.projectName))
      },
      {
        type: 'confirm',
        name: 'overwriteChecker',
        message: '',
        when: (v) => {
          if (v.overwrite === false) {
            throw new Error('Operation cancelled by the user.')
          }
          return false
        }
      },
      {
        type: 'list',
        name: 'template',
        default: 0,
        choices: this.templates,
        message: this.messages.template
      },
      {
        type: 'list',
        name: 'typing',
        default: 0,
        choices: this.typings,
        message: this.messages.typing
      },
      {
        type: 'list',
        name: 'packageManager',
        default: 0,
        choices: this.packageManagers,
        message: this.messages.packageManager
      },
      {
        type: 'checkbox',
        name: 'modules',
        message: this.messages.modules,
        choices: (v) => this.stoneModules.filter((w) => (v.template === 'api' ? w.value !== '@stone-js/router' : true))
      },
      {
        type: 'list',
        name: 'linting',
        default: 0,
        choices: this.lintingTools,
        message: this.messages.linting
      },
      {
        type: 'list',
        name: 'testing',
        default: 0,
        choices: this.testingFrameworks,
        message: this.messages.testing
      },
      {
        type: 'confirm',
        name: 'initGit',
        message: this.messages.initGit
      },
      {
        type: 'confirm',
        name: 'confirmation',
        message: (answers: Record<string, any>) => this.getConfirmationMessage(answers)
      },
      {
        type: 'confirm',
        name: 'confirmationChecker',
        message: '',
        when: (v) => {
          if (v.confirmation === false) {
            throw new Error('Operation cancelled by the user.')
          }
          return false
        }
      }
    ])
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
