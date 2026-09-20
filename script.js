const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const pageWipe = document.getElementById('pageWipe');
const scrollLine = document.getElementById('scrollLine');
const cursorOrb = document.getElementById('cursorOrb');

const savedTheme = localStorage.getItem('badal-theme');
if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

function updateThemeIcon() {
  if (!themeToggle) return;
  themeToggle.textContent = root.dataset.theme === 'light' ? '☀' : '☾';
}
updateThemeIcon();

themeToggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('badal-theme', root.dataset.theme);
  updateThemeIcon();
});

/* ---------------- Cinematic route transition ---------------- */
function buildTransitionMarkup() {
  if (!pageWipe) return;
  pageWipe.classList.remove('hidden', 'entered', 'leaving');
  pageWipe.innerHTML = `
    <div class="wipe-panel"></div>
    <div class="wipe-panel"></div>
    <div class="wipe-panel"></div>
    <div class="wipe-content" aria-hidden="true">
      <span class="wipe-mark">BK</span>
      <span class="wipe-label">BADAL KALRA</span>
    </div>
  `;
}

function enterPage() {
  if (!pageWipe) return;
  buildTransitionMarkup();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pageWipe.classList.add('entered');
      window.setTimeout(() => {
        pageWipe.classList.add('hidden');
        document.body.classList.remove('is-transitioning');
      }, 980);
    });
  });
}

let navigationLocked = false;
function leavePage(href) {
  if (!pageWipe || navigationLocked) return;
  navigationLocked = true;
  document.body.classList.add('is-transitioning');
  pageWipe.classList.remove('hidden', 'entered');
  pageWipe.classList.add('leaving');
  window.setTimeout(() => { window.location.href = href; }, 820);
}

window.addEventListener('pageshow', (event) => {
  if (!event.persisted) enterPage();
});

/* -------- Section navigation: smooth scroll + focus pulse -------- */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.classList.add('section-focus');
    window.setTimeout(() => target.classList.remove('section-focus'), 900);
    history.replaceState(null, '', id);
  });
});

/* -------- Dedicated pages: curtain transition -------- */
document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.protocol !== window.location.protocol || link.host !== window.location.host) return;
    event.preventDefault();
    leavePage(link.href);
  });
});

/* ---------------- Active navigation ---------------- */
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
const activeMap = new Map(navLinks.map(link => [link.getAttribute('href').replace(/^.*#/, ''), link]));
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.remove('active'));
    activeMap.get(entry.target.id)?.classList.add('active');
  });
}, { rootMargin: '-32% 0px -56% 0px', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

/* ---------------- Editorial reveal choreography ---------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .12, rootMargin: '0px 0px -4% 0px' });
document.querySelectorAll('.reveal-section').forEach(el => revealObserver.observe(el));

const heroLines = [...document.querySelectorAll('.hero-line > span')];
window.setTimeout(() => {
  heroLines.forEach((line, index) => {
    window.setTimeout(() => line.classList.add('show'), 110 * index);
  });
}, 320);

/* ---------------- Scroll effects ---------------- */
let ticking = false;
function updateScrollEffects() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  if (scrollLine) scrollLine.style.transform = `scaleX(${progress})`;
  document.querySelectorAll('[data-speed]').forEach(el => {
    const rect = el.getBoundingClientRect();
    const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * parseFloat(el.dataset.speed || '0');
    el.style.setProperty('--parallax', `${offset}px`);
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}, { passive: true });
updateScrollEffects();

/* ---------------- Cursor / magnetic interactions ---------------- */
if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', (event) => {
      const r = el.getBoundingClientRect();
      const x = (event.clientX - (r.left + r.width / 2)) * 0.10;
      const y = (event.clientY - (r.top + r.height / 2)) * 0.10;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  document.addEventListener('pointermove', (event) => {
    cursorOrb?.style.setProperty('--x', `${event.clientX}px`);
    cursorOrb?.style.setProperty('--y', `${event.clientY}px`);
  }, { passive: true });

  document.querySelectorAll('.case-card, .primary-btn, .secondary-btn, .outline-pill').forEach(el => {
    el.addEventListener('pointerenter', () => cursorOrb?.classList.add('cursor-active'));
    el.addEventListener('pointerleave', () => cursorOrb?.classList.remove('cursor-active'));
  });
}

