import { Porcupine } from "@picovoice/porcupine-node";
import { PvRecorder } from "@picovoice/pvrecorder-node";
import { WebSocketServer } from "ws";
import "dotenv/config";

class EvaWakeListener {
  constructor() {
    this.startPorcupine();
    this.startPvRecorder();
    this.startWebsocketServer();
    console.log("EVA Wake Word Listener Starting...");
  }

  startWebsocketServer() {
    this.wss = new WebSocketServer({ port: 8080 });
    this.wss.addListener("listening", (wb) => {
      console.log("WebSocket Server Listening on ws://localhost:8080");
    });

    this.wss.addListener("connection", (ws) => {
      console.log("New WebSocket Client Connected");
      console.log(`Total Clients: ${this.wss.clients.size}`);

      ws.on("close", () => {
        console.log("WebSocket Client Disconnected");
        console.log(`Total Clients: ${this.wss.clients.size}`);
      });
    });
  }

  emitEvaWake() {
    this.wss.clients.forEach((client) => {
      // Broadcast
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ event: "eva_wake" }));
      }
    });
  }

  startPorcupine() {
    const keywordPaths = ["./porcupine_keywords/eva-windows.ppn"];
    const sensitivities = [0.6];

    try {
      this.porcupine = new Porcupine(process.env.API_KEY, keywordPaths, sensitivities);
      console.log("Porcupine Ready");
    } catch (e) {
      console.error("Porcupine Init Failed: ", e);
      process.exit();
    }
  }

  startPvRecorder() {
    // TODO: Develope a microphone input selection logic
    const recorder = new PvRecorder(this.porcupine.frameLength, 3);
    recorder.start();
    console.log("🎤 Listening for EVA...");

    // listen loop
    (async () => {
      while (true) {
        const pcm = await recorder.read();
        const result = this.porcupine.process(pcm);

        if (result >= 0) {
          console.log("\n🔥 WAKE WORD DETECTED: EVA");
          // Trigger websocket event for EVA wake
          this.emitEvaWake();
        }
      }
    })();
  }
}

const evaListener = new EvaWakeListener();
