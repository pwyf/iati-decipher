---
layout: layout
---
# IATI Org File Visualiser

## How to use

 1. [![IATI Org File Visualiser](static/img/bookmarklet.png)](javascript:void(function(){var%20el=document&&document.getElementById('webkit-xml-viewer-source-xml');if(el){el.parentNode.removeChild(el);}var%20xhr=new%20XMLHttpRequest();xhr.open('GET',location.href,false);xhr.send();var%20data=xhr.responseXML;var%20xmlhttp=new%20XMLHttpRequest();xmlhttp.open('GET','https://andylolz.github.io/iati-org-viz/static/xsl/xsl.xsl',false);if(xmlhttp.overrideMimeType){xmlhttp.overrideMimeType('text/xml');}xmlhttp.send();var%20xslDoc=xmlhttp.responseXML;var%20xslProc=new%20XSLTProcessor();xslProc.importStylesheet(xslDoc);var%20result=xslProc.transformToDocument(data);document.replaceChild(document.adoptNode(result.documentElement),document.documentElement);var%20sc=document.createElement('script');sc.setAttribute('src','https://andylolz.github.io/iati-org-viz/static/js/js.js');document.documentElement.appendChild(sc);})();)
 2. Find a publisher’s org file on [the IATI registry](https://iatiregistry.org/) e.g. [this one](https://iatiregistry.org/dataset/wateraid-org)
 3. View it in your browser
 4. Click the bookmarklet, and BEHOLD.
