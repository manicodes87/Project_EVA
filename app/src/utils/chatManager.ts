import fs from 'fs'
import path, { dirname } from 'path'
import { app } from 'electron'
import { fileURLToPath } from 'url'
import { ChatInterface } from '@/types/types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class ChatManager {
  private static instance: ChatManager
  private fileURL: string

  constructor() {
    this.fileURL = this.getChatPath()
  }

  public static getInstance(): ChatManager {
    if (!ChatManager.instance) {
      ChatManager.instance = new ChatManager()
    }
    return ChatManager.instance
  }

  private getChatPath(): string {
    if (app.isPackaged) {
      // Packaged app: models are inside resources folder
      return path.join(process.resourcesPath, 'chat', 'chat.json')
    } else {
      // Dev mode: resolve from project root, not __dirname
      // Adjust this depending on your project structure
      return path.join(__dirname, '..', '..', 'src', 'chat', 'chat.json')
    }
  }

  public readChats(): ChatInterface[] {
    const rawdata = fs.readFileSync(this.fileURL).toString()
    const data = JSON.parse(rawdata) as ChatInterface[]

    return data
  }

  public clearChats(): void {
    fs.writeFileSync(this.fileURL, JSON.stringify({ chats: [] }))
  }

  public saveMessage(sender: string, message: string): { message: number; id: string } {
    if (!message || message.trim() == '') return { message: 400, id: '' }
    const rawdata = fs.readFileSync(this.fileURL).toString()
    const data = JSON.parse(rawdata)
    const id = crypto.randomUUID()

    data.chats.push({
      sender,
      message,
      id
    })

    fs.writeFileSync(this.fileURL, JSON.stringify(data))
    return { message: 200, id }
  }
}
