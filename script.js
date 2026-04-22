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

    type();
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
            cursorRing.style.borderColor     = 'var(--accent-cyan)';
            cursorRing.style.backgroundColor = 'rgba(100,255,218,0.06)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform        = 'translate(-50%, -50%) scale(1)';
            cursorRing.style.width           = '36px';
            cursorRing.style.height          = '36px';
            cursorRing.style.borderColor     = 'rgba(100,255,218,0.5)';
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

// 7. Project card hover-to-play videos
(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    document.querySelectorAll('.bento-card').forEach(card => {
        const video = card.querySelector('.project-video');
        if (!video) return;

        let loaded = false;
        const ensureLoaded = () => {
            if (loaded) return;
            video.load();
            loaded = true;
        };

        const play = () => {
            ensureLoaded();
            const attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(() => {});
            }
        };

        const stop = () => {
            video.pause();
            try { video.currentTime = 0; } catch (_) {}
        };

        card.addEventListener('mouseenter', play);
        card.addEventListener('mouseleave', stop);
        card.addEventListener('focusin', play);
        card.addEventListener('focusout', stop);
    });
})();

// 8. Soweto live clock (Africa/Johannesburg)
(() => {
    const el = document.getElementById('hud-time');
    if (!el) return;
    const tick = () => {
        const now = new Date();
        try {
            el.textContent = now.toLocaleTimeString('en-GB', {
                timeZone: 'Africa/Johannesburg',
                hour12: false
            });
        } catch (_) {
            const pad = n => String(n).padStart(2, '0');
            el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        }
    };
    tick();
    setInterval(tick, 1000);
})();

