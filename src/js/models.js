function Recipient ($recipient, ref) {
  this.ref = ref
  // TODO: v1.0x
  // TODO: i18n
  this.name = $($('narrative', $recipient)[0]).text()
}

function BudgetLine (ref, name) {
  this.ref = ref
  this.name = name
}

function Budget ($budget) {
  this.status = $budget.attr('status') === '2' ? 'actual' : 'indicative'
  this.periodStart = moment($('period-start', $budget).attr('iso-date'))
  this.periodEnd = moment($('period-end', $budget).attr('iso-date'))
  this.val = $('> value', $budget).text()
}

function TotalBudget ($budget) {
  this.elName = 'total-budget'
  Budget.call(this, $budget)
}
TotalBudget.prototype = Object.create(Budget.prototype)

function OrgBudget ($budget, orgRef) {
  this.elName = 'recipient-org-budget'
  Budget.call(this, $budget)
  var q = 'recipient-org[ref="' + orgRef + '"]'
  var $recipient = $(q, $budget)
  this.recipient = new Recipient($recipient, orgRef)
}
OrgBudget.prototype = Object.create(Budget.prototype)

function RegionBudget ($budget, regionCode) {
  this.elName = 'recipient-region-budget'
  Budget.call(this, $budget)
  // TODO: vocab support
  var q = 'recipient-region[code="' + regionCode + '"]'
  var $recipient = $(q, $budget)
  this.recipient = new Recipient($recipient, regionCode)
}
RegionBudget.prototype = Object.create(Budget.prototype)

function CountryBudget ($budget, countryCode) {
  this.elName = 'recipient-country-budget'
  Budget.call(this, $budget)
  var q = 'recipient-country[code="' + countryCode + '"]'
  var $recipient = $(q, $budget)
  this.recipient = new Recipient($recipient, countryCode)
}
CountryBudget.prototype = Object.create(Budget.prototype)

var getBudgets = function ($org, elName, recipientElName) {
  var $budgets = $(elName, $org)
  var budgets = []
  $budgets.each(function () {
    var $budget = $(this)
    budgets.push(new Budget($budget, elName, recipientElName))
  })
  return budgets
}
