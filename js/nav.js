// nav.js
function initNav() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 4px 30px rgba(0,0,0,0.6)'
        : 'none';
    }
  });
}
