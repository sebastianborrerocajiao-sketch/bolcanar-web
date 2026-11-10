/* Menú, barra al hacer scroll, y respaldo si Motion no carga. */

(function () {
  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var menu = document.getElementById("mobileMenu");
  document.getElementById("navToggle").addEventListener("click", function () {
    menu.classList.add("open");
  });
  document.getElementById("mmClose").addEventListener("click", function () {
    menu.classList.remove("open");
  });
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
    });
  });

  /* Si el módulo de Motion no marca la página, las entradas usan solo CSS. */
  window.setTimeout(function () {
    if (document.documentElement.classList.contains("motion-ready")) return;
    if (document.documentElement.classList.contains("motion-fallback")) return;
    document.documentElement.classList.add("motion-fallback");
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
  }, 1600);
})();
