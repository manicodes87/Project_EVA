import { registerReadChats, registerSaveChats } from './chat-bridge'
import { registerEvaAnswer, registerEvaWake } from './eva-bridge'
import { registerChangeSettings, registerLoadSettings } from './settings-bridge'

export function registerIpcMainHandlers(): void {
  registerEvaWake()
  registerReadChats()
  registerSaveChats()
  registerEvaAnswer()
  registerLoadSettings()
  registerChangeSettings()
}
