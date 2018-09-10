var runApp = function (xml) {
  var orgs = $('iati-organisations iati-organisation', xml)
  // TODO: add an org switcher if the file declares
  // multiple `iati-organisation`s
  var $currentOrg = $(orgs[0])

  var defaultCurrency = $currentOrg.attr('default-currency')
  var data = []

  $('total-budget', $currentOrg).each(function () {
    var $this = $(this)
    var start = moment($('period-start', $this).attr('iso-date'))
    var end = moment($('period-end', $this).attr('iso-date'))
    if (start.isValid() && end.isValid()) {
      var value = $('> value', $this).text()
      data.push({
        start: start,
        end: end,
        value: value
      })
    }
  })
  data.sort(function (a, b) {
    return (a.start < b.start) ? -1 : (a.start > b.start) ? 1 : 0
  })

  var chart = new Chart('chart', {
    type: 'bar',
    data: {
      labels: data.map(function (i) {
        return i.start.format('MMM YYYY') + ' – ' + i.end.format('MMM YYYY')
      }),
      datasets: [{
        label: 'Total budget',
        data: data.map(function (i) {
          return i.value
        })
      }]
    },
    options: {
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[0].label
            var val = numeral(tooltipItem.yLabel).format('0.00 a')
            return label + ': ' + val + ' ' + defaultCurrency
          }
        }
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            callback: function (value) {
              var val = numeral(value).format('0 a')
              return val + ' ' + defaultCurrency
            }
          }
        }]
      }
    }
  })
}
