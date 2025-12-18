import { LLMRunner } from './llm-runner'
import fs from 'fs'
import open from 'open'
import generateIntentContext from '@/utils/intentPromptGen'
import getSettingsFile from '@/utils/fetchSettingsFile'

// Singleton IntentRouter to manage intent classification
export class IntentRouter {
  private static instance: IntentRouter
  private llmRunner: LLMRunner
  private appNames: string[]
  private apps: { name: string; dir: string }[]

  constructor(llmRunner: LLMRunner) {
    this.llmRunner = llmRunner

    const rawdata = fs.readFileSync(getSettingsFile()).toString()
    const data = JSON.parse(rawdata)
    this.appNames = data.appNames
    this.apps = data.apps
  }

  public static getInstance(llmRunner: LLMRunner): IntentRouter {
    if (!IntentRouter.instance) {
      IntentRouter.instance = new IntentRouter(llmRunner)
    }

    return IntentRouter.instance
  }

  public async handlePrompt(prompt: string): Promise<{ message: string | number }> {
    const intent = await this.classifyIntent(prompt)
    if (!intent) return { message: 404 }

    switch (intent.intent.action) {
      case 'open_app':
        this.apps?.forEach((item) => {
          if (item.name.toLowerCase().trim() === intent.intent.target.toLowerCase().trim()) {
            open(item.dir)
          }
        })
        return { message: intent.response_to_intent }
      case 'search_web':
        return { message: intent.response_to_intent }
      default:
        return { message: intent.response_to_intent }
    }
  }

  private async classifyIntent(
    prompt: string
  ): Promise<{ intent: { action: string; target: string }; response_to_intent: string }> {
    const intentPrompt = generateIntentContext(this.appNames, prompt)

    const response = await this.llmRunner.generatePrompt(intentPrompt)
    console.log(response)
    const response_json = JSON.parse(response) as {
      intent: { action: string; target: string }
      response_to_intent: string
    }

    return response_json
  }
}
