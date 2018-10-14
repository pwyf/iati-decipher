$.extend($.expr[':'], {
  'containsIN': function (elem, i, match, array) {
    return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0
  }
})

var getOrgName = function ($org, version) {
  var $names
  if (version[0] === '2') {
    $names = $('name narrative', $org)
  } else {
    $names = $('name', $org)
  }
  return $names.first().text()
}

var getOrgId = function ($org) {
  return $('organisation-identifier, iati-identifier', $org)
    .first()
    .text()
}
