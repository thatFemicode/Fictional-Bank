'use strict';

// Getting Ui Variables that are important first
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn-close-modal');
const btnOpenModal = document.querySelectorAll('.btn-show-modal');
const btnScrollTo = document.querySelector('.btn-scroll-to');
const section1 = document.querySelector('#section1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations-tab');
const tabsContainer = document.querySelector('.operations-tab-container');
const tabsContent = document.querySelectorAll('.operations-content');
const navLink = document.querySelector('.nav-links');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const allsections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

// Fixing the modal window

function openMdal(e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}
function closeModal(e) {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}

btnOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openMdal);
});
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button srolling
btnScrollTo.addEventListener('click', function (e) {
  const s1cord = section1.getBoundingClientRect();
  //   console.log(s1cord);
  //   console.log(e.target.getBoundingClientRect());
  //   console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  section1.scrollIntoView({ behavior: 'smooth' });
});
navLink.addEventListener('click', scrollInto);

function scrollInto(e) {
  e.preventDefault();

  // Using the matching startegy
  if (e.target.classList.contains('nav-link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
}
// navLink.addEventListener('click', scrollInto);

// Tabbed component

// tabsContainer.addEventListener('click', tabbed);

function tabbed(e) {
  const clicked = e.target.closest('.operations-tab');
  // console.log(clicked);

  //   Picked up somsthing called guard clause
  if (!clicked) return;

  tabs.forEach((t) => t.classList.remove('operations-tab-active'));
  tabsContent.forEach((c) => c.classList.remove('operations-content-active'));

  clicked.classList.add('operations-tab-active');

  // console.log(clicked.dataset.tab);
  // Activate content area
  document
    .querySelector(`.operations-content-${clicked.dataset.tab}`)
    .classList.add('operations-content-active');
}
tabsContainer.addEventListener('click', tabbed);

// Adding the menu fade for our Navbar
function handleHover(e) {
  if (e.target.classList.contains('nav-link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav-link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach((a) => {
      if (a !== link) {
        a.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// sticky section and intersection obsever Api

const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

// How the Intersection obsderver Api is used, we use it by putting it in
// A constant and then writing the new intersectionobserver

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`,
});

headerObserver.observe(header);

// Revealing sections
// revealing all sections like an animation type of revealing

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // Using the guard clasue
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section-hidden');
  observer.unobserve(entry.target);
};

const section0bserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allsections.forEach(function (section) {
  section0bserver.observe(section);
  section.classList.add('section-hidden');
});

// Lazy image loading effect
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replacing src with dat-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

// Creating the slider functionality
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider-btn-left');
  const btnRight = document.querySelector('.slider-btn-right');
  const dots = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Creating functions
  // Dots function
  const createDots = function () {
    slides.forEach(function (_, i) {
      dots.insertAdjacentHTML(
        'beforeend',
        `<button class="dots-dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document.querySelectorAll('.dots-dot').forEach(function (dot) {
      dot.classList.remove('dots-active');
    });
    document
      .querySelector(`.dots-dot[data-slide="${slide}"]`)
      .classList.add('dots-active');
  };

  // Go to slide functionality
  const gotSlide = function (slide) {
    slides.forEach(function (s, i) {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // Go to next slide functionality
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    gotSlide(curSlide);
    activateDot(curSlide);
  };

  // Go to previous slide functionality
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    gotSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    gotSlide(0);
    createDots();
    activateDot(0);
  };
  init();
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });
  dots.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots-dot')) {
      const { slide } = e.target.dataset;
      gotSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
