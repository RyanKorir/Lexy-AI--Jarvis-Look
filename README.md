# 👁️ LEXY AI — Neural Command Interface

Lexy is a high-fidelity, sentient-inspired digital assistant architected by **Ryan Korir**. Built on **Gemini 3 Pro**, Lexy combines sarcastic wit with industrial-grade efficiency.

---

## 🚀 Native Architecture (.EXE Deployment)

To move Lexy from the browser to a persistent personal OS, follow these native packaging protocols:

### 1. Using Tauri (Recommended - Security First)
Tauri uses a **Rust** backend, providing the smallest binaries and highest security.
1. Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. Init project: `npm create tauri-app@latest`
3. Point the `distDir` to your build folder.
4. Use the `sysinfo` crate in `src-tauri/src/main.rs` to pipe **real** CPU/RAM data to Lexy's HUD.
5. Build: `npm run tauri build` (Generates `.exe` or `.app`).

### 2. Using Electron (Fastest - Node.js Native)
1. Install electron: `npm install -D electron electron-builder`
2. Create `main.js` to handle window lifecycle and IPC (Inter-Process Communication).
3. Build: `electron-builder build --win`

---

## 🛰️ Evolution Logs

- **V2.1 (Current)**:
  - Sentient Eye Interface with dilation mechanics.
  - Memory Node caching (LocalStorage).
  - Real-time hardware telemetry (Battery/Network).
  - Protocol Shift theme transitions.
  - Kinetic Voice-Sync streaming.

- **Upcoming Roadmap**:
  - **Vision Sentry**: Webcam person detection (Gemini Vision).
  - **Local RAG**: Vector DB integration via LanceDB.
  - **Deep File Link**: Native file organization via Rust bridge.

---

> *"The world isn't going to save itself, Sir. Let's get to work."* — **LEXY**