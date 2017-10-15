
// Holds the count of number of times SHIFT + ENTER was pressed
var skipCount = 0;

// Holds the value to determine if the text was changed
var prevVal = "";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("search").focus();
    document.getElementById("search").addEventListener("keyup", function (e) {
        // ignore shift key
        if (e.keyCode == 16) {
            return;
        }

        console.log("Shift: " + e.shiftKey + " keycode: " + e.keyCode);

        if (e.shiftKey && e.keyCode == 13) {
            // if we want to skip the link we found (SHIFT + ENTER)
            skipCount++;
            console.log("Incrementing skipcount: " + skipCount);
        } else if (!e.shiftKey && e.keyCode == 13) {
            // if just enter was pressed we want to click the link selected
            sendEnter();
        } else if (prevVal != e.srcElement.value) {
            // if the value has changed, reset the skip count
            skipCount = 0;
            console.log("Resetting scriptcouunt");
        } else {
            // store the value again
            prevVal = e.srcElement.value;
        }

        console.log("Searching for: " + e.srcElement.value);
        sendSearch(e.srcElement.value, skipCount);
    });
});

// send the enter message
function sendEnter() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log("sending enter");
        chrome.tabs.sendMessage(tabs[0].id, { enter: true });
    });
}

// send the search command
function sendSearch(searchTerm, skipCount) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log("sending msg");
        chrome.tabs.sendMessage(tabs[0].id, { search: searchTerm, skip: skipCount });
    });
}