(function () {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // A prerendered page would finish the motion before it is shown, so hold it until activation.
    const waiting = document.prerendering;
    const held = [];
    document.querySelectorAll('[data-arrive]:not([data-arrived])').forEach(el => {
        el.setAttribute('data-arrived', '');

        const shown = document.createElement('span');
        shown.setAttribute('aria-hidden', 'true');
        const letters = [];
        let lastSpace = true;
        (function walk(node, into) {
            [...node.childNodes].forEach(c => {
                if (c.nodeType === 1) {
                    const copy = c.cloneNode(false);
                    into.appendChild(copy);
                    walk(c, copy);
                    return;
                }
                if (c.nodeType !== 3) return;
                for (const ch of c.textContent.replace(/\s+/g, ' ')) {
                    if (ch === ' ' && lastSpace) continue;
                    lastSpace = ch === ' ';
                    const span = document.createElement('span');
                    span.className = 'arrive';
                    span.textContent = ch;
                    into.appendChild(span);
                    letters.push(span);
                }
            });
        })(el, shown);
        if (lastSpace && letters.length) letters.pop().remove();

        const sr = document.createElement('span');
        sr.className = 'arrive-text';
        sr.textContent = el.textContent.replace(/\s+/g, ' ').trim();
        el.replaceChildren(shown, sr);

        let seed = 7;
        const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        letters.forEach(span => {
            const from = +((3 + rnd() * 9) * 0.72).toFixed(4);
            const a = span.animate([
                { transform: `translateX(${from}em)`, opacity: 0 },
                { transform: 'none', opacity: 1 }
            ], { duration: 900 + rnd() * 900, delay: 80 + rnd() * 260,
                 easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
            if (waiting) { a.pause(); held.push(a); }
        });
    });
    if (waiting) document.addEventListener('prerenderingchange', () => held.forEach(a => a.play()), { once: true });
})();
