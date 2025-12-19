import { parentPort } from 'worker_threads'
import { KokoroTTS } from 'kokoro-js'

let tts: KokoroTTS | null = null
let initializing = false

async function getTTS(modelPath: string): Promise<KokoroTTS> {
  if (tts) return tts
  if (initializing) {
    while (!tts) await new Promise((r) => setTimeout(r, 10))
    return tts
  }

  initializing = true
  tts = await KokoroTTS.from_pretrained(modelPath, {
    dtype: 'q4f16',
    device: 'cpu'
  })
  initializing = false
  return tts
}

parentPort!.on('message', async (msg) => {
  try {
    const tts = await getTTS(msg.modelPath)
    const audio = await tts.generate(msg.text)
    const wav = audio.toWav()

    parentPort!.postMessage(
      { id: msg.id, wav },
      [wav] // zero-copy transfer
    )
  } catch (err) {
    parentPort!.postMessage({
      id: msg.id,
      error: (err as Error).message
    })
  }
})
