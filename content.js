
window.addEventListener('unload', function (e) {
    chrome.runtime.sendMessage({ clear: true });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.enter == true) {
            var match = document.getElementsByClassName("searchMatch");
            if (match.length > 0) {
                match[0].click();
            }
            return;
        }

        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        console.log("msg: " + request.search);

        var links = document.querySelectorAll("a");

        links.forEach(function (e) {
            e.className = e.className.replace(" searchMatch", "");
        })

        var totalmatches = 0;
        for (var i = 0; i < links.length; i++) {
            if (links[i].innerText.indexOf(request.search) != -1) {
                totalmatches++;
            }
        }

        console.log("skip: " + request.skip);
        console.log("total matches " + totalmatches);
        if (request.skip > totalmatches) {
            request.skip -= totalmatches;
        }

        console.log("skip: " + request.skip);
        var count = 0;
        for (var i = 0; i < links.length; i++) {
            if (links[i].innerText.indexOf(request.search) != -1) {

                console.log("count: " + count + " skip: " + request.skip);
                if (count < request.skip) {
                    count++;
                } else {
                    console.log("Found matching link:" + links[i].innerText + " skip: " + request.skip);
                    links[i].scrollTo();
                    links[i].focus();
                    links[i].className += " searchMatch";
                    return;
                }
            }
        }
    }
);