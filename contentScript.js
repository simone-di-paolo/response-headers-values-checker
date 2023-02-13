var foundValues = [];
var valuesInputText;
var count = 0;

// check for run it once
if(typeof contentScriptWorker === 'undefined') {
    const contentScriptWorker = function () {
        var val = getValuesFromResponse();
        // clear
        /*chrome.storage.local.clear(function() {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
        });
         */
        // re-save
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
    req.send(null)
    return req.getAllResponseHeaders().toLowerCase()
}

function valuesWorker() {
    var valuesArray = [];
    var valuesInputText = localStorage.getItem("valuesInput");

    if (valuesInputText === undefined || valuesInputText === null || valuesInputText === '') {
        chrome.storage.local.get('valuesInput', function(obj) {
            if(obj.valuesInput !== undefined && obj.valuesInput !== '') {
                valuesInputText = obj.valuesInput;
                checkValuesInHeaderResponse(valuesInputText);
            }
        });
    }
    return valuesArray;
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