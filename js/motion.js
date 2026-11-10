/*
  Motion mini (~3 KB) solo para botones y transiciones de entrada.
  No anima el frasco: el giro de 360° queda para js-cloudimage-360-view
  cuando existan las fotos. Ver los placeholders en index.html.
*/

var EASE = [0.2, 0.8, 0.2, 1];

function delaySeconds(el) {
  var raw = getComputedStyle(el).getPropertyValue("--d").trim();
  var ms = parseFloat(raw);
  return Number.isFinite(ms) ? ms / 1000 : 0;
}

/* El build mini no entiende atajos como y/scale. Hay que animar transform. */
function shift(lift, scale) {
  var t = "translateY(" + lift + "px)";
  if (scale != null && scale !== 1) t += " scale(" + scale + ")";
  return t;
}

function pressable(animate, el, lift) {
  el.addEventListener("pointerenter", function () {
    animate(el, { transform: shift(lift, 1) }, { duration: 0.35, ease: EASE });
  });
  el.addEventListener("pointerleave", function () {
    animate(el, { transform: shift(0, 1) }, { duration: 0.35, ease: EASE });
  });
  el.addEventListener("pointerdown", function () {
    animate(el, { transform: shift(lift, 0.97) }, { duration: 0.12, ease: EASE });
  });
  el.addEventListener("pointerup", function () {
    animate(el, { transform: shift(lift, 1) }, { duration: 0.2, ease: EASE });
  });
  el.addEventListener("pointercancel", function () {
    animate(el, { transform: shift(0, 1) }, { duration: 0.2, ease: EASE });
  });
}

function cardLift(animate, el) {
  var featured = el.classList.contains("pcard-feat");
  el.addEventListener("pointerenter", function () {
    var wide = window.innerWidth > 1000;
    var next = featured && wide ? shift(-8, 1.03) : shift(-8, 1);
    animate(el, { transform: next }, { duration: 0.45, ease: EASE });
  });
  el.addEventListener("pointerleave", function () {
    animate(el, { transform: shift(0, 1) }, { duration: 0.45, ease: EASE });
  });
}

function playReveals(animate) {
  var nodes = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var seen = new WeakSet();
  var play = function (el) {
    if (seen.has(el)) return;
    seen.add(el);
    animate(
      el,
      { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0px)"] },
      { duration: 0.9, delay: delaySeconds(el), ease: EASE }
    ).finished.then(function () {
      el.classList.add("in");
    }).catch(function () {
      el.classList.add("in");
    });
  };

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        play(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach(function (el) { io.observe(el); });
    var revealInView = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      nodes.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) play(el);
      });
    };
    requestAnimationFrame(revealInView);
  } else {
    nodes.forEach(play);
  }
}

async function start() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var animate;
  try {
    var motion = await import("https://cdn.jsdelivr.net/npm/motion@12.23.24/mini/+esm");
    animate = motion.animate;
  } catch (err) {
    console.warn("Motion no cargó. Las transiciones quedan en CSS.", err);
    document.documentElement.classList.add("motion-fallback");
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
    return;
  }

  document.documentElement.classList.add("motion-ready");

  document.querySelectorAll(".btn, .cm, .nav-toggle, .mm-close").forEach(function (el) {
    pressable(animate, el, -2);
  });
  document.querySelectorAll(".foot-soc a").forEach(function (el) {
    pressable(animate, el, -2);
  });
  document.querySelectorAll(".pcard, .icard").forEach(function (el) {
    cardLift(animate, el);
  });

  if (!document.documentElement.classList.contains("motion-fallback")) {
    playReveals(animate);
  }
}

start();
