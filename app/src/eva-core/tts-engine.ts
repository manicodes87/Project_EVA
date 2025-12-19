import getSettingsFile from '@/utils/fetchSettingsFile'
import createWorker from '../workers/ttsWorker?nodeWorker'
import { SettingsJson } from '@/types/types'
import fs from 'fs'

type Pending = {
  resolve: (b: ArrayBuffer) => void
  reject: (e: Error) => void
}

export class TTSEngine {
  private static worker = createWorker({})
  private static requestId = 0
  private static pending = new Map<number, Pending>()
  private static modelPath = (
    JSON.parse(fs.readFileSync(getSettingsFile()).toString()) as SettingsJson
  ).models.find((m) => m.name === 'kokoroModel')?.dir

  static {
    this.worker.on('message', (msg) => {
      const { id, wav, error } = msg
      const pending = this.pending.get(id)
      if (!pending) return

      this.pending.delete(id)
      error ? pending.reject(new Error(error)) : pending.resolve(wav)
    })
  }

  public static synthesize(text: string): Promise<ArrayBuffer> {
    const id = ++this.requestId

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.worker.postMessage({ id, text, modelPath: this.modelPath })
    })
  }
}
