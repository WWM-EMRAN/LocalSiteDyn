(function() {
  "use strict";

  /**
   * 1. Preloader Fade-out
   */
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(() => {
        preloader.style.transition = "opacity 0.6s ease";
        preloader.style.opacity = "0";
        setTimeout(() => { preloader.style.display = "none"; }, 600);
      }, 1000);
    }
  });

  /**
   * 2. Mobile Navigation Toggle Logic
   */
  const headerToggleBtn = document.querySelector('.header-toggle');
  const header = document.querySelector('#header');

  function toggleMobileMenu() {
    if (header && headerToggleBtn) {
      header.classList.toggle('header-show');
      headerToggleBtn.classList.toggle('bi-list');
      headerToggleBtn.classList.toggle('bi-x');
    }
  }

  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', toggleMobileMenu);
  }

  /**
   * 3. Scroll to Top Button Logic
   */
  const scrollTop = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * 4. Dropdown Toggle Logic
   * 4. Dropdown Toggle Logic (Wrapped for Re-initialization)
   */

  function initDropdowns() {
    document.querySelectorAll('.navmenu .dropdown > a').forEach(dropdownLink => {
      // Remove existing listener to prevent double-firing
      dropdownLink.removeEventListener('click', dropdownToggleHandler);
      dropdownLink.addEventListener('click', dropdownToggleHandler);
    });
  }

  function dropdownToggleHandler(e) {
    const header = document.querySelector('#header');
    if (header.classList.contains('header-show') || window.innerWidth > 1199) {
      if (this.nextElementSibling) {
        e.preventDefault();
        this.parentNode.classList.toggle('dropdown-active');
      }
    }
  }
  // 3. Initial call for static HTML (if any)
  // window.initDropdowns = initDropdowns;
  document.addEventListener('DOMContentLoaded', initDropdowns);

  /**
   * 5. Navmenu Scroll Spy
   * 5. Navmenu Scroll Spy & Active Link Logic
   */
  function initNavScrollSpy() {
    const navmenulinks = document.querySelectorAll('#navmenu a');

    function navmenuScrollspy() {
      navmenulinks.forEach(navmenulink => {
        if (!navmenulink.hash) return;
        let section = document.querySelector(navmenulink.hash);
        if (!section) return;

        let position = window.scrollY + 200;
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          document.querySelectorAll('#navmenu a.active').forEach(link => link.classList.remove('active'));
          navmenulink.classList.add('active');
        }
      });
    }

    // Bind to scroll and load
    window.initNavScrollSpy = initNavScrollSpy;
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);

    // Also run once immediately to highlight the current section
    navmenuScrollspy();
  };


  // In scripts.js
  window.initSkillBars = function() {
      const progressBars = document.querySelectorAll('.progress-bar');
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const value = entry.target.getAttribute('aria-valuenow');
                  entry.target.style.width = value + '%';
                  entry.target.classList.add('animated');
              }
          });
      }, { threshold: 0.5 });

      progressBars.forEach(bar => observer.observe(bar));
  };


  /**
   * 6. Initialize AOS and Typed.js
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true
    });
  }
  window.addEventListener('load', aosInit);

  // /**
  //  * 7. Typed.js Animation Initialization
  //  */
  // const selectTyped = document.querySelector('.typed');
  // if (selectTyped) {
  //   let typed_strings = selectTyped.getAttribute('data-typed-items').split(',');
  //   new Typed('.typed', {
  //     strings: typed_strings,
  //     loop: true,
  //     typeSpeed: 100,
  //     backSpeed: 50,
  //     backDelay: 2000
  //   });
  // }

  /**
   * 7. Typed.js Animation Initialization (Improved)
   */
  function initTypedAnimation() {
    const selectTyped = document.querySelector('.typed');
    if (selectTyped) {
      // Get the items from the data attribute set by site-loader.js
      let typed_strings = selectTyped.getAttribute('data-typed-items').split(',');

      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 60,      // Slower typing (Default was 100, lower is faster)
        backSpeed: 30,      // Slower erasing
        backDelay: 2500,    // Pause longer at the end of a sentence
        startDelay: 500,    // Slight delay before starting
        contentType: 'html' // CRITICAL: Interprets <i> tags as HTML, not text
      });
    }
  }

  /**
   * 8. Init GLightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * 9. Animation on scroll (AOS) - Double check it's active
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * 10. PureCounter Initialization for Key Information
   */
  new PureCounter();


  /**
   * 11. Smooth Transitions for Details/Education
   * Prevents layout shifts and ensures AOS recalculates positions
   */
  document.querySelectorAll('details').forEach((el) => {
    el.addEventListener('toggle', () => {
      // Refresh AOS to prevent animations from triggering at wrong scroll positions
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    });
  });


  /**
   * 12. Smooth Animation for Skills progress bars
   * Prevents layout shifts and ensures AOS recalculates positions
   */
  document.addEventListener('DOMContentLoaded', function() {
    const progressBars = document.querySelectorAll('.progress-bar');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Get the percentage from the aria-valuenow attribute
          const value = entry.target.getAttribute('aria-valuenow');
          // Apply the width and a class to signify it's done
          entry.target.style.width = value + '%';
          entry.target.classList.add('animated');
        }
      });
    }, { threshold: 0.5 }); // Trigger when 50% of the bar is visible

    progressBars.forEach(bar => observer.observe(bar));
  });


  /**
   * 13. Courses and Certificates Isotope Filtering
   */
  window.addEventListener('load', () => {
    let portfolioContainer = document.querySelector('.isotope-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.isotope-item',
        layoutMode: 'masonry',
        filter: '*' // Initial filter (show all)
      });

      let portfolioFilters = document.querySelectorAll('.portfolio-filters li');

      portfolioFilters.forEach(el => {
        el.addEventListener('click', function(e) {
          e.preventDefault();

          // Remove active class from other buttons
          portfolioFilters.forEach(filterEl => {
            filterEl.classList.remove('filter-active');
          });

          // Add active class to clicked button
          this.classList.add('filter-active');

          // Trigger Isotope filtering
          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });

          // Re-trigger AOS animations if used
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        }, false);
      });
    }
  });

  /**
   * 14. Publications Management
   * Dynamically calculates counts and handles citation copying
   */
  document.addEventListener('DOMContentLoaded', function() {
    // Calculate counts for each publication category
    document.querySelectorAll('.resume-category-group').forEach(group => {
      const countSpan = group.querySelector('.category-count');
      if (countSpan) {
        const items = group.querySelectorAll('.resume-item');
        countSpan.textContent = items.length;
      }
    });

    // Handle "Copy Citation" button clicks
    document.querySelectorAll('.citation-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const text = this.getAttribute('data-citation');
        navigator.clipboard.writeText(text).then(() => {
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="bi bi-check2 me-1"></i> Copied!';
          this.classList.replace('badge-dates', 'badge-important');
          setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.replace('badge-important', 'badge-dates');
          }, 2000);
        });
      });
    });
  });




  /**
   * 15. RE-INITIALIZE the menu is injected
   * Initialize Navigation menu/submenu behaviour
   */
  function initNavigationBehavior() {
    console.log("Initializing Navigation menu/submenu behavior...");
      // Call the function from scripts.js to bind clicks to the new elements
      if (typeof initDropdowns === "function") {
          console.log("Initializing dropdown behavior...");
          initDropdowns();
      }
      else {
          console.warn("Dropdown behavior initialization failed. Dropdowns will not work.");
      }

      if (typeof initNavScrollSpy === "function") {
          console.log("Initializing scrollspy behavior...");
          initNavScrollSpy();
      }
      else {
          console.warn("Scrollspy behavior initialization failed. Scrollspy will not work.");
      }
      console.log("Navigation menu/submenu behavior initialized successfully.");
  }
  window.initNavigationBehavior = initNavigationBehavior;




  /**
   * 16. CV Mode Switching
   * Dynamically changes the CV layout based on the URL parameter
   */
  // CV mode change action
  // 1. Get elements
  const selector = document.getElementById('cvModeSelector');
  const standard = document.getElementById('standard-page-section');
  const onePage = document.getElementById('one-page-section');

  // Helper function to wait for SITE_DATA to be ready
  const waitForData = () => {
      return new Promise((resolve) => {
          if (typeof SITE_DATA !== 'undefined' && SITE_DATA.site) {
              resolve();
          } else {
              const interval = setInterval(() => {
                  if (typeof SITE_DATA !== 'undefined' && SITE_DATA.site) {
                      clearInterval(interval);
                      resolve();
                  }
              }, 50); // Check every 50ms
          }
      });
  };

  // 2. The Toggle Engine
  async function changeCVMode(mode) {
      if (!standard || !onePage) return;

      console.log("Switching CV to:", mode);

      if (mode === 'one-page') {
          standard.style.display = 'none';
          onePage.style.display = 'block';
          document.body.classList.add('mode-one-page');
          document.body.classList.remove('mode-standard');
      }
      else if (mode === 'standard') {
        standard.style.display = 'block';
        onePage.style.display = 'none';
        document.body.classList.add('mode-standard');
        document.body.classList.remove('mode-one-page');
      }
      else {
          standard.style.display = 'block';
          onePage.style.display = 'none';
          document.body.classList.add('mode-standard');
          document.body.classList.remove('mode-one-page');
      }

      // Keep URL in sync (without reloading)
      const url = new URL(window.location);
      url.searchParams.set('mode', mode);
      window.history.pushState({}, '', url);

      // 3. WAIT for data before calling site-loader functions
      await waitForData();

      // Call functions from site-loader.js directly
      // Ensure these functions exist in site-loader.js
      if (typeof renderNavigation === "function") {
        console.log("Calling renderNavigation from site-loader.js...");
        const menuToRender = (typeof getMenuToRender === "function") ? getMenuToRender(MAIN_MENU_PAGES) : null;
        renderNavigation({ main_menu: menuToRender });
      }
      else {
        console.warn("renderNavigation function not found in site-loader.js. CV Mode switching may not work as expected.");
      }

      // Initialize Navigation menu/submenu behaviour
      initNavigationBehavior()
  }

  // 3. Attach Listener to Dropdown
  if (selector) {
      selector.addEventListener('change', function(e) {
          changeCVMode(e.target.value);

      });
  }




  // 4. Initial Load Logic
  const params = new URLSearchParams(window.location.search);
  const initialMode = params.get('mode') || 'standard';

  if (selector) selector.value = initialMode;
  changeCVMode(initialMode);
  // Use a small timeout to ensure site-loader.js has finished rendering before toggling
  // setTimeout(() => changeCVMode(initialMode), 100);


})();