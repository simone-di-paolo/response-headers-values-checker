// check for run it once
debugger;
if(typeof contentScriptWorker === 'undefined') {
    const contentScriptWorker = function () {
        var val = getValuesFromResponse();
        chrome.storage.local.set({'responseValues': val}, function() {
            //console.log("Test done: " + val);
            // setting response value
        })
    }

    chrome.storage.local.get(["enabled"], function (result) {
        debugger;
        var isEnabledInFunction = result.enabled || false;
        if (isEnabledInFunction) {

            contentScriptWorker();
        }
    });
}

function getValuesFromResponse() {
    var req = new XMLHttpRequest();
    req.open("get", document.location, false);
    req.send(null);

    if (req.status >= 200 && req.status < 300) {
        return req.getAllResponseHeaders().toLowerCase();
    } else {
        // handle error
        console.log('Error getting response headers: ' + req.status + ' - ' + req.statusText);
        return '';
    }
}
