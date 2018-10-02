var get = function (url, responseType) {
  // Return a new promise.
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest()
    if (responseType === 'json') {
      req.responseType = responseType
    }
    req.open('GET', url)

    req.onload = function () {
      // This is called even on 404 etc
      // so check the status
      if (req.status === 200) {
        // Resolve the promise with the response text
        resolve(req)
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText))
      }
    }

    // Handle network errors
    req.onerror = function () {
      reject(Error('Network Error'))
    }

    // Make the request
    req.send()
  })
}

chrome.runtime.onMessage.addListener(function (request, sender, reply) {
  var responseType = null
  if (request.action === 'msg.jsonrequest') {
    responseType = 'json'
  }
  get(request.url, responseType).then(function (response) {
    if (request.action === 'msg.httprequest') {
      reply(response.responseText)
    } else if (request.action === 'msg.jsonrequest') {
      reply(response.response)
    }
  })

  return true
})
