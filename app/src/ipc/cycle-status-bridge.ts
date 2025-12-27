import { ipcMain } from 'electron'
import { CycleStatus } from '@/eva-core/cycle-status'

export function registerCycleStatusBridge(): void {
  ipcMain.handle('get_cycle_status', async () => {
    return CycleStatus.getStatus()
  })
}
