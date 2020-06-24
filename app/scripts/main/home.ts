import './default'

// Set the date we're counting down to
const countDownDate = new Date("Mar 16, 2019").getTime();

// Update the count down every 1 second
setInterval(function () {

  // Get today's date and time
  const now = new Date().getTime();

  // Find the distance between now and the count down date
  const distance = now - countDownDate;

  // Time calculations for days, hours, minutes and seconds
  const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
  const days = Math.floor(distance % (1000 * 60 * 60 * 24 * 365) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("timer-years").innerHTML = years.toString();
  document.getElementById("timer-days").innerHTML = days.toString();
  document.getElementById("timer-hours").innerHTML = hours.toString();
  document.getElementById("timer-minutes").innerHTML = minutes.toString();
  document.getElementById("timer-seconds").innerHTML = seconds.toString();
}, 1000);

let $selectedImg = $('.photo').first()

async function selectImg($img) {
  $selectedImg.addClass('photo--hiding')
  await new Promise(resolve => setTimeout(resolve, 500))
  $selectedImg.removeClass('photo--hiding')
  $('.photo').removeClass('photo--selected')
  $img.addClass('photo--selected')
  $selectedImg = $img
}

selectImg($selectedImg)

$('.photo').on('click', function () {
  selectImg($selectedImg.next())
})
