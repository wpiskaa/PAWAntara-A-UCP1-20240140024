document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Menu Toggle
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (navToggleBtn && mobileMenu) {
    navToggleBtn.addEventListener('click', () => {
      const isExpanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
      navToggleBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });
  }
});
