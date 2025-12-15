import { SenderEnum } from "../types/types";
import { websocketManager } from "../main";
import { ipcMain } from "electron";
import { ChatManager } from "../utils/chatManager";

export function subscribeText() {
  websocketManager.subscribeEvent((data: { event: string; text: string }) => {
    if (data.event != "speech_text") return;

    const result = ChatManager.getInstance().saveMessage(SenderEnum.USER, data.text);

    // EVA response handling
    if (result.message === 200) ipcMain.emit("eva_generate_answer", {}, data.text);
    return result;
  });
}
