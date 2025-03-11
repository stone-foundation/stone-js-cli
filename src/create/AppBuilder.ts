import { Questionnaire } from './Questionnaire'
import { ConsoleContext } from '../declarations'
import { MetaPipe, Pipeline } from '@stone-js/pipeline'
import { IBlueprint, IncomingEvent } from '@stone-js/core'
import { CreateAppMiddleware } from './CreateAppMiddleware'

/**
 * The App builder options.
 */
export interface AppBuilderOptions {
  blueprint: IBlueprint
}

/**
 * The App builder class.
 */
export class AppBuilder {
  /**
   * Creates a new App builder instance.
   *
   * @param context - The service container to manage dependencies.
   */
  constructor (private readonly context: ConsoleContext) {}

  /**
   * Builds the application.
   *
   * @param event The incoming event.
   */
  async build (event: IncomingEvent): Promise<void> {
    this.setUserOptions(event)

    if (!event.get<boolean>('yes', false)) {
      const answers = await Questionnaire.create(this.context).getAnswers()
      this.context.blueprint.set('stone.createApp', answers)
    }

    await this.executeThroughPipeline(CreateAppMiddleware)
  }

  private setUserOptions (event: IncomingEvent): void {
    this.context.blueprint.set('stone.createApp.overwrite', event.get<boolean>('force', false))
    this.context.blueprint.set('stone.createApp.projectName', event.get<string>('project-name', 'stone-project'))
  }

  private async executeThroughPipeline (pipes: Array<MetaPipe<ConsoleContext>>): Promise<void> {
    await Pipeline
      .create<ConsoleContext>()
      .send(this.context)
      .through(...pipes)
      .thenReturn()
  }
}
