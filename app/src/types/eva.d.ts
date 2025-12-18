import { ChatInterface, SettingsJson } from './types'

declare global {
  interface Window {
    eva: {
      onWake: (cb: () => void) => void
      readChats: () => Promise<ChatInterface>
      saveChats: (sender: string, message: string) => Promise<{ message: number | string }>
      onMessageReady: (cb: () => void) => void
      loadSettings: () => Promise<SettingsJson>
      changeSettings: (newSettings: string) => void
    }
  }
}
export {}
