/*!
 * IATI Org File Visualiser
 * https://github.com/andylolz/iati-org-viz
 * Version: 0.0.1
 *
 * Copyright 2018 Andy Lulham
 * Released under the MIT license
 * https://github.com/andylolz/iati-org-viz/blob/master/LICENSE.md
 */

// Find the download button on the page
var el = document.getElementsByClassName('btn-primary')[0]
// Get the dataset URL
var xmlUrl = el.getAttribute('href')

// Inject a 'Visualise!' button onto the page
var btns = $('.resources').find('li')
btns.append(' · ').append($('<a id="pwyf-org-viz-btn" href="#" class="btn btn-danger disabled"><i class="icon-bar-chart"></i> Visualise!</a>'))

// Save the current DOM, so we can recover it later
var oldDom = document.documentElement

// Download the dataset
chrome.runtime.sendMessage({action: 'msg.httprequest', url: xmlUrl}, function (response) {
  // Parse the dataset
  var xml = new DOMParser().parseFromString(response.txt, 'application/xml')
  // Fetch our template
  chrome.runtime.sendMessage({action: 'msg.httprequest', url: chrome.extension.getURL('html/html.html')}, function (response) {
    // Parse our template
    var html = new DOMParser().parseFromString(response.txt, 'text/html')
    var newDom = html.documentElement
    // Inject the CSS, because it needs a special crx href
    $('link', html).attr('href', chrome.extension.getURL('css/css.css'))

    $('#pwyf-org-viz-btn', 'body').on('click', function () {
      document.replaceChild(document.adoptNode(newDom), document.documentElement)
      // Run the visualize app
      doGraphs(xml)
      return false
    }).removeClass('disabled')
  })
})
