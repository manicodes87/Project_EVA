project-eva/
├── app/ # Electron app (UI + Core AI)
│ ├── src/
│ │ ├── main/ # Main process (IPC, LLM, system integration)
│ │ │ ├── main.ts
│ │ │ ├── ipc/
│ │ │ │ ├── index.ts
│ │ │ │ └── eva-bridge.ts # Handles activation from Go listener
│ │ │ └── eva-core/ # Your AI brain lives here
│ │ │ ├── stt-engine.ts
│ │ │ ├── llm-runner.ts
│ │ │ └── intent-router.ts
│ │ ├── renderer/ # UI Frontend (React)
│ │ │ ├── ui.tsx
│ │ │ ├── assistant-panel.tsx
│ │ │ └── settings.tsx
│ │ └── preload.ts
│ ├── package.json
│ └── electron-builder.yml # Installer config
│
├── listener/ # Wake-word Daemon
│ ├── src/
│ │ └── eva_listener.js
│ ├── build/ # output binaries per OS
│ │ ├── eva-listener-win.exe
│ │ ├── eva-listener-linux
│ │ └── eva-listener-mac
│
│
├── installers/ # Installation scripts per OS
│ ├── windows-install.ps1
│ ├── linux-install.sh
│ ├── mac-install.sh
│ └── readme.md
│
├── models/ # Local model files
│ ├── eva-llm.gguf
│ └── stt-model.onnx
│
├── scripts/
│ ├── build-listener.sh # Builds listener into all 3 OS bins
│ └── package-app.sh # Builds Electron installer
│
└── README.md
