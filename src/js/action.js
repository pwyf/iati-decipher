/*!
 * IATI Decipher
 * https://github.com/pwyf/iati-decipher
 *
 * Copyright 2018 Publish What You Fund
 * Released under the MIT license
 * https://github.com/pwyf/iati-decipher/blob/master/LICENSE.md
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
  var title = name + ' ' + (isSingular ? 'is' : 'are') + ' not provided by this publisher.'
  $el.attr('title', title)
    .attr('data-toggle', 'tooltip')
    .attr('data-placement', 'bottom')
    .parent()
    .addClass('disabled')
}

var sendMessage = function (obj) {
  return new Promise(function (resolve, reject) {
    chrome.runtime.sendMessage(obj, function (response) {
      if (response && response.success === true) {
        resolve(response.message)
      } else {
        reject(Error(response.message))
      }
    })
  })
}

var setupMenus = function ($org, codelists, metadata) {
  var $el = null

  $('#show-summary').on('click', function () {
    navbarSelect('show-summary')
    showSummary($org, metadata)
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
    $('#show-recipient-organisation-budget').on('click', function () {
      navbarSelect('show-recipient-organisation-budget')
      var graph = setupOrgBudget($org)
      graph.show()
      return false
    })
  } else {
    $el = $('#show-recipient-organisation-budget').on('click', function () {
      return false
    })
    addNotProvidedPopup($el, 'Recipient organisation budgets', false)
  }

  // Region budget menu item
  if ($('recipient-region-budget', $org).length > 0) {
    $('#show-recipient-region-budget').on('click', function () {
      navbarSelect('show-recipient-region-budget')
      var graph = setupRegionBudget($org, codelists)
      graph.show()
      return false
    })
  } else {
    $el = $('#show-recipient-region-budget').on('click', function () {
      return false
    })
    addNotProvidedPopup($el, 'Recipient region budgets', false)
  }

  // Country budget menu item
  if ($('recipient-country-budget', $org).length > 0) {
    $('#show-recipient-country-budget').on('click', function () {
      navbarSelect('show-recipient-country-budget')
      var graph = setupCountryBudget($org, codelists)
      graph.show()
      return false
    })
  } else {
    $el = $('#show-recipient-country-budget').on('click', function () {
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
    $('#show-document-link').on('click', function () {
      navbarSelect('show-document-link')
      showDocuments($org, codelists)
      return false
    })
  } else {
    $el = $('#show-document-link').on('click', function () {
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
    $el = $('#show-budgets').on('click', function () {
      return false
    })
    addNotProvidedPopup($el, 'Budgets', false)
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
  var datasetName = null
  var downloadUrl = null
  var $datasets = $('.dataset-content')
  if ($datasets.length > 0) {
    // this is a dataset list page
    $datasets.each(function () {
      var $dataset = $(this)
      if ($('p a:contains("CSV")', $dataset).length === 0) {
        downloadUrl = $('p a:contains("Download")', $dataset).attr('href')
        datasetName = $('p a:contains("View Metadata")', $dataset).attr('href').split('/').pop()
        $('p a', $dataset).parent().append(' · ').append($('<a class="pwyf-org-viz-btn" data-dataset-name="' + datasetName + '" data-download-url="' + downloadUrl + '" href="#">Visualise <i class="icon-bar-chart"></i></a>'))
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
      datasetName = window.location.pathname.split('/').pop()
      // Find the download button on the page, and
      // get the dataset URL
      downloadUrl = $('.resources .btn-primary').first().attr('href')

      // Inject a 'Visualise' button onto the page
      var btns = $('.resources').find('li')
      btns.append(' · ').append($('<a href="#" data-dataset-name="' + datasetName + '" data-download-url="' + downloadUrl + '" class="btn btn-danger pwyf-org-viz-btn"><i class="icon-bar-chart"></i> Visualise</a>'))
    }
  }

  $('body').on('click', '.pwyf-org-viz-btn', function () {
    var downloadUrl = $(this).data('download-url')
    var datasetName = $(this).data('dataset-name')
    var codelistFiles = ['Country', 'Region', 'Language', 'DocumentCategory']

    // Fetch our template
    var xmlPromise = sendMessage({action: 'msg.httprequest', url: chrome.extension.getURL('html/html.html'), proxy: false})
      .then(function (response) {
        // Add special crx hrefs
        response = response.replace(/{path:([^}]+)}/g, function (_, assetPath) {
          return chrome.extension.getURL(assetPath)
        })
        // Parse our template
        var newDom = new DOMParser().parseFromString(response, 'text/html').documentElement
        document.replaceChild(document.adoptNode(newDom), document.documentElement)
      })
      .then(function () {
        // Download the dataset
        return sendMessage({action: 'msg.httprequest', url: downloadUrl})
      })
      .then(function (response) {
        // Parse the dataset
        var xml = new DOMParser().parseFromString(response, 'application/xml')

        if ($(':root', xml)[0].nodeName !== 'iati-organisations') {
          // if the root node is wrong, bail.
          return Promise.reject(Error('Not a valid IATI organisation file'))
        }
        return Promise.resolve(xml)
      })

    var codelistsPromise = xmlPromise.then(function (xml) {
      return Promise.all(
        codelistFiles.map(function (codelistFile) {
          var jsonUrl = chrome.extension.getURL('json/' + codelistFile + '.json')
          return sendMessage({action: 'msg.jsonrequest', url: jsonUrl, proxy: false})
        }))
        .then(function (codelistDataArr) {
          var codelists = {}
          codelistDataArr.forEach(function (codelistData, i) {
            var data = codelistData.data
            if (codelistFiles[i] === 'DocumentCategory') {
              data = data.filter(function (codelistItem) {
                return codelistItem.category === 'B'
              })
            }
            codelists[codelistFiles[i]] = data.reduce(function (codelist, codelistItem) {
              codelist[codelistItem.code] = codelistItem.name
              return codelist
            }, {})
          })
          return Promise.resolve(codelists)
        })
    })

    // var datasetMetaPromise = xmlPromise.then(function (xml) {
    //   var datasetMetaUrl = 'https://iatiregistry.org/api/3/action/package_show?id=' + datasetName
    //   return sendMessage({action: 'msg.jsonrequest', url: datasetMetaUrl})
    // })

    // var publisherMetaPromise = datasetMetaPromise.then(function (datasetMeta) {
    //   if (!datasetMeta.success) {
    //     return Promise.reject(Error('Failed to fetch dataset metadata from the IATI registry'))
    //   }
    //   var orgName = datasetMeta.result.organization.name
    //   var orgMetaUrl = 'https://iatiregistry.org/api/3/action/organization_show?id=' + orgName
    //   return sendMessage({action: 'msg.jsonrequest', url: orgMetaUrl})
    // })

    Promise.all([xmlPromise, codelistsPromise/*, datasetMetaPromise, publisherMetaPromise */])
      .then(function (args) {
        var xml = args[0]
        var codelists = args[1]
        var metadata = {
          // dataset: args[2].result,
          // publisher: args[3].result
        }
        var $orgs = $('iati-organisations iati-organisation', xml)
        // TODO: add an org switcher if the file declares
        // multiple `iati-organisation`s. This is pretty unusual,
        // though
        var $org = $orgs.first()

        $('#view-xml').attr('href', downloadUrl)
        setupMenus($org, codelists, metadata)

        var version = $('iati-organisations', xml).attr('version')
        var orgName = getNarrative('name', $org, version)
        $('#org-name').text(orgName)
        $('[data-toggle="tooltip"]').tooltip()

        // Run the visualize app
        navbarSelect('show-summary')
        showSummary($org, metadata)

        $('#mega-spinner').fadeOut()
      })
      .catch(function (err) {
        alert('An error occurred: ' + err.message)
        window.location.reload()
      })

    return false
  })
})