// 9. Command Palette (⌘K / Ctrl+K)
(() => {
    const palette = document.getElementById('cmd-palette');
    const input = document.getElementById('cmd-input');
    const list = document.getElementById('cmd-list');
    if (!palette || !input || !list) return;

    const commands = [
        { title: 'Home', desc: 'index.html', icon: 'fa-house', kw: 'home profile about', run: () => (location.href = 'index.html') },
        { title: 'Products', desc: 'The full catalogue · 18+ projects', icon: 'fa-briefcase', kw: 'products projects work catalogue portfolio', run: () => (location.href = 'products.html') },
        { title: 'Contact', desc: 'Start a conversation', icon: 'fa-envelope-open-text', kw: 'contact connect hire email talk', run: () => (location.href = 'contact.html') },
        { title: 'The Designer', desc: 'Graphic design practice · Figma · Adobe', icon: 'fa-palette', kw: 'design designer graphic figma illustrator photoshop', run: () => (location.href = 'index.html#design') },
        { title: 'Certifications', desc: 'Microsoft · Canonical · OpenEDG · WeThinkCode_', icon: 'fa-certificate', kw: 'certifications credentials certs', run: () => (location.href = 'index.html#credentials') },
        { title: 'Trajectory', desc: 'Experience timeline', icon: 'fa-route', kw: 'experience trajectory timeline career roles', run: () => (location.href = 'index.html#experience') },
        { title: 'Featured Work', desc: 'Homepage project teaser', icon: 'fa-star', kw: 'featured', run: () => (location.href = 'index.html#featured') },
        { title: 'Copy email address', desc: 'nmeyiswa@gmail.com', icon: 'fa-copy', kw: 'copy email clipboard', run: async () => {
            try { await navigator.clipboard.writeText('nmeyiswa@gmail.com'); toast('Email copied'); }
            catch (_) { toast('Could not copy', true); }
        }},
        { title: 'Send email', desc: 'Opens your mail client', icon: 'fa-envelope', kw: 'email mail compose', run: () => (location.href = 'mailto:nmeyiswa@gmail.com') },
        { title: 'GitHub · @ChumaMike', desc: 'github.com/ChumaMike', icon: 'fa-github', brand: true, kw: 'github code repos', run: () => window.open('https://github.com/ChumaMike', '_blank') },
        { title: 'LinkedIn · chuma-mike', desc: 'Connect professionally', icon: 'fa-linkedin-in', brand: true, kw: 'linkedin professional', run: () => window.open('https://www.linkedin.com/in/chuma-mike', '_blank') },
        { title: 'WhatsApp · +27 69 302 3981', desc: 'Direct message', icon: 'fa-whatsapp', brand: true, kw: 'whatsapp sms message dm', run: () => window.open('https://wa.me/27693023981', '_blank') },
        { title: 'Skhokho Labs', desc: 'skhokholabs.xyz · The startup', icon: 'fa-rocket', kw: 'skhokho labs startup company', run: () => window.open('https://skhokholabs.xyz', '_blank') },
        { title: 'Open secret terminal', desc: 'Or just press ` (backtick)', icon: 'fa-terminal', kw: 'terminal console shell secret easter', run: () => { closePalette(); setTimeout(openTerminal, 120); } },
    ];

    let filtered = commands.slice();
    let selected = 0;

    function render() {
        if (!filtered.length) {
            list.innerHTML = '<li class="cmd-palette-empty">No commands match. Try <kbd>projects</kbd> or <kbd>email</kbd>.</li>';
            return;
        }
        list.innerHTML = filtered.map((c, i) => `
            <li class="cmd-item" data-idx="${i}" data-selected="${i === selected}" role="option">
                <div class="cmd-item-icon"><i class="fa${c.brand ? 'b' : 's'} ${c.icon}"></i></div>
                <div class="cmd-item-body">
                    <span class="cmd-item-title">${c.title}</span>
                    <span class="cmd-item-desc">${c.desc}</span>
                </div>
                <span class="cmd-item-enter">↵</span>
            </li>
        `).join('');

        list.querySelectorAll('.cmd-item').forEach(el => {
            el.addEventListener('mousemove', () => {
                selected = parseInt(el.dataset.idx, 10);
                updateSelection();
            });
            el.addEventListener('click', () => {
                selected = parseInt(el.dataset.idx, 10);
                runSelected();
            });
        });
    }

    function updateSelection() {
        list.querySelectorAll('.cmd-item').forEach(el => {
            el.dataset.selected = (parseInt(el.dataset.idx, 10) === selected).toString();
        });
        const active = list.querySelector(`[data-idx="${selected}"]`);
        if (active) active.scrollIntoView({ block: 'nearest' });
    }

    function filter() {
        const q = input.value.trim().toLowerCase();
        if (!q) { filtered = commands.slice(); }
        else {
            filtered = commands.filter(c =>
                (c.title + ' ' + c.desc + ' ' + (c.kw || '')).toLowerCase().includes(q)
            );
        }
        selected = 0;
        render();
    }

    function runSelected() {
        const c = filtered[selected];
        if (!c) return;
        closePalette();
        setTimeout(() => c.run(), 80);
    }

    function openPalette() {
        palette.classList.add('is-open');
        palette.setAttribute('aria-hidden', 'false');
        input.value = '';
        filter();
        setTimeout(() => input.focus(), 40);
    }

    function closePalette() {
        palette.classList.remove('is-open');
        palette.setAttribute('aria-hidden', 'true');
    }

    // Global shortcut
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if ((e.metaKey || e.ctrlKey) && key === 'k') {
            e.preventDefault();
            palette.classList.contains('is-open') ? closePalette() : openPalette();
        } else if (palette.classList.contains('is-open')) {
            if (key === 'escape') { e.preventDefault(); closePalette(); }
            else if (key === 'arrowdown') { e.preventDefault(); selected = Math.min(filtered.length - 1, selected + 1); updateSelection(); }
            else if (key === 'arrowup')   { e.preventDefault(); selected = Math.max(0, selected - 1); updateSelection(); }
            else if (key === 'enter')     { e.preventDefault(); runSelected(); }
        }
    });

    input.addEventListener('input', filter);

    palette.querySelectorAll('[data-cmd-close]').forEach(el => {
        el.addEventListener('click', closePalette);
    });

    // Expose for terminal handoff
    window.__closeCmdPalette = closePalette;

    filter();
})();

