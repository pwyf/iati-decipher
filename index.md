---
layout: layout
---
# IATI Org File Visualiser

## How to use

 1. [![IATI Org File Visualiser](static/img/bookmarklet.png)](javascript:void(function(){var%20el=document&&document.getElementById('webkit-xml-viewer-source-xml');if(el){el.parentNode.removeChild(el);}var%20xhr=new%20XMLHttpRequest();xhr.open('GET','https://andylolz.github.io/iati-org-viz/wateraid-org.xml',false);xhr.send();var%20data=xhr.responseXML;var%20xmlhttp=new%20XMLHttpRequest();xmlhttp.open('GET','https://andylolz.github.io/iati-org-viz/static/html/html.html',false);xmlhttp.send();var%20htmlString=xmlhttp.response;var%20parser=new%20DOMParser();var%20result=parser.parseFromString(htmlString,'text/html');document.replaceChild(document.adoptNode(result.documentElement),document.documentElement);var%20sc=document.createElement('script');sc.setAttribute('src','https://andylolz.github.io/iati-org-viz/static/js/js.js');document.documentElement.appendChild(sc);})();)
 2. Find a publisher’s org file on [the IATI registry](https://iatiregistry.org/) e.g. [this one](https://iatiregistry.org/dataset/wateraid-org)
 3. View it in your browser
 4. Click the bookmarklet, and BEHOLD.
