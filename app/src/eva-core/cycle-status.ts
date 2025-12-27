export class CycleStatus {
  private static listenerInitialized = false
  private static ttsInitialized = false
  private static assistantInitialized = false

  public static setListenerInitialized(): void {
    this.listenerInitialized = true
  }
  public static setTTSInitialized(): void {
    this.ttsInitialized = true
  }

  public static setAssistantInitialized(): void {
    this.assistantInitialized = true
  }

  public static getStatus(): { listener: boolean; tts: boolean; assistant: boolean } {
    return {
      listener: this.listenerInitialized,
      tts: this.ttsInitialized,
      assistant: this.assistantInitialized
    }
  }
}
