import { ipcMain, app } from "electron";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let filePath = "";

if (app.isPackaged) {
  // Packaged app: apps are inside resources folder
  filePath = path.join(
    process.resourcesPath,
    "assets",
    "src",
    "settings",
    "settings.json"
  );
} else {
  // Dev mode: resolve from project root, not __dirname
  // Adjust this depending on your project structure
  filePath = path.join(
    __dirname,
    "..",
    "..",
    "src",
    "assets",
    "settings",
    "settings.json"
  );
}

export function registerLoadSettings() {
  ipcMain.handle("load-settings", async () => {
    return JSON.parse(fs.readFileSync(filePath).toString());
  });
}

export function registerChangeSettings() {
  ipcMain.handle("change-settings", async (event, newSettings) => {
    try {
      fs.writeFileSync(filePath, newSettings);
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  });
}
