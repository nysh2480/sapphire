# SAPPHIRE ⬡ NG 0.4 v16.2

**Scriptable Asset Processing Platform for Hybrid Integrated Runtime Environment**  
— An AI-native, modular OS for the browser.

> ⚠️ **NOTICE**: This project is currently in the **EXPERIMENTAL** stage.  
> Architecture, API, and DSL specifications are subject to frequent changes.

---

## ⬡ Overview

SAPPHIRE NG is an AI-native lightweight IDE and DSL execution platform that runs entirely in a **single HTML file** — no build step, no server required.

It leverages modern web APIs — **SharedArrayBuffer**, **Web Workers**, **AudioContext**, **WebCodecs**, **WebGPU**, and **WASM** — to integrate compute, audio, and UI resources into one unified runtime environment.

Instead of asking AI to generate thousands of lines of code, SAPPHIRE uses an **orchestration model**: each extension (EXT) embeds its own `sph/doc` (JSON) specification. AI reads these specs and connects EXTs using a lightweight **DSL**, enabling professional-grade applications to be assembled in minutes.

---

## ⬡ How to Use

1. Download `sapphire_ide.html`.
2. Open it directly in Chrome or Edge (no server needed for basic use).
3. Write DSL in the editor, or load an EXT from the EXT panel (⚙ EXT button).
4. Press **Ctrl+Enter** to run, **Escape** to stop.
5. Export the finished system via the **◆ SAPPHIRE** logo button (top-left).

> **Note:** `SharedArrayBuffer` requires `crossOriginIsolated`. v16 embeds an inline ServiceWorker that automatically injects `COOP` + `COEP` headers — this means SAB works even from `file://`, with an automatic reload on first launch.

---

## ⬡ ABCD Architecture

All components are cleanly separated into four layers to prevent resource conflicts:

| Layer | Role | Representative EXTs |
|---|---|---|
| **[A] Action** | User-facing UI / applications | `sound`, `edit`, `game25` |
| **[B] Base** | Data, communication, Workers | `bridge`, `worker`, `key` |
| **[C] Control** | Lifecycle & orchestration | `extmgr`, `file`, `abcd`, `ai_connect` |
| **[D] Definition** | Config, theme, documentation | `appearance`, `err` |

Every EXT can declare its ABCD category via `sph.call('abcd.register', [id, 'A'])`, and communicate via standard ABCD primitives:

```
; pipe: push data A → B
abcd.pipe "source_ext" "target_ext" "data"

; signal: broadcast event
abcd.signal "search:done" "results"
```

---

## ⬡ DSL Quick Reference

SAPPHIRE NG uses a concise, type-safe DSL compiled to JavaScript at runtime.

### Block types

| Symbol | Type | Description |
|---|---|---|
| `!` | Action | Side-effect block — `sys.*` calls allowed |
| `&` | Pure | Pure function — `sys.*` and `ext.*` forbidden |
| `@` | Loop | Loop block — repeats with `-> @` |

### Variable types

| Prefix | Type | Example |
|---|---|---|
| `#` | i32 (integer) | `#count = 0` |
| `%` | f64 (float) | `%speed = 1.5` |
| `$` | string | `$name = "hero"` |
| `~` | u64 (bigint) | `~id = 9999` |
| `#_` | local i32 | `#_tmp = 0` |

### Hello World

```
-> main

!main
  sys.print "Hello, Sapphire!"
  sys.stop
```

### Calling EXT APIs from DSL

```
; Direct EXT call (no return value)
appearance.theme "nord"
sound.beep 440 0.1

; EXT call with return value
$theme  = appearance.theme_get    ; string
#bufval = bridge.buf.read "b" 0   ; i32

; Mount an EXT panel
ide.frame.mount "sound"
ide.frame.set "H"
ide.frame.split 0.4
ide.frame.unmount
sys.stop
```

### Safe math evaluation

```
; ext.math.exec: sandboxed numeric expression (replaces raw sys.f)
%result = ext.math.exec "sin(#angle) * 100"
sys.print %result
sys.stop
```

### DIVD — Parameter governance

```
; Define schema (JS side, e.g. in EXT mount)
sph.call('sys.divd.define', ['volume', { min:0, max:1, default:0.5 }])

; DSL: resolve value safely (clamps to range, falls back to default)
%vol = sys.divd %raw_vol "volume"
#bpm = sys.divd #raw_bpm "bpm"
```

---

## ⬡ URL Parameters

| Parameter | Description |
|---|---|
| `?cfg=<base64url>` | Restore full IDE state (deflate-compressed JSON). Highest priority. |
| `?ext=id1,id2` | Load external EXT IDs. Use `url:https://...` for remote EXTs. |
| `?tab=name` | Set active tab on start. |
| `?mode=ide\|game\|minimal\|app\|present\|embed` | Display mode (see below). |
| `?src=local:key\|gist:id\|url:...\|data:base64` | Load initial tab content from a source. |
| `?run=1` | Auto-run DSL on load. |

### Display modes

