// Initialize Lucide Icons
lucide.createIcons();

// --- Mobile Menu Logic ---
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const iconMenu = document.getElementById("icon-menu");
const iconClose = document.getElementById("icon-close");
const mobileLinks = document.querySelectorAll(".mobile-link");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    // Toggle Menu Visibility
    const isClosed = mobileMenu.classList.contains("opacity-0");

    if (isClosed) {
      // Open
      mobileMenu.classList.remove("opacity-0", "pointer-events-none");
      iconMenu.classList.add("opacity-0");
      iconClose.classList.remove("opacity-0");
    } else {
      // Close
      mobileMenu.classList.add("opacity-0", "pointer-events-none");
      iconMenu.classList.remove("opacity-0");
      iconClose.classList.add("opacity-0");
    }
  });

  // Close menu when a link is clicked
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("opacity-0", "pointer-events-none");
      iconMenu.classList.remove("opacity-0");
      iconClose.classList.add("opacity-0");
    });
  });
}

// --- Copy to Clipboard Logic ---
const copyBtn = document.getElementById("copy-email-btn");
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText("isjm002100@gmail.com");
    alert("Copied!");
  });
}

// 1. Custom Cursor Logic
const cursor = document.getElementById("cursor");
const cursorDot = document.getElementById("cursor-dot");

let mouseX = 0,
  mouseY = 0;
let cursorX = 0,
  cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Immediate update for dot
  if (cursorDot) {
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
  }
});

// Smooth follow for outer circle
function animateCursor() {
  if (cursor) {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effects
const triggers = document.querySelectorAll(".hover-trigger");
triggers.forEach((trigger) => {
  trigger.addEventListener("mouseenter", () => {
    if (cursor) cursor.classList.add("active");
  });
  trigger.addEventListener("mouseleave", () => {
    if (cursor) cursor.classList.remove("active");
  });
});

// 2. Scroll Animation (Intersection Observer)
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target); // Trigger once
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal-text, .reveal-image").forEach((el) => {
  observer.observe(el);
});

// 3. Background Canvas Animation (Abstract Tech/Flow)
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2;
      this.color = Math.random() > 0.9 ? "#3b82f6" : "#333";
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const particleCount = Math.min(window.innerWidth / 15, 100);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      p.update();
      p.draw();

      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(50, 50, 50, ${1 - dist / 100})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animateCanvas);
  }

  window.addEventListener("resize", () => {
    resize();
    initParticles();
  });

  resize();
  initParticles();
  animateCanvas();
}

