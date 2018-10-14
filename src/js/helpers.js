$.extend($.expr[':'], {
  'containsIN': function (elem, i, match, array) {
    return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0
  }
})

// numeral.register('locale', 'pwyf', {
//   delimiters: {
//     thousands: ',',
//     decimal: '.'
//   },
//   abbreviations: {
//     thousand: 'thousand',
//     million: 'million',
//     billion: 'billion',
//     trillion: 'trillion'
//   },
//   ordinal: function () {
//     return ''
//   },
//   currency: {
//     symbol: ''
//   }
// })
// numeral.locale('pwyf')

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
