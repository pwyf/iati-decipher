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
  if (id.indexOf('budget') !== -1) {
    $('#show-budgets').parent().addClass('active')
    $('.second-navbar').show()
    $('body').css('padding-top', '14rem')
  } else {
    $('.second-navbar').hide()
    $('body').css('padding-top', '7rem')
  }
}

var setupMenus = function (html, $org) {
  // Total budget menu item
  if ($('total-budget', $org).length > 0) {
    $('#show-total-budget').on('click', function () {
      navbarSelect('show-total-budget')
      showTotalBudget($org)
      return false
    })
  } else {
    $('#show-total-budget').parent().addClass('disabled')
  }

  // Org budget menu item
  if ($('recipient-org-budget', $org).length > 0) {
    $('#show-org-budgets').on('click', function () {
      navbarSelect('show-org-budgets')
      showOrgBudgets($org)
      return false
    })
  } else {
    $('#show-org-budgets').parent().addClass('disabled')
  }

  // Region budget menu item
  if ($('recipient-region-budget', $org).length > 0) {
    $('#show-region-budgets').on('click', function () {
      navbarSelect('show-region-budgets')
      showRegionBudgets($org)
      return false
    })
  } else {
    $('#show-region-budgets').parent().addClass('disabled')
  }

  // Country budget menu item
  if ($('recipient-country-budget', $org).length > 0) {
    $('#show-country-budgets').on('click', function () {
      navbarSelect('show-country-budgets')
      showCountryBudgets($org)
      return false
    })
  } else {
    $('#show-country-budgets').parent().addClass('disabled')
  }

  // Total expenditure menu item
  if ($('total-expenditure', $org).length > 0) {
    $('#show-total-expenditure').on('click', function () {
      navbarSelect('show-total-expenditure')
      showTotalExpenditure($org)
      return false
    })
  } else {
    $('#show-total-expenditure').parent().addClass('disabled')
  }

  // Documents menu item
  if ($('document-link', $org).length > 0) {
    $('#show-documents').on('click', function () {
      navbarSelect('show-documents')
      showDocuments($org)
      return false
    })
  } else {
    $('#show-documents').parent().addClass('disabled')
  }

  // Show budgets top level menu item
  if ($('.second-navbar li:not(.disabled)').length > 0) {
    $('#show-budgets').on('click', function () {
      $('.second-navbar li:not(.disabled) a').first().click()
      return false
    })
  } else {
    $('#show-budgets').parent().addClass('disabled')
  }
}

$(function () {
  if (window.location.toString().split('/')[3] === 'publisher') {
    var $datasets = $('.dataset-content')
    if ($datasets.length > 0) {
      // this is a publisher page
      var searchStr = 'No. of Activities:'
      $datasets.each(function () {
        var $dataset = $(this)
        if ($dataset.text().indexOf(searchStr) === -1) {
          var downloadUrl = $('p a:contains("Download")', $dataset).attr('href')
          $('p a', $dataset).parent().append(' · ').append($('<a class="pwyf-org-viz-btn" data-download-url="' + downloadUrl + '" href="#">Visualise! <i class="icon-bar-chart"></i></a>'))
        }
      })
    }
  } else {
    // this is a dataset page
    //
    // Check dataset metadata has file type "Organisation"
    var fileType = $('section.additional-info th:contains("File Type")')
      .parent()
      .find('td.dataset-details')
      .text()
      .trim()
    // Check if metadata says it's an organisation file.
    if (fileType === 'Organisation') {
      // Find the download button on the page, and
      // get the dataset URL
      var downloadUrl = $('.resources .btn-primary').first().attr('href')

      // Inject a 'Visualise!' button onto the page
      var btns = $('.resources').find('li')
      btns.append(' · ').append($('<a href="#" data-download-url="' + downloadUrl + '" class="btn btn-danger pwyf-org-viz-btn"><i class="icon-bar-chart"></i> Visualise!</a>'))
    }
  }

  $('.pwyf-org-viz-btn', 'body').on('click', function () {
    var downloadUrl = $(this).data('download-url')

    // Fetch our template
    chrome.runtime.sendMessage({action: 'msg.httprequest', url: chrome.extension.getURL('html/html.html')}, function (response) {
      var txt = response.txt
      // Add special crx hrefs
      txt = txt.replace(/{path:([^}]+)}/g, function (_, assetPath) {
        return chrome.extension.getURL(assetPath)
      })
      // Save the current DOM, so we can recover it later
      var oldDom = document.documentElement
      // Parse our template
      var html = new DOMParser().parseFromString(txt, 'text/html')
      var newDom = html.documentElement
      document.replaceChild(document.adoptNode(newDom), document.documentElement)

      // Reset button
      $('#revert').on('click', function () {
        document.replaceChild(document.adoptNode(oldDom), document.documentElement)
        return false
      })

      // Download the dataset
      chrome.runtime.sendMessage({action: 'msg.httprequest', url: downloadUrl}, function (response) {
        // Parse the dataset
        var xml = new DOMParser().parseFromString(response.txt, 'application/xml')

        $('#loading-spinner').hide()

        // if the root node is wrong, bail.
        if ($(':root', xml)[0].nodeName !== 'iati-organisations') {
          return
        }

        var $orgs = $('iati-organisations iati-organisation', xml)
        // TODO: add an org switcher if the file declares
        // multiple `iati-organisation`s. This is pretty unusual,
        // though
        var $org = $orgs.first()

        setupMenus(html, $org)

        var version = $('iati-organisations', xml).attr('version')
        $('#org-name').text(getOrgName($org, version))

        // Run the visualize app
        navbarSelect('show-total-budget')
        showTotalBudget($org)
      })
    })

    return false
  })
})
