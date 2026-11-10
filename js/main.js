/* Menú, giro de dos frames, y respaldo si Motion no carga. */

(function () {
  var EASE = [0.2, 0.8, 0.2, 1];
  var nav = document.getElementById("nav");
  var menu = document.getElementById("mobileMenu");
  var giro = document.getElementById("giro");
  var viewport = document.getElementById("giroViewport");
  var track = document.getElementById("giroTrack");
  var frames = Array.prototype.slice.call(track.querySelectorAll(".giro-frame"));
  var controls = document.getElementById("giroControls");
  var index = 0;

  var onScroll = function () {
    nav.classList.toggle("scrolled", window.scrollY > 40);
    placeControls();
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  document.getElementById("navToggle").addEventListener("click", function () {
    menu.classList.add("open");
    placeControls();
  });
  document.getElementById("mmClose").addEventListener("click", function () {
    menu.classList.remove("open");
    placeControls();
  });
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
    });
  });

  function reduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function placeControls() {
    if (!giro || !controls) return;
    var rect = giro.getBoundingClientRect();
    var menuOpen = menu.classList.contains("open");
    var show = !menuOpen && rect.bottom > 160 && rect.top < window.innerHeight - 48;
    controls.classList.toggle("is-on", show);
  }

  function paint(i, animate) {
    index = i;
    var target = i === 0 ? "translateX(0%)" : "translateX(-50%)";
    var height = Math.max(frames[i].offsetHeight, window.innerHeight) + "px";
    frames.forEach(function (frame, n) {
      var on = n === i;
      frame.inert = !on;
      frame.setAttribute("aria-hidden", on ? "false" : "true");
    });
    controls.querySelectorAll("[data-giro-to]").forEach(function (btn) {
      var on = Number(btn.getAttribute("data-giro-to")) === i;
      if (btn.classList.contains("giro-dot")) btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.classList.toggle("is-current", on);
    });
    var motion = window.BolcanarMotion;
    if (animate && motion && motion.animate && !reduced()) {
      motion.animate(track, { transform: target }, { duration: 0.7, ease: EASE });
      motion.animate(viewport, { height: height }, { duration: 0.7, ease: EASE });
    } else {
      track.style.transform = target;
      viewport.style.height = height;
    }
  }

  function go(i, animate, scroll) {
    var next = i <= 0 ? 0 : 1;
    paint(next, animate);
    if (history.replaceState) {
      history.replaceState(null, "", next === 0 ? "#hero" : "#productos");
    }
    if (scroll) {
      var top = giro.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top, behavior: reduced() ? "auto" : "smooth" });
    }
    placeControls();
  }

  window.BolcanarGiro = {
    go: go,
    resize: function () { paint(index, false); }
  };

  controls.querySelectorAll("[data-giro-to]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      go(Number(btn.getAttribute("data-giro-to")), true, true);
    });
  });

  document.querySelectorAll('a[href="#productos"], a[href="#hero"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var to = link.getAttribute("href") === "#productos" ? 1 : 0;
      go(to, true, true);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.target && e.target.closest && e.target.closest("input, textarea, select")) return;
    var rect = giro.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    e.preventDefault();
    go(e.key === "ArrowRight" ? Math.min(1, index + 1) : Math.max(0, index - 1), true, false);
  });

  var swipeX = null;
  viewport.addEventListener("pointerdown", function (e) {
    if (e.target.closest("a, button, input, textarea")) return;
    swipeX = e.clientX;
  });
  viewport.addEventListener("pointerup", function (e) {
    if (swipeX == null) return;
    var dx = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) < 48) return;
    go(dx < 0 ? 1 : 0, true, false);
  });
  viewport.addEventListener("pointercancel", function () { swipeX = null; });

  var start = location.hash === "#productos" ? 1 : 0;
  paint(start, false);
  placeControls();
  window.addEventListener("resize", function () { paint(index, false); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { paint(index, false); });
  }

  window.setTimeout(function () {
    if (document.documentElement.classList.contains("motion-ready")) return;
    if (document.documentElement.classList.contains("motion-fallback")) return;
    document.documentElement.classList.add("motion-fallback");
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
  }, 1600);
})();
