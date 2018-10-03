function TimeGraph ($org, options) {
  var self = this
  self.$org = $org
  self.title = options.title
  self.el = options.el
  self.filter = options.filter
  self.breakdown = options.breakdown
  self.currency = $org.attr('default-currency')
  self.language = $org.attr('xml:lang')
  self.chart = null

  if (self.statuses().length > 1) {
    // TODO
    // We need a status filter
  }

  var $filter = null
  var $breakdown = null
  if (self.filter) {
    var filterCats = self.filterCats()
    $filter = $('<div class="form-group col-sm-6"><label for="filter-select">Filter by ' + self.filter.name + '</label><select class="form-control" id="filter-select"></select></div>')
    var $filterSelect = $('#filter-select', $filter)
    filterCats.forEach(function (item) {
      $filterSelect.append($('<option value="' + item.attr + '">' + item.text + '</option>'))
    })
    $filterSelect.on('change', function () {
      self.show()
    })
  }

  var breakdownCats = self.breakdownCats()
  if (breakdownCats.length > 0) {
    $breakdown = $('<div class="form-group col-sm-6"><label for="breakdown-select">Filter by ' + self.breakdown.name + '</label><select class="form-control" id="breakdown-select"><option value="">Show all</option></select></div>')
    var $breakdownSelect = $('#breakdown-select', $breakdown)
    breakdownCats.forEach(function (item) {
      $breakdownSelect.append($('<option data-value-field="' + item.valueField + '" value="' + item.attr + '">' + item.text + '</option>'))
    })
    $breakdownSelect.on('change', function () {
      self.show()
    })
  }

  $('#main').html('')

  if ($filter || $breakdown) {
    var $controlForm = $('<form class="container"><div class="row"></div></form>')
    var $controlRow = $('.row', $controlForm)
    if ($filter) {
      $controlRow.append($filter)
    }
    if ($breakdown) {
      $controlRow.append($breakdown)
    }
    $('#main').append($controlForm)
  }

  $('#main').append($('<canvas id="chart"></canvas>'))
}

TimeGraph.prototype.filterCats = function () {
  var self = this
  var $filterCats = $(self.el + ' ' + self.filter.el, self.$org)
  var filterAttr = self.filter.attr
  var filterCats = _.chain($filterCats).map(function (cat) {
    var $cat = $(cat)
    var txt = $cat.text() // TODO
    var attr = $cat.attr(filterAttr)
    return {
      attr: attr,
      text: txt || self.filter.codelistLookup[attr] || attr
    }
  }).uniq(function (item) {
    return item.attr
  }).sortBy(function (item) {
    return item.text
  }).value()
  return filterCats
}

TimeGraph.prototype.breakdownCats = function () {
  var self = this
  var $breakdownCats = $(self.el + ' ' + self.breakdown.el, self.$org)
  var breakdownAttr = 'ref'
  var breakdownCats = _.chain($breakdownCats).map(function (cat) {
    var $cat = $(cat)
    var txt = $('narrative', $cat).first().text() // TODO
    var attr = $cat.attr(breakdownAttr)
    var valueField = 'attr'
    var attrOrText = attr
    if (!attr) {
      attrOrText = txt
      valueField = 'text'
    }
    return {
      attr: attrOrText,
      valueField: valueField,
      text: txt || self.filter.codelistLookup[attr] || attr
    }
  }).uniq(function (item) {
    return item.attr
  }).sortBy(function (item) {
    return item.text
  }).value()
  return breakdownCats
}

TimeGraph.prototype.statuses = function () {
  var self = this
  var $els = $(self.el, self.$org)
  return _.uniq(_.map($els, function (el) {
    return $(el).attr('status') || 1
  }))
}

TimeGraph.prototype.getDataset = function () {
  var self = this
  var $els = null
  var query = null
  var $breakdown = $('#breakdown-select option:selected')
  var breakdownVal = $breakdown.val()

  var valQuery = '> value'
  if (breakdownVal) {
    if ($breakdown.data('value-field') === 'attr') {
      valQuery = self.breakdown.el + '[ref="' + breakdownVal + '"]' + ' value'
    } else {
      valQuery = self.breakdown.el + ':has(narrative:contains("' + breakdownVal + '"))' + ' value'
    }
  }

  if (self.filter) {
    var filterVal = $('#filter-select option:selected').val()
    if (breakdownVal) {
      if ($breakdown.data('value-field') === 'attr') {
        query = self.el + ':has(' + self.filter.el + '[' + self.filter.attr + '="' + filterVal + '"]):has(' + self.breakdown.el + '[ref="' + breakdownVal + '"])'
      } else {
        query = self.el + ':has(' + self.filter.el + '[' + self.filter.attr + '="' + filterVal + '"]):has(' + self.breakdown.el + ' narrative:contains("' + breakdownVal + '"))'
      }
    } else {
      query = self.el + ':has(' + self.filter.el + '[' + self.filter.attr + '="' + filterVal + '"])'
    }
  } else if (breakdownVal) {
    if ($breakdown.data('value-field') === 'attr') {
      query = self.el + ':has(' + self.breakdown.el + '[ref="' + breakdownVal + '"])'
    } else {
      query = self.el + ':has(' + self.breakdown.el + ' narrative:contains("' + breakdownVal + '"))'
    }
  } else {
    query = self.el
  }
  $data = $(query, self.$org)

  var data = _.map($data, function (el) {
    var $el = $(el)
    var $val = $(valQuery, $el)
    return {
      status: $el.attr('status') === '2' ? 'actual' : 'indicative',
      periodStart: moment($('period-start', $el).attr('iso-date')),
      periodEnd: moment($('period-end', $el).attr('iso-date')),
      val: $val.text(),
      currency: $val.attr('currency') || self.currency
    }
  })

  data = _.sortBy(data, function (a) {
    return a.periodStart
  })

  return data
}

TimeGraph.prototype.download = function (data) {
  // TODO
}

TimeGraph.prototype.show = function () {
  var self = this

  var data = self.getDataset()

  var labels = data.map(function (a) {
    return a.periodStart.format('MMM YYYY') + ' – ' + a.periodEnd.format('MMM YYYY')
  })

  if (self.chart !== null) {
    self.chart.destroy()
  }

  if (data.length === 0) {
    // TODO: Add an error message or something
    return
  }

  self.chart = new Chart('chart', {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: self.title,
        backgroundColor: '#F0CB69',
        data: data.map(function (a) {
          return a.val
        })
      }]
    },
    options: {
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[0].label
            var val = numeral(tooltipItem.yLabel).format('0.00 a')
            return label + ': ' + val + ' ' + self.currency
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
              return val + ' ' + self.currency
            }
          }
        }]
      }
    }
  })
}
