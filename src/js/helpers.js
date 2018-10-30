$.extend($.expr[':'], {
  'containsIN': function (elem, i, match, array) {
    return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0
  }
})

var getNarrative = function (el, $org, version, language) {
  var defaultLanguage = $org.attr('xml:lang')
  language = language || defaultLanguage || 'en'
  var $els
  if (version[0] === '2') {
    $els = $(el + ' narrative', $org)
  } else {
    $els = $(el, $org)
  }
  return $els.first().text()
}

var getOrgId = function ($org) {
  return $('organisation-identifier, iati-identifier', $org)
    .first()
    .text()
}
