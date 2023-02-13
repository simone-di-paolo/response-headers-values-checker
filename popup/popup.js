var valuesInput = document.querySelector('#values-input');
var section = document.getElementById("results-section");
var div = document.querySelector("#results-div > div");
var valuesArray = [];

document.addEventListener('DOMContentLoaded', function(event) {
    init();
});

function init() {
    eventListenerInitializer();
    prepopulateValuesInput();
    setTimeout(function() {
        var mmm = "";
        chrome.storage.local.get('responseValues', function (obj) {
            mmm = obj.responseValues;
            console.log("Inside: " + mmm);
            if(mmm !== null && mmm !== '') {
                worker();
            }
        });
    }, 500);
}

function worker() {
    if (valuesInput != null) {

        var valuesInputText = valuesInput.value;
        var values = getValues(valuesInputText);

        var headers = "";

        chrome.storage.local.get('responseValues', function (obj) {
            headers = obj.responseValues;
            if(headers !== '' ) {

                // get headers as an array
                var headersArray = headers.trim().split(/[\r\n]+/);

                var foundValues = [];
                var count = 0;

                for(var i=0;i <values.length; i++) {
                    for(var j=0; j<headersArray.length; j++) {
                        if(headersArray[j].startsWith(values[i])) {
                            foundValues[count] = headersArray[j]
                            count++;
                        }
                    }
                }
                if(foundValues.length > 0) {
                    injector(foundValues);
                } else {
                    if(!section.classList.contains("disabled")) {
                        section.classList.add("disabled");
                    }
                }

            }
        });
    }
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
    if(value !== '') {
        chrome.storage.local.set({'valuesInput': value}, function() {
            console.log("Values saved!");
        })
    }
}

function prepopulateValuesInput() {
    let valuesInput = document.getElementById("values-input");
    chrome.storage.local.get('valuesInput', function(obj) {
        if(obj.valuesInput !== undefined && obj.valuesInput !== '') {
            valuesInput.value = obj.valuesInput;
        }
        console.log("obj.valuesInput: " + obj.valuesInput);
    });
}

function getValues(valuesInputText) {
    var thisValuesArray = [];
    if (valuesInputText !== null && valuesInputText !== '') {
        thisValuesArray = valuesInputText.split(',');
        // trimming values
        for (var i = 0; i < thisValuesArray.length; i++) {
            thisValuesArray[i] = thisValuesArray[i].trim();
        }
    } else {
        console.log("No values added into the input.");
    }
    return thisValuesArray;
}


function injector(foundValues) {
    section.classList.remove("disabled");
    while(div.firstChild) {
        div.removeChild(div.lastChild);
    }

    for(var l=0; l<foundValues.length; l++) {
        var span = document.createElement('span');
        span.className = 'results-span';
        span.innerText = foundValues[l];
        div.appendChild(span);
    }
}