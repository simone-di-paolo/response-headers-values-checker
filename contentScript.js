var foundValues = [];
var count = 0;

// check for run it once
if(typeof contentScriptWorker === 'undefined') {
    const contentScriptWorker = function () {
        var val = getValuesFromResponse();
        chrome.storage.local.set({'responseValues': val}, function() {
            //console.log("Test done: " + val);
            // setting response value
        })
    }
    contentScriptWorker();
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

function checkValuesInHeaderResponse(valuesInputText) {
    if (valuesInputText !== undefined) {
        if(valuesInputText !== null && valuesInputText !== '') {
            valuesArray = valuesInputText.split(',');
            // trimming values
            for (var i=0; i<valuesArray.length; i++) {
                valuesArray[i] = valuesArray[i].trim();
            }
        } else {
            console.log("No values added into the input.");
        }

        var headers = getValuesFromResponse();

        if (headers != null) {
            for (var i = 0; i < valuesArray.length; i++) {
                if (headers.includes(valuesArray[i])) {
                    var extractedSubstring = headers.substring(headers.indexOf(valuesArray[i]));
                    foundValues[count] = extractedSubstring.substring(0, extractedSubstring.indexOf("\r\n"));
                    var tempSplittedAgain = foundValues[count].split(':');
                    if(tempSplittedAgain.length > 2) {
                        tempSplittedAgain[tempSplittedAgain.length] = tempSplittedAgain[tempSplittedAgain.length].split(' ')[0];
                        var tempString = "";
                        for(var o=0; o<tempSplittedAgain.length; o++) {
                            tempString += tempSplittedAgain[o];
                        }
                        foundValues[count] = tempString;
                    }
                    count++;
                }
            }
            console.log()
        }
        if(foundValues.length > 0) {
            injector();
        }
    }
}
