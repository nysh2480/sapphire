console.log("IDE Content Script: Loaded");

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "EXECUTE_DSL") {
    console.log("Received DSL code, attempting to execute...");
    // セキュリティエラーを避けるため、最も単純な方法で実行を試みる
    const script = document.createElement('script');
    script.textContent = `
      if (window.sph) {
        const activeTab = sph.get('ide.tab.active');
        sph.call('ide.tab.set', [activeTab, \`${request.code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`]);
        sph.call('ide.run');
      }
    `;
    document.documentElement.appendChild(script);
    script.remove();
  }
});