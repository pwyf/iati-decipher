chrome.runtime.onMessage.addListener(function (request, sender, reply) {
  switch (request.action) {
    case 'msg.httprequest':
      var xhr = new XMLHttpRequest()
      xhr.open('GET', request.url, true)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          reply({txt: xhr.responseText})
        }
      }
      xhr.send()
      break
  }
  return true
})
