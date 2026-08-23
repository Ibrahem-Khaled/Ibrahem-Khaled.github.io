/* ── STATE ── */
  let currentLang = 'en';
  let currentTheme = 'dark';

  /* ────────────────────────────────────────────
     LOADER
  ──────────────────────────────────────────── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
      // Trigger entrance animations after load
      initReveal();
      animateSkillBars();
    }, 800);
  });

  /* ────────────────────────────────────────────
     DYNAMIC COPYRIGHT YEAR
  ──────────────────────────────────────────── */
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ────────────────────────────────────────────
     NAVBAR SCROLL EFFECT
  ──────────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const scrollTop = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    navbar.classList.toggle('scrolled', sy > 60);
    scrollTop.style.opacity       = sy > 400 ? '1' : '0';
    scrollTop.style.pointerEvents = sy > 400 ? 'auto' : 'none';
  }, { passive: true });

  /* ────────────────────────────────────────────
     MOBILE MENU
  ──────────────────────────────────────────── */
  function toggleMobileMenu() {
    const menu      = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger');
    const isOpen    = menu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.classList.toggle('open', isOpen);
  }
  function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
  }

  /* ────────────────────────────────────────────
     DARK / LIGHT THEME
  ──────────────────────────────────────────── */
  function toggleTheme() {
    const html   = document.documentElement;
    const isDark = html.classList.contains('dark');
    html.classList.toggle('dark',  !isDark);
    html.classList.toggle('light',  isDark);
    document.getElementById('icon-moon').classList.toggle('hidden',  isDark);
    document.getElementById('icon-sun').classList.toggle('hidden',  !isDark);
    currentTheme = isDark ? 'light' : 'dark';

    // Update theme-color meta tag for mobile browsers
    const themeColor = isDark ? '#f8f8fd' : '#7c3aed';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
  }

  /* ────────────────────────────────────────────
     LANGUAGE SWITCHER
  ──────────────────────────────────────────── */
  function toggleLang() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    const html  = document.documentElement;
    const isAr  = currentLang === 'ar';
    html.setAttribute('lang', currentLang);
    html.setAttribute('dir',  isAr ? 'rtl' : 'ltr');
    document.getElementById('lang-label').textContent = isAr ? 'EN' : 'عربي';

    // Update all elements with data-en / data-ar attributes
    document.querySelectorAll('[data-en]').forEach(el => {
      const text = el.getAttribute(isAr ? 'data-ar' : 'data-en');
      if (text !== null) {
        // If it's an input/textarea placeholder, update that instead
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.innerHTML = text;
        }
      }
    });

    // Re-initialise typing effect with correct language
    clearInterval(typingInterval);
    startTyping();
  }

  /* ────────────────────────────────────────────
     TYPING EFFECT
  ──────────────────────────────────────────── */
  const typingStrings = {
    en: ['Senior Full Stack Developer', 'Laravel & React Expert', 'React Native Specialist', 'API Architect', 'Open Source Contributor'],
    ar: ['مطور Full Stack أول', 'خبير Laravel وReact', 'متخصص React Native', 'مهندس APIs', 'مساهم في المصادر المفتوحة'],
  };
  let typingIndex    = 0;
  let charIndex      = 0;
  let isDeleting     = false;
  let typingInterval = null;
  const typingEl     = document.getElementById('typing-text');

  function startTyping() {
    typingInterval = setInterval(() => {
      const strings = typingStrings[currentLang];
      const current = strings[typingIndex % strings.length];
      if (isDeleting) {
        charIndex--;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) { isDeleting = false; typingIndex++; }
      } else {
        charIndex++;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          clearInterval(typingInterval);
          setTimeout(startTyping, 1800);
          return;
        }
      }
    }, isDeleting ? 50 : 90);
  }
  startTyping();

  /* ────────────────────────────────────────────
     SCROLL REVEAL (Intersection Observer)
  ──────────────────────────────────────────── */
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ────────────────────────────────────────────
     SKILL BARS ANIMATION
  ──────────────────────────────────────────── */
  function animateSkillBars() {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill  = entry.target;
          const width = fill.getAttribute('data-width');
          setTimeout(() => { fill.style.width = width + '%'; }, 300);
          skillObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-bar-fill').forEach(el => skillObserver.observe(el));
  }

  /* ────────────────────────────────────────────
     PROJECT FILTER
  ──────────────────────────────────────────── */
  function filterProjects(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const btnCat = btn.getAttribute('onclick').match(/'([^']+)'/)?.[1];
      btn.classList.toggle('active', btnCat === category);
    });

    // Show/hide cards with fade
    document.querySelectorAll('#projects-grid > [data-category]').forEach(card => {
      const match = category === 'all' || card.getAttribute('data-category') === category;
      card.style.transition = 'opacity .3s ease, transform .3s ease';
      if (match) {
        card.style.display   = '';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
      } else {
        card.style.opacity   = '0';
        card.style.transform = 'scale(.95)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  }

  /* ────────────────────────────────────────────
     CONTACT FORM VALIDATION & SUBMIT
  ──────────────────────────────────────────── */
  function submitForm(e) {
    e.preventDefault();
    let valid = true;

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    // Reset errors
    ['name-error','email-error','msg-error'].forEach(id => {
      document.getElementById(id).classList.add('hidden');
    });

    if (!name.value.trim()) {
      document.getElementById('name-error').classList.remove('hidden');
      valid = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      document.getElementById('email-error').classList.remove('hidden');
      valid = false;
    }
    if (!message.value.trim()) {
      document.getElementById('msg-error').classList.remove('hidden');
      valid = false;
    }

    if (!valid) return;

    // Simulate send
    const btn     = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const spinner = document.getElementById('btn-spinner');

    btn.disabled       = true;
    btnText.textContent = currentLang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';
    btnIcon.classList.add('hidden');
    spinner.classList.remove('hidden');

    setTimeout(() => {
      document.getElementById('form-success').classList.remove('hidden');
      document.getElementById('contact-form').reset();
      btn.disabled        = false;
      btnText.textContent = currentLang === 'ar' ? 'إرسال الرسالة' : 'Send Message';
      btnIcon.classList.remove('hidden');
      spinner.classList.add('hidden');
    }, 1600);
  }

  /* ────────────────────────────────────────────
     ACTIVE NAV LINK ON SCROLL
  ──────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  /* ────────────────────────────────────────────
     FAQ ACCORDION
  ──────────────────────────────────────────── */
  function toggleFaq(item) {
    const wasActive = item.classList.contains('active');
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(faq => {
      faq.classList.remove('active');
      faq.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });
    // Open clicked one if it wasn't already open
    if (!wasActive) {
      item.classList.add('active');
      item.querySelector('.faq-question')?.setAttribute('aria-expanded', 'true');
    }
  }
  // Expose to global scope for onclick
  window.toggleFaq = toggleFaq;

  /* ────────────────────────────────────────────
     PARTICLE CANVAS (Hero Floating Particles)
  ──────────────────────────────────────────── */
  (function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = Math.random() * 0.6 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0 || this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${this.opacity})`;
        ctx.fill();
        // Glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity * 0.15})`;
        ctx.fill();
      }
    }

    // Create particles (fewer on mobile)
    const count = window.innerWidth < 768 ? 20 : 50;
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animFrame = requestAnimationFrame(animate);
    }
    animate();
  })();

  /* ────────────────────────────────────────────
     MAGNETIC CURSOR GLOW (Desktop only)
  ──────────────────────────────────────────── */
  (function initCursorGlow() {
    if (window.innerWidth < 768) return;
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(updateGlow);
    }
    updateGlow();
  })();

  /* ────────────────────────────────────────────
     COUNTER ANIMATION (Count up numbers)
  ──────────────────────────────────────────── */
  function animateCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          const match = text.match(/^(\d+)(\+?)$/);
          if (!match) return;

          const target = parseInt(match[1]);
          const suffix = match[2] || '';
          const duration = 2000;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * ease);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num').forEach(el => {
      counterObserver.observe(el);
    });
  }
  // Initialize after loader
  setTimeout(animateCounters, 1000);

  /* ────────────────────────────────────────────
     TILT CARD EFFECT (3D tilt on hover)
  ──────────────────────────────────────────── */
  (function initTiltCards() {
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.glass.rounded-2xl.p-6').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  })();

  /* ────────────────────────────────────────────
     DIRECTIONAL REVEAL OBSERVER
  ──────────────────────────────────────────── */
  function initDirectionalReveal() {
    const dirObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          dirObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      dirObserver.observe(el);
    });
  }
  setTimeout(initDirectionalReveal, 900);

