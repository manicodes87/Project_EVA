import { WebSocket } from 'ws'

class WebsocketManager {
  private static instance: WebsocketManager
  private socket: WebSocket | null = null

  private constructor(callback: () => void, socketUrl?: string) {
    this.connect(socketUrl || 'ws://localhost:8080', callback)
  }

  public static getInstance(callback: () => void, socketUrl?: string): WebsocketManager {
    if (!WebsocketManager.instance) {
      WebsocketManager.instance = new WebsocketManager(callback, socketUrl)
    }
    return WebsocketManager.instance
  }

  private connect(url: string, callback: () => void): void {
    this.socket = new WebSocket(url)
    this.socket.on('open', () => {
      console.log('WebSocket connection established')
      callback()
    })

    this.socket.on('close', () => {
      console.log('WebSocket connection lost — retrying in 2s...')
      setTimeout(() => this.connect(url, callback), 2000)
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  public subscribeEvent(eventFunction: CallableFunction): void {
    if (!this.socket) return

    this.socket.on('message', (msg) => {
      const data = JSON.parse(msg.toString())
      eventFunction(data)
    })
  }
}

export default WebsocketManager
