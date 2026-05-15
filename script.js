const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const nextPath = document.body.dataset.next;
let navigating = false;
let lastScrollY = window.scrollY;
let touchStartY = 0;

document.body.classList.add("is-loaded");

const isFormActive = () => {
  const active = document.activeElement;
  return active && active.matches("input, textarea, select, button, label");
};

const nearBottom = () => (
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 44
);

const navigateTo = (href) => {
  if (!href || navigating) return;
  navigating = true;

  if (prefersReducedMotion) {
    window.location.href = href;
    return;
  }

  document.body.classList.add("is-leaving");
  window.setTimeout(() => {
    window.location.href = href;
  }, 220);
};

const goNext = () => {
  if (!nextPath || isFormActive()) return;
  navigateTo(nextPath);
};

document.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const url = new URL(link.href);
    const sameWindow = !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && link.target !== "_blank";
    if (sameWindow && url.origin === window.location.origin) {
      event.preventDefault();
      navigateTo(link.getAttribute("href"));
    }
  });
});

window.addEventListener(
  "scroll",
  () => {
    const scrollingDown = window.scrollY > lastScrollY;
    lastScrollY = window.scrollY;
    if (scrollingDown && nearBottom()) {
      window.setTimeout(goNext, 120);
    }
  },
  { passive: true }
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
    if (touchStartY - touchEndY > 38 && nearBottom()) {
      goNext();
    }
  },
  { passive: true }
);

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const isContactForm = form.id === "contact-form";
    let status = form.querySelector(".form-status");

    if (!status) {
      status = document.createElement("p");
      status.className = "form-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      form.append(status);
    }

    status.textContent = document.documentElement.lang === "en"
      ? (isContactForm ? "Thank you. Your message is ready to be sent once the mail backend is connected." : "Subscribed. The email field is working.")
      : (isContactForm ? "ありがとうございます。入力内容を受け付けました。メール送信機能を接続すればこのまま運用できます。" : "登録ありがとうございます。メール入力は動作しています。");
    form.classList.add("is-submitted");
  });
});
