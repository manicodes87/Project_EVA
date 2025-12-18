import { ipcMain } from 'electron'
import fs from 'fs'
import getSettingsFile from '../utils/fetchSettingsFile'
import { SettingsJson } from '@/types/types'

export function registerLoadSettings(): void {
  ipcMain.handle('load-settings', async () => {
    return JSON.parse(fs.readFileSync(getSettingsFile()).toString()) as SettingsJson
  })
}

export function registerChangeSettings(): void {
  ipcMain.handle('change-settings', async (_, newSettings) => {
    try {
      fs.writeFileSync(getSettingsFile(), newSettings)
    } catch (err) {
      console.error('Failed to save settings:', err)
    }
  })
}
