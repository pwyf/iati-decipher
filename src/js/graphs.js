var showOrgBudgets = function ($org) {
  var $orgBudgets = getBudgets($org, 'recipient-org-budget')
  var groupBy = {
    el: 'recipient-org',
    attr: 'code'
  }
  showGraph($orgBudgets, '', $org, groupBy)
}

var showRegionBudgets = function ($org) {
  var $regionBudgets = getBudgets($org, 'recipient-region-budget')
  var groupBy = {
    el: 'recipient-region',
    attr: 'code'
  }
  showGraph($regionBudgets, '', $org, groupBy)
}

var showCountryBudgets = function ($org) {
  var $countryBudgets = getBudgets($org, 'recipient-country-budget')
  var groupBy = {
    el: 'recipient-country',
    attr: 'code'
  }
  showGraph($countryBudgets, '', $org, groupBy)
}

var showTotalBudget = function ($org) {
  var $totalBudgets = getBudgets($org, 'total-budget')
  showGraph($totalBudgets, 'Total budget', $org)
}

var showTotalExpenditure = function ($org) {
  var $totalExpenditures = getBudgets($org, 'total-expenditure')
  showGraph($totalExpenditures, 'Total expenditure', $org)
}

var showGraph = function (data, title, $org, groupBy) {
  var defaultCurrency = $org.attr('default-currency')
  data.sort(function (a, b) {
    return (a.periodStart < b.periodStart) ? -1 : (a.periodStart > b.periodStart) ? 1 : 0
  })

  var labels = data.map(function (i) {
    return i.periodStart.format('MMM YYYY') + ' – ' + i.periodEnd.format('MMM YYYY')
  })

  $('#main').html($('<canvas id="chart"></canvas>'))

  var chart = new Chart('chart', {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        backgroundColor: '#F0CB69',
        data: data.map(function (i) {
          return i.val
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
            min: 0,
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
