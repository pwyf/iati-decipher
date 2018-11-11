function TimeGraph ($org, options) {
  var self = this
  self.$org = $org
  self.title = options.title
  self.el = options.el
  self.hasStatuses = options.hasStatuses
  self.filter = options.filter
  self.breakdown = options.breakdown
  self.currency = $org.attr('default-currency')
  self.chart = null

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

  $('#main').append($('<div class="container" id="chart-content"></div>'))
  $('#main').append($('<div id="chart"></div>'))
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

TimeGraph.prototype.getDataset = function () {
  var self = this
  var $els = null
  var $breakdown = $('#breakdown-select option:selected')
  var breakdownVal = $breakdown.val()

  if (breakdownVal) {
    if ($breakdown.data('value-field') === 'attr') {
      valQuery = self.breakdown.el + '[ref="' + breakdownVal + '"]' + ' value'
    } else {
      valQuery = self.breakdown.el + ':has(narrative:contains("' + breakdownVal + '"))' + ' value'
    }
  }

  $data = $(self.el, self.$org)

  if (self.filter) {
    var filterVal = $('#filter-select option:selected').val()
    $data = $data.filter(':has(' + self.filter.el + '[' + self.filter.attr + '="' + filterVal + '"])')
  }

  var data = null
  if (breakdownVal) {
    if ($breakdown.data('value-field') === 'attr') {
      $data = $(self.breakdown.el + '[ref="' + breakdownVal + '"]', $data)
    } else {
      $data = $(self.breakdown.el, $data).filter(function () {
        return $('narrative:first', this).text() === breakdownVal
      })
    }
    data = _.map($data, function (breakdownEl) {
      var $el = $(breakdownEl).parent()
      var $amount = $('> value', breakdownEl)
      var status = '-'
      if (self.hasStatuses) {
        if ($el.attr('usg:type')) {
          status = $el.attr('usg:type')
        } else {
          status = $el.attr('status') === '2' ? 'Committed' : 'Indicative'
        }
      }
      return {
        status: status,
        periodStart: $('period-start', $el).attr('iso-date'),
        periodEnd: $('period-end', $el).attr('iso-date'),
        amount: $amount.text(),
        currency: $amount.attr('currency') || self.currency || ''
      }
    })
  } else {
    data = _.map($data, function (el) {
      var $el = $(el)
      var $amount = $('> value', $el)
      var status = '-'
      if (self.hasStatuses) {
        if ($el.attr('usg:type')) {
          status = $el.attr('usg:type')
        } else {
          status = $el.attr('status') === '2' ? 'Committed' : 'Indicative'
        }
      }
      return {
        status: status,
        periodStart: $('period-start', $el).attr('iso-date'),
        periodEnd: $('period-end', $el).attr('iso-date'),
        amount: $amount.text(),
        currency: $amount.attr('currency') || self.currency || ''
      }
    })
  }

  data = _.sortBy(data, function (a) {
    return a.periodStart
  })

  return data
}

TimeGraph.prototype.download = function (data) {
  var ws = XLSX.utils.json_to_sheet(data)
  var wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, 'export.xlsx')
  return false
}

TimeGraph.prototype.groupData = function (data) {
  // Find all statuses used
  var statuses = data.reduce(function (acc, obj) {
    if (acc.indexOf(obj.status) === -1) {
      acc.push(obj.status)
    }
    return acc
  }, [])

  var ordering = ['Request', 'Appropriation', 'Actual', 'Indicative', 'Committed']
  statuses.sort(function (a, b) {
    var aInd = ordering.indexOf(a)
    var bInd = ordering.indexOf(b)
    if (aInd < bInd) {
      return -1
    }
    if (aInd > bInd) {
      return 1
    }
    return 0
  })

  var labels = _.uniq(data, true, function (item) {
    return item.periodStart + ' // ' + item.periodEnd
  })

  var datasets = statuses.map(function (status, idx) {
    var l = labels.map(function (l) {
      var d = data.find(function (item) {
        return (l.periodStart === item.periodStart && l.periodEnd === item.periodEnd && item.status === status)
      })
      return (!d) ? null : d.amount
    })
    l.unshift(status)
    return l
  })

  return {
    datasets: datasets,
    labels: labels
  }
}

TimeGraph.prototype.show = function () {
  var self = this

  var data = self.getDataset()

  if (data.length === 0) {
    if (self.chart !== null) {
      self.chart = self.chart.destroy()
    }
    $('#chart-content').html($('<h2>No data provided.</h2>'))
    return
  }

  var groupData = self.groupData(data)

  var labels = groupData.labels.map(function (item) {
    var opts = {year: 'numeric', month: 'short'}
    var dateStart = new Date(item.periodStart)
    var dateEnd = new Date(item.periodEnd)
    return dateStart.toLocaleDateString('en-GB', opts) + ' – ' + dateEnd.toLocaleDateString('en-GB', opts)
  })

  var $downloadLink = $('<a href="#" class="btn btn-default pull-right"><span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span> Download .xlsx</a>').on('click', function () {
    self.download(data)
  })
  $('#chart-content').html($downloadLink)

  var backgroundColors = {
    '-': '#D67D1C',
    'Request': '#EEC32A',
    'Appropriation': '#D67D1C',
    'Actual': '#9EB437',
    'Indicative': '#EEC32A',
    'Committed': '#D67D1C'
  }

  if (self.chart !== null) {
    var newIds = groupData.datasets.map(function (v) {
      return v[0]
    })
    self.chart.load({
      unload: true,
      columns: groupData.datasets,
      colors: groupData.datasets.reduce(function (o, d, i) {
        if (d[0] in backgroundColors) {
          o[d[0]] = backgroundColors[d[0]]
        }
        return o
      }, {})
    })
  } else {
    self.chart = c3.generate({
      bindto: '#chart',
      data: {
        type: 'bar',
        columns: groupData.datasets,
        colors: groupData.datasets.reduce(function (o, d, i) {
          if (d[0] in backgroundColors) {
            o[d[0]] = backgroundColors[d[0]]
          }
          return o
        }, {})
      },
      axis: {
        x: {
          type: 'category',
          categories: labels
        }
        ,
        y: {
          tick: {
            format: function (value) {
              return d3.format(',')(value) + ' ' + self.currency
            }
          }
        }
      },
      tooltip: {
        format: {
          name: function (name, ratio, id, index) {
            return (name !== '-') ? name : ''
          },
          value: function (value, ratio, id, index) {
            return d3.format(',')(value) + ' ' + self.currency
          }
        }
      },
      legend: {
        hide: !!(groupData.datasets.length === 1),
        position: 'inset'
      },
      bar: {
        width: {
          ratio: 0.5
        }
      }
    })
  }
}
