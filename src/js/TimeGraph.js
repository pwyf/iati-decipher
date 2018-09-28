function TimeGraph ($org, options) {
  var self = this
  self.$org = $org
  self.title = options.title
  self.el = options.el
  self.filter = options.filter
  self.breakdownEl = options.breakdownEl
  self.currency = $org.attr('default-currency')
  self.chart = null

  if (self.statuses().length > 1) {
    // TODO
    // We need a status filter
  }

  $('#main').html('')

  var $filter = null
  var $breakdown = null
  if (self.filter) {
    var filterCats = self.filterCats()
    $filter = $('<div class="form-group col-sm-6"><label for="filter-select">Filter by ' + self.filter.name + '</label><select class="form-control" id="filter-select"></select></div>')
    var $filterSelect = $('#filter-select', $filter)
    $.each(filterCats, function () {
      $filterSelect.append($('<option value="' + this.attr + '">' + this.text + '</option>'))
    })
    $filterSelect.on('change', function () {
      self.show()
    })
  }

  var breakdownCats = self.breakdownCats()
  if (breakdownCats.length > 0) {
    $breakdown = $('<div class="form-group col-sm-6"><label for="breakdown-select">Filter by breakdown</label><select class="form-control" id="filter-select"></select></div>')
    var $breakdownSelect = $('#breakdown-select', $breakdown)
    $.each(filterCats, function () {
      $breakdownSelect.append($('<option value="' + this.attr + '">' + this.text + '</option>'))
    })
    $breakdownSelect.on('change', function () {
      self.show()
    })
  }

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
  var $filterCats = $(this.el + ' ' + this.filter.el, this.$org)
  var filterAttr = this.filter.attr
  var filterCats = _.chain($filterCats).map(function (cat) {
    var $cat = $(cat)
    var txt = $cat.text() // TODO
    return {
      attr: $cat.attr(filterAttr),
      text: txt
    }
  }).uniq(function (item) {
    return item.attr
  }).sortBy(function (item) {
    return item.text
  }).value()
  return filterCats
}

TimeGraph.prototype.breakdownCats = function () {
  var $breakdownCats = $(this.el + ' ' + this.breakdownEl, this.$org)
  var breakdownAttr = 'ref'
  var breakdownCats = _.chain($breakdownCats).map(function (cat) {
    var $cat = $(cat)
    var txt = $('narrative', $cat).first().text() // TODO
    return {
      attr: $cat.attr(breakdownAttr),
      text: txt
    }
  }).uniq(function (item) {
    return item.attr
  }).sortBy(function (item) {
    return item.attr
  }).value()
  return breakdownCats
}

TimeGraph.prototype.statuses = function () {
  var $els = $(this.el, this.$org)
  return _.uniq(_.map($els, function (el) {
    return $(el).attr('status') || 1
  }))
}

TimeGraph.prototype.show = function () {
  var self = this
  var $els = null
  if (self.filter) {
    var filterVal = $('#filter-select option:selected').val()
    var query = self.el + ':has(' + self.filter.el + '[' + self.filter.attr + '="' + filterVal + '"])'
    $els = $(query, self.$org)
  } else {
    $els = $(self.el, self.$org)
  }

  var els = _.map($els, function (el) {
    var $el = $(el)
    return {
      status: $el.attr('status') === '2' ? 'actual' : 'indicative',
      periodStart: moment($('period-start', $el).attr('iso-date')),
      periodEnd: moment($('period-end', $el).attr('iso-date')),
      val: $('> value', $el).text()
    }
  })

  els = _.sortBy(els, function (a) {
    return a.periodStart
  })

  var labels = _.map(els, function (a) {
    return a.periodStart.format('MMM YYYY') + ' – ' + a.periodEnd.format('MMM YYYY')
  })

  if (self.chart !== null) {
    self.chart.destroy()
  }
  self.chart = new Chart('chart', {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: self.title,
        backgroundColor: '#F0CB69',
        data: _.map(els, function (a) {
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
