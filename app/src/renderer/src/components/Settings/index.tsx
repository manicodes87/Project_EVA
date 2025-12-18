import { JSX, useEffect, useState } from 'react'
import AppManager from '../AppEntry'
import ModelDirectories from '../ModelDirectories'
import { SettingsJson } from '@/types/types'

const loadSettings = async (): Promise<SettingsJson> => {
  return (await window.eva.loadSettings()) as SettingsJson
}

export default function Settings(): JSX.Element {
  const [settings, setSettings] = useState<SettingsJson>({} as SettingsJson)

  useEffect(() => {
    loadSettings().then((item) => {
      setSettings(item)
    })
  }, [])

  return (
    <div className="p-5 w-[90%] h-[90%] overflow-y-scroll">
      {settings.apps ? (
        <>
          <AppManager settings={settings} />
          <ModelDirectories settings={settings} />
        </>
      ) : (
        <h1>Loading</h1>
      )}
    </div>
  )
}
