import { registerReadChats, registerSaveChats } from './chat-bridge'
import { registerCycleStatusBridge } from './cycle-status-bridge'
import { registerEvaAnswer } from './eva-bridge'
import { registerChangeSettings, registerLoadSettings } from './settings-bridge'

export function registerIpcMainHandlers(): void {
  registerReadChats()
  registerSaveChats()
  registerEvaAnswer()
  registerLoadSettings()
  registerChangeSettings()
  registerCycleStatusBridge()
}
