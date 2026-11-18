/* chumamike.github.io · behaviour
   Everything here is progressive enhancement. The page reads fine with JS off. */
(() => {
    'use strict';
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- toast ---------- */
    const toastEl = $('#toast');
    let toastTimer;
    function toast(msg) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('is-on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 1800);
    }

    /* ---------- theme ---------- */
    const root = document.documentElement;
    function currentTheme() {
        const set = root.getAttribute('data-theme');
        if (set === 'light' || set === 'dark') return set;
        return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    $('#theme-btn')?.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (_) {}
    });

    /* ---------- nav ---------- */
    const nav = $('.nav');
    const onScroll = () => nav?.classList.toggle('is-scrolled', scrollY > 8);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    const menuBtn = $('#menu-btn');
    const mobileMenu = $('#mobile-menu');
    function setMenu(open) {
        if (!menuBtn || !mobileMenu) return;
        mobileMenu.hidden = !open;
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    menuBtn?.addEventListener('click', () => setMenu(mobileMenu.hidden));
    mobileMenu?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && mobileMenu && !mobileMenu.hidden) setMenu(false); });

    // Highlight the nav link for the section in view.
    const sectionLinks = $$('.nav-links a[href^="#"]');
    const sections = sectionLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (!en.isIntersecting) return;
                sectionLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        sections.forEach(s => io.observe(s));
    }

    /* ---------- reveal on scroll ---------- */
    const revealTargets = $$('.card, .principle, .timeline-list li, .exp li, .cert-grid li, .contact-grid li, .site-list li');
    if (!reduceMotion && 'IntersectionObserver' in window) {
        revealTargets.forEach(el => el.classList.add('reveal'));
        const ro = new IntersectionObserver(entries => {
            entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); } });
        }, { threshold: 0.08 });
        revealTargets.forEach(el => ro.observe(el));
        // Safety net: never leave content hidden if the observer misfires.
        setTimeout(() => revealTargets.forEach(el => el.classList.add('is-in')), 2500);
    }

    /* ---------- room hotspots ---------- */
    const room = $('.room');
    const tip = $('#room-tip');
    const roomWrap = $('.room-wrap');
    if (room && tip && roomWrap) {
        const show = (hs) => {
            const label = hs.getAttribute('data-label');
            if (!label) return;
            const r = hs.getBoundingClientRect();
            const w = roomWrap.getBoundingClientRect();
            tip.textContent = label;
            tip.style.left = (r.left - w.left + r.width / 2) + 'px';
            tip.style.top = (r.top - w.top) + 'px';
            tip.classList.add('is-on');
        };
        const hide = () => tip.classList.remove('is-on');
        $$('.hs', room).forEach(hs => {
            hs.addEventListener('pointerenter', () => show(hs));
            hs.addEventListener('pointerleave', hide);
            hs.addEventListener('focus', () => show(hs));
            hs.addEventListener('blur', hide);
            hs.addEventListener('click', e => {
                // Smooth-scroll inside the page; SVG <a> navigation works without this too.
                const href = hs.getAttribute('href');
                const target = href && $(href);
                if (!target) return;
                e.preventDefault();
                hide();
                target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                history.replaceState(null, '', href);
            });
        });
    }

    /* ---------- SAST clock ---------- */
    const clock = $('#sast-time');
    if (clock) {
        const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg', hour: '2-digit', minute: '2-digit' });
        const tick = () => { clock.textContent = 'now ' + fmt.format(new Date()); };
        tick();
        setInterval(tick, 30000);
    }

    /* ---------- command palette ---------- */
    const cmd = $('#cmd');
    const cmdInput = $('#cmd-input');
    const cmdList = $('#cmd-list');
    const copyEmail = async () => {
        try { await navigator.clipboard.writeText('nmeyiswa@gmail.com'); toast('Email copied'); }
        catch (_) { toast('Could not copy'); }
    };
    const commands = [
        { t: 'Live right now', d: '#now', kw: 'now live bonablock gcina skhokho products', run: () => go('#now') },
        { t: '2026 hackathon record', d: '#work', kw: 'work projects hackathons builds', run: () => go('#work') },
        { t: 'How I build', d: '#how', kw: 'how principles stack tech', run: () => go('#how') },
        { t: 'Experience', d: '#experience', kw: 'experience roles timeline career founder mentor', run: () => go('#experience') },
        { t: 'Credentials', d: '#credentials', kw: 'certifications certs credentials nqf', run: () => go('#credentials') },
        { t: 'Sites for small businesses', d: '#sites', kw: 'sites clients websites soweto', run: () => go('#sites') },
        { t: 'Off the clock', d: '#offclock', kw: 'skate skateboard ps5 games hobbies', run: () => go('#offclock') },
        { t: 'Get in touch', d: '#contact', kw: 'contact email hire talk', run: () => go('#contact') },
        { t: 'Copy email address', d: 'nmeyiswa@gmail.com', kw: 'copy email clipboard', run: copyEmail },
        { t: 'Open BonaBlock', d: 'bonablock.vercel.app', kw: 'bonablock avalanche schools', run: () => open('https://bonablock.vercel.app') },
        { t: 'Open Gcina dashboard', d: 'gcina.vercel.app', kw: 'gcina xrpl payments', run: () => open('https://gcina.vercel.app') },
        { t: 'Open Skhokho', d: 'skhokho.sgdataint.co.za', kw: 'skhokho till shop', run: () => open('https://skhokho.sgdataint.co.za') },
        { t: 'GitHub · @ChumaMike', d: 'github.com/ChumaMike', kw: 'github code repos', run: () => open('https://github.com/ChumaMike') },
        { t: 'LinkedIn · chuma-mike', d: 'linkedin.com', kw: 'linkedin', run: () => open('https://www.linkedin.com/in/chuma-mike') },
        { t: 'WhatsApp', d: 'wa.me', kw: 'whatsapp message chat', run: () => open('https://wa.me/27693023981') },
        { t: 'SG Data Int', d: 'sgdataint.co.za', kw: 'sg data int sgdataint company mentor', run: () => open('https://sgdataint.co.za') },
        { t: 'Skhokho Labs', d: 'skhokholabs.xyz', kw: 'skhokho labs company startup', run: () => open('https://skhokholabs.xyz') },
        { t: 'Toggle theme', d: 'light / dark', kw: 'theme dark light mode', run: () => $('#theme-btn')?.click() },
        { t: 'Open terminal', d: 'or press `', kw: 'terminal console shell easter egg', run: () => setTimeout(openTerm, 80) },
    ];
    function go(hash) { const el = $(hash); if (el) { el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); history.replaceState(null, '', hash); } }
    function open(url) { window.open(url, '_blank', 'noopener'); }

    let filtered = commands.slice();
    let selected = 0;
    function renderCmd() {
        if (!cmdList) return;
        if (!filtered.length) { cmdList.innerHTML = '<li class="cmd-empty">Nothing matches. Try "work" or "email".</li>'; return; }
        cmdList.innerHTML = filtered.map((c, i) =>
            `<li class="cmd-item" role="option" data-i="${i}" aria-selected="${i === selected}"><span class="t">${esc(c.t)}</span><span class="d">${esc(c.d)}</span></li>`
        ).join('');
        $$('.cmd-item', cmdList).forEach(li => {
            li.addEventListener('mousemove', () => { selected = +li.dataset.i; markCmd(); });
            li.addEventListener('click', () => { selected = +li.dataset.i; runCmd(); });
        });
    }
    function markCmd() {
        $$('.cmd-item', cmdList).forEach(li => li.setAttribute('aria-selected', String(+li.dataset.i === selected)));
        cmdList.querySelector(`[data-i="${selected}"]`)?.scrollIntoView({ block: 'nearest' });
    }
    function filterCmd() {
        const q = (cmdInput?.value || '').trim().toLowerCase();
        filtered = q ? commands.filter(c => (c.t + ' ' + c.d + ' ' + c.kw).toLowerCase().includes(q)) : commands.slice();
        selected = 0;
        renderCmd();
    }
    function runCmd() { const c = filtered[selected]; if (!c) return; closeCmd(); setTimeout(c.run, 60); }
    function openCmd() { if (!cmd) return; closeTerm(); cmd.hidden = false; if (cmdInput) cmdInput.value = ''; filterCmd(); setTimeout(() => cmdInput?.focus(), 30); }
    function closeCmd() { if (cmd) cmd.hidden = true; }
    $('#palette-btn')?.addEventListener('click', openCmd);
    cmdInput?.addEventListener('input', filterCmd);
    cmd?.addEventListener('click', e => { if (e.target.hasAttribute('data-cmd-close')) closeCmd(); });
    cmdInput?.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, filtered.length - 1); markCmd(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(selected - 1, 0); markCmd(); }
        else if (e.key === 'Enter') { e.preventDefault(); runCmd(); }
    });

    /* ---------- terminal ---------- */
    const term = $('#term');
    const termBody = $('#term-body');
    const termInput = $('#term-input');
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const line = (html, cls = '') => `<div class="term-line ${cls}">${html}</div>`;
    const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${esc(text || href)}</a>`;
    const banners = {
        help: [
            'Commands:',
            '  <span class="t-c">whoami</span>    who is this',
            '  <span class="t-c">now</span>       what is live',
            '  <span class="t-c">projects</span>  the 2026 record',
            '  <span class="t-c">stack</span>     the toolbelt',
            '  <span class="t-c">contact</span>   ways to reach me',
            '  <span class="t-c">cv</span>        CV on request',
            '  <span class="t-c">date</span>      time in Soweto',
            '  <span class="t-c">molo</span>      say hi',
            '  <span class="t-c">clear</span>     wipe the screen',
            '  <span class="t-c">exit</span>      close the terminal',
        ],
        whoami: [
            '<span class="t-c">Chuma (Mike) Meyiswa</span>',
            '  Software Engineer (Backend) · AI agents · Blockchain',
            '  Associate Founder, SG Data Int · Founder, Skhokho Labs',
            '  WeThinkCode_ graduate · former Technical Mentor',
            '  Soweto, Johannesburg, South Africa',
        ],
        now: [
            `  <span class="t-c">bonablock</span>  ${link('https://bonablock.vercel.app')}   schools · Avalanche · independent verification`,
            `  <span class="t-c">gcina</span>      ${link('https://gcina.vercel.app')}       AP agent · XRPL multi-sign · testnet`,
            `  <span class="t-c">skhokho</span>    ${link('https://skhokho.sgdataint.co.za')} shop · till · loyalty · live`,
        ],
        projects: [
            '  2026-11  BonaBlock      UJ BACISS · Avalanche',
            '  2026-11  Gcina          W3Node · Agentic Finance (XRPL)',
            "  2026-11  Shay' iPost    NEMISA Discothon",
            '  2026-10  Mgadi          HackSecure · SMME cyber',
            '  2026-10  Skhokho        FNB App of the Year',
            '  2026-10  SafeGuard SA   Gauteng Youth Tech Expo',
            '  2026-07  GridWise       Microsoft Copilot Studio · WINNER',
            '',
            '  <a href="#work">→ details on the page</a>',
        ],
        stack: [
            '  Languages  TypeScript · Java · Python · Solidity · SQL',
            '  Backend    Next.js · Node · Spring Boot · FastAPI · Flask · Postgres',
            '  Agents     LLM tool-calling · LangChain · Copilot Studio',
            '  Web3       Avalanche (EVM) · XRP Ledger · Hardhat · viem',
            '  Shipping   Vercel · GitHub Actions · Docker · Linux · Playwright',
        ],
        contact: [
            `  email     ${link('mailto:nmeyiswa@gmail.com', 'nmeyiswa@gmail.com')}`,
            `  linkedin  ${link('https://www.linkedin.com/in/chuma-mike', 'in/chuma-mike')}`,
            `  github    ${link('https://github.com/ChumaMike', '@ChumaMike')}`,
            `  whatsapp  ${link('https://wa.me/27693023981', '+27 69 302 3981')}`,
        ],
        cv: [`  CV on request → ${link('mailto:nmeyiswa@gmail.com?subject=CV%20request', 'ping me')}`],
        molo: ['  Molo! 👋  That is hello in isiXhosa.'],
        sudo: ['<span class="t-e">chuma is not in the sudoers file. This incident will be reported.</span>'],
        ls: ['  now/  work/  how/  experience/  credentials/  sites/  offclock/  contact/'],
    };
    function write(html) { if (!termBody) return; termBody.insertAdjacentHTML('beforeend', html); termBody.scrollTop = termBody.scrollHeight; }
    function runTerm(raw) {
        const [cmdName, ...args] = raw.trim().split(/\s+/);
        if (!cmdName) return;
        write(line(`<span class="t-c">$</span> ${esc(raw)}`));
        const name = cmdName.toLowerCase();
        if (name === 'clear') { termBody.innerHTML = ''; return; }
        if (name === 'exit') { closeTerm(); return; }
        if (name === 'date') { write(line('  ' + new Date().toLocaleString('en-GB', { timeZone: 'Africa/Johannesburg' }) + ' SAST')); return; }
        if (name === 'echo') { write(line('  ' + esc(args.join(' ')))); return; }
        if (name === 'cd' && args[0]) { const id = args[0].replace(/\/$/, ''); if ($('#' + id)) { closeTerm(); go('#' + id); } else write(line(`cd: no such section: ${esc(args[0])}`, 't-e')); return; }
        const b = banners[name];
        if (b) { b.forEach(l => write(line(l))); return; }
        write(line(`${esc(cmdName)}: command not found. Try <span class="t-c">help</span>.`, 't-e'));
    }
    function openTerm() {
        if (!term) return;
        closeCmd();
        term.hidden = false;
        if (termBody && !termBody.childElementCount) {
            write(line('<span class="t-c">chuma@soweto:~</span>  welcome.'));
            write(line('  type <span class="t-c">help</span>, or <span class="t-c">cd work</span> to jump around. <span class="t-m">esc</span> closes.'));
            write(line('&nbsp;'));
        }
        setTimeout(() => termInput?.focus(), 30);
    }
    function closeTerm() { if (term) term.hidden = true; }
    term?.addEventListener('click', e => { if (e.target.hasAttribute('data-term-close')) closeTerm(); });
    termInput?.addEventListener('keydown', e => {
        if (e.key === 'Enter') { runTerm(termInput.value); termInput.value = ''; }
    });

    /* ---------- global keys ---------- */
    addEventListener('keydown', e => {
        const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || '') && !document.activeElement.closest('#cmd, #term');
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmd?.hidden ? openCmd() : closeCmd(); return; }
        if (e.key === 'Escape') { closeCmd(); closeTerm(); return; }
        if (e.key === '`' && !typing && cmd?.hidden) { e.preventDefault(); term?.hidden ? openTerm() : closeTerm(); }
    });
})();
