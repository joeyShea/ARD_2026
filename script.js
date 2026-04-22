// ── Star canvas ────────────────────────────────────────────────
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars(n) {
  stars = Array.from({ length: n }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.1 + 0.2,
    alpha: Math.random(),
    speed: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    gold: Math.random() < 0.07
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    s.alpha += s.speed;
    if (s.alpha >= 1) { s.alpha = 1; s.speed *= -1; }
    if (s.alpha <= 0) { s.alpha = 0; s.speed *= -1; }
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.gold
      ? `rgba(201,168,76,${s.alpha})`
      : `rgba(200,212,255,${s.alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}

resizeCanvas();
initStars(130);
drawStars();
window.addEventListener('resize', () => { resizeCanvas(); initStars(130); });

// ── Navigation dots ────────────────────────────────────────────
const sections = Array.from(document.querySelectorAll('.section'));
const navEl = document.getElementById('nav-dots');
let currentIndex = 0;

sections.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Section ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  navEl.appendChild(dot);
});

function dots() { return navEl.querySelectorAll('.nav-dot'); }

function goTo(i) {
  sections[i].scrollIntoView({ behavior: 'smooth' });
}

// ── Keyboard navigation ────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault();
    if (currentIndex < sections.length - 1) goTo(currentIndex + 1);
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    if (currentIndex > 0) goTo(currentIndex - 1);
  }
});

// ── Track active section via IntersectionObserver ──────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = +entry.target.dataset.index;
      currentIndex = idx;
      dots().forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => io.observe(s));
