// Photo data - replace with your image paths
const photos = [
  'assets/slider/photo1.jpg',
  'assets/slider/photo2.jpg',
  'assets/slider/photo3.jpg',
  'assets/slider/photo4.jpg',
  'assets/slider/photo5.jpg',
  'assets/slider/photo6.jpg',
  'assets/slider/photo7.jpg',
  'assets/slider/photo8.jpg',
  'assets/slider/photo9.jpg',
  'assets/slider/photo10.jpg',
  'assets/slider/photo11.jpg',
];

// DOM elements
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const autoBtn = document.querySelector('.auto-btn');
const musicBtn = document.querySelector('.music-btn');

// State variables
let currentIndex = 0;
let autoPlayInterval;
let isAutoPlaying = false;
let audio;
let swooshSound = new Audio('assets/audio/swoosh.mp3');
let zoomSound = new Audio('assets/audio/swoosh.mp3'); // Using same sound for both, can be different

// Initialize slider
function initSlider() {
  photos.forEach((photo, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    if (index === 0) slide.classList.add('active');
    if (index === 1) slide.classList.add('next');
    if (index === photos.length - 1) slide.classList.add('prev');
    
    const img = document.createElement('img');
    img.src = photo;
    img.alt = `Photo ${index + 1}`;
    
    // Add click event to open modal
    img.addEventListener('click', function() {
      playSound(zoomSound);
      openModal(this.src);
    });
    
    slide.appendChild(img);
    slider.appendChild(slide);
  });
}

// Play sound function with mobile compatibility
function playSound(sound) {
  // On mobile, sounds often need to be triggered by user interaction
  sound.currentTime = 0; // Rewind to start
  const promise = sound.play();
  
  if (promise !== undefined) {
    promise.catch(error => {
      // Autoplay was prevented, we'll ignore this error
    });
  }
}

// Get the modal
const modal = document.getElementById('photoModal');
const modalImg = document.getElementById('modalImage');
const captionText = document.querySelector('.caption');
const closeBtn = document.querySelector('.close-btn');

// Function to open modal with clicked image
function openModal(imgSrc) {
  modal.style.display = "block";
  modalImg.src = imgSrc;
}

// Close modal when clicking X
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Close modal when clicking outside image
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Update slider display
function updateSlider() {
  const slides = document.querySelectorAll('.slide');
  slides.forEach((slide, index) => {
    slide.classList.remove('active', 'prev', 'next');
    
    if (index === currentIndex) {
      slide.classList.add('active');
    } else if (index === (currentIndex + 1) % photos.length) {
      slide.classList.add('next');
    } else if (index === (currentIndex - 1 + photos.length) % photos.length) {
      slide.classList.add('prev');
    }
  });
}

// Go to next slide
function nextSlide() {
  playSound(swooshSound);
  currentIndex = (currentIndex + 1) % photos.length;
  updateSlider();
}

// Go to previous slide
function prevSlide() {
  playSound(swooshSound);
  currentIndex = (currentIndex - 1 + photos.length) % photos.length;
  updateSlider();
}

// Toggle autoplay
function toggleAutoPlay() {
  if (isAutoPlaying) {
    clearInterval(autoPlayInterval);
    autoBtn.classList.remove('active');
    isAutoPlaying = false;
  } else {
    playSound(swooshSound);
    autoPlayInterval = setInterval(nextSlide, 4000);
    autoBtn.classList.add('active');
    isAutoPlaying = true;
  }
}

// Toggle music
function toggleMusic() {
  if (!audio) {
    audio = new Audio('assets/audio/music.mp3');
    audio.loop = true;
  }
  
  if (audio.paused) {
    // On mobile, we need to play this as part of user interaction
    const promise = audio.play();
    if (promise !== undefined) {
      promise.catch(error => {
        // Autoplay was prevented, show a message
        alert('Please tap again to play music. Some browsers require this.');
      });
    }
    musicBtn.textContent = 'Music Playing ♫';
    musicBtn.classList.add('active');
  } else {
    audio.pause();
    musicBtn.textContent = 'Play Music ♫';
    musicBtn.classList.remove('active');
  }
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);
autoBtn.addEventListener('click', toggleAutoPlay);
musicBtn.addEventListener('click', toggleMusic);

// Touch events for mobile swipe
let touchStartX = 0;
let touchEndX = 0;

slider.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

slider.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, {passive: true});

function handleSwipe() {
  const threshold = 50; // Minimum swipe distance
  if (touchEndX < touchStartX - threshold) {
    nextSlide();
  } else if (touchEndX > touchStartX + threshold) {
    prevSlide();
  }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

// Initialize
initSlider();

// Preload sounds
window.addEventListener('load', () => {
  // This helps with mobile playback
  swooshSound.volume = 0.5;
  zoomSound.volume = 0.3;
});