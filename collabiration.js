const track = document.getElementById('track');
const progressBar = document.getElementById('progressBar');

track.addEventListener('scroll', () => {
  const maxScroll = track.scrollWidth - track.clientWidth;
  const scrollPercentage = (track.scrollLeft / maxScroll) * 100;
  progressBar.style.width = scrollPercentage + '%';
});

let scrollDirection = 1;

function autoScroll() {
  const maxScroll = track.scrollWidth - track.clientWidth;
  
  if (track.scrollLeft >= maxScroll - 1) {
    scrollDirection = -1;
  } else if (track.scrollLeft <= 0) {
    scrollDirection = 1;
  }

  track.scrollBy({
    left: scrollDirection * 2,
    behavior: 'smooth'
  });
}

setInterval(autoScroll, 30);