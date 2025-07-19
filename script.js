// ========== DOM ELEMENTS ==========
const countdownEl = document.getElementById('countdown');
const countdownSound = document.getElementById('countSound');
const messageBox = document.querySelector('.message-box');
const typingText = document.getElementById('typing-text');
const glowButton = document.getElementById('glow-button');
const typeSound = document.getElementById('typeSound');
const romanticMusic = document.getElementById('romanticMusic');

// ========== GAME VARIABLES ==========
let countdownNum = 10;
const messages = [
  "Today is a very special day for you both bhaiya and bhabhi ji...",
  "Here is the little gift from your little brother to feel you great ❤️"
];

// ========== COUNTDOWN FUNCTIONS ==========
function runCountdown() {
  countdownEl.innerText = countdownNum;
  countdownEl.classList.add("zoom");

  let interval = setInterval(() => {
    countdownNum--;
    countdownEl.innerText = countdownNum;
    countdownEl.classList.remove("zoom");
    void countdownEl.offsetWidth;
    countdownEl.classList.add("zoom");
    countdownSound.currentTime = 0;
    countdownSound.play();

    if (countdownNum === 4) {
      clearInterval(interval);
      fastCountdown();
    }
  }, 1000);
}

function fastCountdown() {
  let fastInterval = setInterval(() => {
    countdownNum--;
    countdownEl.innerText = countdownNum;
    countdownEl.classList.remove("zoom");
    void countdownEl.offsetWidth;
    countdownEl.classList.add("zoom");
    countdownSound.currentTime = 0;
    countdownSound.play();

    if (countdownNum === 1) {
      clearInterval(fastInterval);
      setTimeout(() => {
        countdownEl.classList.add('hidden');
        messageBox.classList.remove('hidden');
        typeMessage(0);
      }, 1000);
    }
  }, 300);
}

// ========== TYPING MESSAGE FUNCTIONS ==========
function typeMessage(i) {
  let index = 0;
  const message = messages[i];
  typingText.innerText = "";

  const type = setInterval(() => {
    if (index < message.length) {
      const char = message[index];
      typingText.innerText += char;
      if (char !== " ") {
        typeSound.currentTime = 0;
        typeSound.play();
      }
      index++;
    } else {
      clearInterval(type);
      if (i === 0) {
        setTimeout(() => deleteMessage(i), 800);
      } else {
        setTimeout(() => {
          glowButton.classList.remove('hidden');
        }, 500);
      }
    }
  }, 90);
}

function deleteMessage(i) {
  let msg = typingText.innerText;
  let index = msg.length;

  const del = setInterval(() => {
    msg = msg.slice(0, --index);
    typingText.innerText = msg;
    if (msg.length > 0 && msg[index] !== " ") {
      typeSound.currentTime = 0;
      typeSound.play();
    }
    if (index <= 0) {
      clearInterval(del);
      setTimeout(() => {
        typeMessage(i + 1);
      }, 300);
    }
  }, 60);
}

// ========== VISUAL EFFECTS ==========
function createFloatingElements() {
  const container = document.querySelector('.heart-container');

  setInterval(() => {
    // --- Heart ---
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (4 + Math.random() * 3) + 's';

    // Decide heart size: normal or big
    let scale, isBig = false;
    if (Math.random() < 0.2) { // 20% chance for a big heart
      scale = 2.2 + Math.random() * 1.5;
      isBig = true;
      heart.classList.add('big-heart');
    } else {
      scale = 0.7 + Math.random() * 1.3;
    }
    heart.style.transform = `rotate(${Math.random() * 360}deg) scale(${scale})`;

    // --- Confetti ---
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
    confetti.style.animationDuration = (3 + Math.random() * 2) + 's';

    container.appendChild(heart);
    container.appendChild(confetti);

    setTimeout(() => {
      heart.remove();
      confetti.remove();
    }, 7000);
  }, 300);
}

// ========== GAME START ==========
glowButton.addEventListener('click', () => {
  romanticMusic.volume = 0.5;
  romanticMusic.loop = true;
  if (romanticMusic.paused) {
    romanticMusic.play().catch(err => console.warn("Autoplay failed:", err));
  }

  // Save the music element before changing the body
  const savedMusic = romanticMusic;
  if (savedMusic.parentElement) savedMusic.parentElement.removeChild(savedMusic);

  document.body.innerHTML = ""; // Clear body for game
  document.body.appendChild(savedMusic);

  const heartTrans = document.createElement('div');
  heartTrans.className = 'transition-heart';
  document.body.appendChild(heartTrans);
  void heartTrans.offsetWidth;

  setTimeout(() => {
    heartTrans.remove();
    startGame();
  }, 1300);
});

