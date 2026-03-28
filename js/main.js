// ===== MOBILE NAV =====
document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  var navOverlay = document.getElementById('navOverlay');

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navOverlay.classList.toggle('show');
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navOverlay.classList.remove('show');
    });
  }

  // ===== IMAGE SLIDER (Home page) =====
  var slider = document.getElementById('slider');
  var dotsContainer = document.getElementById('sliderDots');

  if (slider && dotsContainer) {
    var totalSlides = slider.children.length;
    var currentSlide = 0;
    var autoSlideInterval;
    var isTransitioning = false;

    // Clone first slide and append to end for seamless loop
    var firstClone = slider.children[0].cloneNode(true);
    firstClone.classList.add('slide-clone');
    slider.appendChild(firstClone);

    // Clone last slide and prepend for seamless backward loop
    var lastClone = slider.children[totalSlides - 1].cloneNode(true);
    lastClone.classList.add('slide-clone');
    slider.insertBefore(lastClone, slider.children[0]);

    // Start at slide 1 (offset by 1 because of prepended clone)
    slider.style.transform = 'translateX(-100%)';

    // Create dots
    for (var i = 0; i < totalSlides; i++) {
      var dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.dataset.index = i;
      dot.addEventListener('click', function () {
        if (!isTransitioning) {
          goToSlide(parseInt(this.dataset.index));
          resetAutoSlide();
        }
      });
      dotsContainer.appendChild(dot);
    }

    function updateDots() {
      var dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach(function (d, idx) {
        d.classList.toggle('active', idx === currentSlide);
      });
    }

    function goToSlide(index) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentSlide = index;
      // Offset by 1 for the prepended clone
      slider.style.transition = 'transform 0.6s ease';
      slider.style.transform = 'translateX(-' + ((currentSlide + 1) * 100) + '%)';
      updateDots();
    }

    // Listen for transition end to handle seamless jump
    slider.addEventListener('transitionend', function () {
      isTransitioning = false;
      // If we moved past the last real slide (to the appended clone)
      if (currentSlide >= totalSlides) {
        currentSlide = 0;
        slider.style.transition = 'none';
        slider.style.transform = 'translateX(-100%)';
        updateDots();
      }
      // If we moved before the first real slide (to the prepended clone)
      if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
        slider.style.transition = 'none';
        slider.style.transform = 'translateX(-' + ((currentSlide + 1) * 100) + '%)';
        updateDots();
      }
    });

    window.moveSlide = function (direction) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentSlide += direction;
      slider.style.transition = 'transform 0.6s ease';
      slider.style.transform = 'translateX(-' + ((currentSlide + 1) * 100) + '%)';
      updateDots();
      resetAutoSlide();
    };

    function autoSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentSlide++;
      slider.style.transition = 'transform 0.6s ease';
      slider.style.transform = 'translateX(-' + ((currentSlide + 1) * 100) + '%)';
      updateDots();
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(autoSlide, 3000);
    }

    autoSlideInterval = setInterval(autoSlide, 3000);
  }

  // ===== PRODUCTS CAROUSEL (Home page) — infinite loop =====
  var carouselTrack = document.getElementById('carouselTrack');

  if (carouselTrack) {
    var cards = Array.from(carouselTrack.children);
    var cardCount = cards.length;
    var gap = 25;
    var carouselTransitioning = false;
    var carouselAutoInterval;

    // Measure a single card width + gap
    function getCardStep() {
      var card = carouselTrack.querySelector('.product-card');
      return card ? card.offsetWidth + gap : 305;
    }

    // Clone all cards and append + prepend for seamless loop
    cards.forEach(function (card) {
      carouselTrack.appendChild(card.cloneNode(true));
    });
    cards.forEach(function (card) {
      carouselTrack.insertBefore(card.cloneNode(true), carouselTrack.firstChild);
    });

    // Start offset: skip the prepended clones
    var carouselIndex = cardCount;
    function setCarouselPos(animate) {
      var step = getCardStep();
      if (animate) {
        carouselTrack.style.transition = 'transform 0.5s ease';
      } else {
        carouselTrack.style.transition = 'none';
      }
      carouselTrack.style.transform = 'translateX(-' + (carouselIndex * step) + 'px)';
    }

    // Initial position (no anim)
    setCarouselPos(false);

    // After transition ends, snap if needed
    carouselTrack.addEventListener('transitionend', function () {
      carouselTransitioning = false;
      // Snap back if past real cards
      if (carouselIndex >= cardCount * 2) {
        carouselIndex = cardCount;
        setCarouselPos(false);
      }
      if (carouselIndex < cardCount) {
        carouselIndex = cardCount * 2 - (cardCount - carouselIndex);
        // Recalc: we want to land at the mirror position
        carouselIndex = carouselIndex; // already correct
        setCarouselPos(false);
      }
    });

    function moveCarouselBy(dir) {
      if (carouselTransitioning) return;
      carouselTransitioning = true;
      carouselIndex += dir;
      setCarouselPos(true);
    }

    window.moveCarousel = function (direction) {
      moveCarouselBy(direction);
      resetCarouselAuto();
    };

    function carouselAutoAdvance() {
      moveCarouselBy(1);
    }

    function resetCarouselAuto() {
      clearInterval(carouselAutoInterval);
      carouselAutoInterval = setInterval(carouselAutoAdvance, 4000);
    }

    carouselAutoInterval = setInterval(carouselAutoAdvance, 4000);

    // Recalculate on resize
    window.addEventListener('resize', function () {
      setCarouselPos(false);
    });
  }

  // ===== FAQ ACCORDION =====
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', function () {
        var isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(function (fi) {
          fi.classList.remove('active');
        });

        // Open clicked if it wasn't active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ===== PRODUCT TOGGLE (Products page) =====
  window.toggleProduct = function (card) {
    card.classList.toggle('expanded');
    var toggle = card.querySelector('.product-toggle');
    if (toggle) {
      toggle.innerHTML = card.classList.contains('expanded') ? 'Hide Details &#9652;' : 'View Details &#9662;';
    }
  };

  // ===== SCROLL ANIMATIONS (Intersection Observer) =====
  var animElements = document.querySelectorAll('[data-animate]');
  if (animElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    animElements.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  // ===== CONTACT FORM =====
  window.handleContactForm = function (e) {
    e.preventDefault();
    var form = e.target;
    var name = form.querySelector('#name').value.trim();
    if (name) {
      alert('Thank you, ' + name + '! Your message has been sent. We will get back to you soon.');
      form.reset();
    }
  };
});
