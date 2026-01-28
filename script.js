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
    const isClosed = mobileMenu.classList.contains("opacity-0");
    if (isClosed) {
      mobileMenu.classList.remove("opacity-0", "pointer-events-none");
      iconMenu.classList.add("opacity-0");
      iconClose.classList.remove("opacity-0");
    } else {
      mobileMenu.classList.add("opacity-0", "pointer-events-none");
      iconMenu.classList.remove("opacity-0");
      iconClose.classList.add("opacity-0");
    }
  });

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
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
  }
});

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
  // 【修正】少しでも画面に入ったら検知するように変更（PCでの表示漏れ防止）
  threshold: 0,
  rootMargin: "0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // 監視を解除（一度だけ実行）
      observer.unobserve(entry.target);
      
      // 【修正】0.5秒後 (500ms) に表示クラスを付与
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, 500);
    }
  });
}, observerOptions);

// 監視を開始する関数
function initObserver() {
  const elements = document.querySelectorAll(".reveal-text, .reveal-image");
  elements.forEach((el) => {
    observer.observe(el);
  });
}

// 読み込み完了時と、全てのリソース読み込み後の両方で監視を確認
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initObserver);
} else {
  initObserver();
}
window.addEventListener('load', initObserver);


// 3. Background Canvas Animation
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
  let nextSpawnInterval = 0;
  let circles = [];
  let speed = 4;
  let animationId;
  const CHAR_X_POS = 40;
  const HIT_ZONE = 40;

  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startGame();
  });

  // Controls
  gameArea.parentElement.addEventListener('mousedown', handleInput);
  
  // Mobile Touch Fix
  gameArea.parentElement.addEventListener('touchstart', (e) => {
    if (e.target.closest('button') || e.target.id === 'start-game-btn') {
      return; 
    }
    
    if (isPlaying) {
      e.preventDefault();
      handleInput();
    }
  }, { passive: false });
  
  document.addEventListener('keydown', (e) => {
    if (isPlaying && e.code === 'Space') {
      e.preventDefault();
      handleInput();
    }
  });

  function setRandomInterval() {
    nextSpawnInterval = Math.random() * 2000 + 500;
  }

  function startGame() {
    isPlaying = true;
    score = 0;
    circles = [];
    speed = window.innerWidth < 768 ? 3 : 5;
    scoreDisplay.innerText = "0";
    gameUI.classList.add('opacity-0', 'pointer-events-none');
    document.querySelectorAll('.game-circle').forEach(el => el.remove());
    gameChar.innerText = "(^.^)";
    setRandomInterval();
    spawnTimer = 0;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }

  function handleInput() {
    if (!isPlaying) return;

    gameChar.style.transform = "translateY(-10px)";
    setTimeout(() => {
      gameChar.style.transform = "translateY(0)";
    }, 100);

    const circleElements = document.querySelectorAll('.game-circle');
    let closestDist = Infinity;
    let targetCircle = null;

    circleElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const areaRect = gameArea.getBoundingClientRect();
      const relativeX = rect.left - areaRect.left;
      const dist = relativeX - CHAR_X_POS;
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
    scoreDisplay.innerText = score;
    showFeedbackText(feedback, type);
    element.remove();
    circles = circles.filter(c => c.element !== element);
  }

  function showFeedbackText(text, type) {
    const el = document.createElement('div');
    el.classList.add('game-feedback', `feedback-${type}`);
    el.innerText = text;
    feedbackContainer.appendChild(el);
    setTimeout(() => { el.remove(); }, 800);
  }

  function spawnCircle() {
    const el = document.createElement('div');
    el.classList.add('game-circle');
    el.innerText = "○";
    el.style.left = "100%";
    gameArea.appendChild(el);
    circles.push({ element: el, x: gameArea.offsetWidth });
  }

  function gameLoop(timestamp) {
    if (!isPlaying) return;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    circles.forEach((circle, index) => {
      circle.x -= speed * (deltaTime / 16);
      circle.element.style.left = `${circle.x}px`;
      if (circle.x < -50) {
        circle.element.remove();
        circles.splice(index, 1);
        showFeedbackText("Bad", "bad");
      }
    });

    spawnTimer += deltaTime;
    if (spawnTimer > nextSpawnInterval) {
      spawnCircle();
      spawnTimer = 0;
      setRandomInterval();
      if(speed < 12) speed += 0.05;
    }
    animationId = requestAnimationFrame(gameLoop);
  }
})();