// 10. Terminal Easter Egg (backtick)
let openTerminal = () => {};
let closeTerminal = () => {};
(() => {
    const term = document.getElementById('term');
    const input = document.getElementById('term-input');
    const body = document.getElementById('term-body');
    if (!term || !input || !body) return;

    const history = [];
    let historyIdx = -1;

    const banner = `
<div class="term-line"><span class="t-c">chuma@soweto:~</span> · welcome. typed commands below.</div>
<div class="term-line">  ⚡  Type <span class="t-c">help</span> to see what I respond to.</div>
<div class="term-line">  💡  Hit <span class="t-c">esc</span> or click the red dot to close.</div>
<div class="term-line">&nbsp;</div>
    `.trim();

    const banners = {
        whoami: `<div class="term-line"><span class="t-c">Chuma (Mike) Meyiswa</span></div>
<div class="term-line">  Founder · Skhokho Labs (skhokholabs.xyz)</div>
<div class="term-line">  Software Engineer · NQF Level 6 · WeThinkCode_</div>
<div class="term-line">  Base · Soweto, Gauteng, South Africa</div>`,

        projects: `<div class="term-line">Featured builds →</div>
<div class="term-line">  <span class="t-c">legacy-lazarus</span>  refactors cursed code with an LLM</div>
<div class="term-line">  <span class="t-c">macala-agent</span>    LLM career strategist</div>
<div class="term-line">  <span class="t-c">civic-nerve</span>     autonomous city-ops AI</div>
<div class="term-line">  <span class="t-c">skhokho</span>         the flagship LifeOS</div>
<div class="term-line">  <span class="t-c">chain-quest</span>     web3 learning RPG</div>
<div class="term-line">  <span class="t-c">load-shedd</span>      message-driven SA integration</div>
<div class="term-line">&nbsp;</div>
<div class="term-line"><a href="products.html">→ see the full catalogue</a></div>`,

        contact: `<div class="term-line">📧  nmeyiswa@gmail.com</div>
<div class="term-line">💼  linkedin.com/in/chuma-mike</div>
<div class="term-line">🐙  github.com/ChumaMike</div>
<div class="term-line">💬  wa.me/27693023981</div>
<div class="term-line">🚀  skhokholabs.xyz</div>`,

        stack: `<div class="term-line">Languages · Python, Java, TypeScript, JavaScript, SQL</div>
<div class="term-line">Backend   · Django, Flask, Spring Boot, Node, Firebase</div>
<div class="term-line">Frontend  · React, Next.js, HTML, CSS</div>
<div class="term-line">Design    · Figma, Illustrator, Photoshop</div>
<div class="term-line">DevOps    · Git, GitHub Actions, Docker, Linux, CI/CD</div>`,

        skills: `<div class="term-line">See <span class="t-c">stack</span> for the toolbelt.</div>`,

        skhokho: `<div class="term-line">Opening <a href="https://skhokholabs.xyz" target="_blank">skhokholabs.xyz</a>…</div>`,

        cv: `<div class="term-line">CV available on request → <a href="mailto:nmeyiswa@gmail.com?subject=CV%20Request">ping me</a>.</div>`,

        socials: `<div class="term-line"><a href="https://github.com/ChumaMike" target="_blank">github</a> · <a href="https://www.linkedin.com/in/chuma-mike" target="_blank">linkedin</a> · <a href="https://wa.me/27693023981" target="_blank">whatsapp</a></div>`,

        molo: `<div class="term-line">Molo! 👋  That's hello in isiXhosa.</div>`,

        date: () => `<div class="term-line">${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Johannesburg' })} SAST</div>`,

        echo: (args) => `<div class="term-line">${args.join(' ') || ''}</div>`,

        sudo: () => `<div class="term-line err">chuma is not in the sudoers file.  This incident will be reported.</div>`,
    };

    banners.help = `<div class="term-line">Commands:</div>
<div class="term-line">  <span class="t-c">whoami</span>    who is this</div>
<div class="term-line">  <span class="t-c">projects</span>  featured builds</div>
<div class="term-line">  <span class="t-c">contact</span>   ways to reach me</div>
<div class="term-line">  <span class="t-c">stack</span>     the toolbelt</div>
<div class="term-line">  <span class="t-c">socials</span>   all the links</div>
<div class="term-line">  <span class="t-c">skhokho</span>   open the startup site</div>
<div class="term-line">  <span class="t-c">cv</span>        CV on request</div>
<div class="term-line">  <span class="t-c">date</span>      server time in SAST</div>
<div class="term-line">  <span class="t-c">molo</span>      say hi</div>
<div class="term-line">  <span class="t-c">clear</span>     wipe the screen</div>
<div class="term-line">  <span class="t-c">exit</span>      close terminal</div>`;

    function write(html) {
        body.insertAdjacentHTML('beforeend', html);
        body.scrollTop = body.scrollHeight;
    }

    function echo(cmdText) {
        write(`<div class="term-line input">chuma@soweto:~$ ${escapeHtml(cmdText)}</div>`);
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    }

    function run(raw) {
        const cmdText = raw.trim();
        if (!cmdText) return;
        echo(cmdText);
        history.unshift(cmdText);
        historyIdx = -1;

        const [cmd, ...args] = cmdText.split(/\s+/);
        const key = cmd.toLowerCase();

        if (key === 'clear') { body.innerHTML = ''; return; }
        if (key === 'exit')  { close(); return; }

        const handler = banners[key];
        if (!handler) {
            write(`<div class="term-line err">${escapeHtml(cmd)}: command not found. Try <span class="t-c">help</span>.</div>`);
            return;
        }
        const out = typeof handler === 'function' ? handler(args) : handler;
        write(out);

        if (key === 'skhokho') setTimeout(() => window.open('https://skhokholabs.xyz', '_blank'), 300);
    }

    function open() {
        if (window.__closeCmdPalette) window.__closeCmdPalette();
        term.classList.add('is-open');
        term.setAttribute('aria-hidden', 'false');
        if (!body.children.length) write(banner);
        setTimeout(() => input.focus(), 60);
    }

    function close() {
        term.classList.remove('is-open');
        term.setAttribute('aria-hidden', 'true');
    }

    openTerminal = open;
    closeTerminal = close;

    document.addEventListener('keydown', (e) => {
        const tag = (document.activeElement && document.activeElement.tagName) || '';
        const typing = ['INPUT', 'TEXTAREA'].includes(tag);

        if (e.key === '`' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            term.classList.contains('is-open') ? close() : open();
            return;
        }
        if (term.classList.contains('is-open')) {
            if (e.key === 'Escape') { e.preventDefault(); close(); }
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            run(input.value);
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            historyIdx = Math.min(history.length - 1, historyIdx + 1);
            input.value = history[historyIdx] || '';
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            historyIdx = Math.max(-1, historyIdx - 1);
            input.value = historyIdx < 0 ? '' : (history[historyIdx] || '');
        }
    });

    term.querySelectorAll('[data-term-close]').forEach(el => {
        el.addEventListener('click', close);
    });
})();