/* ---------------- Project spotlight ---------------- */
document.querySelectorAll('.case-card').forEach(card => {
  card.addEventListener('pointermove', event => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - r.left}px`);
    card.style.setProperty('--my', `${event.clientY - r.top}px`);
  });
});

/* tactile click feedback */
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('pointerdown', () => el.classList.add('is-pressed'));
  el.addEventListener('pointerup', () => el.classList.remove('is-pressed'));
  el.addEventListener('pointerleave', () => el.classList.remove('is-pressed'));
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    navigationLocked = false;
    document.body.classList.remove('is-transitioning');
    pageWipe?.classList.add('entered', 'hidden');
  }
});


/* ---------------- Evidence image viewer ---------------- */
const evidenceModal = document.getElementById('evidenceModal');
const evidenceImage = document.getElementById('evidenceImage');
const evidenceFallback = document.getElementById('evidenceFallback');
const evidenceTitle = document.getElementById('evidenceTitle');
const evidenceLink = document.getElementById('evidenceLink');

function closeEvidence() {
  if (!evidenceModal) return;
  evidenceModal.classList.remove('open');
  evidenceModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (evidenceImage) {
    evidenceImage.hidden = true;
    evidenceImage.removeAttribute('src');
  }
}

function openEvidence(card) {
  if (!evidenceModal) return;
  const image = card.dataset.image;
  const link = card.dataset.link;
  const title = card.dataset.title || 'Recognition';
  evidenceTitle.textContent = title;
  evidenceLink.href = link || '#';
  evidenceFallback.hidden = true;
  evidenceImage.hidden = true;
  evidenceImage.onload = () => {
    evidenceImage.hidden = false;
    evidenceFallback.hidden = true;
  };
  evidenceImage.onerror = () => {
    evidenceImage.hidden = true;
    evidenceFallback.hidden = false;
  };
  if (image) {
    evidenceImage.alt = title;
    evidenceImage.src = image;
  } else {
    evidenceFallback.hidden = false;
  }
  evidenceModal.classList.add('open');
  evidenceModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

document.querySelectorAll('.evidence-card').forEach(card => {
  card.addEventListener('click', () => openEvidence(card));
});
document.querySelectorAll('[data-close-evidence]').forEach(el => el.addEventListener('click', closeEvidence));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeEvidence(); });

/* ---------------- Robust resume action ---------------- */
async function downloadResume(event) {
  event.preventDefault();
  const href = new URL('./resume.pdf', document.baseURI).href;
  let fallback = null;
  try { fallback = window.open(href, '_blank', 'noopener,noreferrer'); } catch (_) {}
  try {
    const response = await fetch(href, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Resume request failed: ${response.status}`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = 'Badal-Kalra-Resume.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  } catch (_) {
    if (!fallback) window.location.assign(href);
  }
}

document.querySelectorAll('a[href$="resume.pdf"]').forEach(link => link.addEventListener('click', downloadResume));

/* ---------------- Advanced awards interactions ---------------- */
const awardRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('award-visible');
    awardRevealObserver.unobserve(entry.target);
  });
}, { threshold: .18, rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.award-featured, .award-compact').forEach((el) => awardRevealObserver.observe(el));

if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.award-featured').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const r = card.getBoundingClientRect();
      const px = (event.clientX - r.left) / r.width;
      const py = (event.clientY - r.top) / r.height;
      const rotateY = (px - 0.5) * 5;
      const rotateX = (0.5 - py) * 3.5;
      card.style.setProperty('--tilt-y', `${rotateY}deg`);
      card.style.setProperty('--tilt-x', `${rotateX}deg`);
      card.style.setProperty('--spot-x', `${px * 100}%`);
      card.style.setProperty('--spot-y', `${py * 100}%`);
      card.classList.add('is-award-active');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--spot-x', '50%');
      card.style.setProperty('--spot-y', '30%');
      card.classList.remove('is-award-active');
    });
  });
}

/* Smoothly pulse a section when reached through in-page navigation. */
document.querySelectorAll('.nav a[href^="#"], .outline-pill[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    target.classList.remove('section-focus-advanced');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => target.classList.add('section-focus-advanced'));
    });
    window.setTimeout(() => target.classList.remove('section-focus-advanced'), 1250);
  });
});
