var showDocuments = function ($org, codelists) {
  var $page = $('<div class="container"><form autocomplete="off" id="document-search-form"><div class="form-group"><label for="search">Search documents</label><input autocomplete="off" class="form-control" type="text" placeholder="E.g. Annual report" id="document-search" /></div><div class="row"><div class="form-group col-sm-6"><label for="category-select">Filter by category</label><select class="form-control" id="category-select"></select></div><div class="form-group col-sm-6"><label for="country-select">Filter by country</label><select class="form-control" id="country-select"></select></div></div></form></div><div class="container"><h2></h2><div class="list-group"></div></div>')

  var $recipientCountries = $('document-link recipient-country', $org)
  var $countrySelect = $('#country-select', $page)
  if ($recipientCountries.length > 0) {
    var recipientCountries = _.chain($recipientCountries).uniq(function (item) {
      return $(item).attr('code')
    }).map(function (item) {
      var $item = $(item)
      var attr = $item.attr('code')
      var txt = $('narrative', $item).first().text() // TODO
      return {
        attr: attr,
        text: txt || codelists.Country[attr] || attr
      }
    }).sortBy(function (item) {
      return item.text
    }).value()

    $countrySelect.append($('<option value="">All countries</option>'))
    recipientCountries.forEach(function (item) {
      $countrySelect.append($('<option value="' + item.attr + '">' + item.text + '</option>'))
    })
    $countrySelect.on('change', function () {
      refreshDocuments($org, codelists)
    })
  } else {
    $countrySelect.prop('disabled', 'disabled')
  }

  var $categories = $('document-link category', $org)
  var $categorySelect = $('#category-select', $page)
  if ($categories.length > 0) {
    var categories = _.chain($categories).uniq(function (item) {
      return $(item).attr('code')
    }).map(function (item) {
      var $item = $(item)
      var attr = $item.attr('code')
      var txt = codelists.DocumentCategory[attr]
      if (txt) {
        txt = txt + ' (' + attr + ')'
      } else {
        txt = attr
      }
      return {
        attr: attr,
        text: txt
      }
    }).sortBy(function (item) {
      return item.text
    }).value()

    $categorySelect.append($('<option value="">All categories</option>'))
    categories.forEach(function (item) {
      $categorySelect.append($('<option value="' + item.attr + '">' + item.text + '</option>'))
    })
    $categorySelect.on('change', function () {
      refreshDocuments($org, codelists)
    })
  } else {
    $categorySelect.prop('disabled', 'disabled')
  }

  $('#document-search', $page).on('keyup', function () {
    refreshDocuments($org, codelists)
  })

  $('#document-search-form', $page).on('submit', function () {
    return false
  })

  $('#main').html($page)
  refreshDocuments($org, codelists)
}

var refreshDocuments = function ($org, codelists) {
  $('.list-group').html('')
  var maxResults = 20
  var cat = $('#category-select option:selected').val()
  var country = $('#country-select option:selected').val()
  var search = $('#document-search').val()

  var query = 'document-link'
  if (cat) {
    query += ':has(category[code="' + cat + '"])'
  }
  if (country) {
    query += ':has(recipient-country[code="' + country + '"])'
  }
  if (search) {
    query += ':containsIN("' + search + '")'
  }
  $results = $(query, $org)
  var totalFiltered = $results.length
  var totalPage = _.min([totalFiltered, maxResults])
  if (totalFiltered > 0) {
    $('h2').text('Showing 1-' + totalPage + ' of ' + numeral(totalFiltered).format('0,') + ' document' + (totalFiltered === 1 ? '' : 's'))
    _.chain($results).first(maxResults)
      .each(function (item) {
        var $item = $(item)
        var link = $item.attr('url')
        // TODO: not really v2.0x compatible.
        var title = $('title', $item).first().text()
        // TODO: deal with multiple categories
        var category = $('category', $item).attr('code')
        if (codelists.DocumentCategory[category]) {
          category = codelists.DocumentCategory[category] + ' (' + category + ')'
        }
        // TODO: deal with multiple recipient countries
        var recipientCountry = $('recipient-country', $item).first()
        var description = $('description narrative', $item).first().text()
        // TODO: deal with multiple languages
        var language = $('language', $item).attr('code')
        var documentDate = $('document-date', $item).attr('iso-date')

        var content = ['<dt>Category:</dt><dd>' + category + '</dd>']
        if (recipientCountry.length > 0) {
          var recipientCountryCode = recipientCountry.attr('code')
          recipientCountry = recipientCountry.text() || codelists.Country[recipientCountryCode] || recipientCountryCode
          content.push('<dt>Recipient country:</dt><dd>' + recipientCountry + '</dd>')
        }
        if (description) {
          content.push('<dt>Description:</dt><dd>' + description + '</dd>')
        }
        if (language) {
          language = codelists.Language[language] || language
          content.push('<dt>Language:</dt><dd>' + language + '</dd>')
        }
        if (documentDate) {
          content.push('<dt>Publication date:</dt><dd>' + moment(documentDate).format('D MMMM YYYY')) + '</dd>'
        }

        $('.list-group').append($('<a href="' + link + '" target="_blank" rel="noopener noreferrer" class="list-group-item"><h4 class="list-group-item-heading">' + title + '</h4><dl class="dl-horizontal">' + content.join('') + '</dl></a>'))
      })
  } else {
    $('h2').text('No documents to show')
  }
}
