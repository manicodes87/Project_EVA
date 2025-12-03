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

  async handlePrompt(prompt: string): Promise<{ message: string | number }> {
    const intent = await this.classifyIntent(prompt);
    if (!intent) return { message: 404 };

    switch (intent.intent) {
      case "open_app":
        return { message: intent.response_to_intent };
      case "search_web":
        return { message: intent.response_to_intent };
      default:
        return { message: intent.response_to_intent };
    }
  }

  private async classifyIntent(
    prompt: string
  ): Promise<{ intent: string; response_to_intent: string }> {
    const intentPrompt = `Your name is Eva. Classify the intent of the following prompt: "${prompt}" \n 
    into one of the following categories: 
    open_app,
    search_web.
    Respond in this json format example : { "intent": "open_app", "response_to_intent": "Opening App!" } 
    If the prompt given is not asking you to do any of these intents respond
    { "intent": "default_intent", "response_to_intent": "Respond in a way an assintant or a friend would do depending on the situation" }.
    Try to remember your conversations. dont remove the from memmory as much as possible.`;

    const response = JSON.parse(await this.llmRunner.generatePrompt(intentPrompt)) as {
      intent: string;
      response_to_intent: string;
    };
    return response;
  }
}
