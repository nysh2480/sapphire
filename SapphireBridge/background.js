console.log("Service Worker: Started (v2.0)");

// ── ストレージキー定数 ────────────────────────────────────────
const MEMORY_KEY    = 'bridge_memory_log';
const MEMORY_LIMIT  = 2000; // 最大保持エントリ数

// ── ユーティリティ ────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// chrome.storage.local から全ログを取得
function getLog() {
  return new Promise((res) => {
    chrome.storage.local.get(MEMORY_KEY, (result) => {
      res(result[MEMORY_KEY] || []);
    });
  });
}

// エントリを追記して上限を超えたら古いものを捨てる
async function appendLog(entry) {
  const log = await getLog();
  log.push(entry);
  // 上限超過時は古い順に削除
  const trimmed = log.length > MEMORY_LIMIT ? log.slice(log.length - MEMORY_LIMIT) : log;
  return new Promise((res) => {
    chrome.storage.local.set({ [MEMORY_KEY]: trimmed }, () => res(trimmed.length));
  });
}

// bridge_memory.html が開いているタブを探す
function findMemoryTab(tabs) {
  return tabs.find(t =>
    t.url && (
      t.url.includes('bridge_memory.html') ||
      t.title === '◆ SAPPHIRE BRIDGE MEMORY'
    )
  );
}

// Sapphire IDE タブを探す
function findIdeTab(tabs) {
  return tabs.find(t => t.title && t.title.includes('Sapphire'));
}

// ── メッセージハンドラ ────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // ── 1. Sapphire IDE にコードを送信 ────────────────────────
  if (message.type === 'SEND_TO_IDE') {
    chrome.tabs.query({}, (tabs) => {
      const ideTab = findIdeTab(tabs);
      if (ideTab) {
        chrome.scripting.executeScript({
          target: { tabId: ideTab.id },
          world: 'MAIN',
          args: [message.code],
          func: async (code) => {
            if (window.sph) {
              try {
                const activeTab = await sph.call('ide.tab.active');
                await sph.call('ide.tab.set', [activeTab, code]);
                await sph.call('ide.run');
              } catch (e) {
                console.error('[Bridge Error]', e);
              }
            }
          }
        });
      }
    });
    // 非同期なので true を返さない（sendResponse 不要）
    return false;
  }

  // ── 2. メモリバンクにエントリを保存 ───────────────────────
  // content_llm.js から送られてくる捕捉メッセージ
  if (message.type === 'SAVE_TO_MEMORY') {
    const entry = {
      id:        uid(),
      sessionId: message.sessionId  || 'unknown',
      role:      message.role       || 'ai',
      source:    message.source     || 'unknown',
      content:   message.content    || '',
      url:       message.url        || '',
      model:     message.model      || '',
      timestamp: message.timestamp  || Date.now(),
      tokens:    Math.round((message.content || '').length / 3.5),
    };

    appendLog(entry).then((total) => {
      console.log(`[Memory] saved. total=${total}`);

      // bridge_memory.html が開いていればリアルタイムで転送
      chrome.tabs.query({}, (tabs) => {
        const memTab = findMemoryTab(tabs);
        if (memTab) {
          chrome.scripting.executeScript({
            target: { tabId: memTab.id },
            world: 'MAIN',
            args: [entry],
            func: (en) => {
              window.postMessage({ type: 'BRIDGE_MEMORY_PUSH', entries: [en] }, '*');
            }
          }).catch(() => {});
        }
      });
    });

    sendResponse({ ok: true });
    return true;
  }

  // ── 3. bridge_memory.html を開く / フォーカス ────────────
  if (message.type === 'OPEN_MEMORY') {
    chrome.tabs.query({}, (tabs) => {
      const memTab = findMemoryTab(tabs);
      if (memTab) {
        // すでに開いていればフォーカスするだけ
        chrome.tabs.update(memTab.id, { active: true });
        chrome.windows.update(memTab.windowId, { focused: true });
      } else {
        // 新規タブで開く（拡張ディレクトリの bridge_memory.html）
        chrome.tabs.create({ url: chrome.runtime.getURL('bridge_memory.html') });
      }
    });
    return false;
  }

  // ── 4. bridge_memory.html からのダンプ要求 ───────────────
  // SYNC ボタンが押されたとき chrome.storage の全データを返す
  if (message.type === 'REQUEST_MEMORY_DUMP') {
    getLog().then((entries) => {
      sendResponse({ ok: true, entries });
    });
    return true; // 非同期 sendResponse のために true を返す
  }

  // ── 5. ストレージ全クリア ─────────────────────────────────
  if (message.type === 'CLEAR_MEMORY') {
    chrome.storage.local.remove(MEMORY_KEY, () => {
      sendResponse({ ok: true });
    });
    return true;
  }
});

// ── bridge_memory.html からの postMessage をリレー ───────────
// (bridge_memory.html は file:// or extension page なので
//  content script 経由ではなく runtime.onMessage で直接受け取る)
// ※ bridge_memory.html 内の JS が chrome.runtime.sendMessage を
//   直接呼べるように、上記ハンドラで REQUEST_MEMORY_DUMP を処理済み
