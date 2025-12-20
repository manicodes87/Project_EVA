import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { Context, MemoryJson } from '@/types/types'

export class MemoryManager {
  private static instance: MemoryManager | null = null
  private path: string | null = null

  constructor() {
    if (app.isPackaged) {
      // Packaged app: models are inside resources folder
      this.path = path.join(process.resourcesPath, 'chat', 'context.json')
    } else {
      // Dev mode: resolve from project root, not __dirname
      // Adjust this depending on your project structure
      this.path = path.join(__dirname, '..', '..', 'src', 'chat', 'context.json')
    }
  }

  public getMemoryJson(): MemoryJson {
    return JSON.parse(fs.readFileSync(this.path as string, 'utf-8'))
  }

  public setMemoryJson(memoryJson: Context): void {
    const data = this.getMemoryJson()
    data.memory.push(memoryJson)

    fs.writeFileSync(this.path as string, JSON.stringify(data), 'utf-8')
  }

  public clearMemory(): void {
    fs.writeFileSync(this.path as string, JSON.stringify({ memory: [] }), 'utf-8')
  }

  public static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager()
    }

    return MemoryManager.instance
  }
}