// 11. Tiny toast helper
function toast(msg, isError = false) {
    let el = document.getElementById('chuma-toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'chuma-toast';
        el.style.cssText = `
            position:fixed; bottom:90px; right:22px; z-index:1001;
            padding:10px 16px; border-radius:8px;
            font-family:var(--font-mono,monospace); font-size:0.82rem;
            background:rgba(10,15,30,0.95); color:#64ffda;
            border:1px solid rgba(100,255,218,0.35);
            box-shadow:0 10px 30px -10px rgba(0,0,0,0.6);
            transition:opacity 0.3s, transform 0.3s; opacity:0; transform:translateY(8px);`;
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.color = isError ? '#ff6b6b' : '#64ffda';
    el.style.borderColor = isError ? 'rgba(255,107,107,0.4)' : 'rgba(100,255,218,0.35)';
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';
    }, 1800);
}

// 12. 3D tilt on cards
(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (prefersReducedMotion || isTouch) return;

    const selector = '.bento-card, .design-tile, .cert-card, .lane-card, .client-card, .lab-notes-card';
    document.querySelectorAll(selector).forEach(card => {
        card.classList.add('tilt-card');
        let raf = null;
        const max = 5; // max degrees

        card.addEventListener('mousemove', (e) => {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateY(-4px)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            if (raf) cancelAnimationFrame(raf);
            card.style.transform = '';
        });
    });
})();
