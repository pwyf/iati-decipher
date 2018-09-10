var runApp = function (xml) {
  var orgs = $('iati-organisations iati-organisation', xml)
  var $currentOrg = orgs[0]

  var xLabels = []
  var data = []

  console.log(moment)

  $('total-budget', $currentOrg).each(function () {
    $this = $(this)
    console.log($this)
    var start = moment($('period-start', $this).attr('iso-date'))
    var end = moment($('period-end', $this).attr('iso-date'))
    if (!(start.isValid() || end.isValid())) {
      return
    }
    console.log(end > start)
    var label = start.format('MMM YYYY') + ' – ' + end.format('MMM YYYY')
    xLabels.push(label)
    var d = $('> value', $this).text()
    data.push(d)
    console.log(d)
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
      legend: {
        display: false
      }
    }
  })
}
