import { LLMRunner } from "./llm-runner";
import fs from "fs";
import { app } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import open from "open";
import generateIntentContext from "../utils/intentPromptGen";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Singleton IntentRouter to manage intent classification
export class IntentRouter {
  private static instance: IntentRouter | null;
  private llmRunner: LLMRunner | null;
  private appNames: string[] | null;
  private apps: { name: string; dir: string }[] | null;

  constructor(llmRunner: LLMRunner) {
    this.llmRunner = llmRunner;

    const rawdata = fs.readFileSync(this.getAppsFile()).toString();
    const data = JSON.parse(rawdata);
    this.appNames = data.appNames;
    this.apps = data.apps;
  }

  private getAppsFile() {
    if (app.isPackaged) {
      // Packaged app: apps are inside resources folder
      return path.join(process.resourcesPath, "assets", "src", "intents", "apps.json");
    } else {
      // Dev mode: resolve from project root, not __dirname
      // Adjust this depending on your project structure
      return path.join(__dirname, "..", "..", "src", "assets", "intents", "apps.json");
    }
  }

  public static getInstance(llmRunner: LLMRunner): IntentRouter {
    if (!IntentRouter.instance) {
      IntentRouter.instance = new IntentRouter(llmRunner);
    }

    return IntentRouter.instance;
  }

  public async handlePrompt(prompt: string): Promise<{ message: string | number }> {
    const intent = await this.classifyIntent(prompt);
    if (!intent) return { message: 404 };

    switch (intent.intent.action) {
      case "open_app":
        this.apps.forEach((item) => {
          if (
            item.name.toLowerCase().trim() === intent.intent.target.toLowerCase().trim()
          ) {
            open(item.dir);
          }
        });
        return { message: intent.response_to_intent };
      case "search_web":
        return { message: intent.response_to_intent };
      default:
        return { message: intent.response_to_intent };
    }
  }

  private async classifyIntent(
    prompt: string
  ): Promise<{ intent: { action: string; target: string }; response_to_intent: string }> {
    const intentPrompt = generateIntentContext(this.appNames, prompt);

    const response = await this.llmRunner.generatePrompt(intentPrompt);
    console.log(response);
    const response_json = JSON.parse(response) as {
      intent: { action: string; target: string };
      response_to_intent: string;
    };

    return response_json;
  }
}
