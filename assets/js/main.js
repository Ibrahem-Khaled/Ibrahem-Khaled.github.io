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
      entries.forEach((entry, i) => {
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
     NAVBAR GLASS on scroll
  ──────────────────────────────────────────── */
  // Already handled by 'scrolled' class above via scroll listener
