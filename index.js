// Detect if the browser is mobile Safari
function isSafariMobile() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isSafari = /safari/.test(userAgent);
  const isChrome = /chrome/.test(userAgent);
  const isMobile = /iphone|ipod|ipad/.test(userAgent);
  return isSafari && !isChrome && isMobile;
}

// Get the safe area if supported
function getSafeArea() {
  let safeArea = "0px";
  const isEnvSupported =
    window.CSS &&
    window.CSS.supports &&
    window.CSS.supports("top: env(safe-area-inset-top)");

  if (isEnvSupported) {
    safeArea = getComputedStyle(document.documentElement).getPropertyValue(
      "--safe-area-inset-bottom"
    );
  }
  return safeArea;
}

// Capture and set the actual viewport height
function setViewportHeight() {
  let viewportHeight = window.innerHeight;
  document.documentElement.style.setProperty(
    "--viewport-height",
    `${viewportHeight}px`
  );

  if (isSafariMobile()) {
    const safeAreaValue = getSafeArea();
    // Optionally set some CSS property using the safeAreaValue
    document.documentElement.style.setProperty("--safe-area", safeAreaValue);
  }
}

// Call the function initially
setViewportHeight();

// Update the height when the window is resized
window.addEventListener("resize", setViewportHeight);

function nearingBottom() {
  return (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
  );
}

// Call the function initially
setViewportHeight();

// Update the height when the window is resized
window.addEventListener("resize", setViewportHeight);

// Scroll prevention logic
let lastScrollTop = 0;

window.addEventListener(
  "scroll",
  function () {
    if (nearingBottom()) {
      if (window.scrollY > lastScrollTop) {
        // Scrolling down, so prevent it
        window.scrollTo(0, lastScrollTop);
      }
    }
    lastScrollTop = window.scrollY;
  },
  false
);

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll("nav li a");
  const titleLink = document.querySelector('a[href="#home"] .title');
  const sections = document.querySelectorAll(".page");

  function updateActiveLink() {
    const hash = window.location.hash;
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === hash) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Logic for DarkViolet.ai link
    if (hash === "#home") {
      titleLink.classList.add("active");
    } else {
      titleLink.classList.remove("active");
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          window.history.pushState(null, null, `#${id}`);
          updateActiveLink();
        }
      });
    },
    {
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  updateActiveLink();
  window.addEventListener("hashchange", updateActiveLink);
});