// --- Mini Game Logic ---
(function() {
  const startBtn = document.getElementById('start-game-btn');
  const gameUI = document.getElementById('game-ui');
  const gameArea = document.getElementById('game-area');
  const gameChar = document.getElementById('game-char');
  const scoreDisplay = document.getElementById('score-display');
  const feedbackContainer = document.getElementById('feedback-container');

  if (!gameArea) return;

  let isPlaying = false;
  let score = 0;
  let lastTime = 0;
  let spawnTimer = 0;
  let nextSpawnInterval = 0; // 次のスポーンまでの時間を格納
  let circles = [];
  let speed = 4;
  let animationId;

  // Configuration
  const CHAR_X_POS = 40; // Approximate left position of character center (px)
  const HIT_ZONE = 40;   // Tolerance +/- px

  // Start Game
  startBtn.addEventListener('click', () => {
    startGame();
  });

  // Controls (Mouse/Touch & Keyboard)
  gameArea.parentElement.addEventListener('mousedown', handleInput);
  gameArea.parentElement.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scroll
    handleInput();
  }, { passive: false });
  
  document.addEventListener('keydown', (e) => {
    if (isPlaying && e.code === 'Space') {
      e.preventDefault(); // Prevent scroll
      handleInput();
    }
  });

  function setRandomInterval() {
    // 0.5秒(500ms) 〜 2.5秒(2500ms) の間でランダムに決定
    nextSpawnInterval = Math.random() * 2000 + 500;
  }

  function startGame() {
    isPlaying = true;
    score = 0;
    circles = [];
    speed = window.innerWidth < 768 ? 3 : 5;
    scoreDisplay.innerText = "0";
    gameUI.classList.add('opacity-0', 'pointer-events-none');
    
    // Clear existing elements
    document.querySelectorAll('.game-circle').forEach(el => el.remove());
    
    // Character reset
    gameChar.innerText = "(^.^)";
    
    // 初回のスポーン時間をセット
    setRandomInterval();
    spawnTimer = 0;
    
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }

  function handleInput() {
    if (!isPlaying) return;

    // Character Jump/Bop Animation
    gameChar.style.transform = "translateY(-10px)";
    setTimeout(() => {
      gameChar.style.transform = "translateY(0)";
    }, 100);

    // Check collision
    // Find the closest circle to the character
    const circleElements = document.querySelectorAll('.game-circle');
    let closestDist = Infinity;
    let targetCircle = null;

    circleElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const areaRect = gameArea.getBoundingClientRect();
      
      // Calculate position relative to game area
      const relativeX = rect.left - areaRect.left;
      
      // Distance to character center (approx 50px from left)
      const dist = relativeX - CHAR_X_POS;
      
      // We only care about circles that are close, even if slightly passed
      if (Math.abs(dist) < closestDist) {
        closestDist = dist;
        targetCircle = el;
      }
    });

    if (targetCircle && Math.abs(closestDist) < HIT_ZONE) {
      evaluateHit(closestDist, targetCircle);
    }
  }

  function evaluateHit(dist, element) {
    const absDist = Math.abs(dist);
    let feedback = "";
    let type = "";

    if (absDist < 15) {
      feedback = "Nice!!";
      type = "nice";
      score += 100;
      gameChar.classList.add('char-hit');
      setTimeout(() => gameChar.classList.remove('char-hit'), 200);
    } else if (absDist < 30) {
      feedback = "Good";
      type = "good";
      score += 50;
    } else {
      feedback = "Bad";
      type = "bad";
      score += 10;
    }

    // Update Score
    scoreDisplay.innerText = score;
    
    // Show Visual Feedback
    showFeedbackText(feedback, type);

    // Remove the circle
    element.remove();
    // Remove from array logic
    circles = circles.filter(c => c.element !== element);
  }

  function showFeedbackText(text, type) {
    const el = document.createElement('div');
    el.classList.add('game-feedback', `feedback-${type}`);
    el.innerText = text;
    feedbackContainer.appendChild(el);
    
    // Auto remove after animation
    setTimeout(() => {
      el.remove();
    }, 800);
  }

  function spawnCircle() {
    const el = document.createElement('div');
    el.classList.add('game-circle');
    el.innerText = "○";
    el.style.left = "100%"; // Start from right
    gameArea.appendChild(el);

    circles.push({
      element: el,
      x: gameArea.offsetWidth
    });
  }

  function gameLoop(timestamp) {
    if (!isPlaying) return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Move Circles
    circles.forEach((circle, index) => {
      circle.x -= speed * (deltaTime / 16); // normalize speed
      circle.element.style.left = `${circle.x}px`;

      // Remove if off screen
      if (circle.x < -50) {
        circle.element.remove();
        circles.splice(index, 1);
        
        // Missed text
        showFeedbackText("Bad", "bad");
      }
    });

    // Spawn Logic (Updated Random Interval)
    spawnTimer += deltaTime;
    if (spawnTimer > nextSpawnInterval) {
      spawnCircle();
      spawnTimer = 0;
      setRandomInterval(); // 次のスポーンまでの時間をランダム再設定

      // Increase speed slightly over time
      if(speed < 12) speed += 0.05;
    }

    animationId = requestAnimationFrame(gameLoop);
  }
})();