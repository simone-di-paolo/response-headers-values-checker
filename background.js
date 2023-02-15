try {
    // on page change
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://extensions/')) {
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: ['contentScript.js']
            });
        }
    });
} catch (e) {
    console.log(e);
}