| Mode | Effect |
|---|---|
| `ide` | Default — full IDE visible |
| `app` | IDE hidden, first EXT panel fills viewport |
| `game` | Hides frame-b and tab-bar |
| `minimal` | Hides frame-b |
| `present` | Hides tab-bar and frame-b |
| `embed` | Hides toolbar and frame-b |

```
; Example: fullscreen app, auto-run
?mode=app&ext=myext&run=1
```

---

## ⬡ Built-in EXTs

These EXTs are embedded in the HTML and available at startup without any loading:

| ID | Label | Category | Description |
|---|---|---|---|
| `err` | ERR | D | Error display and warning log |
| `edit` | EDIT | A | Tab editor with preview/source toggle |
| `debug` | DEBUG | A | Console trap + block call tracing |
| `tester` | TESTER | A | Block unit testing framework |
| `key` | KEY_EXT | B | Keyboard / mouse / drag input (injection model) |
| `bridge` | BRIDGE_EXT | B | Channel messaging, shared buffer, sync points |
| `worker` | WORKER_EXT | B | Web Worker management + AudioWorklet support |
| `sound` | SOUND | A | Beep + AudioWorklet synth (sine/square/saw/tri) |
| `extmgr` | EXT | C | EXT lifecycle manager (load, unload, discover) |
| `appearance` | APPEARANCE | D | Theme engine (`dark`, `nord`, `mocha`, `light`) |
| `file` | FILE | C | File load/save (.html, .txt, .sph) |
| `abcd` | ABCD | C | ABCD pipe / signal / flow orchestration primitives |
| `ai_connect` | AI CONNECT | C | Bidirectional AI agent bridge via `window.postMessage` |
| `compute` | COMPUTE | B | (embedded) Compute resource provider |
| `monitor` | MONITOR | C | (embedded) System monitor |
| `media_studio` | MEDIA STUDIO | A | (embedded) Media processing studio |
| `timeline` | TIMELINE | B | (embedded) Timeline engine |

---

## ⬡ Standard Library (`std`)

The `std` lib tab is pre-loaded with pure utility blocks:

```
; Math
&clamp, &abs, &lerp, &min, &max, &sign, &floor, &ceil, &pow, &sqrt

; Integer
&iclamp, &iabs, &imax, &imin

; String
&str_eq, &str_len, &str_upper, &str_lower, &str_trim

; Bool
&not

; EXT shortcuts (!beep_ok, !beep_err, !theme_cycle, !buf_init, !buf_put, &buf_get)
; ABCD helpers (!abcd_a, !abcd_b, !abcd_c, !abcd_d)
; Timing (!wait_frames)
; DIVD helpers (&divd, &idivd)
```

---

## ⬡ EXT Development

Create an EXT by calling `sph.mount()`. All fields are optional.

```javascript
sph.mount('myext', 'MY EXT', '?', {
  // panel: UI shown in frame-a when mounted
  panel: () => sph.ui.panel('myext',
    sph.ui.row('Volume', sph.ui.slider('v', 0, 1, .5, 'myext.volume')) +
    sph.ui.row('Name',   sph.ui.input('n'))
  ),

  // api: each key is registered as myext.<key>, callable from DSL
  api: {
    /** Set volume @param {number} v */
    volume: (v) => { /* ... */ },
  },

  // on: event handlers — wired on mount, removed on unmount
  on: {
    'frame-mounted': () => renderPanel(),
    'ide-ready':     () => initData(),   // fires once at boot
    'theme-change':  ({vars}) => applyTheme(vars),
  },

  // layout: preferred frame split when this EXT opens (S | V | H)
  layout: 'H',

  // subPanel: shown in frame-b when layout is V or H
  subPanel: () => '<div class="sph-panel">tools here</div>',

  // commands: explicit command list (auto-inferred from api if omitted)
  commands: [
    { name: 'myext.volume', desc: 'Set volume', args: 'v:number' },
  ],
});
```

### sph.ui builders

```javascript
sph.ui.panel(id, body)               // header + ← back + body
sph.ui.btn(label, onclick, variant)  // variant: 'ok' | 'acc'
sph.ui.row(label, control)           // flex label+control row
sph.ui.slider(id, min, max, val, apiKey)
sph.ui.input(id, type?)              // text, number, ...
sph.ui.section(title, body)          // titled card
```

### CSS utility classes

```
.sph-btn       .sph-btn-ok    .sph-btn-acc
.sph-head      .sph-label     .sph-meta
.sph-body      .sph-row       .sph-section
.sph-ph        .sph-input     .sph-panel
```

### EXT whitelist (security)

By default, DSL blocks can only call EXTs that are on the whitelist. To permit a custom EXT from JS:

```javascript
sph.ext.allow('myext.compute');
sph.ext.isAllowed('myext.compute'); // → true
```

Blocked calls emit a **W-EXT** warning at runtime.

---

## ⬡ Core API Reference

### sph.mount / sph.unmount

```javascript
sph.mount(id, label, icon?, descriptor)  // Register an EXT (singleton enforced)
sph.unmount(id)                          // Unregister and clean up an EXT
```

**Core EXTs** (`worker`, `sound`, `extmgr`, `appearance`, `file`, `abcd`) cannot be overridden via `sph.mount()`. Use `sph.unmount()` first if modification is required.

