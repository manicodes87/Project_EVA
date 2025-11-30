import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import { app } from "electron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getModelPath(filename: string) {
  if (app.isPackaged) {
    // Packaged app: models are inside resources folder
    return path.join(process.resourcesPath, "..", "model", filename);
  } else {
    // Dev mode: resolve from project root, not __dirname
    // Adjust this depending on your project structure
    return path.join(__dirname, "..", "..", "..", "model", filename);
  }
}

export async function initializeLlama() {
  const { getLlama, LlamaChatSession } = await import("node-llama-cpp");
  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: getModelPath("phi3.gguf"),
  });
  const context = await model.createContext();
  const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
  });
  const q1 = "Hi there, how are you?";
  console.log("User: " + q1);
  const a1 = await session.prompt(q1);
  console.log("AI: " + a1);
  const q2 = "Summarize what you said";
  console.log("User: " + q2);
  const a2 = await session.prompt(q2);
  console.log("AI: " + a2);
}
