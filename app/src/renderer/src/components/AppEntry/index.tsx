import { JSX, useEffect, useState } from 'react'
import { SettingsJson, Entry } from '@/types/types'

export default function AppManager({ settings }: { settings: SettingsJson }): JSX.Element {
  const [name, setName] = useState<string>('')
  const [dir, setdir] = useState<string>('')
  const [apps, setApps] = useState<Entry[]>(settings?.apps)
  const [appNames, setAppNames] = useState<string[]>(settings?.appNames)

  const handleAddApp = (): void => {
    const path = dir.trim()
    if (!name.trim() || !path) return
    const fixedPath = path.replace(/\\/g, '/')

    // Add new app to the list
    setApps([...apps, { name: name.trim().toLowerCase(), dir: fixedPath }])
    setAppNames([...appNames, name.trim().toLowerCase()])

    const newSettings: SettingsJson = {
      apps: [...apps, { name: name.trim().toLowerCase(), dir: fixedPath }],
      appNames: [...appNames, name.trim().toLowerCase()],
      models: settings.models
    }
    window.eva.changeSettings(JSON.stringify(newSettings))

    setName('')
    setdir('')
  }

  // Initial app values passed through props
  useEffect(() => {
    if (settings) {
      setApps([...settings.apps])
      setAppNames([...settings.appNames])
    }
  }, [])

  return (
    <div className="p-6 bg-(--background-darker-color) rounded-lg m-2">
      <h2 className="text-xl font-bold mb-4">Add a New App</h2>
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          placeholder="App Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-4 border-2 rounded-2xl border-(--background-darker-color) text-sm bg-(--background-lighter-color) outline-none transition duration-100 focus:border-(--accent-color)"
        />
        <input
          type="text"
          placeholder="dirution Command"
          value={dir}
          onChange={(e) => setdir(e.target.value)}
          className="p-4 border-2 rounded-2xl border-(--background-darker-color) text-sm bg-(--background-lighter-color) outline-none transition duration-100 focus:border-(--accent-color)"
        />
        <button
          onClick={handleAddApp}
          className="p-4 border-2 rounded-2xl bg-(--primary-color) border-(--background-darker-color) text-sm outline-none transition duration-100 hover:bg-(--secondary-color) cursor-pointer"
        >
          Save
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Added Apps</h3>
        {apps?.length === 0 ? (
          <p className="text-gray-500">No apps added yet</p>
        ) : (
          <ul className="space-y-3">
            {apps?.map((app, idx) => (
              <li
                key={idx}
                className="p-4 rounded-2xl border-2 border-(--background-darker-color) bg-(--background-lighter-color)"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-(--text-secondary-color)">Name:</span>
                    <span className="text-(--text-color)">{app.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-(--text-secondary-color)">dir:</span>
                    <span className="text-(--text-color)">{app.dir}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
