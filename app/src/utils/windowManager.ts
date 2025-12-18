import { BrowserWindow } from 'electron'

let mainWindow: BrowserWindow | null = null

export const WindowManager = {
  setMainWindow: (win: BrowserWindow) => {
    mainWindow = win
  },
  getMainWindow: () => mainWindow
}
