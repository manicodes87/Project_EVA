import { parentPort } from 'worker_threads'
import { KokoroTTS, TextSplitterStream } from 'kokoro-js'

type TTSMessage = {
  id: number
  text: string
  modelPath: string
}

let tts: KokoroTTS | null = null
let initPromise: Promise<void> | null = null
const queue: TTSMessage[] = []
let processing = false

async function initTTS(modelPath: string) {
  if (tts) return
  if (initPromise) return initPromise

  initPromise = (async () => {
    tts = await KokoroTTS.from_pretrained(modelPath)
    await tts.generate(' ') // warm-up
  })()

  return initPromise
}

async function processQueue() {
  if (processing) return
  processing = true

  while (queue.length > 0) {
    const msg = queue.shift()!
    try {
      await initTTS(msg.modelPath)
      if (!tts) continue

      const splitter = new TextSplitterStream()
      splitter.push(msg.text)
      splitter.close() // signal end of sentence

      const stream = tts.stream(splitter)
      for await (const chunk of stream) {
        const floatData = chunk.audio.audio // Float32Array
        const pcmBuffer =
          floatData.buffer instanceof ArrayBuffer ? floatData.buffer : floatData.slice().buffer
        const sampleRate = chunk.audio.sampling_rate ?? 22050

        parentPort!.postMessage({ id: msg.id, pcm: pcmBuffer, sampleRate }, [pcmBuffer])
      }
    } catch (err) {
      parentPort!.postMessage({
        id: msg.id,
        error: (err as Error).message
      })
    }
  }

  processing = false
}

parentPort!.on('message', (msg: TTSMessage) => {
  queue.push(msg)
  processQueue()
})
