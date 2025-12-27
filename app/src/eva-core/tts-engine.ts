import getSettingsFile from '@/utils/fetchSettingsFile'
import createWorker from '../workers/ttsWorker?nodeWorker'
import { SettingsJson } from '@/types/types'
import fs from 'fs'
import { BrowserWindow } from 'electron'

export class TTSEngine {
  private static worker = createWorker({})
  private static requestId = 0
  private static win: BrowserWindow | null = null

  private static modelPath = (
    JSON.parse(fs.readFileSync(getSettingsFile(), 'utf8')) as SettingsJson
  ).models.find((m) => m.name === 'kokoroModel')?.dir

  public static attachWindow(win: BrowserWindow) {
    this.win = win
  }

  static {
    this.worker.on(
      'message',
      (msg: { id: number; pcm?: ArrayBuffer; sampleRate?: number; error?: string }) => {
        if (msg.pcm && msg.sampleRate && this.win && !this.win.isDestroyed()) {
          this.win.webContents.send('tts-audio-chunk', { pcm: msg.pcm, sampleRate: msg.sampleRate })
        }
        if (msg.error) {
          console.error('TTS Worker Error:', msg.error)
        }
      }
    )
  }

  /// Non-blocking streaming: push text to worker
  public static enqueueChunk(text: string): void {
    const id = ++this.requestId
    this.worker.postMessage({
      id,
      text,
      modelPath: this.modelPath
    })
  }
}
