import fs from "fs";
import path, { dirname } from "path";
import { app } from "electron";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ChatManager {
  private static instance: ChatManager | null;
  private fileURL: string | null;

  constructor() {
    this.fileURL = this.getChatPath();
  }

  public static getInstance() {
    if (!ChatManager.instance) {
      ChatManager.instance = new ChatManager();
    }
    return ChatManager.instance;
  }

  private getChatPath() {
    if (app.isPackaged) {
      // Packaged app: models are inside resources folder
      return path.join(process.resourcesPath, "assets", "src", "chat", "chat.json");
    } else {
      // Dev mode: resolve from project root, not __dirname
      // Adjust this depending on your project structure
      return path.join(__dirname, "..", "..", "src", "assets", "chat", "chat.json");
    }
  }

  public readChats() {
    const rawdata = fs.readFileSync(this.fileURL).toString();
    const data = JSON.parse(rawdata);

    return data;
  }

  public saveMessage(sender: string, message: string) {
    const rawdata = fs.readFileSync(this.fileURL).toString();
    const data = JSON.parse(rawdata);

    data.chats.push({
      sender,
      message,
    });

    fs.writeFileSync(this.fileURL, JSON.stringify(data));
  }
}