// ========== GAME LOGIC ==========
function startGame() {
  // Save the music element before changing the body
  const savedMusic = romanticMusic;
  if (savedMusic.parentElement) savedMusic.parentElement.removeChild(savedMusic);

  document.body.innerHTML = `
    <div class="game-container">
      <div class="score-board">
        🎯 Today is 20 July — Catch 20 Hearts!
        <div id="score">Caught: 0 / 20</div>
      </div>
      <div id="basket"></div>
      <div id="heart-area"></div>
      <audio id="pop" src="assets/audio/pop.mp3" preload="auto"></audio>
    </div>
  `;

  document.body.appendChild(savedMusic);

  const basket = document.getElementById('basket');
  const heartArea = document.getElementById('heart-area');
  const scoreEl = document.getElementById('score');
  const popSound = document.getElementById('pop');

  let caught = 0;
  let isHolding = false;

  // Mouse event listeners
  basket.addEventListener('mousedown', (e) => {
    isHolding = true;
    e.preventDefault();
  });
  window.addEventListener('mouseup', () => isHolding = false);
  window.addEventListener('mousemove', (e) => {
    if (isHolding) {
      let x = Math.max(0, Math.min(e.clientX - basket.offsetWidth / 2, window.innerWidth - basket.offsetWidth));
      basket.style.left = `${x}px`;
    }
  });

  // Touch event listeners
  basket.addEventListener('touchstart', (e) => {
    isHolding = true;
    e.preventDefault();
  });
  window.addEventListener('touchend', () => isHolding = false);
  window.addEventListener('touchmove', (e) => {
    if (isHolding && e.touches.length > 0) {
      let touch = e.touches[0];
      let x = Math.max(0, Math.min(touch.clientX - basket.offsetWidth / 2, window.innerWidth - basket.offsetWidth));
      basket.style.left = `${x}px`;
    }
  });

  function dropHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-fall';
    let isSpecial = (caught === 19); // 20th heart (0-based)
    let dodges = 0;
    let maxDodges = 2 + Math.floor(Math.random() * 2); // 2 or 3 dodges

    // Random or special position
    let left = Math.random() * (window.innerWidth - 40);
    heart.style.left = left + 'px';

    // Random duration for normal hearts
    let duration = Math.random() * 3.5 + 1.5; // 1.5s to 5s
    if (isSpecial) duration = 4; // Special heart a bit slower

    heart.style.animationDuration = duration + 's';
    heartArea.appendChild(heart);

    let fallTimer = setInterval(() => {
      const hRect = heart.getBoundingClientRect();
      const bRect = basket.getBoundingClientRect();

      if (isSpecial && dodges < maxDodges) {
        // If basket is under heart, dodge!
        if (
          hRect.bottom >= bRect.top - 30 &&
          hRect.left < bRect.right &&
          hRect.right > bRect.left
        ) {
          // Move heart to a new random position
          left = Math.random() * (window.innerWidth - 40);
          heart.style.left = left + 'px';
          dodges++;
          return; // Don't check for catch yet
        }
      }

      // After dodging, allow to be caught
      if (
        hRect.bottom >= bRect.top &&
        hRect.left < bRect.right &&
        hRect.right > bRect.left
      ) {
        heart.remove();
        clearInterval(fallTimer);
        popSound.currentTime = 0;
        popSound.play();
        caught++;
        scoreEl.textContent = `Caught: ${caught} / 20`;
        if (caught === 20) showQuizScene();
      }
    }, 30);

    setTimeout(() => {
      if (heart.parentElement) {
        heart.remove();
        clearInterval(fallTimer);
        if (caught > 0 && !isSpecial) {
          caught--;
          scoreEl.textContent = `Caught: ${caught} / 20`;
        }
      }
    }, duration * 1000);
  }

  function randomHeartEngine() {
    if (caught >= 20) return;
    dropHeart();
    const nextDelay = Math.random() * 600 + 400; // 400ms to 1000ms between hearts
    setTimeout(randomHeartEngine, nextDelay);
  }

  randomHeartEngine();
}

// ========== QUIZ FUNCTIONS ==========
function showQuizScene() {
  const quizButton = document.createElement('button');
  quizButton.innerText = 'Go to Quiz';
  quizButton.className = 'glow-button';
  quizButton.style.marginTop = '20px';

  const quizMessage = document.createElement('div');
  quizMessage.innerHTML = `
    <h2>💖 🎉 Woww... 💖</h2>
    <h2>💖 🎉 Congratulations... bruh... you caught all 20 hearts! so smart...💖</h2>
    <p>Your love score is unbeatable!</p>
    <p>Love Quiz Coming Next...</p>
  `;

  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.justifyContent = 'center';
  wrapper.style.alignItems = 'center';
  wrapper.style.height = '100vh';
  wrapper.style.textAlign = 'center';
  wrapper.style.animation = 'fadeIn 1s ease';

  wrapper.appendChild(quizMessage);
  wrapper.appendChild(quizButton);

  const gameContainer = document.querySelector('.game-container');
  if (gameContainer) {
    gameContainer.innerHTML = '';
    gameContainer.appendChild(wrapper);
  } else {
    document.body.innerHTML = '';
    document.body.appendChild(wrapper);
  }

  quizButton.onclick = () => {
    if (gameContainer) gameContainer.remove();
    startQuiz();
  };
}

