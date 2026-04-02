# SAPPHIRE ⬡ [EXPERIMENTAL]

**Scriptable Asset Processing Platform for Hybrid Integrated Runtime Environment**  
— An AI-native, modular OS for the browser.

> ⚠️ **NOTICE**: This project is currently in the **EXPERIMENTAL** stage.  
> The architecture, API, and DSL specifications are subject to frequent changes as development progresses.

## ⬡ Overview

SAPPHIRE is an experimental AI-native lightweight IDE and execution platform that transforms the browser into a high-performance **media processing OS**.

It fully leverages modern web technologies — **WebCodecs**, **WebGPU**, **WASM**, **SharedArrayBuffer**, **Web Workers**, **AudioContext**, and more — to integrate audio, video, and compute resources into a single unified logical environment.

Unlike traditional approaches that ask AI to generate thousands of lines of code, SAPPHIRE is an **orchestration environment**. AI reads the embedded specifications (`sph/doc` JSON) inside each extension (EXT) and connects them using a lightweight **DSL (Domain Specific Language)**, allowing professional-grade applications to be assembled in minutes.

## ⬡ ABCD Architecture — Collision-Free Integration

The entire system is cleanly separated into four distinct roles to prevent resource conflicts and maximize asset reusability:

- **[A] Action (Execution Layer)**  
  User-facing interfaces and concrete applications (DAW, Video Editor, Media Studio, etc.)

- **[B] Base (Infrastructure Layer)**  
  Physical resource providers (SharedArrayBuffer, WASM modules, Web Workers, AudioContext, etc.)

- **[C] Control (Management Layer)**  
  The central orchestrator — handles I/O routing, memory address allocation, cross-extension search (`FIND`), and coordination.

- **[D] Definition (Specification Layer)**  
  The "constitution" of the system — defines grammar (BNF), API specifications (`DOC`), environment schemas, and more.

## ⬡ Key Features

- **AI-Native Design**  
  Each extension embeds its own `sph/doc` (JSON). AI can directly reference these specifications, enabling extremely accurate code generation and system building even with zero-shot prompts.

- **Scriptable Assets**  
  Tone patches, video clips, logic blocks, and other elements are treated as reusable, searchable **Assets** rather than disposable code.

- **Zero-Copy Processing**  
  Memory address management via `CONNECT_EXT` allows massive video frames and audio buffers to be processed at high speed without expensive data duplication.

- **Instant Deployment**  
  Completed systems can be exported instantly as a **Single HTML (APP format)** that packages all required extensions and libraries.

- **Unified MEDIA_MML**  
  A common markup language and timeline syntax for both music (**DAW_MML**) and video (**VIDEO_MML**), enabling millisecond-level synchronization.

- **Highly Modular Extension System**  
  All functionality is provided as independent `_ext.html` files that can be freely combined.

## ⬡ Repository Structure

All core files are located in the root directory:

### Main IDE
- `sapphire_ide.html` — The central integrated development and execution environment.

### Extensions (EXT)
- `abcd_ext.html`
- `asset_manager_ext.html`
- `audio_engine_ext.html`
- `compute_ext.html`
- `daw_ext.html`
- `definition_ext.html`
- `dev_ext.html`
- `find_ext.html`
- `game25_ext.html`
- `media_core_ext.html`
- `media_definition_ext.html`
- `media_ext.html`
- `media_studio_ext.html`
- `monitor_ext.html`
- `network_ext.html`
- `storage_ext.html`
- `timeline_ext.html`
- `timeline_manager_ext.html`
- `ui_mml_ext.html`
- `video_engine_ext.html`
- `wave_ext.html`

Additional:
- `signaling-server/` — Directory for network signaling (WebRTC-related)

Every `_ext.html` file is a self-contained HTML/JavaScript module with embedded API documentation.

## ⬡ How to Use

1. Clone or download the repository.
2. Open `sapphire_ide.html` directly in a modern browser (Chrome/Edge recommended).
3. Load the desired extensions inside the IDE.
4. Use the built-in DSL or ask an AI to connect extensions according to their `sph/doc` specifications.
5. Export the finished system as a single HTML app when ready.

**Note**: Some features rely on `SharedArrayBuffer` and `WebGPU`. For best performance, serve the files via a local server and ensure your browser has the necessary flags enabled if required.

## ⬡ Technical Stack

- **100% HTML + JavaScript** (no build step required)
- Modern Web APIs: WebCodecs, WebGPU, WASM, SharedArrayBuffer, Web Workers, AudioContext
- Lightweight DSL + JSON-based specification system (`sph/doc`)

## ⬡ Development Status

- **Experimental** — Actively developed (98+ commits by a single author)
- No official releases yet
- License: Not specified (please check with the author)

---

**SAPPHIRE** — Build at the speed of thought.  
An AI-native media processing platform that lives entirely in the browser.

For the latest updates, visit the [GitHub repository](https://github.com/nysh2480/sapphire).
