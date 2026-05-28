/* ============================================================
   PORTFOLIO — script.js
   Features:
   ✅ EmailJS contact form (real email sending)
   ✅ Resume download with missing-file toast
   ✅ Certificate links open in new tab (configured in HTML)
   ✅ Loader, cursor, navbar, typed text, scroll reveal,
      count-up stats, skill bars, project filter, back-to-top,
      orb parallax, card tilt
============================================================ */

/* ════════════════════════════════════════════════════════════
   ▶  EMAILJS CONFIG — fill these 3 values to enable email
   ════════════════════════════════════════════════════════════
   1. Sign up free at https://www.emailjs.com
   2. Add an Email Service (Gmail recommended) → copy Service ID
   3. Create an Email Template with variables:
        {{from_name}}  {{from_email}}  {{subject}}  {{message}}
      → copy Template ID
   4. Account → API Keys → copy Public Key
   5. Paste all three below and save
   ════════════════════════════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_xxxxxx'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xxxxxx'

/* ════════════════════════════════════════════════════════════
   ▶  YOUR EMAIL ADDRESS — messages are delivered here
   ════════════════════════════════════════════════════════════ */
const TO_EMAIL = 'your@email.com';  // ← change to your real email

document.addEventListener('DOMContentLoaded', () => {

  /* ── INIT EMAILJS ─────────────────────────────────────── */
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }


  /* ── 1. LOADER ─────────────────────────────────────────── */
  const loaderFill = document.getElementById('loader-fill');
  let pct = 0;
  const tick = setInterval(() => {
    pct += Math.random() * 18;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      loaderFill.style.width = '100%';
      setTimeout(() => document.body.classList.add('loaded'), 450);
    }
    loaderFill.style.width = pct + '%';
  }, 80);


  /* ── 2. CUSTOM CURSOR (desktop only) ─────────────────── */
  const isTouchDevice = window.matchMedia('(hover:none)').matches;
  if (!isTouchDevice) {
    const cur = document.getElementById('cursor');
    const fol = document.getElementById('cursor-follower');
    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });
    (function animFol() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      fol.style.left = fx + 'px';
      fol.style.top  = fy + 'px';
      requestAnimationFrame(animFol);
    })();

    document.querySelectorAll('a,button,.cert-card,.project-card,.sport-card,.filter-btn,.tech-tag').forEach(el => {
      el.addEventListener('mouseenter', () => { cur.classList.add('hover'); fol.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); fol.classList.remove('hover'); });
    });
  }


  /* ── 3. NAVBAR: scroll style + active link ───────────── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 80);

    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });

    document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ── 4. HAMBURGER MENU ──────────────────────────────── */
  const hamburger    = document.getElementById('hamburger');
  const navLinksList = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinksList.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinksList.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksList.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });


  /* ── 5. TYPED TEXT ──────────────────────────────────── */
  const typedEl = document.getElementById('typed');
  const words   = ['Full Stack Developer','UI/UX Enthusiast','Problem Solver','Open Source Contributor','Tech Explorer'];
  let wi = 0, ci = 0, deleting = false, delay = 80;

  function type() {
    const word = words[wi];
    typedEl.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
    deleting ? ci-- : ci++;

    if (!deleting && ci === word.length) { deleting = true; delay = 2200; }
    else if (deleting && ci === 0)       { deleting = false; wi = (wi + 1) % words.length; delay = 400; }
    else delay = deleting ? 45 : 80 + Math.random() * 40;

    setTimeout(type, delay);
  }
  setTimeout(type, 2000);


  /* ── 6. SCROLL REVEAL ───────────────────────────────── */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      const d = parseFloat(getComputedStyle(target).getPropertyValue('--delay')) || 0;
      setTimeout(() => target.classList.add('visible'), d * 1000);
      ro.unobserve(target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => ro.observe(el));


  /* ── 7. COUNT-UP STATS ──────────────────────────────── */
  const co = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      const goal = +target.dataset.target;
      let n = 0;
      const step = Math.ceil(goal / 40);
      const t = setInterval(() => {
        n = Math.min(n + step, goal);
        target.textContent = n;
        if (n >= goal) clearInterval(t);
      }, 40);
      co.unobserve(target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => co.observe(el));


  /* ── 8. SKILL BARS ──────────────────────────────────── */
  const so = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.style.width = target.dataset.width + '%';
      so.unobserve(target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-bar-fill').forEach(el => so.observe(el));


  /* ── 9. PROJECT FILTER ──────────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;

      projectCards.forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'filterReveal .4s ease forwards';
        }
      });
    });
  });


  /* ── 10. RESUME DOWNLOAD ────────────────────────────── */
  /*
   * The <a href="resume.pdf" download="..."> in HTML handles the
   * actual file download automatically.  This guard checks if the
   * file exists (HTTP only) and shows a toast when it's missing,
   * so you get a clear developer-friendly error during setup.
   *
   * HOW TO SET UP:
   *   • Name your resume file exactly  resume.pdf
   *   • Place it in the SAME folder as index.html
   *   • That's it — the browser download dialog opens on click
   */
  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', e => {
      // Only run the HEAD check over HTTP/HTTPS (not file://)
      if (location.protocol.startsWith('http')) {
        fetch('resume.pdf', { method: 'HEAD' })
          .then(res => {
            if (!res.ok) {
              e.preventDefault();
              showToast('⚠️ resume.pdf not found — place your PDF in the same folder as index.html', 'warn');
            }
            // File exists → browser follows the <a download> naturally
          })
          .catch(() => {
            // Network error — let the link proceed normally
          });
      }
    });
  }


  /* ── 11. CONTACT FORM WITH EMAILJS ─────────────────── */
  /*
   * This sends a real email to your inbox using EmailJS.
   * Fill in EMAILJS_PUBLIC_KEY / SERVICE_ID / TEMPLATE_ID at
   * the top of this file, then it works without any backend.
   *
   * EmailJS free plan: 200 emails/month — perfect for a portfolio.
   */
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText   = submitBtn.querySelector('.btn-text');
  const btnLoad   = submitBtn.querySelector('.btn-loading');
  const successEl = document.getElementById('form-success');
  const errorEl   = document.getElementById('form-error-msg');

  const validators = {
    fname:    v => v.trim().length >= 2  ? '' : 'Please enter your full name.',
    femail:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email.',
    fsubject: v => v.trim().length >= 3  ? '' : 'Please enter a subject.',
    fmessage: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.',
  };

  function validateField(id) {
    const input = document.getElementById(id);
    const errEl = document.getElementById('err-' + id);
    if (!input || !errEl) return true;
    const msg = validators[id](input.value);
    errEl.textContent = msg;
    input.style.borderColor = msg ? '#f87171' : '';
    return !msg;
  }

  Object.keys(validators).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validateField(id));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const valid = Object.keys(validators).map(validateField).every(Boolean);
    if (!valid) return;

    // Show loading state
    btnText.hidden  = true;
    btnLoad.hidden  = false;
    submitBtn.disabled = true;
    successEl.hidden   = true;
    successEl.style.display = '';
    errorEl.hidden     = true;
    errorEl.style.display = '';

    /* Build the template parameters that match your EmailJS template.
       Variable names must match exactly what you used in the template
       editor on emailjs.com (the {{variable_name}} placeholders).     */
    const templateParams = {
      from_name:  document.getElementById('fname').value.trim(),
      from_email: document.getElementById('femail').value.trim(),
      subject:    document.getElementById('fsubject').value.trim(),
      message:    document.getElementById('fmessage').value.trim(),
      to_email:   TO_EMAIL,   // optional — use in template as {{to_email}}
      reply_to:   document.getElementById('femail').value.trim(),
    };

    try {
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS not loaded — check your internet connection or script tag.');
      }

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      // ✅ Success
      btnText.hidden     = false;
      btnLoad.hidden     = true;
      submitBtn.disabled = false;
      successEl.hidden   = false;
      successEl.style.display = 'flex';
      form.reset();
      Object.keys(validators).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.borderColor = '';
        const errEl = document.getElementById('err-' + id);
        if (errEl) errEl.textContent = '';
      });
      setTimeout(() => {
        successEl.hidden = true;
        successEl.style.display = '';
      }, 6000);

    } catch (err) {
      // ❌ Error
      console.error('EmailJS error:', err);
      btnText.hidden     = false;
      btnLoad.hidden     = true;
      submitBtn.disabled = false;
      errorEl.hidden     = false;
      errorEl.style.display = 'flex';
      setTimeout(() => {
        errorEl.hidden = true;
        errorEl.style.display = '';
      }, 6000);
    }
  });


  /* ── 12. BACK TO TOP ────────────────────────────────── */
  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── 13. FOOTER YEAR ────────────────────────────────── */
  document.getElementById('year').textContent = new Date().getFullYear();


  /* ── 14. SMOOTH ANCHOR LINKS ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + scrollY - navbar.offsetHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── 15. ORB PARALLAX ───────────────────────────────── */
  if (!isTouchDevice) {
    document.addEventListener('mousemove', e => {
      const dx = (e.clientX - innerWidth  / 2) / innerWidth;
      const dy = (e.clientY - innerHeight / 2) / innerHeight;
      document.querySelectorAll('.orb').forEach((o, i) => {
        const f = (i + 1) * 18;
        o.style.transform = `translate(${dx * f}px,${dy * f}px)`;
      });
    });
  }


  /* ── 16. CARD TILT (desktop only) ──────────────────── */
  if (!isTouchDevice) {
    document.querySelectorAll('.cert-card,.sport-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top)  / r.height - .5) * -10;
        const ry = ((e.clientX - r.left) / r.width  - .5) *  10;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }


  /* ── 17. INJECT @keyframes for filter ──────────────── */
  try {
    const sheet = document.styleSheets[0];
    sheet.insertRule(`
      @keyframes filterReveal {
        from { opacity:0; transform:scale(.92) translateY(20px) }
        to   { opacity:1; transform:none }
      }`, sheet.cssRules.length);
  } catch(_) {}


  /* ── 18. TOAST HELPER ───────────────────────────────── */
  function showToast(msg, type = 'info') {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position:     'fixed',
      bottom:       '5rem',
      left:         '50%',
      transform:    'translateX(-50%)',
      background:   type === 'warn' ? '#7c2d12' : '#1e3a5f',
      color:        '#fff',
      padding:      '.75rem 1.5rem',
      borderRadius: '50px',
      fontSize:     '.85rem',
      zIndex:       '9999',
      boxShadow:    '0 4px 20px rgba(0,0,0,.4)',
      whiteSpace:   'nowrap',
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 5000);
  }

  console.log('%c Portfolio Ready ✨', 'color:#e8b86d;font-size:14px;font-weight:bold;');
});