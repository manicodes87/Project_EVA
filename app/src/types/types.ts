export interface ChatInterface {
  chats: [
    {
      sender: SenderEnum
      message: string
      id: number
    }
  ]
}

export interface Entry {
  name: string
  dir: string
}

export interface SettingsJson {
  apps: Entry[]
  appNames: string[]
  models: Entry[]
}

export enum SenderEnum {
  USER = 'User',
  EVA = 'Eva'
}
