// @ts-nocheck
// TODO: fully refactor this
function getModificators($el) {
  return $el.attr('class').split(' ').slice(1)
}

function removeModificators() {
  const $modalDefault = $('.modals-container')

  getModificators($modalDefault).forEach(function (mod) {
    $modalDefault.removeClass(mod)
  })
}

function stopVideo() {
  const $modalDefault = $('.modals-container')
  const iframes = $modalDefault.find('iframe')
  iframes[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*')
  iframes.attr('src','')
}

function loadVideo(videoId) {
  const $modalDefault = $('.modals-container')

  const $videoWrapper = $modalDefault.find('.video-wrapper')
  $videoWrapper.find('iframe').remove()
  $('<iframe frameborder="0" allowfullscreen=></iframe>')
    .attr('src', `https://www.youtube.com/embed/${videoId}?enablejsapi=1`)
    .appendTo($videoWrapper)
}

function loadVideoVimeo(videoId) {
  const $modalDefault = $('.modals-container')

  let $videoWrapper = $modalDefault.find('.video-wrapper')
  $videoWrapper.find('iframe').remove()
  $('<iframe frameborder="0" allowfullscreen=></iframe>')
    .attr('src', `https://player.vimeo.com/video/${videoId}?enablejsapi=1&autoplay=1&title=0&byline=0&portrait=0`)
    .appendTo($videoWrapper)
}

function closeModal() {
  const $modalDefault = $('.modals-container')
  $('body').removeClass('overflow-hidden')

  if ($modalDefault.hasClass('_video')) {
    stopVideo()
  }
  $modalDefault.removeClass('_show')
  removeModificators()
}

function openModal(modelClass) {
  const $modalDefault = $('.modals-container')
  $('body').addClass('overflow-hidden')
  removeModificators()
  $modalDefault.addClass('_show')
  $modalDefault.addClass('_' + modelClass)
}

$(function () {
  const $modalDefault = $('.modals-container')

  $('[data-video]').on('click.openVideoModal', function (e) {
    e.preventDefault()
    loadVideo($(this).data('video'))
    openModal('video')
  })
  $('[data-video-vimeo]').on('click.openVideoModal', function (e) {
    e.preventDefault()
    loadVideoVimeo($(this).data('video-vimeo'))
    openModal('video')
  })
  $('[data-modal]').on('click.openModal', function (e) {
    e.preventDefault()
    openModal($(this).data('modal'))
  })
  $modalDefault.on('click.closeModal', function (e) {
    e.preventDefault()
    closeModal()
  })
  $modalDefault.on('click.closeModal', '.modal__outer', function (e) {
    e.stopPropagation()
  })
  $('.modal__close').on('click.closeModal', function (e) {
    e.preventDefault()
    closeModal()
  })
  $modalDefault.on('click.closeModal', '.modal-default__inner', function (e) {
    e.stopPropagation()
  })
})

// Handle modal closing with `esc` button

$(document).keyup(function (e) {
  if (e.keyCode === 27) {
    closeModal()
  }
})
