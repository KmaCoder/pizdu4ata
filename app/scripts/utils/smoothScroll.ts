import navigation from "../components/navigation"
import ClickEvent = JQuery.ClickEvent;

class SmoothScroll {
  private _$root: JQuery
  private _pathname: string

  constructor(private defaultAnimSpeed: number) {
    this._$root = $('html, body')
    this._pathname = window.location.pathname

    // add smooth scroll for every link
    $('a[href]').on('click', function (e: ClickEvent) {
      smoothScroll.withHref(e, $(this).attr('href'))
    })
  }

  public withHref(e: ClickEvent, href: string, animSpeed: number = this.defaultAnimSpeed): void {
    const splitHref = href.split('#')
    // TODO: only scroll if current page equals page from href: || !splitHref[0].endsWith(window.location.href)
    if (splitHref.length < 2) return

    const anchorName = splitHref[1].split('?')[0]
    e.preventDefault()
    this.toAnchor(anchorName, animSpeed)
  }

  public toAnchor(anchorName: string, animSpeed: number = this.defaultAnimSpeed): void {
    if (anchorName.length === 0)
      return
    const $anchor = $("#" + anchorName)
    if ($anchor.length === 0)
      return

    this._$root.animate({
      scrollTop: $anchor.offset().top - navigation.height
    }, animSpeed)
    navigation.close()
    history.pushState({}, "", "#" + anchorName);
  }
}

const smoothScroll = new SmoothScroll(500)

export default smoothScroll
