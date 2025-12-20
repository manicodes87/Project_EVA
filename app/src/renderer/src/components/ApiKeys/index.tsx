import { SettingsJson } from '@/types/types'
import { useEffect, useState } from 'react'
import { SaveIcon } from 'lucide-react'

export default function ApiKeys({ settings }: { settings: SettingsJson }) {
  const [porcupineKey, setPorcupineKey] = useState('')

  // Initial state setup based on settings prop
  useEffect(() => {
    if (settings) {
      setPorcupineKey(settings.porcupineAPIKey)
    }
  }, [])

  const handleAddKey = () => {
    const key = porcupineKey.trim()
    if (!key) return

    const newSettings: SettingsJson = {
      ...settings,
      porcupineAPIKey: key
    }

    setPorcupineKey(key)
    window.eva.changeSettings(JSON.stringify(newSettings))
  }

  return (
    <div className="p-6 bg-(--background-darker-color) rounded-lg m-2 flex">
      <input
        type="text"
        placeholder="dirution Command"
        value={porcupineKey}
        onChange={(e) => setPorcupineKey(e.target.value)}
        className="p-4 border-2 flex-1 rounded-2xl border-(--background-darker-color) text-sm bg-(--background-lighter-color) outline-none transition duration-100 focus:border-(--accent-color)"
      />

      <button
        onClick={handleAddKey}
        className="p-4 flex ml-2 justify-center items-center border-2 rounded-2xl bg-(--primary-color) border-(--background-darker-color) text-sm outline-none transition duration-100 hover:bg-(--secondary-color) cursor-pointer"
      >
        <SaveIcon />
      </button>
    </div>
  )
}
