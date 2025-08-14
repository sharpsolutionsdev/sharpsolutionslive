// Attach after other scripts (module)
const revealItems = [
  ...document.querySelectorAll('.panel.glow-border'),
  ...document.querySelectorAll('.feature-card'),
  ...document.querySelectorAll('.hero-content'),
  ...document.querySelectorAll('.service-item'),
  ...document.querySelectorAll('.why-card'),
  ...document.querySelectorAll('.carousel-slide'),
  ...document.querySelectorAll('.t-card')
];
revealItems.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
},{ threshold: 0.15 });
revealItems.forEach(el=>io.observe(el));

// Auto carousel (projects)
(() => {
  const wrap = document.getElementById('projectsCarousel');
  if(!wrap) return;
  const track = wrap.querySelector('.carousel-track');
  const slides = Array.from(wrap.querySelectorAll('.carousel-slide'));
  const prev = wrap.querySelector('.carousel-btn.prev');
  const next = wrap.querySelector('.carousel-btn.next');
  let index = 0; let timer = null; let paused = false;
  function isDesktop(){ return window.matchMedia('(min-width: 900px)').matches; }
  function update(){
    if(isDesktop()){
      // show static row on desktop (no auto-translate)
      track.style.transform = 'translateX(0)';
      return;
    }
    const slideWidth = slides[0].getBoundingClientRect().width + 20;
    track.style.transform = `translateX(${-index * slideWidth}px)`;
  }
  function go(dir){ if(isDesktop()) return; index = (index + dir + slides.length) % slides.length; update(); }
  function play(){ timer = setInterval(()=>{ if(!paused && !isDesktop()) go(1); }, 3500); }
  function stop(){ if(timer) clearInterval(timer); }
  prev?.addEventListener('click', ()=>go(-1));
  next?.addEventListener('click', ()=>go(1));
  wrap.addEventListener('mouseenter', ()=>{ paused = true; });
  wrap.addEventListener('mouseleave', ()=>{ paused = false; });
  window.addEventListener('resize', update, { passive: true });
  update(); play();
})();

// Auto slider (testimonials)
(() => {
  const wrap = document.getElementById('testimonialsSlider');
  if(!wrap) return;
  const track = wrap.querySelector('.t-track');
  const slides = Array.from(wrap.querySelectorAll('.t-card'));
  let i = 0; let paused = false; let timer;
  function isDesktop(){ return window.matchMedia('(min-width: 900px)').matches; }
  function update(){
    const w = slides[0].getBoundingClientRect().width + 20;
    track.style.transform = `translateX(${-i * w}px)`;
  }
  function step(){ if(!paused){ i = (i + 1) % slides.length; update(); } }
  wrap.addEventListener('mouseenter', ()=> paused = true);
  wrap.addEventListener('mouseleave', ()=> paused = false);
  window.addEventListener('resize', update, { passive: true });
  update(); timer = setInterval(step, 4000);
})();

// Pointer parallax for any section containing glow orbs
document.querySelectorAll('.hero-glow-bg').forEach(glowBg => {
  const container = glowBg.parentElement;
  const localOrbs = glowBg.querySelectorAll('.glow-orb');
  if(!container || !localOrbs.length) return;
  container.addEventListener('pointermove', e => {
    const r = container.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    localOrbs.forEach((orb, i) => {
      const depth = (i + 1) * 12;
      orb.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
    });
  });
  container.addEventListener('pointerleave', () => {
    localOrbs.forEach(o => (o.style.transform = 'translate3d(0,0,0)'));
  });
});

// Subtle scroll parallax for hero title
const heroTitle = document.querySelector('.hero-title');
window.addEventListener('scroll', ()=>{
  if(!heroTitle) return;
  const y = window.scrollY * 0.15;
  heroTitle.style.transform = `translateY(${y}px)`;
  const sm = document.querySelector('.scroll-mouse');
  if(sm){ if(window.scrollY > 40) sm.classList.add('hide'); else sm.classList.remove('hide'); }
},{ passive:true });

// Floating/gliding shapes in background
(function(){
  const container = document.createElement('div');
  container.className = 'float-decor';
  document.body.appendChild(container);
  const count = 14;
  for(let i=0;i<count;i++){
    const s = document.createElement('span');
    s.className = 'shape';
    const size = 6 + Math.random()*14;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random()*100 + 'vw';
    s.style.top = (100 + Math.random()*60) + 'vh';
    s.style.animationDuration = (40 + Math.random()*40) + 's';
    s.style.animationDelay = (-Math.random()*40) + 's';
    s.style.background = `radial-gradient(circle, rgba(222,7,208,0.5), rgba(168,0,166,0.2))`;
    container.appendChild(s);
  }
})();

