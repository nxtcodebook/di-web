/* ============================================================
   HEMANGINI'S 18th BIRTHDAY — INTERACTIVE JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== ELEMENTS =====
    const curtain = document.getElementById('curtain');
    const openBtn = document.getElementById('openBtn');
    const envelope = document.getElementById('envelope');
    const mainContent = document.getElementById('mainContent');
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkEls = document.querySelectorAll('.nav-link');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const confettiCtx = confettiCanvas.getContext('2d');

    // ===== CURTAIN / OPENING =====
    function openSurprise() {
        // Animate envelope open
        envelope.classList.add('open');

        setTimeout(() => {
            curtain.classList.add('opening');
            launchConfetti();
        }, 1200);

        setTimeout(() => {
            curtain.style.display = 'none';
            mainContent.classList.remove('hidden');
            // Trigger hero animations
            animateHeroElements();
            initScrollAnimations();
        }, 2200);
    }

    openBtn.addEventListener('click', openSurprise);
    envelope.addEventListener('click', openSurprise);

    // ===== HERO ENTRANCE ANIMATIONS =====
    function animateHeroElements() {
        const heroAnimElements = document.querySelectorAll('.hero .animate-on-scroll');
        heroAnimElements.forEach(el => {
            const delay = parseInt(el.dataset.delay || 0);
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, delay);
        });
    }

    // ===== SCROLL ANIMATIONS (Intersection Observer) =====
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.dataset.delay || 0);
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, delay);
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all non-hero elements
        document.querySelectorAll('.animate-on-scroll:not(.hero .animate-on-scroll)').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== NAVBAR =====
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;

        // Active nav link
        updateActiveNav();
    });

    function updateActiveNav() {
        const sections = ['hero', 'about', 'gallery', 'timeline', 'wishes'];
        const scrollPos = window.scrollY + 150;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinkEls.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            }
        });
    }

    // Mobile nav toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinkEls.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // ===== GALLERY LIGHTBOX =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentIndex = 0;

    const galleryData = [];
    galleryItems.forEach((item, i) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        galleryData.push({
            src: img.src,
            caption: caption ? caption.textContent : ''
        });

        item.addEventListener('click', () => {
            currentIndex = i;
            openLightbox();
        });
    });

    function openLightbox() {
        lightbox.classList.add('active');
        updateLightbox();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        lightboxImg.src = galleryData[currentIndex].src;
        lightboxCaption.textContent = galleryData[currentIndex].caption;
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        updateLightbox();
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryData.length;
        updateLightbox();
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
            updateLightbox();
        }
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryData.length;
            updateLightbox();
        }
    });

    // ===== HERO PARTICLES =====
    function createHeroParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;
        const particleEmojis = ['✨', '🌟', '💖', '🦋', '🎨', '💃', '🌸', '⭐'];

        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('span');
            particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
            particle.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 1.5 + 0.8}rem;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.4 + 0.1};
                animation: particleFloat ${Math.random() * 10 + 8}s ease-in-out infinite;
                animation-delay: ${Math.random() * -10}s;
                pointer-events: none;
            `;
            container.appendChild(particle);
        }
    }

    // Add particle float animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(90deg); }
            50% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(180deg); }
            75% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(270deg); }
        }
    `;
    document.head.appendChild(particleStyle);
    createHeroParticles();

    // ===== CONFETTI SYSTEM =====
    let confettiParticles = [];
    let confettiActive = false;
    let confettiAnimFrame;

    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class ConfettiParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = Math.random() * -confettiCanvas.height;
            this.w = Math.random() * 12 + 6;
            this.h = Math.random() * 8 + 4;
            this.vx = Math.random() * 4 - 2;
            this.vy = Math.random() * 3 + 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 8 - 4;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.color = this.getColor();
            this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
        }

        getColor() {
            const colors = [
                '#e8a0bf', '#b48cde', '#f0c27f', '#f5c6d8',
                '#d4b5f0', '#7b68c8', '#ff6b9d', '#c084fc',
                '#fbbf24', '#f472b6', '#a78bfa', '#fb923c'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            this.vy += 0.05; // gravity
            this.vx *= 0.99;

            // Wind sway
            this.vx += Math.sin(this.y * 0.01) * 0.1;

            if (this.y > confettiCanvas.height + 20) {
                this.reset();
                if (!confettiActive) {
                    this.opacity = 0;
                }
            }
        }

        draw() {
            if (this.opacity <= 0) return;
            confettiCtx.save();
            confettiCtx.translate(this.x, this.y);
            confettiCtx.rotate((this.rotation * Math.PI) / 180);
            confettiCtx.globalAlpha = this.opacity;
            confettiCtx.fillStyle = this.color;

            if (this.shape === 'rect') {
                confettiCtx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
            } else {
                confettiCtx.beginPath();
                confettiCtx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
                confettiCtx.fill();
            }

            confettiCtx.restore();
        }
    }

    function launchConfetti() {
        confettiActive = true;
        confettiParticles = [];

        for (let i = 0; i < 200; i++) {
            const p = new ConfettiParticle();
            p.y = Math.random() * -500;
            p.vy = Math.random() * 5 + 3;
            confettiParticles.push(p);
        }

        animateConfetti();

        // Stop creating new confetti after 5 seconds
        setTimeout(() => {
            confettiActive = false;
        }, 5000);

        // Clear canvas after 10 seconds
        setTimeout(() => {
            cancelAnimationFrame(confettiAnimFrame);
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confettiParticles = [];
        }, 10000);
    }

    function animateConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        confettiParticles.forEach(p => {
            p.update();
            p.draw();
        });

        confettiAnimFrame = requestAnimationFrame(animateConfetti);
    }

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 70; // navbar height
                const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // ===== PARALLAX ON HERO =====
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        if (scrollY < heroHeight) {
            const content = document.querySelector('.hero-content');
            if (content) {
                content.style.transform = `translateY(${scrollY * 0.3}px)`;
                content.style.opacity = 1 - scrollY / heroHeight;
            }
        }
    });

    // ===== TYPING CURSOR EFFECT ON HERO NAME =====
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        heroName.style.borderRight = '3px solid var(--clr-primary)';
        heroName.style.animation = 'none';
        const blinkStyle = document.createElement('style');
        blinkStyle.textContent = `
            @keyframes cursorBlink {
                0%, 100% { border-right-color: transparent; }
                50% { border-right-color: var(--clr-primary); }
            }
        `;
        document.head.appendChild(blinkStyle);
        setTimeout(() => {
            heroName.style.animation = 'cursorBlink 1s infinite';
        }, 2000);
        // Remove cursor after a few seconds
        setTimeout(() => {
            heroName.style.borderRight = 'none';
            heroName.style.animation = 'none';
        }, 6000);
    }

    // ===== TILT EFFECT ON GALLERY ITEMS =====
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // ===== COUNTER ANIMATION FOR AGE DIGITS =====
    function animateCounter(elementId, target, duration) {
        const el = document.getElementById(elementId);
        if (!el) return;
        let start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(update);
    }

    // Will fire after curtain opens
    setTimeout(() => {
        animateCounter('ageDigit1', 1, 800);
        animateCounter('ageDigit2', 8, 1200);
    }, 3000);

    // ===== TOUCH SWIPE FOR LIGHTBOX =====
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left -> next
                currentIndex = (currentIndex + 1) % galleryData.length;
            } else {
                // Swipe right -> prev
                currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
            }
            updateLightbox();
        }
    }

    // ===== EASTER EGG: CLICK BIRTHDAY CAKE IN FOOTER =====
    const footerCake = document.querySelector('.footer-cake');
    if (footerCake) {
        footerCake.style.cursor = 'pointer';
        footerCake.addEventListener('click', () => {
            launchConfetti();
            footerCake.style.transform = 'scale(1.5) rotate(20deg)';
            setTimeout(() => {
                footerCake.style.transform = '';
            }, 500);
        });
    }

});
