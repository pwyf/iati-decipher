var html = null

function loadHTML (url) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      html = xhr.responseText
    }
  }
  xhr.send()
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case 'msg.get-html':
      if (html === null) {
        loadHTML(request.filePath)
      }
      sendResponse({fileText: html})
      break
    case 'msg.show-page-action':
      chrome.pageAction.show(sender.tab.id)
      break
    case 'msg.hide-page-action':
      chrome.pageAction.hide(sender.tab.id)
      break
    case 'msg.do-cool-stuff':
      chrome.tabs.executeScript({
        file: 'js/chart.js'
      })
      break
  }
})

loadHTML('../html/html.html')
