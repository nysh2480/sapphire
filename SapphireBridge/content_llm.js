// ════════════════════════════════════════════════════════════════
//  content_llm.js  v2.0
//  - LLMページ（Claude / Grok / AI Studio）に注入される
//  - コードブロックへの 💎 Send ボタン注入（既存機能）
//  - 会話メッセージの自動キャプチャ → background.js 経由で保存（新規）
//  - IDE_TO_BRIDGE / BRIDGE_MEMORY_REQUEST_DUMP のリスナー（新規）
// ════════════════════════════════════════════════════════════════

'use strict';

// ── ソース判定 ────────────────────────────────────────────────
const SOURCE = (() => {
  const h = location.hostname;
  if (h.includes('claude.ai'))         return 'claude.ai';
  if (h.includes('aistudio.google'))   return 'aistudio';
  if (h.includes('grok') || h.includes('x.com')) return 'grok';
  return 'unknown';
})();

// ── セッションID: タブ起動ごとに固定 ──────────────────────────
const SESSION_ID = SOURCE + '_' + Date.now().toString(36);

// ── ユーティリティ ────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ════════════════════════════════════════════════════════════════
//  1. コードブロック → 💎 Send ボタン注入（既存機能・維持）
// ════════════════════════════════════════════════════════════════
function injectButtons() {
  const copyButtons = document.querySelectorAll(
    'button[aria-label*="コピー"], button[aria-label*="Copy"], .copy-button'
  );

  copyButtons.forEach(copyBtn => {
    if (copyBtn.parentElement.querySelector('.sapphire-send-btn')) return;

    const sapphireBtn = document.createElement('button');
    sapphireBtn.innerText = '💎 Send';
    sapphireBtn.className = 'sapphire-send-btn';
    sapphireBtn.style.cssText = 'background:#4c8ef5;color:white;border:none;border-radius:4px;padding:4px 12px;font-size:11px;font-weight:bold;cursor:pointer;margin-right:8px;vertical-align:middle;';

    sapphireBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      let container = sapphireBtn.closest('.code-block-container, ms-code-block, div[role="region"]');
      if (!container) container = sapphireBtn.parentElement.parentElement;

      const codeEl = container.querySelector('pre, code, .code-content');
      if (codeEl) {
        const code = codeEl.innerText.trim();
        chrome.runtime.sendMessage({ type: 'SEND_TO_IDE', code });
        sapphireBtn.innerText = '✅ Sent!';
        setTimeout(() => { sapphireBtn.innerText = '💎 Send'; }, 2000);
      }
    };

    copyBtn.parentNode.insertBefore(sapphireBtn, copyBtn);
  });
}

const _btnObserver = new MutationObserver(injectButtons);
_btnObserver.observe(document.body, { childList: true, subtree: true });
injectButtons();

// ════════════════════════════════════════════════════════════════
//  2. 会話メッセージのキャプチャ
//  各LLMサイトのDOM構造に応じたセレクター定義
// ════════════════════════════════════════════════════════════════
const CAPTURE_RULES = {
  'claude.ai': {
    // ユーザー発言
    human: {
      container: '[data-testid="user-message"]',
      text:      null,  // コンテナ自身のinnerText
    },
    // AI発言
    ai: {
      container: '[data-testid="assistant-message"]',
      text:      null,
    },
    // モデル名取得（ベストエフォート）
    model: () => {
      const el = document.querySelector('[data-testid="model-selector-dropdown"] span, .model-name');
      return el ? el.innerText.trim() : '';
    }
  },
  'aistudio': {
    human: {
      container: 'ms-prompt-chunk .user-prompt, .turn-container[data-turn-role="user"]',
      text:      '.prompt-text, .text-content',
    },
    ai: {
      container: 'ms-model-response, .turn-container[data-turn-role="model"]',
      text:      '.response-text, .text-content, .markdown',
    },
    model: () => {
      const el = document.querySelector('.model-name-label, [data-testid="model-name"]');
      return el ? el.innerText.trim() : '';
    }
  },
  'grok': {
    human: {
      container: '[data-message-author-role="user"], .human-message',
      text:      null,
    },
    ai: {
      container: '[data-message-author-role="assistant"], .assistant-message',
      text:      null,
    },
    model: () => 'grok'
  },
  'unknown': {
    human: { container: null, text: null },
    ai:    { container: null, text: null },
    model: () => ''
  }
};

