var showDocuments = function ($org) {
  var $page = $('<form class="container"><div class="form-group"><label for="search">Search documents</label><input class="form-control" type="text" placeholder="E.g. Annual report" id="document-search" /></div><div class="row"><div class="form-group col-sm-6"><label for="category-select">Filter by category</label><select class="form-control" id="category-select"></select></div><div class="form-group col-sm-6"><label for="country-select">Filter by country</label><select class="form-control" id="country-select"></select></div></div></form><div class="container"><h2></h2><div class="list-group"></div></div>')

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
        text: txt || attr
      }
    }).sortBy(function (item) {
      return item.text
    }).value()

    $countrySelect.append($('<option value="">All countries</option>'))
    _.each(recipientCountries, function (item) {
      $countrySelect.append($('<option value="' + item.attr + '">' + item.text + '</option>'))
    })
    $countrySelect.on('change', function () {
      refreshDocuments($org)
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
      var txt = null
      return {
        attr: attr,
        text: txt || attr
      }
    }).sortBy(function (item) {
      return item.text
    }).value()

    $categorySelect.append($('<option value="">All categories</option>'))
    _.each(categories, function (item) {
      $categorySelect.append($('<option value="' + item.attr + '">' + item.text + '</option>'))
    })
    $categorySelect.on('change', function () {
      refreshDocuments($org)
    })
  } else {
    $categorySelect.prop('disabled', 'disabled')
  }

  $('#document-search', $page).on('keyup', function () {
    refreshDocuments($org)
  })

  $('#main').html($page)
}

var refreshDocuments = function ($org) {
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
  var totalFiltered = _.min([$results.length, maxResults])
  var totalDocuments = numeral($('document-link', $org).length).format('0,')
  $('.list-group').html('')
  if (totalFiltered > 0) {
    $('h2').text('Showing 1-' + totalFiltered + ' of ' + totalDocuments + ' documents')
    _.chain($results).first(maxResults)
      .each(function (item) {
        var $item = $(item)
        var link = $item.attr('url')
        // TODO: not really v2.0x compatible.
        var title = $('title', $item).text()
        var category = $('category', $item).attr('code')
        $('.list-group').append($('<a href="' + link + '" target="_blank" rel="noopener noreferrer" class="list-group-item"><h4 class="list-group-item-heading">' + title + '</h4><p class="list-group-item-text">Category: ' + category + '</p></a>'))
      })
  } else {
    $('h2').text('No documents to show')
  }
}
