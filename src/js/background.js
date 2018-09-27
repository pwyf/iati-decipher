chrome.runtime.onMessage.addListener(function (request, sender, reply) {
  var xhr = new XMLHttpRequest()
  if (request.action === 'msg.jsonrequest') {
    xhr.responseType = 'json'
  }
  xhr.open('GET', request.url, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (request.action === 'msg.httprequest') {
        reply(xhr.responseText)
      } else if (request.action === 'msg.jsonrequest') {
        reply(xhr.response)
      }
    }
  }
  xhr.send()
  return true
})
