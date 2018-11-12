// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

$(function () {
  $('form').on('submit', function () {
    return false
  })

  $('#iati-org-popup body').on('click', 'a.list-group-item', function () {
    chrome.runtime.sendMessage({action: 'msg.opentab', url: $(this).attr('href')})
    return false
  })

  var tmpl = 'https://iatiregistry.org/api/3/action/package_search?fq=extras_filetype:organisation&qf=title&q='
  $('#org-file-name').on('keyup', debounce(function () {
    var searchStr = $(this).val()
    if (searchStr === '') {
      $('.list-group').html('')
      return
    }
    $('.list-group').html('<div id="mini-spinner"><div></div></div>')
    chrome.runtime.sendMessage({action: 'msg.jsonrequest', url: tmpl + searchStr}, function (data) {
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
