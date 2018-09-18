/*!
 * IATI Org File Visualiser
 * https://github.com/pwyf/iati-org-viz
 * Version: 0.0.1
 *
 * Copyright 2018 Publish What You Fund
 * Released under the MIT license
 * https://github.com/pwyf/iati-org-viz/blob/master/LICENSE.md
 */

var navbarSelect = function (id) {
  $('.navbar-nav li').each(function () {
    $(this).removeClass('active')
  })
  $('#' + id).parent().addClass('active')
}

$(function () {
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

    // if the root node is wrong, bail.
    if ($(':root', xml)[0].nodeName !== 'iati-organisations') {
      return
    }

    // Fetch our template
    chrome.runtime.sendMessage({action: 'msg.httprequest', url: chrome.extension.getURL('html/html.html')}, function (response) {
      var txt = response.txt
      // Add special crx hrefs
      txt = txt.replace(/{path:([^}]+)}/g, function (_, assetPath) {
        return chrome.extension.getURL(assetPath)
      })
      // Parse our template
      var html = new DOMParser().parseFromString(txt, 'text/html')
      var newDom = html.documentElement

      // Total budget menu item
      $('#show-total-budget', $('body', html)).on('click', function () {
        navbarSelect('show-total-budget')
        showTotalBudget(xml)
        return false
      })

      $('#show-documents', $('body', html)).on('click', function () {
        navbarSelect('show-documents')
        showDocuments(xml)
        return false
      })

      // Reset button
      $('#revert', $('body', html)).on('click', function () {
        document.replaceChild(document.adoptNode(oldDom), document.documentElement)
        return false
      })

      $('#pwyf-org-viz-btn', 'body').on('click', function () {
        document.replaceChild(document.adoptNode(newDom), document.documentElement)
        // Run the visualize app
        navbarSelect('show-total-budget')
        showTotalBudget(xml)
        return false
      }).removeClass('disabled')
    })
  })
})
