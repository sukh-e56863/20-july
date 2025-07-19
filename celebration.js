function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');

  const size = Math.random() * 20 + 10;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;

  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.bottom = "-50px";
  heart.style.animationDuration = 3 + Math.random() * 3 + 's';

  document.querySelector('.hearts-container').appendChild(heart);
  setTimeout(() => heart.remove(), 7000);
}

function createBalloon() {
  const balloon = document.createElement('div');
  balloon.classList.add('balloon');

  balloon.style.left = Math.random() * 100 + 'vw';
  balloon.style.backgroundColor = getRandomColor();
  balloon.style.bottom = "-50px";
  balloon.style.animationDuration = 4 + Math.random() * 4 + 's';

  const string = document.createElement('div');
  string.classList.add('string');
  balloon.appendChild(string);
  string.style.left = '50%';

  document.querySelector('.balloons-container').appendChild(balloon);
  setTimeout(() => balloon.remove(), 7000);
}

function getRandomColor() {
  const colors = ['#cc3a5cff', '#d853d1ff', '#119bdbff', '#d60024ff', '#dd2fb7ff', '#db5656ff'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const heartInterval = setInterval(createHeart, 200);
const balloonInterval = setInterval(createBalloon, 400);
const wipeSound = document.getElementById('wipeSound');

setTimeout(() => {
  clearInterval(balloonInterval);
  clearInterval(heartInterval);

  // Play wipe sound
  wipeSound.play().catch(e => console.log("Audio play failed:", e));

  // Trigger wipe effect
  const wipe = document.getElementById('wipeLayer');
  wipe.style.bottom = '0';

  setTimeout(() => {
    document.querySelectorAll('.balloon, .heart').forEach(el => el.remove());

    // Show launch button
    const btn = document.getElementById('launchBtn');
    btn.style.display = 'block';
    setTimeout(() => {
      btn.style.opacity = '1';
      btn.addEventListener('click', function() {
        window.location.href = "fireworks.html";
      });
    }, 100);
  }, 1600);
}, 7000);

// Handle mobile touch events
document.addEventListener('touchstart', handleTouch, {passive: true});
document.addEventListener('touchend', handleTouch, {passive: true});

function handleTouch() {
  // This helps mobile browsers allow audio playback
  if (wipeSound.paused) {
    const playPromise = wipeSound.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Auto-play was prevented, show a message if needed
      });
    }
  }
}