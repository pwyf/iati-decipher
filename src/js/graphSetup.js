var setupOrgBudget = function ($org) {
  var options = {
    title: 'Recipient organisation budget',
    el: 'recipient-org-budget',
    filter: {
      name: 'organisation',
      el: 'recipient-org',
      attr: 'ref',
      codelist: null
    },
    breakdownEl: 'budget-line'
  }
  return new TimeGraph($org, options)
}

var setupRegionBudget = function ($org) {
  var options = {
    title: 'Recipient region budget',
    el: 'recipient-region-budget',
    filter: {
      name: 'region',
      el: 'recipient-region',
      attr: 'code',
      codelist: 'Region'
    },
    breakdownEl: 'budget-line'
  }
  return new TimeGraph($org, options)
}

var setupCountryBudget = function ($org) {
  var options = {
    title: 'Recipient country budget',
    el: 'recipient-country-budget',
    filter: {
      name: 'country',
      el: 'recipient-country',
      attr: 'code',
      codelist: 'Country'
    },
    breakdownEl: 'budget-line'
  }
  return new TimeGraph($org, options)
}

var setupTotalBudget = function ($org) {
  var options = {
    title: 'Total budget',
    el: 'total-budget',
    filter: null,
    breakdownEl: 'budget-line'
  }
  return new TimeGraph($org, options)
}

var setupTotalExpenditure = function ($org) {
  var options = {
    title: 'Total expenditure',
    el: 'total-expenditure',
    filter: null,
    breakdownEl: 'expense-line'
  }
  return new TimeGraph($org, options)
}