### sph.call / sph.emit

```javascript
await sph.call('ext.method', [arg1, arg2])  // Call a registered API (5s timeout)
sph.emit('event-name', payload)             // Broadcast an event
```

### sph.singleton

```javascript
sph.singleton.getInfo(extId)      // → { mountTime, id } | null
sph.singleton.isMounted(extId)    // → boolean
sph.singleton.list()              // → array of all registered EXTs with singleton info
sph.singleton.getDetail(extId)    // → full EXT descriptor + singleton data
```

### IDE frame control

```javascript
sph.call('ide.frame.mount',   'extId')   // Mount EXT into frame-a
sph.call('ide.frame.unmount')            // Return to editor
sph.call('ide.frame.set',     'H')       // Set layout: S | V | H
sph.call('ide.frame.split',   0.4)       // Set frame-a ratio (0.0–1.0)
sph.call('ide.theme.set',     {vars})    // Apply CSS variable overrides
```

### ABCD EXT descriptor

```javascript
sph.mount('myext', 'MY EXT', {
  api: {
    describe: () => ({
      cat: 'A',          // A | B | C | D
      version: '1.0',
      consumes: ['bridge'],
      produces: ['my_state'],
      signals:  ['my:event'],
    }),
    consume: (data, from) => { /* receive data */ },
    produce: ()           => ({ /* export state */ }),
  }
});
```

---

## ⬡ Security Model

| Layer | Protection |
|---|---|
| Compile time | `&pure` violation, `W-TYPE` sigil mismatch warnings, `@loop` transform |
| `callBlock` | `try/catch`, `signal.stopped`, `STOP` rethrow |
| `_safeCall` | 5-second timeout, `E012` on timeout |
| `@loop` guard | 1M iteration cap (`W006`), 10s wall clock (`W007`), `yield` every frame |
| `str[]` Proxy | 1000-slot cap (`W008`) |
| `sph.call` | `try/catch`, `E010`/`E011` event emission |
| EXT whitelist | `ALLOWED_EXT` set, `W-EXT` on blocked calls |
| DSL Sandbox | `Proxy`-based global access block — only declared scope vars accessible |
| `ext.math.exec` | `SAFE_EXPR` regex gate + `SAFE_MATH`-only scope — no raw `eval` |

---

## ⬡ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Ctrl+Enter` | Run DSL |
| `Escape` | Stop execution / close panel |

---

## ⬡ Changelog

### v16.2 (current)
- **EXT singleton management — improved**: Core EXT list defined as `CORE_EXTS`; cannot be overridden without explicit `unmount`. `sph.mount()` return type unified to always return string `id`.
- **Global event listener cleanup**: Handler references stored at mount time; reliably removed on `sph.unmount()`.
- **Deep copy of EXT descriptor**: Mutations to the original descriptor object no longer affect the registered copy.
- **`singletonData` null guard**: `sph.singleton.getDetail()` no longer throws when singleton data is absent.

### v16.1
- `sph.singleton` API introduced: `getInfo`, `isMounted`, `list`, `getDetail`.

### v16
- `SAFE_MATH` / `_safeEval` / `_evalCache`: sandboxed numeric expression evaluation (`ext.math.exec`).
- `ALLOWED_EXT` whitelist: DSL EXT calls restricted by default; `sph.ext.allow(name)` to permit.
- `sph._extCall`: whitelist-checked EXT call entry point for DSL sandbox.
- `W-TYPE` warning: static type inference — warns on sigil mismatches at compile time.
- `W-EXT` warning: blocked EXT call emits runtime warning with name and reason.
- `E016`: stack overflow guard via `sph.ext.callDepth`.
- `q_slot` freelist: `{cur, free[]}` per type replaces simple counter — `sys.q.free` releases slots.
- `qlit` (Literal Array): named constant arrays accessible from DSL and sandbox.

### v15
- Double-evaluation fix in `_castI` / `_castF` (1-1).
- Operator precedence corrected: `||` > `&&` (1-2).
- Local variable type-prefixing: `#_v → _iv`, `%_v → _fv`, `$_v → _sv` (3-1).
- `q_slot` freelist introduced (2.6).
- `sys.screen.width` / `height` / `idx` ghost APIs resolved (2.13).
- Debug mode: `sph.debug.enabled = true` enables block trace; `callDepth` enforced (2.15).
- Nested `if` support (4-1).
- `sys.f` inner double-quote handling fixed (4-2).

---

## ⬡ Technical Stack

- **100% HTML + JavaScript** — single file, no build step
- Modern Web APIs: SharedArrayBuffer, Web Workers, AudioContext, WebCodecs, WebGPU, WASM
- Inline ServiceWorker for `crossOriginIsolated` (works from `file://`)
- Lightweight DSL compiled at runtime to sandboxed JavaScript
- JSON-based EXT specification system (`sph/doc`, `sph/meta`)

---

## ⬡ Repository

For the latest updates, visit the [GitHub repository](https://github.com/nysh2480/sapphire).

**SAPPHIRE** — Build at the speed of thought.
