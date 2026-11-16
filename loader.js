// Loading screen, ported from Audiospatials (js/theme.js + css/theme.css there): the name in bold over a
// filling bar, once per visit, until the page has loaded (shown at least 0.7s, at most 3s). Loaded in the
// head of every page, after the theme script, so it's there from the first frame in the right colors.
// When it lifts it fires `loaderdone` on document; title and scramble motion waits for that.
(function () {
    var html = document.documentElement, seen = false;
    try { seen = !!sessionStorage.getItem('ge-loaded'); sessionStorage.setItem('ge-loaded', '1'); } catch (e) {}
    if (seen || document.prerendering) return;

    var css = document.createElement('style');
    css.textContent =
        'html.loading{--ld-bg:#0a0a0a;--ld-fg:#f5f5f5;--ld-faint:rgba(245,245,245,.18)}' +
        'html.loading[data-theme="light"]{--ld-bg:#fafaf8;--ld-fg:#141414;--ld-faint:rgba(20,20,20,.16)}' +
        'html.loading::before,html.loading::after{content:"";position:fixed;z-index:10000;pointer-events:none}' +
        'html.loading::before{content:"GREGOR EGAN";inset:0;display:grid;place-items:center;padding-bottom:64px;' +
        'background:var(--ld-bg);color:var(--ld-fg);' +
        "font:800 clamp(26px,3vw,44px)/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;" +
        'letter-spacing:-.03em;text-transform:none!important}' +
        'html.loading::after{left:50%;top:calc(50% + 14px);width:clamp(200px,20vw,300px);height:6px;border-radius:3px;' +
        'translate:-50% 0;background:linear-gradient(var(--ld-fg),var(--ld-fg)) 0 0/85% 100% no-repeat,var(--ld-faint);' +
        'animation:ld-fill 1.1s cubic-bezier(.2,.7,.2,1) both}' +
        'html.loaded::after{animation:ld-done .25s ease-out forwards}' +
        'html.loaded::before,html.loaded::after{opacity:0;transition:opacity .45s ease .25s}' +
        '@keyframes ld-fill{from{background-size:0% 100%,auto}}' +
        '@keyframes ld-done{to{background-size:100% 100%,auto}}' +
        '@media (prefers-reduced-motion:reduce){html.loading::after{animation:none}}';
    document.head.appendChild(css);
    html.classList.add('loading');

    var start = Date.now(), finished = false;
    function done() {
        if (finished) return;
        finished = true;
        setTimeout(function () {
            html.classList.add('loaded');
            setTimeout(function () { document.dispatchEvent(new Event('loaderdone')); }, 250);
            setTimeout(function () { html.classList.remove('loading', 'loaded'); }, 800);
        }, Math.max(0, 700 - (Date.now() - start)));
    }
    addEventListener('load', done);
    setTimeout(done, 3000);
})();
