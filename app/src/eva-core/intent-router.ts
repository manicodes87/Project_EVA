import { LLMRunner } from "./llm-runner";

// Singleton IntentRouter to manage intent classification
export class IntentRouter {
  private static instance: IntentRouter | null;
  private llmRunner: LLMRunner | null;
  constructor(llmRunner: LLMRunner) {
    this.llmRunner = llmRunner;
  }

  public static getInstance(llmRunner: LLMRunner): IntentRouter {
    if (!IntentRouter.instance) {
      IntentRouter.instance = new IntentRouter(llmRunner);
    }

    return IntentRouter.instance;
  }

  async handlePrompt(prompt: string): Promise<{ message: number }> {
    const intent = await this.classifyIntent(prompt);
    if (!intent) return { message: 404 };

    switch (intent) {
      case "open_app":
        console.log("Intent to open an app detected.");
        break;
      case "search_web":
        console.log("Intent to search the web detected.");
        break;
      default:
        console.log("Default intent detected.");
    }

    return { message: 200 };
  }

  private async classifyIntent(prompt: string): Promise<string> {
    const intentPrompt = `Classify the intent of the following prompt: "${prompt}" \n into one of the following categories: open_app, search_web, or default_intent. Respond with only the intent category. If the prompt given is not asking you to do any of these intents respond normally.`;

    const response = await this.llmRunner.generatePrompt(intentPrompt);
    console.log(response);
    return response;
  }
}
