const nextPages = {
  "/": "about.html",
  "/index.html": "about.html",
  "/about.html": "work.html",
  "/work.html": "philosophy.html",
  "/philosophy.html": "note.html",
  "/note.html": "contact.html",
  "/en/": "about.html",
  "/en/index.html": "about.html",
  "/en/about.html": "work.html",
  "/en/work.html": "philosophy.html",
  "/en/philosophy.html": "note.html",
  "/en/note.html": "contact.html"
};

let navigating = false;
let lastScrollY = window.scrollY;

const normalizedPath = () => {
  const path = window.location.pathname;
  return path.replace("/hiro-sasaki", "") || "/";
};

const goNext = () => {
  if (navigating) return;
  const next = nextPages[normalizedPath()];
  if (!next) return;

  navigating = true;
  window.location.href = next;
};

const nearBottom = () => (
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24
);

window.addEventListener(
  "wheel",
  (event) => {
    if (event.deltaY > 0 && nearBottom()) {
      goNext();
    }
  },
  { passive: true }
);

window.addEventListener(
  "scroll",
  () => {
    const scrollingDown = window.scrollY > lastScrollY;
    lastScrollY = window.scrollY;

    if (scrollingDown && nearBottom()) {
      window.setTimeout(goNext, 140);
    }
  },
  { passive: true }
);

let touchStartY = 0;

window.addEventListener(
  "touchstart",
  (event) => {
    touchStartY = event.touches[0]?.clientY ?? 0;
  },
  { passive: true }
);

window.addEventListener(
  "touchend",
  (event) => {
    const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY;
    const swipedUp = touchStartY - touchEndY > 32;
    if (swipedUp && nearBottom()) {
      goNext();
    }
  },
  { passive: true }
);
