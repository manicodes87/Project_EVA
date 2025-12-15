import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import { app } from "electron";
import { LlamaChatSession } from "node-llama-cpp";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Singleton LLMRunner to manage LLM sessions
export class LLMRunner {
  private static instance: LLMRunner | null;
  private session: LlamaChatSession | null;
  private modelPath: string;

  private constructor(fileName: string) {
    this.modelPath = LLMRunner.getModelPath(fileName);
  }

  public static getInstance(fileName: string): LLMRunner {
    if (!LLMRunner.instance) {
      LLMRunner.instance = new LLMRunner(fileName);
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

  static getModelPath(filename: string) {
    if (app.isPackaged) {
      // Packaged app: models are inside resources folder
      return path.join(process.resourcesPath, "..", "model", filename);
    } else {
      // Dev mode: resolve from project root, not __dirname
      // Adjust this depending on your project structure
      return path.join(__dirname, "..", "..", "..", "model", filename);
    }
  }

  async generatePrompt(prompt: string): Promise<string> {
    if (!this.sessionExists()) {
      throw new Error("LLM session is not initialized.");
    }
    const response = await this.session.prompt(prompt);
    return response;
  }
}
