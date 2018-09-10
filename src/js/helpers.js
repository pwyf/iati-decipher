numeral.register('locale', 'pwyf', {
  delimiters: {
    thousands: ',',
    decimal: '.'
  },
  abbreviations: {
    thousand: 'thousand',
    million: 'million',
    billion: 'billion',
    trillion: 'trillion'
  },
  ordinal: function () {
    return ''
  },
  currency: {
    symbol: ''
  }
})
numeral.locale('pwyf')
