// shows msg on the screen
function showMessage(elementId, millis) {
    let divMessage = document.getElementById(elementId);
    divMessage.classList.remove("hidden");
    window.setTimeout(function(){
        divMessage.classList.add("hidden");
    }, millis);
}