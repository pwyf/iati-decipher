$(function () {
  $('form').on('submit', function () {
    return false
  })

  $('#iati-org-popup body').on('click', 'a.list-group-item', function () {
    chrome.runtime.sendMessage({action: 'msg.opentab', url: $(this).attr('href')})
    return false
  })

  var tmpl = 'https://iatiregistry.org/api/3/action/package_search?fq=extras_filetype:organisation&q=title:"{}"' +
             ' OR license_id:"{}"' +
             ' OR maintainer:"{}"' +
             ' OR maintainer_email:"{}"' +
             ' OR author_email:"{}"' +
             ' OR name:"{}"' +
             ' OR organization:"{}"' +
             ' OR extras_country:"{}"' +
             ' OR extras_publisher_country:"{}"' +
             ' OR extras_publisher_iati_id:"{}"'

  $('#org-file-name').on('keyup', debounce(function () {
    var searchStr = $(this).val()
    if (searchStr === '') {
      $('.list-group').html('')
      return
    }
    $('.list-group').html('<div id="mini-spinner"><div></div></div>')
    chrome.runtime.sendMessage({
      action: 'msg.jsonrequest',
      url: tmpl.replace(/\{\}/g, encodeURIComponent(searchStr))
    }, function (data) {
      var links = []
      if (data.message.success) {
        var result = data.message.result
        result.results.forEach(function (el) {
          links.push('<a data-dataset-name="' + el.name + '" data-download-url="' + el.resources[0].url + '" href="https://iatiregistry.org/dataset/' + el.name + '" class="list-group-item pwyf-org-viz-btn"><span class="badge"><span class="fas fa-link"></span></span> ' + el.title + '</a>')
        })
      }
      $('.list-group').html(links.join(''))
    })
  }, 500))
})
