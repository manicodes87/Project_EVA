# EVA 🤖

EVA is a **local, privacy‑first AI assistant** designed to run entirely on your machine. The goal of the project is to provide a fast, customizable assistant with **speech‑to‑text (STT)**, **text‑to‑speech (TTS)**, and modular AI models — without relying on cloud APIs.

Built with a desktop‑first mindset, EVA focuses on acceptable latency, offline support, and full control over models and settings.

---

## ✨ Features

- 🖥️ **Desktop App (Electron)**
- 🎙️ **Speech‑to‑Text (Whisper-based)**
- 🗣️ **Text‑to‑Speech (local & free models)**
- 🧠 **Pluggable Assistant Models**
- 🔑 **Wake‑word support (Porcupine)**
- ⚙️ **Fully configurable settings UI**
- 🔒 **Runs locally – no data leaves your machine**

---

## 🧱 Tech Stack

- **Frontend:** Electron + React (TSX)
- **Backend / Main Process:** Node.js
- **STT:** OpenAI Whisper (local)
- **TTS:** Local neural TTS engines (offline)
- **Wake Word:** Porcupine
- **IPC:** Electron IPC for settings & events

---

## 📂 Project Structure

```text
PROJECT_EVA/
├─ app/                        # Main Electron application
│  ├─ resources/               # Static resources
│  ├─ src/                     # Application source code
│  │  ├─ chat/                 # Chat UI & conversation logic
│  │  ├─ eva-core/             # Core AI logic & orchestration
│  │  ├─ ipc/                  # IPC channels (main ↔ renderer)
│  │  ├─ main/                 # Electron main process
│  │  ├─ preload/              # Secure preload bridge
│  │  ├─ renderer/             # Frontend UI (React / TSX)
│  │  ├─ types/                # Shared TypeScript types
│  │  ├─ utils/                # Utility helpers
│  │  └─ workers/              # Background workers (TTS)
│  │
│  ├─ electron-builder.yml
│  ├─ electron.vite.config.ts
│  ├─ eslint.config.mjs
│  ├─ postcss.config.mjs
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  ├─ tsconfig.web.json
│  └─ package.json
│
├─ listener/                   # Standalone audio listener service
│  ├─ whisper/                 # Whisper STT integration
│  ├─ index.js                 # Listener entry point
│  ├─ .env                     # Runtime environment variables
│  ├─ package.json
│  └─ package-lock.json
│
├─ models/                     # Centralized AI models (LLM, TTS, STT) Used for Development
│
└─ settings/                   # App & service configuration

```

### app/

- Full Electron + Vite application (UI, IPC, core logic)

### listener/

- Lightweight Node service for always-on audio & Whisper STT

### models/

- Central shared model storage, reused by both app and listener

### settings/

- Persistent user & system configuration

---

## ⚙️ Configuration

EVA allows model-level configuration directly from the UI.

### Model Settings

- **Whisper STT Model** – speech-to-text model
- **Kokoro TTS Model** – text-to-speech model
- **Assistant Model** – core LLM powering responses
- **Porcupine Keywords Model** – wake-word detection

Settings are persisted locally

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18+**
- npm or pnpm
- Windows / Linux (macOS experimental)

#### Required Downloads

- A llama friendly model has to be downloaded and stored somewhere where it can be accessed by the application ( AI Agent model )

- A Whisper STT Model model has to be downloaded and stored somewhere where it can be accessed by the application

- A Porcupine Keywords Model has to be downloaded and stored somewhere where it can be accessed by the application

- A Kokoro Model has to be downloaded and stored somewhere where it can be accessed by the application

### Installation

You can either download the available binaries ( windows only for now ) or clone this repo and build it for yourself.

#### Recommended models

- [Recommended AI Agent model (Qwen 2.5)](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct-GGUF/tree/main)

- [Picovoice/Porcupine Model for wake-word](https://picovoice.ai/platform/porcupine/)

- [Whisper ggml models](https://huggingface.co/ggerganov/whisper.cpp/tree/main)

- [Kokoro TTS ONNX models](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/tree/main)

- A tutorial video will be created after the first release of the application

```bash
git clone https://github.com/manicodes87/Project_EVA.git
```

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## 🎧 Performance Notes

- Designed to run **without a GPU** (GPU optional)
- STT latency depends on Whisper model size
- TTS is optimized for low-latency responses

---

## 🛣️ Roadmap

- [ ] Conversation memory
- [ ] Cross‑platform builds

---

## 🧠 Philosophy

EVA is built around three core ideas:

1. **Local-first** – your data stays yours
2. **Modular** – swap models easily
3. **Fast** – minimal overhead, maximum control

---

## 📜 License

MIT License

---

## 🙌 Contributing

PRs, ideas, and experiments are welcome. EVA is a playground for building serious local AI tooling.

---

> _EVA is not meant to replace cloud assistants — it’s meant to outperform them locally._
