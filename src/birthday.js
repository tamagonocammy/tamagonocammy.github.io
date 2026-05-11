(function () {
  const now = new Date();
  if (now.getMonth() !== 4 || now.getDate() !== 5) return; // month is 0-indexed

  const palette = window.CONFIG?.palette;
  const colors = palette
    ? [palette.mauve, palette.pink, palette.peach, palette.yellow, palette.green, palette.teal, palette.sky, palette.sapphire, palette.lavender]
    : ["#cba6f7", "#f38ba8", "#fab387", "#f9e2af", "#a6e3a1", "#94e2d5", "#89dceb", "#89b4fa", "#b4befe"];

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const PARTICLE_COUNT = 160;
  const GRAVITY = 0.25;
  const FADE_START = 4000;
  const FADE_DURATION = 1500;

  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: 6 + Math.random() * 8,
    h: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 2,
    vy: 1 + Math.random() * 3,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.15,
  }));

  const startTime = performance.now();
  let animId;

  function draw(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const elapsed = now - startTime;
    const opacity = elapsed < FADE_START
      ? 1
      : Math.max(0, 1 - (elapsed - FADE_START) / FADE_DURATION);

    if (opacity <= 0) {
      canvas.remove();
      return;
    }

    ctx.globalAlpha = opacity;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += GRAVITY;
      p.angle += p.spin;

      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
        p.vy = 1 + Math.random() * 3;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    animId = requestAnimationFrame(draw);
  }

  animId = requestAnimationFrame(draw);
})();
