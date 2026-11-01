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
    /* tilt */
    if (!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches) {
        document.querySelectorAll('[data-tilt]').forEach(function(c) {
            c.addEventListener('mousemove', function(e) {
                var r = c.getBoundingClientRect(),
                    x = (e.clientX - r.left) / r.width - .5,
                    y = (e.clientY - r.top) / r.height - .5;
                c.style.transform = 'perspective(1000px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg)'
            });
            c.addEventListener('mouseleave', function() { c.style.transform = '' })
        })
    }
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
                [0, 245, 255],
                [59, 130, 246],
                [168, 85, 247]
            ];

        function rs() {
            W = cv.width = Math.ceil(innerWidth * S);
            H = cv.height = Math.ceil(innerHeight * S)
        }
        rs();
        addEventListener('resize', rs);

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