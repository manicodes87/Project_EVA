import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const eva = {
  onTTS: (
    callback: (
      event: Electron.IpcRendererEvent,
      msg: { pcm: ArrayBuffer; sampleRate: number }
    ) => Promise<void>
  ) => {
    ipcRenderer.on('tts-audio-chunk', (event, msg: { pcm: ArrayBuffer; sampleRate: number }) =>
      callback(event, msg)
    )
  },
  readChats: () => ipcRenderer.invoke('read-chats'),
  saveChats: (sender: string, message: string) => ipcRenderer.invoke('save-chats', sender, message),
  onMessageReady: (callback: () => void) => ipcRenderer.on('eva_answer_ready', () => callback()),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  changeSettings: (newSettings: string) => ipcRenderer.invoke('change-settings', newSettings)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('eva', eva)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.eva = api
}
