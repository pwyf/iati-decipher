var showSummary = function ($org, metadata) {
  $page = $('<div class="container"><div class="list-group"></div></div>')

  var stuff = [
    {el: 'total-budget', name: 'Total budgets'},
    {el: 'recipient-organisation-budget', name: 'Recipient organisation budgets'},
    {el: 'recipient-region-budget', name: 'Recipient region budgets'},
    {el: 'recipient-country-budget', name: 'Recipient country budgets'},
    {el: 'total-expenditure', name: 'Total expenditure'},
    {el: 'document-link', name: 'Documents'}
  ]

  var $listGroup = $('.list-group', $page)

  stuff.forEach(function (obj) {
    var total = $(obj.el, $org).length
    var $item = $('<a href="#" data-el="' + obj.el + '" class="list-group-item ' + (total === 0 ? 'disabled' : '') + '"><span class="badge">' + numeral(total).format(',') + '</span> ' + obj.name + '</a>').on('click', function () {
      var $this = $(this)
      if ($this.hasClass('disabled')) {
        return false
      }
      $('#show-' + $this.data('el')).click()
      return false
    })
    $listGroup.append($item)
  })

  $('#main').html($page)
}
