const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
const fireworksSound = document.getElementById("fireworksSound");

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let particles = [];
let lastFireworkTime = 0;
const fireworkInterval = 800; // milliseconds between fireworks

function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

document.getElementById('finalBtn').addEventListener('click', function() {
  window.location.href = "spiral.html"; // Redirect to spiral page
});

class Firework {
  constructor() {
    this.reset();
    this.color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`;
  }

  reset() {
    this.x = random(canvas.width * 0.2, canvas.width * 0.8);
    this.y = canvas.height;
    this.targetX = random(100, canvas.width - 100);
    this.targetY = random(50, canvas.height / 2);
    this.speed = random(3, 6);
    this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
    this.exploded = false;
    this.radius = 2;
    this.trail = [];
    this.maxTrail = 10;
  }

  update() {
    if (!this.exploded) {
      // Add current position to trail
      this.trail.push({x: this.x, y: this.y});
      if (this.trail.length > this.maxTrail) {
        this.trail.shift();
      }

      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      // Check if reached target
      if (Math.abs(this.y - this.targetY) < 10) {
        this.explode();
      }
    }
  }

  explode() {
    this.exploded = true;
    // Play sound when firework explodes
    fireworksSound.currentTime = 0;
    fireworksSound.play();
    
    // Create explosion particles
    const particleCount = Math.floor(random(50, 100));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(this.x, this.y, this.color));
    }
  }

  draw() {
    if (!this.exploded) {
      // Draw trail
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, 0.5)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw firework head
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.speed = random(1, 6);
    this.angle = random(0, Math.PI * 2);
    this.radius = random(1, 3);
    this.alpha = 1;
    this.decay = random(0.01, 0.03);
    this.color = color;
    this.gravity = 0.1;
    this.velocityY = random(-1, 1);
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.velocityY;
    this.velocityY += this.gravity;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function animate() {
  requestAnimationFrame(animate);
  
  // Clear canvas with semi-transparent black for fade effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const currentTime = Date.now();
  
  // Launch new fireworks at intervals
  if (currentTime - lastFireworkTime > fireworkInterval) {
    fireworks.push(new Firework());
    lastFireworkTime = currentTime;
  }

  // Update and draw fireworks
  fireworks.forEach((fw, index) => {
    fw.update();
    fw.draw();
    if (fw.exploded) {
      fireworks.splice(index, 1);
    }
  });

  // Update and draw particles
  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) {
      particles.splice(index, 1);
    }
  });

  // Draw moon glow effect
  
}

// In your animate() function, replace drawMoonGlow() with:
 
// Start the animation
animate();

// Create initial stars
function createStars() {
  const starsContainer = document.querySelector('.stars');
  const starCount = 200;
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.position = 'absolute';
    star.style.width = `${random(1, 3)}px`;
    star.style.height = star.style.width;
    star.style.left = `${random(0, 100)}vw`;
    star.style.top = `${random(0, 100)}vh`;
    star.style.backgroundColor = 'white';
    star.style.borderRadius = '50%';
    star.style.opacity = random(0.3, 1);
    star.style.animation = `twinkle ${random(2, 6)}s infinite alternate`;
    starsContainer.appendChild(star);
  }
}

// Initialize
createStars();