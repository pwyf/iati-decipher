/*!
 * IATI Org File Visualiser
 * https://github.com/pwyf/iati-org-viz
 *
 * Copyright 2018 Publish What You Fund
 * Released under the MIT license
 * https://github.com/pwyf/iati-org-viz/blob/master/LICENSE.md
 */

var navbarSelect = function (id) {
  $('.nav li').each(function () {
    $(this).removeClass('active')
  })
  $('#' + id).parent().addClass('active')
  if (id.indexOf('budget') !== -1) {
    $('#show-budgets').parent().addClass('active')
    $('.second-navbar').show()
  } else {
    $('.second-navbar').hide()
  }
}

var addNotProvidedPopup = function ($el, name, isSingular) {
  var title = name + ' ' + (isSingular ? 'is' : 'are') + ' not provided in this file.'
  $el.attr('title', title)
    .attr('data-toggle', 'tooltip')
    .attr('data-placement', 'bottom')
    .parent()
    .addClass('disabled')
}

var sendMessage = function (obj) {
  return new Promise(function (resolve, reject) {
    chrome.runtime.sendMessage(obj, function (response) {
      resolve(response)
    })
  })
}

var setupMenus = function ($org) {
  var $el = null

  $('#show-summary').on('click', function () {
    navbarSelect('show-summary')
    showSummary($org)
    return false
  })

  // Total budget menu item
  if ($('total-budget', $org).length > 0) {
    $('#show-total-budget').on('click', function () {
      navbarSelect('show-total-budget')
      var graph = setupTotalBudget($org)
      graph.show()
      return false
    })
  } else {
    $el = $('#show-total-budget').on('click', function () {
      return false
    })
    addNotProvidedPopup($el, 'Total budgets', false)
  }

  // Org budget menu item
  if ($('recipient-org-budget', $org).length > 0) {
    $('#show-org-budgets').on('click', function () {
      navbarSelect('show-org-budgets')
      var graph = setupOrgBudget($org)
      graph.show()
      return false
    })
  } else {
    $el = $('#show-org-budgets').on('click', function () {
      return false
    })
    addNotProvidedPopup($el, 'Recipient organisation budgets', false)
  }

  // Region budget menu item
  if ($('recipient-region-budget', $org).length > 0) {
    $('#show-region-budgets').on('click', function () {
      navbarSelect('show-region-budgets')
      var graph = setupRegionBudget($org)
      graph.show()
      return false
    })
  } else {
    $el = $('#show-region-budgets').on('click', function () {
      return false
    })
    addNotProvidedPopup($el, 'Recipient region budgets', false)
  }

  // Country budget menu item
  if ($('recipient-country-budget', $org).length > 0) {
    $('#show-country-budgets').on('click', function () {
      navbarSelect('show-country-budgets')
      var graph = setupCountryBudget($org)
      graph.show()
      return false
    })
  } else {
    $el = $('#show-country-budgets').on('click', function () {
      return false
    })
    addNotProvidedPopup($el, 'Recipient country budgets', false)
  }

  // Total expenditure menu item
  if ($('total-expenditure', $org).length > 0) {
    $('#show-total-expenditure').on('click', function () {
      navbarSelect('show-total-expenditure')
      var graph = setupTotalExpenditure($org)
      graph.show()
      return false
    })
  } else {
    $el = $('#show-total-expenditure').on('click', function () {
      return false
    })
    addNotProvidedPopup($el, 'Total expenditure', true)
  }

  // Documents menu item
  if ($('document-link', $org).length > 0) {
    $('#show-documents').on('click', function () {
      navbarSelect('show-documents')
      showDocuments($org)
      return false
    })
  } else {
    $el = $('#show-documents').on('click', function () {
      return false
    })
    addNotProvidedPopup($el, 'Document links', false)
  }

  // Show budgets top level menu item
  if ($('.second-navbar li:not(.disabled)').length > 0) {
    $('#show-budgets').on('click', function () {
      $('.second-navbar li:not(.disabled) a').first().click()
      return false
    })
  } else {
    $('#show-budgets').on('click', function () {
      return false
    }).parent().addClass('disabled')
  }

  // Show d-portal top level menu item
  if ($('organisation-identifier, iati-identifier', $org).length > 0) {
    var orgId = getOrgId($org)
    var dportalUrl = 'http://d-portal.org/ctrack.html?search&publisher=' + orgId + '#view=main'
    $('#on-dportal').attr('href', dportalUrl)
  } else {
    addNotProvidedPopup($el, 'An organisation identifier', true)
  }

  // Exit button
  $('#exit').on('click', function () {
    window.location.reload()
    return false
  })
}

$(function () {
  var $datasets = $('.dataset-content')
  if ($datasets.length > 0) {
    // this is a dataset list page
    $datasets.each(function () {
      var $dataset = $(this)
      if ($('p a:contains("CSV")', $dataset).length === 0) {
        var downloadUrl = $('p a:contains("Download")', $dataset).attr('href')
        $('p a', $dataset).parent().append(' · ').append($('<a class="pwyf-org-viz-btn" data-download-url="' + downloadUrl + '" href="#">Visualise! <i class="icon-bar-chart"></i></a>'))
      }
    })
  } else {
    // this is a dataset metadata page
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
    sendMessage({action: 'msg.httprequest', url: chrome.extension.getURL('html/html.html')}).then(function (response) {
      // Add special crx hrefs
      response = response.replace(/{path:([^}]+)}/g, function (_, assetPath) {
        return chrome.extension.getURL(assetPath)
      })
      // Parse our template
      var newDom = new DOMParser().parseFromString(response, 'text/html').documentElement
      document.replaceChild(document.adoptNode(newDom), document.documentElement)
    })

    // Download the dataset
    sendMessage({action: 'msg.httprequest', url: downloadUrl}).then(function (response) {
      // Parse the dataset
      var xml = new DOMParser().parseFromString(response, 'application/xml')

      // if the root node is wrong, bail.
      if ($(':root', xml)[0].nodeName !== 'iati-organisations') {
        // TODO
        return
      }

      var $orgs = $('iati-organisations iati-organisation', xml)
      // TODO: add an org switcher if the file declares
      // multiple `iati-organisation`s. This is pretty unusual,
      // though
      var $org = $orgs.first()

      $('#download-xml').attr('href', downloadUrl)
      setupMenus($org)

      var orgId = getOrgId($org)
      var version = $('iati-organisations', xml).attr('version')
      var orgName = getOrgName($org, version)
      $('#org-name').text(orgName).append('&nbsp;').append($('<span class="badge" data-toggle="tooltip" title="' + orgId + '">?</span>'))
      $('[data-toggle="tooltip"]').tooltip()

      // Run the visualize app
      navbarSelect('show-summary')
      showSummary($org)

      $('#loading-spinner').hide()
    })

    return false
  })
})
