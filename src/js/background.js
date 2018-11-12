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
        if (responseType === 'json') {
          resolve(req.response)
        } else {
          resolve(req.responseText)
        }
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText + ' (' + req.status + ')'))
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
  if (request.action === 'msg.opentab') {
    chrome.tabs.create({url: request.url})
    return true
  }
  var responseType = null
  if (request.action === 'msg.jsonrequest') {
    responseType = 'json'
  } else {
    responseType = 'xml'
  }
  get(request.url, responseType).then(function (response) {
    reply({success: true, message: response})
  }).catch(function (err) {
    reply({success: false, message: err.message})
  })

  return true
})
