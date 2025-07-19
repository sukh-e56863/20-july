document.addEventListener('DOMContentLoaded', () => {
  window.onload = () => showCakeCuttingScene();

  function showCakeCuttingScene() {
    document.body.innerHTML = `
      <div class="cake-scene">
        <div id="cake-message" class="message"></div>

        <div id="fan-container">
          <img id="fan" src="assets/images/fan.png" class="fan-asset" />
          <button id="fan-btn" class="glow-button fan-btn">Turn On Fan</button>
        </div>

        <div class="table">
          <img id="cake" src="assets/images/cake.png" class="cake-asset" />
        </div>

        <div class="asset-row">
          <img id="knife" src="assets/images/knife.png" class="cake-asset" />
          <img id="candle" src="assets/images/candle.png" class="cake-asset" />
          <img id="matchbox" src="assets/images/matchbox.png" class="cake-asset" />
        </div>

        <div id="cd-player">
          <img src="assets/images/cd.png" id="cdImage" alt="CD">
          <div class="cd-controls">
            <button id="playPauseBtn" class="pp-btn">⏸</button>
            <input id="seekBar" type="range" min="0" max="100" value="0" class="seek">
            <div class="waves"></div>
          </div>
        </div>

        <button id="celebrate-btn" class="glow-button">Let's Celebrate!</button>

        <audio id="celebrateSong" preload="auto" src="assets/audio/celebrate.mp3"></audio>
      </div>
    `;

    const bgMusic = document.getElementById('romanticMusic');
    if (bgMusic) {
      bgMusic.loop = true;
      bgMusic.play().catch(() => {});
    }

    setupCakeLogic();
  }

  function setupCakeLogic() {
    let candlePlaced = false, candleLit = false, fanOn = false, cakeCut = false;

    const cake = el('cake');
    const candle = el('candle');
    const match = el('matchbox');
    const knife = el('knife');
    const fan = el('fan');
    const fanBtn = el('fan-btn');
    const msg = el('cake-message');
    const cdPlayer = el('cd-player');
    const cdImage = el('cdImage');
    const btn = el('celebrate-btn');
    const song = el('celebrateSong');
    const playPauseBtn = el('playPauseBtn');
    const seekBar = el('seekBar');

    makeDraggable(candle, placeCandles);
    makeDraggable(match);
    makeDraggable(knife);

    function placeCandles() {
      if (candlePlaced) return;
      candlePlaced = true;
      const spacing = cake.offsetWidth / 5;
      window.candleArray = [];
      for (let i = 0; i < 4; i++) {
        const c = document.createElement('img');
        c.src = 'assets/images/candle.png';
        c.className = 'cake-candle';
        c.style.position = 'absolute';
        c.style.width = '15px';
        c.style.left = (cake.offsetLeft + spacing * (i + 1) - 10) + 'px';
        c.style.top = (cake.offsetTop - 10) + 'px';
        document.querySelector('.table').appendChild(c);
        candleArray.push({ el: c });
      }
      candle.style.display = 'none';
      msg.innerText = 'Tap the matchbox to light the candles!';
    }

    match.addEventListener('click', () => {
      if (!candlePlaced || candleLit) return;
      candleLit = true;
      candleArray.forEach(c => {
        const f = document.createElement('img');
        f.src = 'assets/images/flame.png';
        f.className = 'flame';
        f.style.position = 'absolute';
        f.style.width = '15px';
        f.style.left = c.el.style.left;
        f.style.top = (parseInt(c.el.style.top) - 20) + 'px';
        f.style.zIndex = 10;
        document.querySelector('.table').appendChild(f);
      });
      match.style.display = 'none';
      msg.innerText = 'Now turn on the fan to blow them out!';
    });

    fanBtn.addEventListener('click', () => {
      if (!candleLit || fanOn) return;
      fanOn = true;
      fan.classList.add('fan-spin');

      setTimeout(() => {
        document.querySelectorAll('.flame, .cake-candle').forEach(el => el.remove());
        fan.classList.remove('fan-spin');

        const playPromise = song.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            msg.innerText += 'now wait & feel the music...';
            document.addEventListener('click', () => song.play(), { once: true });
          });
        }

        // Show CD player and start spinning
        cdPlayer.classList.add('visible');
        cdImage.classList.add('spinning');

        song.addEventListener("play", () => {
          playPauseBtn.textContent = '⏸';
          cdPlayer.classList.add('visible');
          cdImage.classList.add('spinning');
        });

        song.addEventListener("pause", () => {
          playPauseBtn.textContent = '▶';
          cdImage.classList.remove('spinning');
        });

        song.addEventListener("ended", () => {
          cdPlayer.classList.remove('visible');
          cdImage.classList.remove('spinning');
        });

        song.onended = () => {
          msg.innerText = 'Now cut the cake!';
          knife.style.cursor = 'pointer';
          cdPlayer.classList.remove('visible');
          fan.style.opacity = '0';
          fanBtn.style.opacity = '0';
          setTimeout(() => { fan.remove(); fanBtn.remove(); }, 500);
        };
      }, 2000);
    });

    // Music controls
    playPauseBtn.addEventListener('click', () => {
      if (song.paused) {
        song.play();
        playPauseBtn.textContent = '⏸';
        cdImage.classList.add('spinning');
      } else {
        song.pause();
        playPauseBtn.textContent = '▶';
        cdImage.classList.remove('spinning');
      }
    });

    song.addEventListener('timeupdate', () => {
      seekBar.value = (song.currentTime / song.duration) * 100 || 0;
    });

    seekBar.addEventListener('input', () => {
      song.currentTime = (seekBar.value / 100) * song.duration;
    });

