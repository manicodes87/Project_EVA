import './index.css'
import NavBar from '@renderer/components/NavBar'
import Home from '@renderer/components/Home'
import Settings from '@renderer/components/Settings'
import Chat from '@renderer/components/Chat'
import { Routes, Route, useLocation, HashRouter } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { JSX } from 'react'

// --- Audio playback ---
let audioContext: AudioContext | null = null
let nextTime = 0
const audioQueue: { buffer: AudioBuffer; duration: number }[] = []

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext()
    audioContext.resume() // ensure it can play on user interaction
    nextTime = audioContext.currentTime
  }
  return audioContext
}

// Plays queued audio chunks without gaps
function scheduleAudio(buffer: AudioBuffer) {
  const ctx = getAudioContext()
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.connect(ctx.destination)

  const startTime = Math.max(nextTime, ctx.currentTime)
  src.start(startTime)
  nextTime = startTime + buffer.duration
}

// --- TTS callback ---
window.eva.onTTS(async (_, msg: { pcm: ArrayBuffer; sampleRate: number }) => {
  if (!msg.pcm || !msg.sampleRate) return

  const ctx = getAudioContext()
  const floatData = new Float32Array(msg.pcm)
  const buffer = ctx.createBuffer(1, floatData.length, msg.sampleRate)
  buffer.copyToChannel(floatData, 0, 0)

  audioQueue.push({ buffer, duration: buffer.duration })

  // Schedule all queued chunks immediately
  while (audioQueue.length > 0) {
    const { buffer } = audioQueue.shift()!
    scheduleAudio(buffer)
  }
})

// --- Routes & App ---
function AnimatedRoutes(): JSX.Element {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              className="h-full w-full flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/chat"
          element={
            <motion.div
              className="h-full w-full flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Chat />
            </motion.div>
          }
        />
        <Route
          path="/settings"
          element={
            <motion.div
              className="h-full w-full flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Settings />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default function App(): JSX.Element {
  return (
    <HashRouter>
      <div id="app" className="flex h-screen w-screen overflow-hidden shadow-lg">
        <NavBar />
        <div className="flex-1 bg-(--background-lighter-color) ml-px relative">
          <AnimatedRoutes />
        </div>
      </div>
    </HashRouter>
  )
}
