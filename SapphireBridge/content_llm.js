console.log("💎 Sapphire Bridge: LLM Script Active (AI Studio Special)");

function injectButtons() {
  // AI Studioの「コピー」ボタンを探す（これが最も確実な目印です）
  // GoogleのUIでは、コピーボタンの近くにコード本体があります
  const copyButtons = document.querySelectorAll('button[aria-label*="コピー"], button[aria-label*="Copy"], .copy-button');

  copyButtons.forEach(copyBtn => {
    // すでに隣にSapphireボタンがある場合はスキップ
    if (copyBtn.parentElement.querySelector('.sapphire-send-btn')) return;

    // Sapphire送信ボタンを作成
    const sapphireBtn = document.createElement('button');
    sapphireBtn.innerText = "💎 Send";
    sapphireBtn.className = "sapphire-send-btn";
    
    // コピーボタンと同じような見た目にするためのスタイル
    sapphireBtn.style.cssText = `
      background: #4c8ef5;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      margin-right: 8px;
      vertical-align: middle;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transition: all 0.2s;
    `;

    sapphireBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // このボタンの近くにあるコードブロック（preやcode）を探す
      // 通常、コピーボタンの親要素の近くにコードがあります
      let container = sapphireBtn.closest('.code-block-container, ms-code-block, div[role="region"]');
      if (!container) container = sapphireBtn.parentElement.parentElement;
      
      const codeEl = container.querySelector('pre, code, .code-content');
      if (codeEl) {
        const code = codeEl.innerText.trim();
        console.log("💎 Sending DSL to Background...");
        chrome.runtime.sendMessage({ type: "SEND_TO_IDE", code: code });
        
        sapphireBtn.innerText = "✅ Sent!";
        sapphireBtn.style.background = "#2de881";
        setTimeout(() => { 
          sapphireBtn.innerText = "💎 Send"; 
          sapphireBtn.style.background = "#4c8ef5";
        }, 2000);
      } else {
        console.warn("❌ Code element not found near button");
      }
    };

    // コピーボタンの直前に挿入
    copyBtn.parentNode.insertBefore(sapphireBtn, copyBtn);
  });

  // 予備：コピーボタンが見つからない場合のための従来型ロジックも併用
  const preBlocks = document.querySelectorAll('pre:not([data-sapphire-bound])');
  preBlocks.forEach(pre => {
    if (pre.querySelector('.sapphire-send-btn')) return;
    pre.setAttribute('data-sapphire-bound', 'true');
    pre.style.position = 'relative';
    
    const btn = document.createElement('button');
    btn.innerText = "🚀 Send to Sapphire";
    btn.className = "sapphire-send-btn";
    btn.style.cssText = "position:absolute; top:5px; right:40px; z-index:9999; background:#4c8ef5; color:white; border:none; border-radius:4px; padding:4px 8px; font-size:10px; cursor:pointer;";
    
    btn.onclick = (e) => {
      e.preventDefault();
      chrome.runtime.sendMessage({ type: "SEND_TO_IDE", code: pre.innerText.replace("🚀 Send to Sapphire", "").trim() });
    };
    pre.appendChild(btn);
  });
}

// 監視を強化
const observer = new MutationObserver(injectButtons);
observer.observe(document.body, { childList: true, subtree: true });
injectButtons();