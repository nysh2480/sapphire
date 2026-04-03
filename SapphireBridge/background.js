console.log("Service Worker: Started");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SEND_TO_IDE") {
    console.log("Received code from LLM tab");

    chrome.tabs.query({}, (tabs) => {
      const ideTab = tabs.find(t => t.title.includes("Sapphire"));
      
      if (ideTab) {
        console.log("Found IDE Tab:", ideTab.title);
        
        // CSP制限を回避してIDEのメイン世界でコードを実行
        chrome.scripting.executeScript({
          target: { tabId: ideTab.id },
          world: 'MAIN', // IDEの変数(window.sph)に直接アクセス
          args: [message.code],
          func: (code) => {
            if (window.sph) {
              const activeTab = sph.get('ide.tab.active');
              sph.call('ide.tab.set', [activeTab, code]);
              sph.call('ide.run');
              console.log("[Bridge] Code executed successfully");
            } else {
              alert("Sapphire IDE is not ready (window.sph not found)");
            }
          }
        });
      } else {
        console.warn("Sapphire IDE tab not found");
      }
    });
  }
});