// 送信済みメッセージのハッシュセット（重複防止）
const _sentHashes = new Set();

function hashText(text) {
  // 簡易ハッシュ: 先頭80文字 + 長さ
  return text.slice(0, 80) + '|' + text.length;
}

function extractText(el, rule) {
  if (!rule.text) return el.innerText.trim();
  const sub = el.querySelector(rule.text);
  return sub ? sub.innerText.trim() : el.innerText.trim();
}

function captureMessages() {
  const rules = CAPTURE_RULES[SOURCE] || CAPTURE_RULES['unknown'];
  const model = rules.model ? rules.model() : '';
  const url   = location.href;

  for (const role of ['human', 'ai']) {
    const rule = rules[role];
    if (!rule || !rule.container) continue;

    const elements = document.querySelectorAll(rule.container);
    elements.forEach(el => {
      const text = extractText(el, rule);
      if (!text || text.length < 4) return;

      const hash = hashText(text);
      if (_sentHashes.has(hash)) return;
      _sentHashes.add(hash);

      chrome.runtime.sendMessage({
        type:      'SAVE_TO_MEMORY',
        sessionId: SESSION_ID,
        role,
        source:    SOURCE,
        content:   text,
        url,
        model,
        timestamp: Date.now(),
      });
    });
  }
}

// ── MutationObserver で新メッセージを検知 ────────────────────
let _captureTimer = null;
const _captureObserver = new MutationObserver(() => {
  // 短時間に大量発火するので debounce
  clearTimeout(_captureTimer);
  _captureTimer = setTimeout(captureMessages, 800);
});

// DOMContentLoaded 後にオブザーバーを開始
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    _captureObserver.observe(document.body, { childList: true, subtree: true });
    captureMessages(); // 初回スキャン
  });
} else {
  _captureObserver.observe(document.body, { childList: true, subtree: true });
  captureMessages();
}

// ════════════════════════════════════════════════════════════════
//  3. window.postMessage リスナー
//  ・IDE_TO_BRIDGE  : Sapphire IDE からのログ受信（既存）
//  ・BRIDGE_MEMORY_REQUEST_DUMP : bridge_memory.html からの SYNC 要求
// ════════════════════════════════════════════════════════════════
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  const d = event.data;
  if (!d) return;

  // ── IDE → Bridge ログ受信（既存機能・維持） ──────────────
  if (d.type === 'IDE_TO_BRIDGE') {
    const logMsg = `[AI_CONNECT] ${d.log?.ai_bridge || 'IDE'} → ${JSON.stringify(d.log?.data ?? d)}`;
    if (typeof sph !== 'undefined' && sph.call) {
      sph.call('ide.log', [logMsg]);
    } else {
      console.log('[Sapphire Bridge]', logMsg);
    }
  }

  // ── bridge_memory.html から SYNC ボタンが押された ─────────
  // bridge_memory.html は同一タブ内ではなく別タブなので
  // postMessage は届かないが、拡張ページ経由のケースに備えてリスナーを置く
  if (d.type === 'BRIDGE_MEMORY_REQUEST_DUMP') {
    chrome.runtime.sendMessage({ type: 'REQUEST_MEMORY_DUMP' }, (res) => {
      window.postMessage({ type: 'BRIDGE_MEMORY_DUMP', entries: res?.entries || [] }, '*');
    });
  }
});

// ── bridge_memory.html を開くコマンド（LLMページ上のショートカット） ──
// Alt+Shift+M でメモリバンクを開く
document.addEventListener('keydown', (e) => {
  if (e.altKey && e.shiftKey && e.key === 'M') {
    chrome.runtime.sendMessage({ type: 'OPEN_MEMORY' });
  }
});

// ── 起動通知 ─────────────────────────────────────────────────
window.postMessage({
  type:    'BRIDGE_TO_IDE',
  status:  'ready',
  message: `Sapphire Bridge v2.0 loaded on ${SOURCE}`
}, '*');

console.log(`[Sapphire Bridge] v2.0 active on ${SOURCE} — session: ${SESSION_ID}`);
