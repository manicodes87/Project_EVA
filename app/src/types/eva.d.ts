import { ChatInterface, SettingsJson } from './types'

declare global {
  interface Window {
    eva: {
      getCycleStatus: () => Promise<{ tts: boolean; listener: boolean; assistant: boolean }>
      onTTS: (
        cb: (
          event: Electron.IpcRendererEvent,
          msg: { pcm: ArrayBuffer; sampleRate: number }
        ) => Promise<void>
      ) => void
      readChats: () => Promise<ChatInterface>
      saveChats: (sender: string, message: string) => Promise<{ message: number | string }>
      onMessageReady: (cb: () => void) => void
      loadSettings: () => Promise<SettingsJson>
      changeSettings: (newSettings: string) => void
    }
  }
}
export {}
