import { SenderEnum } from '@/types/types'
import { websocketManager } from '@/main'
import { ipcMain } from 'electron'
import { ChatManager } from '@/utils/chatManager'
import { WindowManager } from '@/utils/windowManager'
import { CycleStatus } from './cycle-status'

export class STTEngine {
  public static init(): void {
    this.subscribeInit()
    this.subscribeText()
  }

  private static subscribeText(): void {
    websocketManager?.subscribeEvent((data: { event: string; text: string }) => {
      if (data.event != 'speech_text') return

      const result = ChatManager.getInstance().saveMessage(SenderEnum.USER, data.text)

      // EVA response handling
      if (result.message === 200) ipcMain.emit('eva_generate_answer', {}, data.text)
      return result
    })
  }

  private static subscribeInit(): void {
    websocketManager?.subscribeEvent((data: { event: string }) => {
      if (data.event != 'listener_ready') return

      CycleStatus.setListenerInitialized()
    })
  }
}
