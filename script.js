const boot = document.getElementById('boot');
const tiles = document.getElementById('tiles');
const consoleEl = document.querySelector('.console');

// Boot text is empty by default (no 'Ready.' text)

// Horizontal scrolling tiles: use wheel to scroll horizontally (preserve direction)
tiles.addEventListener('wheel', (e) => {
  e.preventDefault();
  const sensitivity = 2.5;
  tiles.scrollBy({left: e.deltaY * sensitivity, behavior: 'smooth'});
}, { passive: false });

// Pointer drag support for horizontal scrolling
let isDown = false, startX, scrollStart;
tiles.addEventListener('pointerdown', (e) => {
  isDown = true;
  tiles.setPointerCapture(e.pointerId);
  startX = e.clientX;
  scrollStart = tiles.scrollLeft;
  tiles.classList.add('dragging');
});
tiles.addEventListener('pointermove', (e) => {
  if (!isDown) return;
  const dx = e.clientX - startX;
  tiles.scrollLeft = scrollStart - dx;
});
tiles.addEventListener('pointerup', (e) => { isDown = false; tiles.classList.remove('dragging'); });
tiles.addEventListener('pointercancel', () => { isDown = false; tiles.classList.remove('dragging'); });
tiles.addEventListener('pointerleave', () => { isDown = false; tiles.classList.remove('dragging'); });

function launchGame(name, btn) {
  // flash console and show launching text
  consoleEl.classList.add('launching');
  const prev = boot.textContent;
  boot.textContent = `Launching ${name}...`;
  btn.classList.add('active');
  setTimeout(() => {
    boot.textContent = `Now running: ${name}`;
    setTimeout(() => {
      consoleEl.classList.remove('launching');
      boot.textContent = prev + '\n';
      btn.classList.remove('active');
    }, 1200);
  }, 1200);
}

tiles.querySelectorAll('.tile').forEach(t => {
  t.addEventListener('click', (ev) => {
    const href = t.dataset.href;
    const name = t.textContent.trim();
    if (href) {
      // navigate to page
      window.location.href = href;
      return;
    }
    launchGame(name, t);
  });
  t.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); t.click(); }
  });
});

