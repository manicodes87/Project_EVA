// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("eva", {
  onWake: (callback: () => void) => ipcRenderer.on("eva:wake", () => callback()),
  readChats: () => ipcRenderer.invoke("read-chats"),
  saveChats: (sender: string, message: string) => {
    ipcRenderer.invoke("save-chats", sender, message);
  },
});
