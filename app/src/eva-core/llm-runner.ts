import fs from "fs";
import { LlamaChatSession } from "node-llama-cpp";
import os from "os";
import getSettingsFile from "../utils/fetchSettingsFile";
import { Settings } from "../types/types";

// Singleton LLMRunner to manage LLM sessions
export class LLMRunner {
  private static instance: LLMRunner | null;
  private session: LlamaChatSession | null;
  private modelPath: string;

  private constructor() {
    this.modelPath = LLMRunner.getModelPath();
  }

  public static getInstance(): LLMRunner {
    if (!LLMRunner.instance) {
      LLMRunner.instance = new LLMRunner();
    }

    return LLMRunner.instance;
  }

  async initialize() {
    const { getLlama, LlamaChatSession } = await import("node-llama-cpp");
    const llama = await getLlama();
    const model = await llama.loadModel({
      modelPath: this.modelPath,
    });

    // Limiters
    const context = await model.createContext({
      contextSize: 2048,
      threads: Math.max(1, os.cpus().length - 1),
    });
    this.session = new LlamaChatSession({
      contextSequence: context.getSequence(),
    });

    return { message: 200 };
  }

  sessionExists() {
    return this.session instanceof LlamaChatSession;
  }

  static getModelPath() {
    const settings: Settings = JSON.parse(fs.readFileSync(getSettingsFile()).toString());
    return settings.models.find((item) => item.name === "assistantModel").dir;
  }

  async generatePrompt(prompt: string): Promise<string> {
    if (!this.sessionExists()) {
      throw new Error("LLM session is not initialized.");
    }
    const response = await this.session.prompt(prompt);
    return response;
  }
}
