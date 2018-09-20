var showDocuments = function (xml) {
  var $page = $('<div class="container"><input class="typeahead form-control" type="text" placeholder="Search documents..."></div>')
  $documentLinks = $('document-link', xml)

  var docs = [];
  $documentLinks.each(function () {
    var $this = $(this)
    var link = $this.attr('url')
    // TODO: not really v2.0x compatible.
    var title = $('title', $this).text()
    var category = $('category', $this).attr('code')
    docs.push({
      title: title,
      link: link,
      category: category
    })
  })
  $('#main').html($page)

  var matcher = function (docs) {
    return function (q, cb) {
      var matches

      // an array that will be populated with substring matches
      matches = []

      // regex used to determine if a string contains the substring `q`
      var substrRegex = new RegExp(q, 'i')

      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(docs, function (i, str) {
        if (substrRegex.test(str.title)) {
          matches.push(str)
        } else if (substrRegex.test(str.category)) {
          matches.push(str)
        }
      })

      cb(matches)
    }
  }

  $('.typeahead').typeahead({
    hint: true,
    highlight: true
  },
  {
    name: 'documents',
    source: matcher(docs),
    display: 'title',
    templates: {
      suggestion: function (suggestion) {
        return [
          '<a href="' + suggestion.link + '" ',
          'target="_blank" rel="noopener noreferrer">',
          suggestion.title,
          '<br>',
          'Category: ' + suggestion.category,
          '</a>'
        ].join('\n')
      }
    }
  })
}
