import * as $ from 'jquery'

(<any>window).$ = $
$.fn.extend({
  isInViewport: function () {
    const elementTop = $(this).offset().top
    const elementBottom = elementTop + $(this).outerHeight()

    const viewportTop = $(window).scrollTop()
    const viewportBottom = viewportTop + $(window).height()

    return elementBottom > viewportTop && elementTop < viewportBottom
  }
})
