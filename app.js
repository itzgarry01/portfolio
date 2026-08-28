/**
 * ARTIST.GARRY // Animation & Motion Graphics Studio Portfolio Engine
 * GSAP 3 + ScrollTrigger + Lenis Smooth Scroll + Cartoon Mascot Physics
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 2. Playful Web Audio API Synthesizer (Satisfying Tactile Click & Pop System)
  let audioCtx = null;
  let soundEnabled = true;

  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  // Instant resume on any first user gesture
  ['click', 'mousedown', 'touchstart', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, () => initAudio(), { once: true, passive: true });
  });

  const playCartoonPop = (pitch = 750, duration = 0.075) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 2.4, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay fallback
    }
  };

  // Global Click Sound Interceptor: Plays on EVERY click across the entire website
  document.addEventListener('click', (e) => {
    initAudio();
    const interactiveTarget = e.target.closest('button, a, .hover-target, .gallery-item, .featured-album-card, .sticker-btn, .filter-btn, .modal-nav-btn, .modal-close-btn, .collector-frame, input, select, textarea, .cartoon-sticker, [role="button"]');
    if (interactiveTarget && soundEnabled) {
      // Gentle pitch variation between 720Hz - 820Hz for organic, satisfying feel
      const dynamicPitch = 740 + Math.floor(Math.random() * 80);
      playCartoonPop(dynamicPitch, 0.07);
    }
  }, true);

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      soundEnabled = !soundEnabled;
      soundToggleBtn.style.opacity = soundEnabled ? '1' : '0.4';
      soundToggleBtn.style.transform = 'scale(0.92)';
      setTimeout(() => {
        soundToggleBtn.style.transform = 'scale(1)';
      }, 150);
      if (soundEnabled) {
        playCartoonPop(850, 0.09);
      }
    });
  }

  // 3. Eyeballs Tracking (Pupils follow mouse)
  const pupilLeft = document.getElementById('pupilLeft');
  const pupilRight = document.getElementById('pupilRight');

  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    [pupilLeft, pupilRight].forEach((pupil) => {
      if (!pupil) return;
      const rect = pupil.getBoundingClientRect();
      const pupilCenterX = rect.left + rect.width / 2;
      const pupilCenterY = rect.top + rect.height / 2;

      const angle = Math.atan2(mouseY - pupilCenterY, mouseX - pupilCenterX);
      const distance = Math.min(3.5, Math.hypot(mouseX - pupilCenterX, mouseY - pupilCenterY) / 40);

      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      pupil.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    });
  });

  // 4. Initialize Lenis Smooth Scroll
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Anchor links smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -40, duration: 1.2 });
          playCartoonPop(520, 0.06);
        }
      });
    });
  }

  // 5. Preloader Engine
  const preloader = document.getElementById('preloader');
  const preloaderCounter = document.getElementById('preloaderCounter');
  const preloaderBar = document.getElementById('preloaderBar');

  let progress = { value: 0 };
  gsap.to(progress, {
    value: 100,
    duration: 1.1,
    ease: 'power2.out',
    onUpdate: () => {
      const current = Math.floor(progress.value);
      if (preloaderCounter) preloaderCounter.textContent = `${current}%`;
      if (preloaderBar) preloaderBar.style.width = `${current}%`;
    },
    onComplete: () => {
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        onComplete: () => {
          if (preloader) preloader.style.display = 'none';
          initHeroAnimations();
        }
      });
    }
  });

  // 6. Custom Playful Cursor
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const customCursor = document.getElementById('customCursor');
  const cursorText = document.getElementById('cursorText');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
  });

  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;
    if (cursorRing) {
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }
    if (cursorText) {
      cursorText.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }
  });

  // Hover listeners for cursor
  document.querySelectorAll('.hover-target, button, a, input, select, textarea').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (customCursor) customCursor.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      if (customCursor) customCursor.classList.remove('cursor-hover');
    });
  });

  document.querySelectorAll('.hover-view').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (customCursor) customCursor.classList.add('cursor-view');
    });
    el.addEventListener('mouseleave', () => {
      if (customCursor) customCursor.classList.remove('cursor-view');
    });
  });

  // 7. Hero Entrance Animation
  function initHeroAnimations() {
    gsap.from('.hero-eyebrow', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'back.out(1.7)'
    });

    gsap.from('.hero-headline', {
      opacity: 0,
      y: 35,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.15
    });

    gsap.from('.hero-description', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.3
    });

    gsap.from('.hero-actions', {
      opacity: 0,
      y: 25,
      duration: 0.8,
      ease: 'back.out(1.5)',
      delay: 0.4
    });

    gsap.from('.hero-visual-card', {
      opacity: 0,
      scale: 0.9,
      rotate: -3,
      duration: 1.0,
      ease: 'back.out(1.6)',
      delay: 0.25
    });
  }

  // 8. 3D Mouse Parallax on Hero Card
  const heroCardContainer = document.getElementById('heroCardContainer');
  const hero3dCard = document.getElementById('hero3dCard');

  if (heroCardContainer && hero3dCard) {
    heroCardContainer.addEventListener('mousemove', (e) => {
      const rect = heroCardContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / (rect.height / 2)) * 10;
      const rotY = (x / (rect.width / 2)) * 10;

      gsap.to(hero3dCard, {
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 800,
        duration: 0.35,
        ease: 'power2.out'
      });
    });

    heroCardContainer.addEventListener('mouseleave', () => {
      gsap.to(hero3dCard, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  }

  // 9. Scroll-Driven Directional Marquees (Stops on Idle, Moves with Scroll, Reverses on Scroll Up)
  const marquee1 = document.getElementById('marqueeRibbon1');
  const marquee2 = document.getElementById('marqueeRibbon2');

  if (marquee1 && marquee2) {
    let pos1 = 0;
    let pos2 = -25;
    let targetVelocity = 0;
    let currentVelocity = 0;
    let lastScrollY = window.scrollY;

    // Track scroll velocity via Lenis or native window scroll
    if (typeof lenis !== 'undefined' && lenis) {
      lenis.on('scroll', (e) => {
        // e.velocity is positive on scroll down, negative on scroll up (soft sensitivity)
        targetVelocity = (e.velocity || 0) * 0.04;
      });
    } else {
      window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;
        targetVelocity = delta * 0.035;
      }, { passive: true });
    }

    function renderScrollMarquee() {
      // Smooth deceleration: lerp current velocity to target velocity
      currentVelocity += (targetVelocity - currentVelocity) * 0.09;

      // Friction decay: when user stops scrolling, velocity decays smoothly to 0
      targetVelocity *= 0.86;
      if (Math.abs(targetVelocity) < 0.0005) targetVelocity = 0;
      if (Math.abs(currentVelocity) < 0.0005) currentVelocity = 0;

      // When scrolling down (currentVelocity > 0):
      // Ribbon 1 moves left (decreases), Ribbon 2 moves right (increases)
      // When scrolling up (currentVelocity < 0):
      // Ribbon 1 moves right (increases), Ribbon 2 moves left (decreases)
      pos1 -= currentVelocity * 0.1;
      pos2 += currentVelocity * 0.1;

      // Seamless wrap-around modulo between -50% and 0%
      while (pos1 <= -50) pos1 += 50;
      while (pos1 > 0) pos1 -= 50;

      while (pos2 <= -50) pos2 += 50;
      while (pos2 > 0) pos2 -= 50;

      marquee1.style.transform = `translate3d(${pos1}%, 0, 0)`;
      marquee2.style.transform = `translate3d(${pos2}%, 0, 0)`;

      requestAnimationFrame(renderScrollMarquee);
    }
    renderScrollMarquee();
  }

  // 10. Interactive Cartoon Sticker Lab
  const stickerCanvas = document.getElementById('stickerCanvas');
  const stickerBtns = document.querySelectorAll('.sticker-btn');
  const clearCanvasBtn = document.getElementById('clearCanvasBtn');

  let currentStickerType = 'pop';

  const stickerBubbles = {
    pop: { text: '✦ POP!', bg: '#FFBA08', color: '#1E1815' },
    flame: { text: '🔥 BEAST', bg: '#E65C38', color: '#FFF' },
    lightning: { text: '⚡ HYPER', bg: '#3A60ED', color: '#FFF' },
    love: { text: '💖 LOVE', bg: '#FF5A87', color: '#FFF' }
  };

  stickerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      stickerBtns.forEach((b) => {
        b.classList.remove('active');
        b.style.background = 'var(--bg-canvas-subtle)';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--accent-yellow)';
      currentStickerType = btn.getAttribute('data-type');
      playCartoonPop(680, 0.06);
    });
  });

  if (stickerCanvas) {
    stickerCanvas.addEventListener('click', (e) => {
      if (e.target.closest('.stamp-item')) return;

      const rect = stickerCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const stamp = document.createElement('div');
      stamp.classList.add('stamp-item');

      const innerBubble = document.createElement('div');
      innerBubble.classList.add('stamp-bubble');

      const cfg = stickerBubbles[currentStickerType];
      innerBubble.textContent = cfg.text;
      innerBubble.style.backgroundColor = cfg.bg;
      innerBubble.style.color = cfg.color;

      const rot = Math.floor(Math.random() * 30) - 15;
      stamp.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
      stamp.style.left = `${x}px`;
      stamp.style.top = `${y}px`;

      stamp.appendChild(innerBubble);
      stickerCanvas.appendChild(stamp);

      gsap.from(stamp, {
        scale: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'back.out(2)'
      });

      playCartoonPop(860, 0.09);
      makeDraggable(stamp);
    });
  }

  function makeDraggable(el) {
    let isDraggingEl = false;
    let startX, startY, initialLeft, initialTop;

    el.addEventListener('mousedown', (e) => {
      isDraggingEl = true;
      e.stopPropagation();
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = parseFloat(el.style.left);
      initialTop = parseFloat(el.style.top);
      el.style.zIndex = 100;
      playCartoonPop(500, 0.04);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingEl) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = `${initialLeft + dx}px`;
      el.style.top = `${initialTop + dy}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingEl) {
        isDraggingEl = false;
        el.style.zIndex = 10;
      }
    });
  }

  if (clearCanvasBtn && stickerCanvas) {
    clearCanvasBtn.addEventListener('click', () => {
      const items = stickerCanvas.querySelectorAll('.stamp-item');
      gsap.to(items, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        stagger: 0.02,
        onComplete: () => {
          items.forEach((item) => item.remove());
        }
      });
      playCartoonPop(320, 0.1);
    });
  }

  // 11. Filterable Portfolio Archive Gallery
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      playCartoonPop(560, 0.05);

      galleryItems.forEach((item) => {
        const categories = (item.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          gsap.to(item, {
            scale: 1,
            opacity: 1,
            display: 'block',
            duration: 0.35,
            ease: 'back.out(1.4)'
          });
        } else {
          gsap.to(item, {
            scale: 0.88,
            opacity: 0,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
              item.style.display = 'none';
            }
          });
        }
      });
    });
  });

  // 12. Fullscreen Lightbox Modal with Next/Prev Carousel
  const lightboxModal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalPrevBtn = document.getElementById('modalPrevBtn');
  const modalNextBtn = document.getElementById('modalNextBtn');

  // Build catalog array from open-lightbox elements
  let galleryCatalog = [];
  let currentModalIndex = 0;

  const buildCatalog = () => {
    galleryCatalog = [];
    document.querySelectorAll('.gallery-item').forEach((item, idx) => {
      galleryCatalog.push({
        src: item.getAttribute('data-img'),
        title: item.getAttribute('data-title') || 'Artwork Preview'
      });
    });
  };
  buildCatalog();

  const showModalItem = (index) => {
    if (!galleryCatalog.length) return;
    if (index < 0) index = galleryCatalog.length - 1;
    if (index >= galleryCatalog.length) index = 0;
    currentModalIndex = index;

    const item = galleryCatalog[currentModalIndex];
    if (modalImg && item) {
      gsap.to(modalImg, {
        opacity: 0,
        scale: 0.94,
        duration: 0.15,
        onComplete: () => {
          modalImg.src = item.src;
          if (modalCaption) {
            modalCaption.textContent = `${item.title} (${currentModalIndex + 1} / ${galleryCatalog.length})`;
          }
          gsap.to(modalImg, {
            opacity: 1,
            scale: 1,
            duration: 0.25,
            ease: 'back.out(1.5)'
          });
        }
      });
    }
  };

  const openLightbox = (imgSrc, captionText) => {
    if (!lightboxModal || !modalImg) return;
    
    // Find index in catalog if available
    const idx = galleryCatalog.findIndex(item => item.src === imgSrc);
    if (idx !== -1) {
      currentModalIndex = idx;
      modalImg.src = galleryCatalog[idx].src;
      if (modalCaption) {
        modalCaption.textContent = `${galleryCatalog[idx].title} (${idx + 1} / ${galleryCatalog.length})`;
      }
    } else {
      modalImg.src = imgSrc;
      if (modalCaption) modalCaption.textContent = captionText || 'Artwork Preview';
    }

    lightboxModal.classList.add('active');
    playCartoonPop(780, 0.08);

    gsap.from('.modal-content-wrap', {
      scale: 0.85,
      opacity: 0,
      duration: 0.35,
      ease: 'back.out(1.7)'
    });
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    playCartoonPop(400, 0.05);
  };

  document.querySelectorAll('.open-lightbox').forEach((el) => {
    el.addEventListener('click', () => {
      const imgSrc = el.getAttribute('data-img');
      const title = el.getAttribute('data-title');
      if (imgSrc) openLightbox(imgSrc, title);
    });
  });

  if (modalPrevBtn) {
    modalPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showModalItem(currentModalIndex - 1);
      playCartoonPop(620, 0.05);
    });
  }

  if (modalNextBtn) {
    modalNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showModalItem(currentModalIndex + 1);
      playCartoonPop(720, 0.05);
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      showModalItem(currentModalIndex - 1);
      playCartoonPop(620, 0.05);
    }
    if (e.key === 'ArrowRight') {
      showModalItem(currentModalIndex + 1);
      playCartoonPop(720, 0.05);
    }
  });

  // 13. Live Local Time Clock
  const liveTimeClock = document.getElementById('liveTimeClock');
  function updateTime() {
    if (!liveTimeClock) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    liveTimeClock.textContent = timeString;
  }
  updateTime();
  setInterval(updateTime, 1000);

  // 14. Back to Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      playCartoonPop(720, 0.08);
    });
  }

  // 15. Form Submission Handler (Live Email Dispatch to artist.gxrry@gmail.com)
  window.handleFormSubmit = function() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccessMessage');
    const submitBtn = document.getElementById('submitBtn');

    const name = document.getElementById('clientName')?.value || '';
    const email = document.getElementById('clientEmail')?.value || '';
    const commissionType = document.getElementById('projectType')?.value || '';
    const message = document.getElementById('clientMessage')?.value || '';

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>DISPATCHING TO INBOX...</span>';
    }

    playCartoonPop(850, 0.1);

    // Send via FormSubmit AJAX endpoint directly to artist.gxrry@gmail.com
    fetch('https://formsubmit.co/ajax/artist.gxrry@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `New Commission Inquiry from ${name} [${commissionType}]`,
        _template: 'table',
        _captcha: 'false',
        'Client Name': name,
        'Client Email': email,
        'Commission Package': commissionType,
        'Project Brief / Message': message
      })
    })
    .then((response) => response.json())
    .then((data) => {
      if (successMsg) {
        successMsg.textContent = '✓ Inquiry received! Details sent directly to artist.gxrry@gmail.com. Garry will reply within 24 hours.';
        successMsg.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.innerHTML = '<span>INQUIRY SENT TO GARRY ✦</span>';
        submitBtn.style.background = 'var(--accent-yellow)';
        submitBtn.style.color = '#1E1815';
      }
      playCartoonPop(980, 0.15);
      if (form) form.reset();
    })
    .catch((err) => {
      // Fallback: Open prefilled mail client if network blocks AJAX
      window.location.href = `mailto:artist.gxrry@gmail.com?subject=${encodeURIComponent('Commission Inquiry: ' + name)}&body=${encodeURIComponent('Client: ' + name + '\nEmail: ' + email + '\nType: ' + commissionType + '\n\nBrief:\n' + message)}`;
      if (successMsg) {
        successMsg.textContent = '✓ Opening email client to send your brief to artist.gxrry@gmail.com!';
        successMsg.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Commission Inquiry</span>';
      }
    });
  };

  // 16. ScrollTrigger Stagger Reveals
  gsap.utils.toArray('.featured-album-card').forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.3)'
    });
  });

  gsap.utils.toArray('.process-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'back.out(1.4)'
    });
  });

  gsap.utils.toArray('.pricing-ticket').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      duration: 0.6,
      delay: index * 0.12,
      ease: 'back.out(1.4)'
    });
  });

  // 17. Security & Anti-Inspection Deterrence
  const exitToGoogle = () => {
    try {
      document.body.innerHTML = '';
      window.location.replace('https://www.google.com');
    } catch (e) {
      window.location.href = 'https://www.google.com';
    }
  };

  // Prevent Right-Click Context Menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, false);

  // Prevent Dragging Images
  document.addEventListener('dragstart', (e) => {
    if (e.target.nodeName === 'IMG') {
      e.preventDefault();
      return false;
    }
  }, false);

  // Intercept Inspection Keyboard Shortcuts (F12, Ctrl/Cmd+Shift+I/J/C, Ctrl/Cmd+U, Ctrl/Cmd+S)
  window.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      exitToGoogle();
      return false;
    }

    // Ctrl+Shift+I / Cmd+Opt+I (Inspect Element)
    if ((cmdOrCtrl && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) ||
        (isMac && e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73))) {
      e.preventDefault();
      e.stopPropagation();
      exitToGoogle();
      return false;
    }

    // Ctrl+Shift+J / Cmd+Opt+J (Console)
    if ((cmdOrCtrl && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) ||
        (isMac && e.metaKey && e.altKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74))) {
      e.preventDefault();
      e.stopPropagation();
      exitToGoogle();
      return false;
    }

    // Ctrl+Shift+C / Cmd+Opt+C (Element Picker)
    if ((cmdOrCtrl && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) ||
        (isMac && e.metaKey && e.altKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67))) {
      e.preventDefault();
      e.stopPropagation();
      exitToGoogle();
      return false;
    }

    // Ctrl+U / Cmd+U / Cmd+Opt+U (View Source)
    if ((cmdOrCtrl && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) ||
        (isMac && e.metaKey && e.altKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85))) {
      e.preventDefault();
      e.stopPropagation();
      exitToGoogle();
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page)
    if (cmdOrCtrl && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      exitToGoogle();
      return false;
    }
  }, true);

});

