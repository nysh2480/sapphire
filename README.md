# SAPPHIRE ⬡ [EXPERIMENTAL]

**Scriptable Asset Processing Platform for Hybrid Integrated Runtime Environment**

> ⚠️ **NOTICE: This project is currently in the EXPERIMENTAL stage.**  
> The architecture, API, and DSL specifications are subject to change without notice as development progresses.

SAPPHIRE is an experimental implementation of an AI-native, lightweight IDE and execution platform designed to transform the browser into a "High-End Media Processing OS."

It maximizes modern web technologies such as WebCodecs, WebGPU, and WASM to integrate audio, video, and computational resources into a single, logical environment.

## ⬡ Concept: Build at the Speed of Thought with AI

SAPPHIRE is not a place to make AI generate thousands of lines of bloated code. 
It is an **orchestration environment** where AI understands the specifications (DOC) built into each extension (EXT) and "connects" them using a lightweight DSL (Domain Specific Language) to assemble professional-grade applications in minutes.

## ⬡ ABCD Structure: Integration Without Collision

The entire system is clearly separated into four roles to prevent resource conflicts and maximize asset reusability.

- **[A] Action (Execution Layer)**: User-facing UI and specific features (DAW, Video Editor, etc.)
- **[B] Base (Infrastructure Layer)**: Physical resource providers (SharedArrayBuffer, WASM, WebWorker, AudioContext)
- **[C] Control (Management Layer)**: The orchestrator. Handles I/O routing, memory address allocation, and cross-extension search (FIND).
- **[D] Definition (Specification Layer)**: The system's constitution. Defines grammar (BNF), API specifications (DOC), and environment schemas.

## ⬡ Key Features

- **AI-Native Design**: AI directly references the `sph/doc` (JSON) embedded in each EXT. This enables extremely high-precision code generation and system construction even with zero-shot prompts.
- **Scriptable Assets**: Tone patches, video clips, and logic are treated as "Assets" that are always searchable and reusable, rather than disposable code snippets.
- **Zero-Copy Processing**: By managing memory addresses via `CONNECT_EXT`, massive video frames and audio buffers are processed at high speed without expensive data cloning.
- **Instant Deployment**: Developed systems can be immediately exported as a "Single HTML (APP format)" that packages all necessary EXTs and LIBs.
- **Unified MEDIA_MML**: Describe both music (DAWMML) and video (VIDEO_MML) using a common timeline and syntax, synchronized at the milli
