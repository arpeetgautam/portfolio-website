// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Reveal cards only when motion is enabled and the observer is supported.
const cards = document.querySelectorAll(".card");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  cards.forEach((card) => {
    card.classList.add("reveal-card");
    observer.observe(card);
  });
}

console.log("Portfolio Website Loaded - Enhanced with smooth interactions");

// Lightbox gallery
(() => {
  const triggers = Array.from(document.querySelectorAll(".lightbox-trigger"));
  if (!triggers.length) return;

  const lb = document.getElementById("lightbox");
  if (!lb) return;

  const lbImg = lb.querySelector(".lightbox__img");
  const lbCaption = lb.querySelector(".lightbox__caption");
  const btnClose = lb.querySelector(".lightbox__close");
  const btnNext = lb.querySelector(".lightbox__next");
  const btnPrev = lb.querySelector(".lightbox__prev");
  if (!lbImg || !lbCaption || !btnClose || !btnNext || !btnPrev) return;

  const items = triggers.map((t) => ({
    src: t.getAttribute("href"),
    caption: t.dataset.caption || t.querySelector("img")?.alt || "",
    webp:
      (t.querySelector("source") &&
        t.querySelector("source").getAttribute("srcset")) ||
      null,
  }));

  let index = 0;
  let isAnimating = false;

  function open(i, direction = "none") {
    if (isAnimating) return;
    
    // Initial open
    if (lb.getAttribute("aria-hidden") === "true") {
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      btnClose.focus();
    } else {
      isAnimating = true;
      // Animate out current image
      lbImg.style.opacity = '0';
      lbImg.style.transform = direction === 'next' ? 'scale(0.95) translateX(-60px)' : 'scale(0.95) translateX(60px)';
      lbCaption.style.opacity = '0';
      lbCaption.style.transform = 'translateY(15px)';
    }

    setTimeout(() => {
      index = i;
      const it = items[index];
      
      // Set starting position for new image
      lbImg.style.transition = 'none';
      if (direction === 'next') lbImg.style.transform = 'scale(1.05) translateX(60px)';
      else if (direction === 'prev') lbImg.style.transform = 'scale(1.05) translateX(-60px)';
      else lbImg.style.transform = 'scale(0.9) translateY(20px)';
      
      lbImg.src = it.webp || it.src;
      lbImg.alt = it.caption;
      lbCaption.textContent = it.caption;

      const finishAnimation = () => {
        // Trigger reflow
        void lbImg.offsetWidth;
        
        lbImg.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        lbCaption.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1) 0.1s';
        
        lbImg.style.opacity = '1';
        lbImg.style.transform = 'scale(1) translateX(0) translateY(0)';
        
        lbCaption.style.opacity = '1';
        lbCaption.style.transform = 'translateY(0)';
        
        isAnimating = false;
      };

      if (lbImg.complete) {
        finishAnimation();
      } else {
        lbImg.onload = finishAnimation;
      }

      // Preload next image
      const nextItem = items[(index + 1) % items.length];
      if (nextItem) new Image().src = nextItem.webp || nextItem.src;
    }, direction === "none" ? 50 : 350); // wait for fade out if swiping
  }

  function close() {
    lbImg.style.opacity = '0';
    lbImg.style.transform = 'scale(0.95) translateY(20px)';
    lbCaption.style.opacity = '0';
    setTimeout(() => {
      lb.setAttribute("aria-hidden", "true");
      lbImg.src = "";
      document.body.style.overflow = "";
    }, 400); 
  }

  function next() {
    open((index + 1) % items.length, 'next');
  }
  function prev() {
    open((index - 1 + items.length) % items.length, 'prev');
  }

  triggers.forEach((t, i) => {
    t.addEventListener("click", (e) => {
      e.preventDefault();
      open(i);
    });
  });

  btnClose.addEventListener("click", close);
  btnNext.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });
  btnPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  });

  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.classList.contains("lightbox__stage")) close();
  });

  window.addEventListener("keydown", (e) => {
    if (lb.getAttribute("aria-hidden") === "true") return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
})();

// Carousel slider
(function () {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel__track");
  const slides = Array.from(track.querySelectorAll(".carousel__slide"));
  const prevBtn = carousel.querySelector(".carousel__prev");
  const nextBtn = carousel.querySelector(".carousel__next");
  const indicators = carousel.querySelector(".carousel__indicators");

  let index = 0;
  let autoplayId = null;
  const autoplayDelay = 4000;

  // build indicators
  slides.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
    btn.addEventListener("click", () => goTo(i));
    indicators.appendChild(btn);
  });

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    Array.from(indicators.children).forEach((b, i) =>
      b.setAttribute("aria-selected", i === index),
    );
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  // autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(next, autoplayDelay);
  }
  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
    autoplayId = null;
  }

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  // keyboard
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // touch support
  let startX = 0;
  let deltaX = 0;
  carousel.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      stopAutoplay();
    },
    { passive: true },
  );
  carousel.addEventListener(
    "touchmove",
    (e) => {
      deltaX = e.touches[0].clientX - startX;
    },
    { passive: true },
  );
  carousel.addEventListener("touchend", () => {
    if (Math.abs(deltaX) > 40) {
      deltaX < 0 ? next() : prev();
    }
    deltaX = 0;
    startAutoplay();
  });

  // init
  update();
  startAutoplay();
})();
