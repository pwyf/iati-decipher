var get=function(e,n){return new Promise(function(s,t){var o=new XMLHttpRequest;"json"===n&&(o.responseType=n),o.open("GET",e),o.onload=function(){200===o.status?s("json"===n?o.response:o.responseText):t(Error(o.statusText+" ("+o.status+")"))},o.onerror=function(){t(Error("Network Error"))},o.send()})},chrome={extension:{getURL:function(e){return e}},runtime:{sendMessage:function(e,n){var s="xml";"msg.jsonrequest"===e.action&&(s="json"),get(e.url,s).then(function(e){n({success:!0,message:e})}).catch(function(e){n({success:!1,message:e.message})})}}};