/*!
 * IATI Org File Visualiser
 * https://github.com/andylolz/iati-org-viz
 * Version: 0.0.1
 *
 * Copyright 2018 Andy Lulham
 * Released under the MIT license
 * https://github.com/andylolz/iati-org-viz/blob/master/LICENSE.md
 */

var el = document.getElementsByClassName('btn-primary')[0]
var xmlUrl = el.getAttribute('href')

var btns = $('.resources').find('li')
btns.append(' · ').append($('<a id="pwyf-org-viz-btn" href="#" class="btn btn-danger disabled"><i class="icon-bar-chart"></i> Visualize!</a>'))

var oldDom = document.documentElement

chrome.runtime.sendMessage({action: 'msg.httprequest', url: xmlUrl}, function (response) {
  var xml = new DOMParser().parseFromString(response.txt, 'application/xml')
  chrome.runtime.sendMessage({action: 'msg.httprequest', url: chrome.extension.getURL('html/html.html')}, function (response) {

    var html = new DOMParser().parseFromString(response.txt, 'text/html')
    var newDom = html.documentElement
    $('link', html).attr('href', chrome.extension.getURL('css/css.css'))

    $('#pwyf-org-viz-btn', 'body').on('click', function () {
      document.replaceChild(document.adoptNode(newDom), document.documentElement)
      doGraphs(xml)
      return false
    }).removeClass('disabled')
  })
})
