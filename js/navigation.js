// Mobile Navigation Menu
document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.querySelector('.burger-menu');
  const navMenu = document.querySelector('#nav-menu');
  const body = document.body;

  if (burgerMenu && navMenu) {
    // Toggle menu when burger button is clicked
    burgerMenu.addEventListener('click', function() {
      const isExpanded = burgerMenu.getAttribute('aria-expanded') === 'true';
      
      // Toggle aria-expanded
      burgerMenu.setAttribute('aria-expanded', !isExpanded);
      
      // Toggle menu visibility
      navMenu.classList.toggle('nav-open');
      burgerMenu.classList.toggle('burger-active');
      body.classList.toggle('nav-open');
    });

    // Close menu when clicking on a navigation link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('nav-open');
        burgerMenu.classList.remove('burger-active');
        burgerMenu.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!burgerMenu.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove('nav-open');
        burgerMenu.classList.remove('burger-active');
        burgerMenu.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        navMenu.classList.remove('nav-open');
        burgerMenu.classList.remove('burger-active');
        burgerMenu.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        navMenu.classList.remove('nav-open');
        burgerMenu.classList.remove('burger-active');
        burgerMenu.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      }
    });
  }
});
