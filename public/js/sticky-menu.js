// https://jsfiddle.net/reimeister/8kGE5/

let win = $(window),
    fxel = $('nav'),
    eloffset = fxel.offset().top;

win.scroll(function () {
    if (eloffset < win.scrollTop()) {
      fxel.addClass('fixed');
    } else {
      fxel.removeClass('fixed');
    }
  });
