var runApp = function (xml) {
  var orgs = $('iati-organisations iati-organisation', xml)
  // TODO: add an org switcher if the file declares
  // multiple `iati-organisation`s
  var $currentOrg = $(orgs[0])

  var defaultCurrency = $currentOrg.attr('default-currency')
  var xLabels = []
  var data = []

  $('total-budget', $currentOrg).each(function () {
    var $this = $(this)
    var start = moment($('period-start', $this).attr('iso-date'))
    var end = moment($('period-end', $this).attr('iso-date'))
    if (!(start.isValid() || end.isValid())) {
      return
    }
    var label = start.format('MMM YYYY') + ' – ' + end.format('MMM YYYY')
    xLabels.push(label)
    var d = $('> value', $this).text()
    data.push(d)
  })

  var ctx = $('#chart')[0].getContext('2d')
  var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: xLabels,
      datasets: [{
        label: 'Total budget',
        data: data
      }]
    },
    options: {
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[0].label
            return label + ': ' + commify(tooltipItem.xLabel) + ' ' + defaultCurrency
          }
        }
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            callback: function (value) {
              return commify(value) + ' ' + defaultCurrency
            }
          }
        }]
      }
    }
  })
}
