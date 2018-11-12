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

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
