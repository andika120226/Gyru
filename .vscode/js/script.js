// Toggel classactive

const navbarNav = document.querySelector(".navbar-nav");
// ketika hamburger menu di klik

document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// klik di luar side bar untuk untuk menghilangkan nav

const hamburger = document.querySelector("#hamburger-menu");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// Tutup navbar ketika salah satu link di dalamnya diklik (berguna di mobile)
const navLinks = document.querySelectorAll(".navbar-nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navbarNav.classList.remove("active");
  });
});

// Interactive menu card effects
const menuCards = document.querySelectorAll(".menu-card, .card");
menuCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.animation = "none";
    setTimeout(() => {
      card.style.animation = "";
    }, 10);
  });

  // Ripple effect on click
  card.addEventListener("click", (e) => {
    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.width = "20px";
    ripple.style.height = "20px";
    ripple.style.backgroundColor = "rgba(255, 215, 0, 0.5)";
    ripple.style.borderRadius = "50%";
    ripple.style.pointerEvents = "none";
    ripple.style.animation = "rippleEffect 0.6s ease-out";

    const rect = card.getBoundingClientRect();
    ripple.style.left = e.clientX - rect.left - 10 + "px";
    ripple.style.top = e.clientY - rect.top - 10 + "px";

    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Scroll animation for elements
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe menu cards dan sections
document.querySelectorAll(".menu-card, .card, .about, .contact").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "all 0.6s ease";
  observer.observe(el);
});

// Button click feedback
const buttons = document.querySelectorAll("button, .cta");
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
      btn.style.transform = "scale(1)";
    }, 100);
  });
});
