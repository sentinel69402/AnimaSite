(function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const blobs = [
    { x: 0.3, y: 0.2, tx: 0.5, ty: 0.4, r: 0.45, color: [100, 30, 160] },
    { x: 0.7, y: 0.6, tx: 0.4, ty: 0.3, r: 0.38, color: [140, 60, 200] },
    { x: 0.5, y: 0.8, tx: 0.6, ty: 0.5, r: 0.35, color: [60, 10, 100] },
  ];

  function pickTarget(blob) {
    blob.tx = 0.1 + Math.random() * 0.8;
    blob.ty = 0.1 + Math.random() * 0.8;
  }

  function draw() {
    ctx.fillStyle = '#050208';
    ctx.fillRect(0, 0, w, h);

    for (const b of blobs) {
      const speed = 0.003;
      b.x += (b.tx - b.x) * speed;
      b.y += (b.ty - b.y) * speed;

      const dx = b.tx - b.x;
      const dy = b.ty - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < 0.01) {
        pickTarget(b);
      }

      const cx = b.x * w;
      const cy = b.y * h;
      const radius = b.r * Math.max(w, h);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      const [r, g, bl] = b.color;
      grad.addColorStop(0,   `rgba(${r}, ${g}, ${bl}, 0.18)`);
      grad.addColorStop(0.4, `rgba(${r}, ${g}, ${bl}, 0.08)`);
      grad.addColorStop(1,   `rgba(${r}, ${g}, ${bl}, 0)`);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.site-nav');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

(function highlightActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (href === 'index.html' && page === '')) {
      link.classList.add('active');
    }
  });
})();

const reveals = document.querySelectorAll('.reveal');

if (reveals.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

const header = document.querySelector('.site-header');

if (header) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)';
        } else {
          header.style.boxShadow = 'none';
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}
