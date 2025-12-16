import { app } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function getSettingsFile() {
  if (app.isPackaged) {
    // Packaged app: apps are inside resources folder
    return path.join(process.resourcesPath, "assets", "src", "settings", "settings.json");
  } else {
    // Dev mode: resolve from project root, not __dirname
    // Adjust this depending on your project structure
    return path.join(__dirname, "..", "..", "src", "assets", "settings", "settings.json");
  }
}
