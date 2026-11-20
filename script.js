(function() {
    var R = document.documentElement,
        $ = function(s) { return document.querySelector(s) },
        reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    try { var t = localStorage.getItem('dn-theme'); if (t === 'light' || t === 'dark') R.setAttribute('data-theme', t) } catch (e) {}
    $('#theme').onclick = function() {
        var n = R.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        R.setAttribute('data-theme', n);
        try { localStorage.setItem('dn-theme', n) } catch (e) {}
    };
    var FV = { default: "data:image/png;base64,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", editorial: "data:image/png;base64,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", cyberpunk: "data:image/png;base64,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" };
    var sb = $('#styleBtn'),
        sm = $('#styleMenu');

    function setStyle(v) {
        R.setAttribute('data-style', v);
        var ic = document.querySelector('link[rel="icon"]');
        if (ic && FV[v]) ic.href = FV[v];
        try { localStorage.setItem('dn-style', v) } catch (e) {}
        sm.querySelectorAll('button').forEach(function(b) { b.setAttribute('aria-checked', b.getAttribute('data-style') === v) })
    }
    try { var sv = localStorage.getItem('dn-style'); if (sv === 'default' || sv === 'editorial' || sv === 'cyberpunk' || s === 'professional') R.setAttribute('data-style', sv) } catch (e) {}
    setStyle(R.getAttribute('data-style') || 'default');

    function closeS() {
        sm.classList.remove('open');
        sb.setAttribute('aria-expanded', 'false')
    }
    sb.onclick = function() {
        var o = sm.classList.toggle('open');
        sb.setAttribute('aria-expanded', o)
    };
    sm.addEventListener('click', function(e) {
        var b = e.target.closest('button');
        if (b) {
            setStyle(b.getAttribute('data-style'));
            closeS()
        }
    });
    document.addEventListener('click', function(e) { if (!sm.contains(e.target) && !sb.contains(e.target)) closeS() });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeS() });

    var mb = $('#menuBtn'),
        lk = $('#links');

    function closeM() {
        lk.classList.remove('open');
        mb.setAttribute('aria-expanded', 'false')
    }
    mb.onclick = function() {
        var o = lk.classList.toggle('open');
        mb.setAttribute('aria-expanded', o)
    };
    lk.addEventListener('click', function(e) { if (e.target.tagName === 'A') closeM() });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeM() });
    document.addEventListener('click', function(e) { if (!lk.contains(e.target) && !mb.contains(e.target)) closeM() });
    /* reveal */
    try {
        (function() {
            function split(el) {
                var i = 0;
                (function walk(n) {
                    Array.prototype.slice.call(n.childNodes).forEach(function(c) {
                        if (c.nodeType === 3) {
                            var f = document.createDocumentFragment();
                            c.textContent.split(/(\s+)/).forEach(function(t) {
                                if (!t) return;
                                if (/^\s+$/.test(t)) { f.appendChild(document.createTextNode(' ')); return }
                                var o = document.createElement('span');
                                o.className = 'w';
                                var k = document.createElement('span');
                                k.textContent = t;
                                k.style.transitionDelay = (i++ * 40) + 'ms';
                                o.appendChild(k);
                                f.appendChild(o)
                            });
                            c.parentNode.replaceChild(f, c)
                        } else if (c.nodeType === 1) walk(c)
                    })
                })(el)
            }
            document.querySelectorAll('.rv h2,.ab2 p,.rv>p:not(.loc)').forEach(split)
        })()
    } catch (e) {}
    R.classList.add('js');
    var rv = Array.prototype.filter.call(document.querySelectorAll('.rv'), function(el) { return !el.closest('.hero') });
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(en) { en.forEach(function(x) { x.target.classList.toggle('in', x.isIntersecting) }) }, { threshold: .1, rootMargin: '-6% 0px -6% 0px' });
        rv.forEach(function(el) { io.observe(el) })
    } else rv.forEach(function(el) { el.classList.add('in') });
    /* active nav */
    var secs = ['home', 'about', 'skills', 'experience', 'projects', 'contact'],
        as = document.querySelectorAll('.links a');

    function spy() {
        var y = scrollY + innerHeight * .35,
            cur = 'home';
        secs.forEach(function(id) { var el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id });
        if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = 'contact';
        as.forEach(function(a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur) });
        $('#top').classList.toggle('show', scrollY > 700)
    }
    addEventListener('scroll', spy, { passive: true });
    spy();
    /* copy */
    var tip = $('#tip'),
        em = 'deeveshnemade2007@gmail.com';

    function shown() {
        tip.classList.add('show');
        setTimeout(function() { tip.classList.remove('show') }, 1800)
    }

    function fb() {
        try {
            var a = document.createElement('textarea');
            a.value = em;
            a.style.position = 'fixed';
            a.style.opacity = '0';
            document.body.appendChild(a);
            a.select();
            var ok = document.execCommand('copy');
            document.body.removeChild(a);
            if (ok) shown();
            else prompt('Copy this email:', em)
        } catch (e) { prompt('Copy this email:', em) }
    }
    $('#copy').onclick = function() { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(em).then(shown, fb) } else fb() };
    /* fluid */
    (function() {
        var cv = document.getElementById('fluid');
        if (!cv || reduce) { if (cv) cv.style.display = 'none'; return }
        var cx = cv.getContext('2d'),
            W, H, S = .5,
            ps = [],
            px = -1,
            py = -1,
            last = 0,
            ghost = true,
            t0 = Date.now(),
            cols = [
                [47, 107, 255],
                [216, 203, 179],
                [111, 151, 255]
            ];

        function rs() {
            W = cv.width = Math.ceil(innerWidth * S);
            H = cv.height = Math.ceil(innerHeight * S)
        }
        rs();
        addEventListener('resize', rs);

        function rc() {
            try {
                var cs = getComputedStyle(document.documentElement),
                    n = [1, 2, 3].map(function(i) { return cs.getPropertyValue('--fl' + i).trim().split(',').map(Number) });
                if (n.every(function(a) { return a.length === 3 && !a.some(isNaN) })) cols = n
            } catch (e) {}
        }
        rc();
        new MutationObserver(rc).observe(document.documentElement, { attributes: true, attributeFilter: ['data-style', 'data-theme'] });

        function emit(x, y, vx, vy) { for (var i = 0; i < 2; i++) ps.push({ x: x * S, y: y * S, vx: vx * .05 * S + (Math.random() - .5) * .6, vy: vy * .05 * S + (Math.random() - .5) * .6, l: 1, r: (45 + Math.random() * 55) * S, c: cols[(Math.random() * 3) | 0] }); if (ps.length > 150) ps.splice(0, ps.length - 150) }

        function mv(x, y) {
            if (px >= 0 && !ghost) emit(x, y, x - px, y - py);
            else emit(x, y, 0, 0);
            ghost = false;
            px = x;
            py = y;
            last = Date.now();
            if (!run && ps.length) {
                run = true;
                requestAnimationFrame(f)
            }
        }
        addEventListener('pointermove', function(e) { if (e.pointerType !== 'touch') mv(e.clientX, e.clientY) }, { passive: true });
        addEventListener('touchstart', function(e) {
            var t = e.touches[0];
            if (!t) return;
            ghost = true;
            mv(t.clientX, t.clientY)
        }, { passive: true });
        addEventListener('touchmove', function(e) { var t = e.touches[0]; if (t) mv(t.clientX, t.clientY) }, { passive: true });
        var run = false;

        function f() {

            cx.globalCompositeOperation = 'destination-out';
            cx.fillStyle = 'rgba(0,0,0,.07)';
            cx.fillRect(0, 0, W, H);
            cx.globalCompositeOperation = 'source-over';
            for (var i = ps.length - 1; i >= 0; i--) {
                var p = ps[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= .97;
                p.vy *= .97;
                p.l -= .012;
                if (p.l <= 0) { ps.splice(i, 1); continue }
                var g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                g.addColorStop(0, 'rgba(' + p.c + ',' + (.24 * p.l) + ')');
                g.addColorStop(1, 'rgba(' + p.c + ',0)');
                cx.fillStyle = g;
                cx.beginPath();
                cx.arc(p.x, p.y, p.r, 0, 6.3);
                cx.fill()
            }
            if (ps.length) { requestAnimationFrame(f) } else {
                run = false;
                cx.clearRect(0, 0, W, H)
            }
        }
    })();
})();
/* ===== Card tilt: boxes lift and tilt slightly toward the cursor or finger ===== */
(function() {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    /* t: tilt deg, l: lift px, k: follow speed */
    var CFG = { project: { t: 7, l: -4, k: .14 }, skill: { t: 4, l: -3, k: .22 }, chip: { t: 0, l: -1, k: .3 }, calm: { t: 1.6, l: -1, k: .08 }, exp: { t: 5, l: -4, k: .14 }, soft: { t: 2.6, l: -2, k: .12 } };
    [
        ['.pc', 'project'],
        ['.sc', 'skill'],
        ['.sc .tags span', 'chip'],
        ['.ex', 'exp'],
        ['.ecard', 'calm'],
        ['.mini', 'soft'],
        ['.cta', 'soft'],
        ['.mail', 'soft']
    ].forEach(function(m) {
        document.querySelectorAll(m[0]).forEach(function(el) {
            el.setAttribute('data-fx', m[1]);
            bind(el, CFG[m[1]])
        })
    });

    function bind(el, c) {
        var nx = .5,
            ny = .5,
            tx = .5,
            ty = .5,
            on = 0,
            live = false,
            raf = 0,
            st = el.style;

        function pos(e) {
            var r = el.getBoundingClientRect();
            tx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
            ty = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
        }

        function run() { if (!raf) raf = requestAnimationFrame(tick) }

        function tick() {
            raf = 0;
            nx += (tx - nx) * c.k;
            ny += (ty - ny) * c.k;
            on += ((live ? 1 : 0) - on) * .14;
            st.setProperty('--rx', ((.5 - ny) * c.t * 2).toFixed(2) + 'deg');
            st.setProperty('--ry', ((nx - .5) * c.t * 2).toFixed(2) + 'deg');
            st.setProperty('--ty', (c.l * on).toFixed(2) + 'px');
            if (live || on > .01 || Math.abs(nx - tx) > .002 || Math.abs(ny - ty) > .002) run();
            else el.classList.remove('fx-live')
        }

        function start(p) {
            pos(p);
            if (!el.classList.contains('fx-live')) {
                nx = .5;
                ny = .5
            }
            live = true;
            el.classList.add('fx-live');
            run()
        }

        function end() {
            live = false;
            tx = .5;
            ty = .5;
            run()
        }
        if (fine) {
            el.addEventListener('pointerenter', function(e) { if (e.pointerType !== 'touch') start(e) });
            el.addEventListener('pointermove', function(e) {
                if (live && e.pointerType !== 'touch') {
                    pos(e);
                    run()
                }
            });
            el.addEventListener('pointerleave', end)
        }
        /* touch screens: tilt toward the finger while it is on the box, ease back on release */
        el.addEventListener('touchstart', function(e) { if (e.touches[0]) start(e.touches[0]) }, { passive: true });
        el.addEventListener('touchmove', function(e) {
            if (live && e.touches[0]) {
                pos(e.touches[0]);
                run()
            }
        }, { passive: true });
        el.addEventListener('touchend', end, { passive: true });
        el.addEventListener('touchcancel', end, { passive: true })
    }
})();