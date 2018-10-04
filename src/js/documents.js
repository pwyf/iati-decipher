var showDocuments = function ($org, codelists) {
  var $page = $('<div class="container"><form autocomplete="off" id="document-search-form"><div class="form-group"><label for="search">Search documents</label><input autocomplete="off" class="form-control" type="text" placeholder="E.g. Annual report" id="document-search" /></div><div class="row"><div class="form-group col-sm-6"><label for="category-select">Filter by category</label><select class="form-control" id="category-select"></select></div><div class="form-group col-sm-6"><label for="country-select">Filter by country</label><select class="form-control" id="country-select"></select></div></div></form></div><div class="container"><h2></h2><div class="list-group"></div></div>')

  var pagination = '<nav aria-label="Page navigation"><ul class="pager"><li class="previous"><a href="#" class="prev-page"><span aria-hidden="true">&larr;</span> Previous page</a></li><li class="next"><a href="#" class="next-page">Next page <span aria-hidden="true">&rarr;</span></a></li></ul></nav>'
  $('.list-group', $page).after($(pagination)).before($(pagination))

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
      refreshDocuments($org, 1, codelists)
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
      refreshDocuments($org, 1, codelists)
    })
  } else {
    $categorySelect.prop('disabled', 'disabled')
  }

  $('#document-search', $page).on('keyup', function () {
    refreshDocuments($org, 1, codelists)
  })

  $('#document-search-form', $page).on('submit', function () {
    return false
  })

  $('.next-page, .prev-page', $page).on('click', function () {
    var page = $(this).data('page')
    refreshDocuments($org, page, codelists)
    return false
  })

  $('#main').html($page)
  refreshDocuments($org, 1, codelists)
}

var refreshDocuments = function ($org, page, codelists) {
  if (page < 1) { return }

  var maxResults = 20
  var dateOpts = {date: 'numeric', month: 'long', year: 'numeric'}

  var offset = (page - 1) * maxResults
  var cat = $('#category-select option:selected').val()
  var country = $('#country-select option:selected').val()
  var search = $('#document-search').val()

  $results = $('document-link', $org)
  if (cat) {
    $results = $results.filter(':has(category[code="' + cat + '"])')
  }
  if (country) {
    $results = $results.filter(':has(recipient-country[code="' + country + '"])')
  }
  if (search) {
    $results = $results.filter(':containsIN(' + search + ')')
  }
  var totalFiltered = $results.length

  // get the current page results
  var pageResults = _.chain($results)
    .drop(offset)
    .take(maxResults)
    .value()

  // don't show an empty page
  if (totalFiltered > 0 && pageResults.length === 0) {
    return
  }

  $('.list-group').html('')

  // pagination stuff
  if (page === 1) {
    $('.prev-page').prop('disabled', 'disabled')
      .parent().addClass('disabled')
  } else {
    $('.prev-page').prop('disabled', '')
      .parent().removeClass('disabled')
  }
  if (pageResults.length + offset === totalFiltered) {
    $('.next-page').prop('disabled', 'disabled')
      .parent().addClass('disabled')
  } else {
    $('.next-page').prop('disabled', '')
      .parent().removeClass('disabled')
  }
  $('.next-page').data('page', page + 1)
  $('.prev-page').data('page', page - 1)

  if (totalFiltered > 0) {
    $('h2').text('Showing ' + (offset + 1) + '-' + (offset + pageResults.length) + ' of ' + numeral(totalFiltered).format('0,') + ' document' + (totalFiltered === 1 ? '' : 's'))
    pageResults.forEach(function (item) {
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
        content.push('<dt>Publication date:</dt><dd>' + new Date(documentDate).toLocaleDateString('en-GB', dateOpts)) + '</dd>'
      }

      $('.list-group').append($('<a href="' + link + '" target="_blank" rel="noopener noreferrer" class="list-group-item"><h4 class="list-group-item-heading">' + title + '</h4><dl class="dl-horizontal">' + content.join('') + '</dl></a>'))
      $('.pager').show()
    })
  } else {
    $('.pager').hide()
    $('h2').text('No documents to show')
  }
}
