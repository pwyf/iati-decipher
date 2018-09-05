//fallback to old Chrome API
var sendMessage = chrome.runtime.sendMessage;

function isXML(doc) {
    var docElem = doc.documentElement;
    var isSVG = docElem && docElem.namespaceURI == 'http://www.w3.org/2000/svg';
    return !(doc instanceof HTMLDocument || isSVG);
}

function toXml(text) {
    var result = (new DOMParser()).parseFromString(text, 'text/xml');

    if (!result || !result.documentElement
            || result.documentElement.nodeName == 'parsererror'
            || result.getElementsByTagName('parsererror').length) {


        var error = result.getElementsByTagName('parsererror')[0];
        console.log(error);
        throw "<h2>Can’t parse XML document</h2> \n" + (error ? error.textContent : '');
    }

    return result;
}

function canTransform(doc) {
    if (!doc) {
        return false;
    }

    if (doc.nodeType == 1) {
        doc = doc.ownerDocument;
    }

    return 'documentElement' in doc && isXML(doc) && !(doc.documentElement instanceof HTMLElement);
}

function doSomeMagic(data) {
    console.log(data);
}

function doTransform(data) {
    sendMessage({action: 'xv.get-html', filePath: 'html/html.html'},
        function(response) {
            var result = (new DOMParser()).parseFromString(response.fileText, 'text/html');
            document.replaceChild(document.adoptNode(result.documentElement), document.documentElement);

            var bundle = document.getElementsByTagName('link')[0];
            bundle.setAttribute('href', chrome.extension.getURL('css/css.css'));

            // var bundle = document.createElement('script');
            // bundle.setAttribute('src', chrome.extension.getURL('js/bundle.js'));
            // document.documentElement.appendChild(bundle);

            var doctype = document.implementation.createDocumentType('html',
                '-//W3C//DTD XHTML 1.0 Transitional//EN',
                'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd');

            var xml_doc = document.implementation.createDocument(
                    'http://www.w3.org/1999/xhtml', 'html', doctype);

            var replacement = null;
            if (data instanceof Document) {
                replacement = xml_doc.adoptNode(data.documentElement);
            } else {
                // assume 'data' is a node with HTML elements in it
                replacement = xml_doc.createDocumentFragment();
                data.childNodes.forEach(function(elem){
                    replacement.appendChild(xml_doc.importNode(elem, true));
                });
            }
            xml_doc.replaceChild(replacement, xml_doc.documentElement);

            doSomeMagic(xml_doc);
        }
    );
}

if (!('__canRender' in this)) {
    this['__canRender'] = canTransform(document);
}

function togglePageAction(isEnabled) {
    sendMessage({
        action: isEnabled ? 'xv.show-page-action' : 'xv.hide-page-action'
    });
}

// this code will be executed twice since original document will be replaced
// with Chrome's XML tree viewer. The real XML doc will have 'interactive' state,
// but replaced doc will have 'complete' state
document.addEventListener('readystatechange', function() {
    if (document.readyState == 'complete') {
        var webIntent = window.webkitIntent || window.intent;
        if (webIntent) {
            var url = webIntent.getExtra ? webIntent.getExtra('url') : webIntent.data[0].url;
            if (!url)
                return;

            renderPage(url);
            togglePageAction(false);
            return;
        }


        var el = document && document.getElementById('webkit-xml-viewer-source-xml');
        if (el) { // Chrome 12.x with native XML viewer
            el.parentNode.removeChild(el);
            doTransform(el);
            togglePageAction(false);
        } else if (__canRender) {
            renderPage();
            togglePageAction(false);
        } else {
            togglePageAction(true);
        }
    }
});
