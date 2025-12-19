import { ChatInterface, SettingsJson } from './types'

declare global {
  interface Window {
    eva: {
      onTTS: (cb: (event: Electron.IpcRendererEvent, audioBuffer: ArrayBuffer) => void) => void
      readChats: () => Promise<ChatInterface>
      saveChats: (sender: string, message: string) => Promise<{ message: number | string }>
      onMessageReady: (cb: () => void) => void
      loadSettings: () => Promise<SettingsJson>
      changeSettings: (newSettings: string) => void
    }
  }
}
export {}
