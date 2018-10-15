var setupOrgBudget = function ($org) {
  var options = {
    title: 'Recipient organisation budget',
    el: 'recipient-org-budget',
    hasStatuses: true,
    filter: {
      name: 'organisation',
      el: 'recipient-org',
      attr: 'ref',
      codelist: null
    },
    breakdown: {
      name: 'budget line',
      el: 'budget-line'
    }
  }
  return new TimeGraph($org, options)
}

var setupRegionBudget = function ($org, codelists) {
  var options = {
    title: 'Recipient region budget',
    el: 'recipient-region-budget',
    hasStatuses: true,
    filter: {
      name: 'region',
      el: 'recipient-region',
      attr: 'code',
      codelist: 'Region',
      codelistLookup: codelists.Region
    },
    breakdown: {
      name: 'budget line',
      el: 'budget-line'
    }
  }
  return new TimeGraph($org, options)
}

var setupCountryBudget = function ($org, codelists) {
  var options = {
    title: 'Recipient country budget',
    el: 'recipient-country-budget',
    hasStatuses: true,
    filter: {
      name: 'country',
      el: 'recipient-country',
      attr: 'code',
      codelist: 'Country',
      codelistLookup: codelists.Country
    },
    breakdown: {
      name: 'budget line',
      el: 'budget-line'
    }
  }
  return new TimeGraph($org, options)
}

var setupTotalBudget = function ($org) {
  var options = {
    title: 'Total budget',
    el: 'total-budget',
    hasStatuses: true,
    filter: null,
    breakdown: {
      name: 'budget line',
      el: 'budget-line'
    }
  }
  return new TimeGraph($org, options)
}

var setupTotalExpenditure = function ($org) {
  var options = {
    title: 'Total expenditure',
    el: 'total-expenditure',
    hasStatuses: false,
    filter: null,
    breakdown: {
      name: 'expense line',
      el: 'expense-line'
    }
  }
  return new TimeGraph($org, options)
}
