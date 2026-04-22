/* ==========================================================================
   ARTELEK 03 — ÉLECTRICIEN MONTLUÇON
   Interactions · 3D Logo · Electric particles · Reveals · Form handler
   ========================================================================== */

(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ========== HEADER + SCROLL PROGRESS (style hupr) ========== */
    const header = document.getElementById('header');
    const progressBar = document.querySelector('.scroll-progress span');
    const SCROLL_THRESHOLD = 60;
    let ticking = false;

    const onScrollCompute = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);

        if (progressBar) {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
            progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
        }

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScrollCompute);
            ticking = true;
        }
    }, { passive: true });

    onScrollCompute();

    /* ========== BURGER MENU ========== */
    const burger = document.querySelector('.burger');
    if (burger) {
        burger.addEventListener('click', () => {
            const isOpen = document.body.classList.toggle('nav-open');
            burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('nav-open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ========== REVEAL ON SCROLL (base + directional) ========== */
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-clip');

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    /* ========== HIGHLIGHTS ROTATING (style hupr) ========== */
    const highlightsTrack = document.querySelector('[data-highlights]');
    if (highlightsTrack) {
        const items = highlightsTrack.querySelectorAll('.highlight-item');
        const dots = document.querySelectorAll('.highlights-dot');
        let idx = 0;
        let timer = null;
        const INTERVAL = 3800;

        const show = (i) => {
            items.forEach((el, j) => el.toggleAttribute('data-highlight-active', j === i));
            dots.forEach((d, j) => d.toggleAttribute('data-active', j === i));
            idx = i;
        };

        const next = () => show((idx + 1) % items.length);
        const restart = () => { clearInterval(timer); timer = setInterval(next, INTERVAL); };

        dots.forEach(d => {
            d.addEventListener('click', () => { show(parseInt(d.dataset.highlightIndex, 10)); restart(); });
        });

        show(0);
        dots[0].toggleAttribute('data-active', true);
        if (!prefersReducedMotion) restart();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) clearInterval(timer);
            else if (!prefersReducedMotion) restart();
        });
    }

    /* ========== PARALLAX IMAGES (style hupr) ========== */
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length && !prefersReducedMotion) {
        let parallaxTicking = false;
        const updateParallax = () => {
            const vh = window.innerHeight;
            parallaxEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > vh) return;
                const speed = parseFloat(el.dataset.parallax) || 0.12;
                const centerOffset = (rect.top + rect.height / 2) - vh / 2;
                const shift = -centerOffset * speed;
                const img = el.querySelector('img');
                if (img) img.style.transform = `translate3d(0, ${shift}px, 0)`;
            });
            parallaxTicking = false;
        };
        window.addEventListener('scroll', () => {
            if (!parallaxTicking) { requestAnimationFrame(updateParallax); parallaxTicking = true; }
        }, { passive: true });
        window.addEventListener('resize', updateParallax);
        updateParallax();
    }

    /* ========== COUNT-UP STATS ========== */
    const counters = document.querySelectorAll('[data-count-to]');
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const countObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const end = parseInt(el.dataset.countTo, 10);
                const duration = 1600;
                const start = performance.now();
                const tick = (now) => {
                    const p = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.floor(end * eased);
                    if (p < 1) requestAnimationFrame(tick);
                    else el.textContent = end;
                };
                requestAnimationFrame(tick);
                countObs.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => countObs.observe(c));
    }

    /* ========== 3D LOGO — INTERACTIVE TILT ========== */
    const logo3d = document.getElementById('logo3d');
    const logoStage = document.querySelector('.hero-logo-stage');

    if (logo3d && logoStage && !prefersReducedMotion) {
        let targetX = -12;
        let targetY = 6;
        let currentX = targetX;
        let currentY = targetY;
        let mouseActive = false;

        logoStage.addEventListener('mousemove', (e) => {
            const rect = logoStage.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            targetX = (x - 0.5) * 40;
            targetY = -(y - 0.5) * 25;
            mouseActive = true;
            logo3d.style.animation = 'none';
        });

        logoStage.addEventListener('mouseleave', () => {
            mouseActive = false;
            logo3d.style.animation = '';
        });

        const animateLogo = () => {
            if (mouseActive) {
                currentX += (targetX - currentX) * 0.08;
                currentY += (targetY - currentY) * 0.08;
                logo3d.style.transform = `rotateY(${currentX}deg) rotateX(${currentY}deg)`;
            }
            requestAnimationFrame(animateLogo);
        };
        animateLogo();
    }

    /* ========== HERO CANVAS — ELECTRIC PARTICLES ========== */
    const canvas = document.getElementById('heroCanvas');

    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let width, height, dpr;
        let particles = [];
        let sparks = [];
        let mouse = { x: null, y: null };
        let rafId;

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * height;
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 1.4 + 0.3;
                this.baseAlpha = Math.random() * 0.4 + 0.15;
                this.alpha = this.baseAlpha;
                this.pulse = Math.random() * Math.PI * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.pulse += 0.02;
                this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.15;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (mouse.x !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const force = (150 - dist) / 150 * 0.5;
                        this.x += (dx / dist) * force;
                        this.y += (dy / dist) * force;
                    }
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 168, 83, ${this.alpha})`;
                ctx.fill();
            }
        }

        class Spark {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.segments = [];
                this.life = 0;
                this.maxLife = 20 + Math.random() * 20;
                this.generate();
            }
            generate() {
                const steps = 8 + Math.floor(Math.random() * 6);
                let x = this.x;
                let y = this.y;
                let angle = Math.random() * Math.PI * 2;
                this.segments = [{ x, y }];
                for (let i = 0; i < steps; i++) {
                    angle += (Math.random() - 0.5) * 1.2;
                    x += Math.cos(angle) * 15;
                    y += Math.sin(angle) * 15;
                    this.segments.push({ x, y });
                }
            }
            update() {
                this.life++;
            }
            draw() {
                if (this.life > this.maxLife) return;
                const alpha = 1 - (this.life / this.maxLife);
                ctx.beginPath();
                ctx.moveTo(this.segments[0].x, this.segments[0].y);
                for (let i = 1; i < this.segments.length; i++) {
                    ctx.lineTo(this.segments[i].x, this.segments[i].y);
                }
                ctx.strokeStyle = `rgba(125, 211, 252, ${alpha * 0.7})`;
                ctx.lineWidth = 1;
                ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
                ctx.shadowBlur = 8;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            isDead() {
                return this.life > this.maxLife;
            }
        }

        const initParticles = () => {
            const count = Math.min(100, Math.floor((width * height) / 12000));
            particles = Array.from({ length: count }, () => new Particle());
        };

        const drawConnections = () => {
            const MAX_DIST = 140;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        const alpha = (1 - dist / MAX_DIST) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(212, 168, 83, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            drawConnections();

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            sparks = sparks.filter(s => !s.isDead());
            sparks.forEach(s => {
                s.update();
                s.draw();
            });

            if (Math.random() < 0.015 && sparks.length < 3) {
                sparks.push(new Spark());
            }

            rafId = requestAnimationFrame(animate);
        };

        resize();
        initParticles();
        animate();

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.parentElement.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(rafId);
            else animate();
        });
    }

    /* ========== SERVICE BLOCKS — HOVER STATE ========== */
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.service-block-image').forEach(img => {
            img.addEventListener('pointerenter', () => img.style.setProperty('--hover', '1'));
            img.addEventListener('pointerleave', () => img.style.removeProperty('--hover'));
        });
    }

    /* ========== REALISATIONS — TILT EFFECT ========== */
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotY = (x - 0.5) * 8;
                const rotX = -(y - 0.5) * 8;
                card.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ========== HERO PARALLAX ========== */
    const heroInner = document.querySelector('.hero-inner');
    const heroGrid = document.querySelector('.hero-grid');

    if (!prefersReducedMotion && heroInner) {
        let scrollY = 0;
        const onScroll = () => {
            scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                const offset = scrollY * 0.3;
                heroInner.style.transform = `translateY(${offset}px)`;
                heroInner.style.opacity = String(Math.max(0, 1 - scrollY / (window.innerHeight * 0.8)));
                if (heroGrid) heroGrid.style.transform = `translateY(${offset * 0.5}px)`;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ========== AVIS MARQUEE ========== */
    document.querySelectorAll('[data-marquee]').forEach(marquee => {
        const track = marquee.querySelector('.avis-track');
        if (!track) return;

        const originals = Array.from(track.children);
        originals.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.setAttribute('tabindex', '-1');
            track.appendChild(clone);
        });

        if (prefersReducedMotion) return;

        let isDown = false;
        let startX = 0;
        let translateOffset = 0;
        let dragOffset = 0;

        const getTranslateX = () => {
            const m = window.getComputedStyle(track).transform;
            if (m === 'none') return 0;
            const match = m.match(/matrix.*\((.+)\)/);
            return match ? parseFloat(match[1].split(',')[4]) : 0;
        };

        marquee.addEventListener('pointerdown', (e) => {
            isDown = true;
            startX = e.clientX;
            translateOffset = getTranslateX();
            marquee.dataset.paused = 'true';
            marquee.setPointerCapture(e.pointerId);
            track.style.animationPlayState = 'paused';
        });

        marquee.addEventListener('pointermove', (e) => {
            if (!isDown) return;
            dragOffset = e.clientX - startX;
            track.style.transform = `translateX(${translateOffset + dragOffset}px)`;
        });

        const release = (e) => {
            if (!isDown) return;
            isDown = false;
            marquee.dataset.paused = 'false';
            track.style.transform = '';
            track.style.animationPlayState = '';
        };
        marquee.addEventListener('pointerup', release);
        marquee.addEventListener('pointercancel', release);
        marquee.addEventListener('pointerleave', release);
    });

    /* ========== FAQ EXCLUSIVE OPEN ========== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item) other.open = false;
                });
            }
        });
    });

    /* ========== DEVIS FORM ========== */
    const form = document.getElementById('devisForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const required = form.querySelectorAll('[required]');
            let valid = true;
            required.forEach(field => {
                if (!field.value || (field.type === 'checkbox' && !field.checked)) {
                    valid = false;
                    field.style.borderColor = 'var(--error)';
                    setTimeout(() => { field.style.borderColor = ''; }, 2000);
                }
            });
            if (!valid) return;

            form.classList.add('submitted');
            form.reset();

            setTimeout(() => {
                form.classList.remove('submitted');
            }, 6000);
        });
    }

    /* ========== SMOOTH SCROLL OFFSET ========== */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id === '#' || id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

})();
