var valuesInput = document.querySelector('#values-input');
var section = document.getElementById("results-section");
var div = document.querySelector("#results-div > div");
var startStopButton = document.getElementById("toggle-btn");

var millisBeforeUpdate = 3000;

document.addEventListener('DOMContentLoaded', function(event) {
    init();
    startStopButton.addEventListener("click", toggleExtension);
    getIsEnabled();
});

function init() {
    eventListenerInitializer();
    prepopulateValuesInput();
    setTimeout(function() {
        var responseValues = "";
        chrome.storage.local.get('responseValues', function (obj) {
            responseValues = obj.responseValues;
            console.log("Inside: " + responseValues);
            if(responseValues !== null && responseValues !== '') {
                chrome.storage.local.get(["enabled"], function (result) {
                    var isEnabledInFunction = result.enabled || false;
                    if(isEnabledInFunction) {
                        worker();
                    }
                });
            }
        });
    }, 500);
}

function worker() {
    debugger;
    if (valuesInput != null) {

        var valuesInputText = valuesInput.value;
        var values = getValues(valuesInputText);

        var headers = "";

        chrome.storage.local.get('responseValues', function (obj) {
            if(obj.responseValues !== undefined) {
                headers = obj.responseValues;
                if (headers !== '') {

                    // get headers as an array
                    if (headers !== undefined) {
                        var headersArray = headers.trim().split(/[\r\n]+/);

                        var foundValues = [];
                        var count = 0;

                        for (var i = 0; i < values.length; i++) {
                            for (var j = 0; j < headersArray.length; j++) {
                                if (headersArray[j].startsWith(values[i])) {
                                    foundValues[count] = headersArray[j]
                                    count++;
                                }
                            }
                        }
                        if (foundValues.length > 0) {
                            injector(foundValues);
                        } else {
                            if (!section.classList.contains("disabled")) {
                                section.classList.add("disabled");
                            }
                        }
                    }
                }
            } else {
                // removing childs from div
                var element = document.querySelector(".results-div-style");
                removeChildsFromNode(element);
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

function toggleExtension() {
    var button = document.getElementById("toggle-btn");
    if(button !== undefined) {
        chrome.storage.local.get(["enabled"], function (result) {
            var isEnabledInFunction = result.enabled || false;
            if (!isEnabledInFunction) {
                // enabling
                chrome.storage.local.set({enabled: true}, function () {
                    //document.getElementById("toggle-btn").textContent = "ENABLED";
                    buttonStyler(button, "ENABLED", "#4caf50");
                });


                refreshAndReload(millisBeforeUpdate);
            } else {
                // disabling
                // clear the local storage
                chrome.storage.local.clear();

                // set again the same value in storage
                chrome.storage.local.set({'valuesInput': valuesInput.value}, function() {
                    // nothing, just save and that's all!
                    // •|龴◡龴|•
                });

                chrome.storage.local.set({enabled: false}, function () {
                    //document.getElementById("toggle-btn").textContent = "DISABLED";
                    buttonStyler(button, "DISABLED", "#f44336");
                });
                refreshAndReload(millisBeforeUpdate);
                //countdownToRefresh(millisBeforeUpdate/1000);
            }
        });
    } else {
        console.log("start/stop button is undefined");
    }
}

function getIsEnabled() {
    chrome.storage.local.get(["enabled"], function (result) {
        var isEnabledInFunction = result.enabled || false;
        if (startStopButton !== undefined) {
            var button = document.getElementById("toggle-btn");
            if (button !== undefined) {
                isEnabledInFunction ? buttonStyler(button, "ENABLED", "#4caf50") : buttonStyler(button, "DISABLED", "#f44336");
                startStopButton.classList.remove("disabled");
            }
        } else {
            console.log("startStopButton is undefined");
        }
    });
}

function refreshAndReload(relaunchWorkerTime) {
    // refresh the page for update the headers response
    setTimeout(function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
    }, 500);

    debugger;
    countdownToRefresh(relaunchWorkerTime/1000);
    // relaunching the worker so the popup can be updated
    setTimeout(function() {
        worker();
    }, relaunchWorkerTime);
}

function buttonStyler(button, buttonText, buttonColor) {
    if(button !== undefined) {
        button.textContent = buttonText;
        button.style.backgroundColor = buttonColor;
    }
}

function countdownToRefresh(startsSeconds, ) {
    var countdownDiv = document.querySelector('#countdown-section');
    var countdownText = document.querySelector('#countdown-text-id');
    if(countdownDiv !== undefined) {
        if(section !== undefined) {
            section.classList.add("disabled");
        }

        // checking if the script it's enabled
        chrome.storage.local.get(["enabled"], function (result) {
            var isEnabledInFunction = result.enabled || false;

            // if it's enabled show the countdown and continue...
            if(isEnabledInFunction) {
                if (startStopButton !== undefined) {
                    if (countdownDiv.classList.contains("disabled")) {
                        countdownText.textContent = "Updating values in " + startsSeconds + " seconds...";
                        countdownDiv.classList.remove("disabled");
                    }

                    // updating countdown
                    if (countdownText !== undefined) {
                        var counter = setInterval(function () {
                            startsSeconds = startsSeconds - 1;
                            if (startsSeconds <= 0) {
                                clearInterval(counter);
                                // hiding the countdown div
                                countdownDiv.classList.add("disabled");
                            }
                            if (startsSeconds > 1) {
                                countdownText.textContent = "Updating values in " + startsSeconds + " seconds...";
                            } else {
                                countdownText.textContent = "Updating values in " + startsSeconds + " second...";
                            }
                        }, 1000);
                    }
                }
            } else  {
                // else it's disabled so remove and hide the results
                var element = document.querySelector(".results-div-style");
                removeChildsFromNode(element);
            }
        });
    }
}

function removeChildsFromNode(element) {
    // removing childs from div
    if(typeof element !== undefined && element !== undefined) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    if (!section.classList.contains("disabled")) {
        section.classList.add("disabled");
    }
}