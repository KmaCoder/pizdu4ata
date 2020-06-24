// Add parameters from URL and custom params from 'url_add_params' object to href attribute
function addParamsOnLink($elem, customParams=null) {
  let url_destination = $elem.attr('href')
  if (url_destination === undefined || url_destination.length <= 0 || url_destination.indexOf('#') === 0)
    return

  let url_current = new URL(window.location.href)
  let params = ''

  if (customParams !== null) {
    Object.entries(customParams).forEach(function (param) {
      params += param[0] + '=' + param[1] + '&'
    })
  }

  url_current.searchParams.forEach(function (value, key) {
    if (customParams === null || !customParams.hasOwnProperty(key))
      params += key + '=' + value + '&'
  })

  if (params.length > 0)
    url_destination += (url_destination.indexOf('?') > 0 ? '&' : '?') + params.substring(0, params.length - 1)

  $elem.attr('href', url_destination)
}

$('.js-pass-params').each(function () {
  addParamsOnLink($(this))
})

export {addParamsOnLink}
