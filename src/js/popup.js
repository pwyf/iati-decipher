$(function () {
  $('form').on('submit', function () {
    return false
  })

  $('#iati-org-popup body').on('click', 'a.list-group-item', function () {
    chrome.runtime.sendMessage({action: 'msg.opentab', url: $(this).attr('href')})
    return false
  })


  var tmpl = 'https://iatiregistry.org/api/3/action/package_search?fq=extras_filetype:organisation&q=title:'
  var tmpl2 = ' OR license_id:'
  var tmpl3 = ' OR maintainer:'
  var tmpl4 = ' OR maintainer_email:'
  var tmpl5 = ' OR author_email:'
  var tmpl6 = ' OR name:'
  var tmpl7 = ' OR organization_name:'
  var tmpl9 = ' OR organization_title:'
  var tmpl10 = ' OR organization_description:'
  var tmpl11 = ' OR extras_country:'
  var tmpl12 = ' OR extras_publisher_country:'
  var tmpl13 = ' OR extras_publisher_iati_id:'

  $('#org-file-name').on('keyup', debounce(function () {
    var searchStr = $(this).val()
    if (searchStr === '') {
      $('.list-group').html('')
      return
    }
    $('.list-group').html('<div id="mini-spinner"><div></div></div>')
    chrome.runtime.sendMessage({action: 'msg.jsonrequest', url: tmpl + searchStr + tmpl2 + searchStr + tmpl3 + searchStr + tmpl4 + searchStr + tmpl5 + searchStr + tmpl6 + searchStr + tmpl7 + searchStr + tmpl8 + searchStr + tmpl9 + searchStr + tmpl10 + searchStr + tmpl11 + searchStr + tmpl12 + searchStr + tmpl13 + searchStr}, function (data) {
      var result = data.message.result
      var links = []
      if (result.count > 0) {
        result.results.forEach(function (el) {
          links.push('<a data-dataset-name="' + el.name + '" data-download-url="' + el.resources[0].url + '" href="https://iatiregistry.org/dataset/' + el.name + '" class="list-group-item pwyf-org-viz-btn"><span class="badge"><span class="fas fa-link"></span></span> ' + el.title + '</a>')
        })
      }
      $('.list-group').html(links.join(''))
    })
  }, 500))
})
