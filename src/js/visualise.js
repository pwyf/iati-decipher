var showTotalBudget = function (xml) {
  var orgs = $('iati-organisations iati-organisation', xml)
  // TODO: add an org switcher if the file declares
  // multiple `iati-organisation`s. This is pretty unusual,
  // though
  var $currentOrg = $(orgs[0])
  var $totalBudgets = $('total-budget', $currentOrg)

  showGraph($totalBudgets, 'Total budget', $currentOrg)
}

var showTotalExpenditure = function (xml) {
  var orgs = $('iati-organisations iati-organisation', xml)
  // TODO: add an org switcher if the file declares
  // multiple `iati-organisation`s. This is pretty unusual,
  // though
  var $currentOrg = $(orgs[0])
  var $totalExpenditures = $('total-expenditure', $currentOrg)

  showGraph($totalExpenditures, 'Total expenditure', $currentOrg)
}

var showGraph = function ($data, title, $currentOrg) {
  var defaultCurrency = $currentOrg.attr('default-currency')
  var data = []

  $data.each(function () {
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

  var labels = data.map(function (i) {
    return i.start.format('MMM YYYY') + ' – ' + i.end.format('MMM YYYY')
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
