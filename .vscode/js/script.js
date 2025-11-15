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
