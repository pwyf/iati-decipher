var html = null;

function loadHTML (url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            html = xhr.responseText;
        }
    };
    xhr.send();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case 'xv.get-html':
            if (html === null) {
                loadHTML(request.filePath);
            }
            sendResponse({fileText: html});
            break;
        case 'xv.show-page-action':
            chrome.pageAction.show(sender.tab.id);
            break;
        case 'xv.hide-page-action':
            chrome.pageAction.hide(sender.tab.id);
            break;
    }
});

loadHTML('../html/html.html');
