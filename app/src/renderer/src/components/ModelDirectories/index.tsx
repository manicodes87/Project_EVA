import { useState, JSX, useEffect } from 'react'
import { SettingsJson, Entry } from '@/types/types'

export default function ModelDirectories({ settings }: { settings: SettingsJson }): JSX.Element {
  const [whisperModelDir, setWhisperModelDir] = useState<string>('')
  const [assistantModelDir, setAssistantModelDir] = useState<string>('')
  const [porcupineModelDir, setPorcupineModelDir] = useState<string>('')
  const [savedModels, setSavedModels] = useState<Entry[]>()

  // Initial model values passed through props
  useEffect(() => {
    if (settings) {
      const whisperModel = settings.models.find((item) => item.name === 'whisperModel') as Entry
      const assistantModel = settings.models.find((item) => item.name === 'assistantModel') as Entry
      const porcupineModel = settings.models.find((item) => item.name === 'porcupineModel') as Entry

      setSavedModels([whisperModel, assistantModel, porcupineModel])
    }
  }, [])

  const handleSaveModelDirs = (): void => {
    if (!whisperModelDir && !assistantModelDir && !porcupineModelDir) return

    const newModels: Entry[] = [
      {
        name: 'whisperModel',
        dir: whisperModelDir.trim()
      },
      {
        name: 'assistantModel',
        dir: assistantModelDir.trim()
      },
      {
        name: 'porcupineModel',
        dir: porcupineModelDir.trim()
      }
    ]

    const newSettings: SettingsJson = {
      appNames: settings.appNames,
      apps: settings.apps,
      models: newModels
    }

    setSavedModels(newModels)
    window.eva.changeSettings(JSON.stringify(newSettings))

    // Clear inputs
    setWhisperModelDir('')
    setAssistantModelDir('')
    setPorcupineModelDir('')
  }

  const handleRemoveModel = (idx: number): void => {
    setSavedModels(savedModels?.filter((_, i) => i !== idx))
  }

  return (
    <div className="p-6 bg-(--background-darker-color) rounded-lg m-2">
      <h2 className="text-xl font-bold mb-4">Model Directories</h2>

      <div className="flex flex-col gap-3 mb-6">
        {/* Whisper STT model */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--text-secondary-color)">
            Whisper STT Model
          </label>
          <input
            type="text"
            placeholder="Path to Whisper model"
            value={whisperModelDir}
            onChange={(e) => setWhisperModelDir(e.target.value.replace(/\\/g, '/'))}
            className="p-4 border-2 rounded-2xl border-(--background-darker-color) text-sm bg-(--background-lighter-color) outline-none transition duration-100 focus:border-(--accent-color)"
          />
        </div>

        {/* Assistant model */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--text-secondary-color)">
            Assistant Model
          </label>
          <input
            type="text"
            placeholder="Path to Assistant model"
            value={assistantModelDir}
            onChange={(e) => setAssistantModelDir(e.target.value.replace(/\\/g, '/'))}
            className="p-4 border-2 rounded-2xl border-(--background-darker-color) text-sm bg-(--background-lighter-color) outline-none transition duration-100 focus:border-(--accent-color)"
          />
        </div>

        {/* Porcupine keywords model */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--text-secondary-color)">
            Porcupine Keywords Model
          </label>
          <input
            type="text"
            placeholder="Path to Porcupine keywords model"
            value={porcupineModelDir}
            onChange={(e) => setPorcupineModelDir(e.target.value.replace(/\\/g, '/'))}
            className="p-4 border-2 rounded-2xl border-(--background-darker-color) text-sm bg-(--background-lighter-color) outline-none transition duration-100 focus:border-(--accent-color)"
          />
        </div>

        <button
          onClick={handleSaveModelDirs}
          className="p-4 border-2 rounded-2xl bg-(--primary-color) border-(--background-darker-color) text-sm outline-none transition duration-100 hover:bg-(--secondary-color) cursor-pointer mt-3"
        >
          Save
        </button>
      </div>

      {/* Display saved directories */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Saved Model Directories</h3>
        {savedModels?.length === 0 ? (
          <p className="text-gray-500">No model directories added yet</p>
        ) : (
          <ul className="space-y-3">
            {savedModels?.map((model, idx) => (
              <li
                key={idx}
                className="p-4 rounded-2xl border-2 border-(--background-darker-color) bg-(--background-lighter-color) flex justify-between items-start"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-(--text-secondary-color)">
                      {model.name === 'whisperModel'
                        ? 'Whisper Model:'
                        : model.name === 'assistantModel'
                          ? 'Assistant Model:'
                          : model.name === 'porcupineModel'
                            ? 'Porcupine Model:'
                            : ''}
                    </span>
                    <span className="text-(--text-color)">{model.dir}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveModel(idx)}
                  className="ml-4 text-red-500 font-semibold hover:text-red-700 transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
