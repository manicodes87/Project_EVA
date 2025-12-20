import { ipcMain } from 'electron'
import { WindowManager } from '@/utils/windowManager'
import { intentRouter } from '@/main'
import { ChatManager } from '@/utils/chatManager'
import { SenderEnum } from '@/types/types'
import { TTSEngine } from '@/eva-core/tts-engine'
import { MemoryManager } from '@/utils/memoryManager'

export function registerEvaAnswer(): void {
  ipcMain.on('eva_generate_answer', async (_, message: string) => {
    const res = await intentRouter?.handlePrompt(message)

    // Activate TTS synthesis
    TTSEngine.synthesize(res?.message as string).then((audioBuffer) => {
      // Send TTS ready event to renderer with audio buffer
      WindowManager?.getMainWindow()?.webContents.send('eva_tts_ready', audioBuffer)
    })

    // Save chat to chat history
    const { id } = ChatManager.getInstance().saveMessage(SenderEnum.EVA, res?.message as string)
    MemoryManager.getInstance().setMemoryJson({
      id,
      context: res?.context as string
    })

    // Send event to renderer after answer generation
    WindowManager?.getMainWindow()?.webContents.send('eva_answer_ready')
  })
}
