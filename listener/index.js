import { Porcupine } from "@picovoice/porcupine-node";
import { PvRecorder } from "@picovoice/pvrecorder-node";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import fs from "fs";
import { spawn } from "child_process";
import path from "path";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const settings = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "settings", "settings.json"), "utf-8")
);

const WHISPER_EXEC = path.join(__dirname, "whisper", "whisper-cli.exe"); // Whisper CLI for transcripting
const MODEL = settings.models.find((val) => val.name === "whisperModel").dir; // Whisper model directory

const SAMPLE_RATE = 16000;
const SILENCE_THRESHOLD = 200; // adjust to mic sensitivity
const SILENCE_TIMEOUT = 2000; // milliseconds of silence

class EvaListener {
  constructor() {
    this.wss = null;
    this.porcupine = null;
    this.recorder = null;
    this.isRecording = false;
    this.audioBuffer = [];
    this.init();
    this.isRunning = true;
  }

  async init() {
    this.startWebSocketServer();
    await this.startPorcupine();
    await this.startPvRecorder();
  }

  startWebSocketServer() {
    this.wss = new WebSocketServer({ port: 6000 });
    this.wss.on("connection", () => {
      this.emitEvent("listener_ready");
    });
  }

  // For emitting events to the main electron app
  emitEvent(event, payload = {}) {
    this.wss?.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ event, ...payload }));
      }
    });
  }

  async startPorcupine() {
    const keywordPaths = [
      settings.models.find((val) => val.name === "porcupineModel").dir,
    ];

    const sensitivities = [0.6];
    this.porcupine = new Porcupine(
      process.env.NODE_ENV === "development"
        ? process.env.API_KEY
        : settings.porcupineAPIKey,
      keywordPaths,
      sensitivities
    );
    console.log("Porcupine ready");
  }

  async startPvRecorder() {
    this.recorder = new PvRecorder(this.porcupine.frameLength, 3);
    await this.recorder.start();
    console.log("Listening...");

    let silenceTimer = null;

    while (this.isRunning) {
      const pcm = await this.recorder.read();
      const result = this.porcupine.process(pcm);

      // Wake word detected
      if (result >= 0 && !this.isRecording) {
        this.emitEvent("eva_wake");
        this.isRecording = true;
        this.audioBuffer = [];
        console.log("Start speaking...");
      }

      if (this.isRecording) {
        this.audioBuffer.push(...pcm);

        // RMS to detect silence
        const rms = Math.sqrt(pcm.reduce((sum, x) => sum + x * x, 0) / pcm.length);
        if (rms > SILENCE_THRESHOLD) {
          // reset silence timer
          if (silenceTimer) clearTimeout(silenceTimer);
          silenceTimer = setTimeout(async () => {
            this.isRecording = false;
            await this.transcribeAudio(this.audioBuffer);
          }, SILENCE_TIMEOUT);
        }
      }
    }
  }

  pcmToWav(pcmArray) {
    const buffer = Buffer.alloc(44 + pcmArray.length * 2);
    let offset = 0;
    const writeString = (s) => {
      buffer.write(s, offset);
      offset += s.length;
    };
    const writeUInt32 = (v) => {
      buffer.writeUInt32LE(v, offset);
      offset += 4;
    };
    const writeUInt16 = (v) => {
      buffer.writeUInt16LE(v, offset);
      offset += 2;
    };

    // WAV header
    writeString("RIFF");
    writeUInt32(36 + pcmArray.length * 2);
    writeString("WAVE");
    writeString("fmt ");
    writeUInt32(16);
    writeUInt16(1);
    writeUInt16(1);
    writeUInt32(SAMPLE_RATE);
    writeUInt32(SAMPLE_RATE * 2);
    writeUInt16(2);
    writeUInt16(16);
    writeString("data");
    writeUInt32(pcmArray.length * 2);

    for (let i = 0; i < pcmArray.length; i++)
      buffer.writeInt16LE(pcmArray[i], 44 + i * 2);

    return buffer;
  }

  async transcribeAudio(pcmArray) {
    const wavBuffer = this.pcmToWav(pcmArray);
    const tmpFile = path.join(process.cwd(), "temp.wav");
    fs.writeFileSync(tmpFile, wavBuffer);

    const whisperProc = spawn(
      WHISPER_EXEC,
      [tmpFile, "--model", MODEL, "--language", "en", "--no-timestamps"],
      { shell: true }
    );

    let transcript = "";

    whisperProc.stdout.on("data", (data) => {
      transcript += data.toString();
    });

    whisperProc.on("error", (err) => console.error("Whisper spawn error:", err));

    // Emitting the speech results after the proccess exit
    whisperProc.on("exit", () => {
      console.log("Transcription:", transcript.trim());
      this.emitEvent("speech_text", { text: transcript.trim() });
      fs.unlinkSync(tmpFile);
    });
  }

  async stop() {
    if (this.recorder) await this.recorder.stop();
    this.porcupine?.release();
    this.wss?.close();
    this.isRunning = false;
  }
}

const eva = new EvaListener();

process.on("SIGINT", async () => {
  await eva.stop();
  process.exit();
});
