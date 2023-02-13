try {
    // on page change
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (!tab.url.startsWith("chrome://") && changeInfo.status === 'complete') {
            chrome.scripting.executeScript({
                files: ['contentScript.js'],
                target: {
                    tabId: tab.id
                }
            });
        }
    });
} catch (e) {
    console.log(e);
}
