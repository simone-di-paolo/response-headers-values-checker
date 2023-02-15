// on page change
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url && !tab.url.startsWith('chrome://extensions/')) {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ['contentScript.js']
        });
    }
});