knife.addEventListener('pointerup', () => {
  if (!fanOn || cakeCut) return;
  cakeCut = true;
  
  // Get original cake position and size
  const cakeRect = cake.getBoundingClientRect();
  const originalWidth = cake.width;
  const originalHeight = cake.height;
  
  // Hide original cake (but keep space)
  cake.style.visibility = 'hidden';
  
  // Create left piece (using exact dimensions from your image)
  const leftPiece = document.createElement('img');
  leftPiece.src = 'assets/images/cake-cut-left.png';
  leftPiece.style.position = 'absolute';
  leftPiece.style.left = `${cakeRect.left}px`;
  leftPiece.style.top = `${cakeRect.top}px`;
  leftPiece.style.width = `${originalWidth/2}px`; // Half width
  leftPiece.style.height = `${originalHeight}px`; // Full height
  leftPiece.style.objectFit = 'contain';
  leftPiece.style.transition = 'transform 1s ease-in-out';
  
  // Create right piece (using exact dimensions from your image)
  const rightPiece = document.createElement('img');
  rightPiece.src = 'assets/images/cake-cut-right.png';
  rightPiece.style.position = 'absolute';
  rightPiece.style.left = `${cakeRect.left + originalWidth/2}px`;
  rightPiece.style.top = `${cakeRect.top}px`;
  rightPiece.style.width = `${originalWidth/2}px`; // Half width
  rightPiece.style.height = `${originalHeight}px`; // Full height
  rightPiece.style.objectFit = 'contain';
  rightPiece.style.transition = 'transform 1s ease-in-out';
  
  document.body.appendChild(leftPiece);
  document.body.appendChild(rightPiece);
  
  // Animate pieces moving apart
  setTimeout(() => {
    leftPiece.style.transform = 'translateX(-80px)';
    rightPiece.style.transform = 'translateX(80px)';
  }, 50);
  
  // Position celebrate button perfectly centered
  setTimeout(() => {
    btn.style.left = `${cakeRect.left + originalWidth/2}px`;
    btn.style.top = `${cakeRect.top + originalHeight/2}px`;
    btn.style.transform = 'translate(-50%, -50%)';
    btn.classList.add('show');
  }, 1000);
  
  // Clean up other elements
  knife.classList.add('fade-out');
  fan.classList.add('fade-out');
  fanBtn.classList.add('fade-out');
  setTimeout(() => {
    knife.remove();
    fan.remove();
    fanBtn.remove();
    cake.remove();
  }, 600);
  
  msg.innerText = 'Tap "Let\'s Celebrate!"';
  btn.style.display = 'inline-block';
});

    btn.onclick = () => {
      msg.innerText = '🎉 Happy Celebration! 🎉';
      btn.style.display = 'none';
      window.open("celebration.html");
    };

    function el(id) { return document.getElementById(id); }

    function makeDraggable(el, onDrop) {
      let isDragging = false, sx, sy, ox, oy;
      el.addEventListener('pointerdown', e => {
        isDragging = true;
        el.setPointerCapture(e.pointerId);
        const r = el.getBoundingClientRect();
        ox = r.left; oy = r.top;
        sx = e.clientX; sy = e.clientY;
        el.style.zIndex = 1000;
        el.style.position = 'absolute';
      });
      el.addEventListener('pointermove', e => {
        if (!isDragging) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        el.style.left = (ox + dx) + 'px';
        el.style.top = (oy + dy) + 'px';
      });
      el.addEventListener('pointerup', e => {
        isDragging = false;
        el.releasePointerCapture(e.pointerId);
        el.style.zIndex = 3;
        if (onDrop) onDrop();
      });
    }
  }
});