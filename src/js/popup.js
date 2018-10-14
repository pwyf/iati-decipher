$(function () {
  $('body').on('click', 'a.list-group-item', function () {
    chrome.runtime.sendMessage({action: 'msg.opentab', url: $(this).attr('href')})
    return false
  })

  var tmpl = 'https://iatiregistry.org/api/3/action/package_search?fq=extras_filetype:organisation&q=title:'
  $('#org-file-name').on('keyup', function () {

    var searchStr = $(this).val()
    searchStr = searchStr.split(' ')
    searchStr = '(+*' + searchStr.join('* +*') + '*)'
    chrome.runtime.sendMessage({action: 'msg.jsonrequest', url: tmpl + searchStr}, function (data) {
      var results = data.message.result.results
      var links = []
      results.forEach(function (el) {
        links.push('<a href="https://iatiregistry.org/dataset/' + el.name + '" class="list-group-item">' + el.title + '</a>')
      })
      $('.list-group').html(links.join(''))
    })
  })
})
