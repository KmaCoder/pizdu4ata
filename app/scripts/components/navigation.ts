class Navigation {
  private _$elem: JQuery
  private _$toggle: JQuery

  constructor() {
    this._$elem = $('#navigation')
    this._$toggle = $('.js-navbar-toggle')

    this.close()
    this._$toggle.on('click', () => this.toggle())
    $(window).on('scroll', () => this.toggleNavScrolled())
  }

  private _isOpened: boolean

  get isOpened(): boolean {
    return this._isOpened;
  }

  set isOpened(value: boolean) {
    value ? this.close() : this.open()
  }

  get height(): number {
    return this._$elem.outerHeight();
  }

  public toggle(): void {
    this._isOpened ? this.close() : this.open()
  }

  public close(): void {
    this._isOpened = false;
    this._$toggle.removeClass('is-active')
    this._$elem.removeClass('navigation--opened')
    $('body').removeClass('overflow-hidden-navbar')
  }

  public open(): void {
    this._isOpened = true;
    this._$toggle.addClass('is-active')
    this._$elem.addClass('navigation--opened')
    $('body').addClass('overflow-hidden-navbar')
  }

  private toggleNavScrolled(): void {
    this._$elem.toggleClass('nav-scrolled', $(window).scrollTop() < 5)
  }
}

const navigation = new Navigation()

export default navigation
