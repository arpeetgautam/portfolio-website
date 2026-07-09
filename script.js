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

// Add animation on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 },
);

// Observe all cards
document.querySelectorAll(".card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});

console.log("Portfolio Website Loaded - Enhanced with smooth interactions");

// Lightbox gallery
(() => {
  const triggers = Array.from(document.querySelectorAll(".lightbox-trigger"));
  if (!triggers.length) return;

  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector(".lightbox__img");
  const lbCaption = lb.querySelector(".lightbox__caption");
  const btnClose = lb.querySelector(".lightbox__close");
  const btnNext = lb.querySelector(".lightbox__next");
  const btnPrev = lb.querySelector(".lightbox__prev");

  const items = triggers.map((t) => ({
    src: t.getAttribute("href"),
    caption: t.dataset.caption || t.querySelector("img")?.alt || "",
    webp:
      (t.querySelector("source") &&
        t.querySelector("source").getAttribute("srcset")) ||
      null,
  }));

  let index = 0;

  function open(i) {
    index = i;
    const it = items[index];
    lbImg.src = it.webp || it.src;
    lbImg.alt = it.caption;
    lbCaption.textContent = it.caption;
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // preload next
    const next = items[(index + 1) % items.length];
    if (next) new Image().src = next.webp || next.src;
  }

  function close() {
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  function next() {
    open((index + 1) % items.length);
  }
  function prev() {
    open((index - 1 + items.length) % items.length);
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
    if (e.target === lb) close();
  });

  window.addEventListener("keydown", (e) => {
    if (lb.getAttribute("aria-hidden") === "true") return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
})();
