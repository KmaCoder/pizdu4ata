class Alerts {
  private readonly $wrapper: JQuery

  constructor() {
    this.$wrapper = $('[data-js="alerts"]')
  }

  public showMessage(message: string, timeout = 10000): void {
    const $alert =
      $(`<div class="alert">
                 <button type="button" class="alert-close" data-dismiss="alert"></button>
                 ${message}
               </div>`)
    $alert.appendTo(this.$wrapper)
    setTimeout(function () {
      $alert.addClass('alert--show')
    }, 50)

    setTimeout(function () {
      $alert.removeClass('alert--show')
      setTimeout(function () {
        $alert.remove()
      }, 500)
    }, timeout)
  }
}

export default new Alerts()
