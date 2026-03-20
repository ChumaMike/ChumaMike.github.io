// 1. Particle System
particlesJS("particles-js", {
    particles: {
        number: { value: 50, density: { enable: true, value_area: 900 } },
        color: { value: "#64ffda" },
        shape: { type: "circle" },
        opacity: { value: 0.35, random: true },
        size: { value: 2.5, random: true },
        line_linked: {
            enable: true,
            distance: 160,
            color: "#4c9eff",
            opacity: 0.15,
            width: 1
        },
        move: { enable: true, speed: 1.2, random: true, out_mode: "out" }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true
        },
        modes: {
            grab: { distance: 180, line_linked: { opacity: 0.5 } },
            push: { particles_nb: 3 }
        }
    },
    retina_detect: true
});

// 2. Typewriter Effect
const textElement = document.querySelector(".typewriter");
if (textElement) {
    const words = textElement.getAttribute("data-text").split(", ");
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    document.addEventListener("DOMContentLoaded", type);
}

// 2. Custom Cursor
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
    });

    // Ring follows with smooth lag
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform        = 'translate(-50%, -50%) scale(0)';
            cursorRing.style.width           = '54px';
            cursorRing.style.height          = '54px';
            cursorRing.style.borderColor     = 'var(--accent-gold)';
            cursorRing.style.backgroundColor = 'rgba(240,180,41,0.06)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform        = 'translate(-50%, -50%) scale(1)';
            cursorRing.style.width           = '36px';
            cursorRing.style.height          = '36px';
            cursorRing.style.borderColor     = 'rgba(240,180,41,0.5)';
            cursorRing.style.backgroundColor = 'transparent';
        });
    });
}

// 3. Scroll Reveal — IntersectionObserver
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
});

// 4. Stat Counter Animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el       = entry.target;
            const target   = parseInt(el.dataset.target);
            const duration = 1800;
            const step     = target / (duration / 16);
            let current    = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, 16);

            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

// 5. Hamburger Menu
const hamburger  = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// 6. Nav Scroll State
const nav = document.querySelector('.glass-nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('nav-scrolled', window.scrollY > 80);
    }, { passive: true });
}
