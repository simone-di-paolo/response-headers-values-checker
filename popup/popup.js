var valuesInput = document.querySelector('#values-input');
var resultsSpan = document.querySelector('#results-span');

document.addEventListener('DOMContentLoaded', function(event) {
    init();
});

function init() {
    eventListenerInitializer();
    prepopulateValuesInput();
    setTimeout(function() {
        worker();
    }, 250);
}

function worker() {
    if (valuesInput != null) {

        var valuesInputText = valuesInput.value;
        var values = getValues(valuesInputText);

        var headers = getValuesFromResponse();
        var foundValues = [];
        var count = 0;

        if (headers != null) {
            for (var i = 0; i < values.length; i++) {
                if (headers.includes(values[i])) {
                    var extractedSubstring = headers.substring(headers.indexOf(values[i]));
                    var finalValue = extractedSubstring.substring(0, extractedSubstring.indexOf("\r\n"));
                    foundValues[count] = finalValue;
                    count++;
                }
            }
            resultsSpan.textContent = resultsToString(foundValues);
        }
    }
}

function getValues(valuesInputText) {
    var values = [];
    if(valuesInputText !== '') {
        values = valuesInputText.split(',');
        // trimming values
        for (var i=0; i<values.length; i++) {
            values[i] = values[i].trim();
        }
    } else {
        console.log("No values added into the input.");
    }
    return values;
}

function getValuesFromResponse() {
    var req = new XMLHttpRequest();
    req.open("get", document.location, false);
    req.send(null)
    return req.getAllResponseHeaders().toLowerCase()
}

function resultsToString(foundValues) {
    var result = "";
    for(var i=0; i<foundValues.length; i++) {
        result += foundValues[i] + "\n";
    }
    return result;
}

function eventListenerInitializer() {
    let valuesInput = document.getElementById("values-input");
    valuesInput.addEventListener("focusout", function() {
        saveOnFocusLeave(valuesInput.value);
        showMessage("success-text", 1500);
        worker();
    });
}


function saveOnFocusLeave(value) {
    if(value !== "") {
        chrome.storage.sync.set({
            "valuesInput": value
        });
        chrome.storage.sync.get(["valuesInput"], function(obj) {
            console.log(obj.valuesInput);
        })
    }
}

function prepopulateValuesInput() {
    let valuesInput = document.getElementById("values-input");
    chrome.storage.sync.get("valuesInput", function (obj) {
        if(obj.valuesInput !== undefined) {
            valuesInput.value = obj.valuesInput;
        }
    });
}