const quizData = [
  {
    question: "How much do you love each other?",
    answers: ["Little", "Moderate", "Very Much", "Can't explain"],
    correct: 3
  },
  {
    question: "How did you first meet?",
    answers: ["Online", "By friends", "Cafe", "Bus Stop"],
    correct: 1
  },
  {
    question: "Who says sorry first after a fight?",
    answers: ["Bhaiya", "Bhabhi", "Both Together", "No one"],
    correct: 2
  },
  {
    question: "How many stars in your love?",
    answers: ["3", "4", "5", "Unlimited"],
    correct: 3
  }
];

let currentQ = 0;
let score = 0;

function startQuiz() {
  const savedMusic = romanticMusic;
  if (savedMusic.parentElement) savedMusic.parentElement.removeChild(savedMusic);

  document.body.innerHTML = `
    <div class="quiz-container" style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(to right, #ffe5f2, #ffd6e8); font-family: sans-serif; text-align: center;">
      <h2 id="quiz-question" style="font-size: 24px; color: #d0006f; margin-bottom: 30px;"></h2>
      <div id="quiz-answers" style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px;"></div>
      <button id="submit-answer" class="glow-button hidden" style="margin-top: 20px;">Submit Answer</button>
      <div class="quiz-report hidden" style="margin-top: 40px;">
        <h3 id="quiz-results" style="color: green;"></h3>
        <button id="retake-quiz" class="glow-button" style="margin-top: 20px;">Retake Quiz</button>
        <button id="go-to-cake-cutting-scene" class="glow-button" style="margin-top: 20px; display:none;">Go to Cake Cutting Scene</button>
      </div>
    </div>
  `;
  document.body.appendChild(savedMusic);

  currentQ = 0;
  score = 0;
  showQuestion();
}

function typeQuizQuestion(text, callback) {
  const quizQ = document.getElementById("quiz-question");
  quizQ.innerHTML = "";
  let idx = 0;
  
  function typeNext() {
    if (idx < text.length) {
      quizQ.innerHTML += text[idx] === " " ? "&nbsp;" : text[idx];
      if (text[idx] !== " ") {
        typeSound.currentTime = 0;
        typeSound.play();
      }
      idx++;
      setTimeout(typeNext, 50);
    } else if (callback) {
      callback();
    }
  }
  typeNext();
}

function showQuestion() {
  const q = quizData[currentQ];
  const answersContainer = document.getElementById("quiz-answers");
  answersContainer.innerHTML = "";
  document.getElementById("submit-answer").classList.add("hidden");
  document.getElementById("submit-answer").dataset.selected = "";

  typeQuizQuestion(q.question, () => {
    q.answers.forEach((ans, idx) => {
      const label = document.createElement("label");
      label.innerText = ans;
      label.style.padding = "10px 20px";
      label.style.border = "2px solid #ff99bb";
      label.style.borderRadius = "10px";
      label.style.cursor = "pointer";
      label.style.background = "#fff";
      label.style.fontWeight = "bold";

      label.addEventListener("click", () => {
        document.querySelectorAll("#quiz-answers label").forEach(l => {
          l.style.background = "#fff";
          l.style.color = "#000";
        });

        label.style.background = "#ffc1cc";
        label.style.color = "#111";
        document.getElementById("submit-answer").dataset.selected = idx;
        document.getElementById("submit-answer").classList.remove("hidden");
      });

      answersContainer.appendChild(label);
    });
  });
}

// ========== EVENT LISTENERS ==========
document.addEventListener("click", function(e) {
  if (e.target.id === "submit-answer") {
    const selected = parseInt(e.target.dataset.selected);
    if (selected === quizData[currentQ].correct) score++;

    currentQ++;
    e.target.classList.add("hidden");

    if (currentQ < quizData.length) {
      showQuestion();
    } else {
      document.getElementById("quiz-question").classList.add("hidden");
      document.getElementById("quiz-answers").classList.add("hidden");
      document.querySelector(".quiz-report").classList.remove("hidden");
      document.getElementById("quiz-results").innerText =
        score === quizData.length
          ? `🎯 Perfect! You got all ${quizData.length} correct!`
          : `You got ${score} out of ${quizData.length} correct. Try again!`;
      document.getElementById("retake-quiz").style.display =
        score === quizData.length ? "none" : "inline-block";
      document.getElementById("go-to-cake-cutting-scene").style.display =
        score === quizData.length ? "inline-block" : "none";
    }
  }

  if (e.target.id === "retake-quiz") {
    startQuiz();
  }

  if (e.target.id === "go-to-cake-cutting-scene") {
    window.open('cake.html', '_blank');
  }
});

// ========== INITIALIZE GAME ==========
runCountdown();
createFloatingElements();