import { WebSocket } from "ws";

class WebsocketManager {
  private static instance: WebsocketManager;
  private socket: WebSocket | null = null;

  private constructor(socketUrl?: string) {
    this.connect(socketUrl || "ws://localhost:8080");
  }

  public static getInstance(): WebsocketManager {
    if (!WebsocketManager.instance) {
      WebsocketManager.instance = new WebsocketManager();
    }
    return WebsocketManager.instance;
  }

  private connect(url: string): void {
    this.socket = new WebSocket(url);
    this.socket.on("open", () => {
      console.log("WebSocket connection established");

      this.setupMessageHandler();
    });

    this.socket.on("close", () => {
      console.log("WebSocket connection lost — retrying in 2s...");
      setTimeout(() => this.connect(url), 2000);
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  private setupMessageHandler(): void {
    if (!this.socket) return;
    this.socket.on("message", (msg) => {
      const data = JSON.parse(msg.toString());
      if (data.event === "eva_wake") {
        console.log("EVA Wake Word Detected!");
      }
    });
  }
}

export default WebsocketManager;
