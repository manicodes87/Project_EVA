import { ipcMain } from 'electron'
import { ChatManager } from '@/utils/chatManager'
import { ChatInterface } from '@/types/types'

export function registerReadChats(): void {
  ipcMain.handle('read-chats', async () => {
    const chats: ChatInterface[] = ChatManager.getInstance().readChats()

    return chats
  })
}

export function registerSaveChats(): void {
  ipcMain.handle('save-chats', async (_, sender: string, message: string) => {
    const result = ChatManager.getInstance().saveMessage(sender, message)

    // EVA response handling
    if (result.message === 200) ipcMain.emit('eva_generate_answer', {}, message)
    return result
  })
}
