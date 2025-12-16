import { ipcMain } from "electron";
import fs from "fs";
import getSettingsFile from "../utils/fetchSettingsFile";

export function registerLoadSettings() {
  ipcMain.handle("load-settings", async () => {
    console.log(getSettingsFile());
    return JSON.parse(fs.readFileSync(getSettingsFile()).toString());
  });
}

export function registerChangeSettings() {
  ipcMain.handle("change-settings", async (event, newSettings) => {
    try {
      fs.writeFileSync(getSettingsFile(), newSettings);
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  });
}
