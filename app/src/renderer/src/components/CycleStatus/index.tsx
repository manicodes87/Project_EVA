import { JSX, useState } from 'react'

export default function CycleStatus(): JSX.Element {
  const [TTSStatus, setTTSStatus] = useState<boolean | string>('loading...')
  const [listenerStatus, setListenerStatus] = useState<boolean | string>('loading...')
  const [assistantStatus, setAssistantStatus] = useState<boolean | string>('loading...')

  const interval = setInterval(() => {
    window.eva.getCycleStatus().then((status) => {
      if (status.tts != TTSStatus) setTTSStatus(status.tts)
      if (status.listener != listenerStatus) setListenerStatus(status.listener)
      if (status.assistant != assistantStatus) setAssistantStatus(status.assistant)

      if (status.tts && status.listener && status.assistant) clearInterval(interval)
      console.log('Cycle Status:', status)
    })
  }, 1000)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-(--primary-color) rounded-lg shadow flex items-center space-x-3">
        <span
          className={`w-3 h-3 rounded-full ${
            TTSStatus ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
          }`}
        ></span>
        <div>
          <h2 className="font-semibold text-lg">TTS</h2>
          <p className="text-sm text-(--text-color)">
            {typeof TTSStatus === 'boolean'
              ? TTSStatus
                ? 'Initialized'
                : 'Initializing...'
              : TTSStatus}
          </p>
        </div>
      </div>

      <div className="p-4 bg-(--primary-color) rounded-lg shadow flex items-center space-x-3">
        <span
          className={`w-3 h-3 rounded-full ${
            listenerStatus ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
          }`}
        ></span>
        <div>
          <h2 className="font-semibold text-lg">Listener</h2>
          <p className="text-sm text-(--text-color)">
            {typeof listenerStatus === 'boolean'
              ? listenerStatus
                ? 'Initialized'
                : 'Initializing...'
              : listenerStatus}
          </p>
        </div>
      </div>

      <div className="p-4 bg-(--primary-color) rounded-lg shadow flex items-center space-x-3">
        <span
          className={`w-3 h-3 rounded-full ${
            assistantStatus ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
          }`}
        ></span>
        <div>
          <h2 className="font-semibold text-lg">Assistant</h2>
          <p className="text-sm text-(--text-color)">
            {typeof assistantStatus === 'boolean'
              ? assistantStatus
                ? 'Initialized'
                : 'Initializing...'
              : assistantStatus}
          </p>
        </div>
      </div>
    </div>
  )
}
