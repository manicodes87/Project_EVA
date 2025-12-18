import { ipcMain } from 'electron'
import WebsocketManager from '@/utils/websocketManager'
import { WindowManager } from '@/utils/windowManager'
import { intentRouter } from '@/main'
import { ChatManager } from '@/utils/chatManager'
import { SenderEnum } from '@/types/types'

export function registerEvaWake(): void {
  // Recieve Wake from listener daemon
  WebsocketManager.getInstance().subscribeEvent((data: { event: string }) => {
    const win = WindowManager.getMainWindow()
    if (!win) return
    if (data.event !== 'eva_wake') return

    console.log('Wake event from listener')

    // Forward to renderer UI
    win.webContents.send('eva:wake')
  })
}

export function registerEvaAnswer(): void {
  ipcMain.on('eva_generate_answer', async (_, message: string) => {
    const res = (await intentRouter?.handlePrompt(message))?.message
    ChatManager.getInstance().saveMessage(SenderEnum.EVA, res as string)

    // Send event to renderer after answer generation
    WindowManager?.getMainWindow()?.webContents.send('eva_answer_ready')
  })
}