// Cursor particle trail (subtle)
(function(){
  const maxParticles = 80;
  const pool = [];
  const root = document.createElement('div');
  root.style.position = 'fixed';
  root.style.inset = '0';
  root.style.pointerEvents = 'none';
  root.style.zIndex = '5';
  document.body.appendChild(root);

  function spawn(x,y){
    const el = document.createElement('span');
    el.style.position='absolute';
    el.style.left = x+'px';
    el.style.top = y+'px';
    const size = 3 + Math.random()*4;
    el.style.width = size+'px';
    el.style.height = size+'px';
    el.style.borderRadius='50%';
    el.style.background = 'radial-gradient(circle, rgba(222,7,208,0.9), rgba(168,0,166,0.1))';
    el.style.filter = 'blur(0.5px)';
    el.style.opacity='0.85';
    el.style.transform='translate(-50%,-50%)';
    el.style.transition='transform .8s ease-out, opacity .8s ease-out';
    root.appendChild(el);
    requestAnimationFrame(()=>{
      el.style.transform = `translate(-50%,-50%) translate(${(Math.random()-0.5)*40}px, ${(Math.random()-0.5)*40}px)`;
      el.style.opacity='0';
    });
    setTimeout(()=>{ el.remove(); }, 900);
  }

  window.addEventListener('pointermove', (e)=>{
    if(window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
    spawn(e.clientX, e.clientY);
  }, { passive: true });
})();

// Page transitions: fade overlay when navigating
(function(){
  const overlay = document.getElementById('pageTransition');
  if(!overlay) return;
  const links = document.querySelectorAll('a[href]');
  links.forEach(a=>{
    const url = a.getAttribute('href')||'';
    if(url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) return;
    a.addEventListener('click', (e)=>{
      if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if(a.target === '_blank') return;
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(()=>{ window.location.href = url; }, 300);
    });
  });
  window.addEventListener('pageshow', ()=> overlay.classList.remove('active'));
})();

// Mobile menu particles when open
(function(){
  const nav = document.getElementById('nav-menu');
  const container = nav?.querySelector('.nav-particles');
  if(!nav || !container) return;
  let raf = 0; const dots = []; const maxDots = 40;
  function create(){
    const d = document.createElement('span');
    d.style.position='absolute';
    const size = 2 + Math.random()*3;
    d.style.width = size+'px'; d.style.height=size+'px'; d.style.borderRadius='50%';
    d.style.left = Math.random()*100+'%'; d.style.top = '100%';
    d.style.background='rgba(222,7,208,0.5)'; d.style.filter='blur(0.5px)';
    container.appendChild(d);
    const speed = 0.4 + Math.random()*0.6; const drift = (Math.random()-0.5)*0.2;
    return { el:d, y:100, x:parseFloat(d.style.left), speed, drift };
  }
  function tick(){
    if(!nav.classList.contains('nav-open')){ cancelAnimationFrame(raf); raf=0; container.innerHTML=''; dots.length=0; return; }
    while(dots.length<maxDots) dots.push(create());
    dots.forEach(p=>{
      p.y -= p.speed; p.x += p.drift;
      p.el.style.top = p.y+'%'; p.el.style.left = p.x+'%';
      if(p.y < -10){ p.el.remove(); dots.splice(dots.indexOf(p),1); }
    });
    raf = requestAnimationFrame(tick);
  }
  const burger = document.querySelector('.burger-menu');
  burger?.addEventListener('click', ()=>{ if(!raf) raf=requestAnimationFrame(tick); });
})();

// Tech icon tooltips
(function(){
  const techInner = document.querySelector('.tech-inner');
  if(!techInner) return;

  let tooltipEl = null;

  function ensureTooltip(){
    if(tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'tech-tooltip';
    tooltipEl.innerHTML = '<div class="tt-name"></div><p class="tt-desc"></p>';
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  function positionTooltip(target){
    const rect = target.getBoundingClientRect();
    const tt = ensureTooltip();
    const gap = 10;
    let left = rect.left + window.scrollX + rect.width + gap;
    let top = rect.top + window.scrollY - 6;
    const maxLeft = window.scrollX + document.documentElement.clientWidth - (tt.offsetWidth + 12);
    if(left > maxLeft) left = rect.left + window.scrollX - tt.offsetWidth - gap;
    if(left < window.scrollX + 8) left = window.scrollX + 8;
    const maxTop = window.scrollY + document.documentElement.clientHeight - (tt.offsetHeight + 12);
    if(top > maxTop) top = maxTop;
    if(top < window.scrollY + 8) top = window.scrollY + 8;
    tt.style.left = left + 'px';
    tt.style.top = top + 'px';
  }

  function showTooltip(target){
    const tt = ensureTooltip();
    const name = target.getAttribute('data-name') || target.alt || 'Technology';
    const desc = target.getAttribute('data-desc') || '';
    tt.querySelector('.tt-name').textContent = name;
    tt.querySelector('.tt-desc').textContent = desc;
    positionTooltip(target);
    tt.classList.add('visible');
  }

  function hideTooltip(){
    if(tooltipEl){
      tooltipEl.classList.remove('visible');
    }
  }

  function onEnter(e){ showTooltip(e.currentTarget); }
  function onLeave(){ hideTooltip(); }
  function onFocus(e){ showTooltip(e.currentTarget); }
  function onBlur(){ hideTooltip(); }

  techInner.querySelectorAll('.tech-icon').forEach(icon =>{
    icon.addEventListener('mouseenter', onEnter);
    icon.addEventListener('mouseleave', onLeave);
    icon.addEventListener('focus', onFocus);
    icon.addEventListener('blur', onBlur);
  });
})();