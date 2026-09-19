/* ===================================================================
   M/s Suvidha Auto Agency — Shared JavaScript
   - Mobile navigation toggle
   - Scroll reveal animations
   - Animated stat counters
   - Contact form "thank you" message (no backend)
   =================================================================== */

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile menu toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal (with fail-safe so content is never stuck hidden) ---------- */
  var reveals = document.querySelectorAll(".reveal");

  function revealAll() {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
  function revealInView() {
    var h = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < h - 40) el.classList.add("in");
    });
  }

  if (reveals.length) {
    revealInView();

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      window.addEventListener("scroll", revealInView, { passive: true });
    }

    /* Absolute fail-safe: reveal everything shortly after load regardless of observer state. */
    window.addEventListener("load", function () { setTimeout(revealAll, 1500); });
    setTimeout(revealAll, 4000);
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");

  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    var duration = 1400;

    function tick(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function finalValue(el) {
    return (parseInt(el.getAttribute("data-count"), 10) || 0).toLocaleString("en-IN") + (el.getAttribute("data-suffix") || "");
  }

  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.dataset.done = "1";
          runCounter(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
    /* Fail-safe: if the observer never fired, still show the final number. */
    setTimeout(function () {
      counters.forEach(function (el) { if (!el.dataset.done) el.textContent = finalValue(el); });
    }, 4000);
  } else {
    counters.forEach(function (el) { el.textContent = finalValue(el); });
  }

  /* ---------- Contact form: thank-you message, no backend ---------- */
  var form = document.getElementById("contactForm");
  var msg = document.getElementById("formMessage");

  if (form && msg) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameField = document.getElementById("name");
      var name = nameField ? nameField.value.trim() : "";

      msg.textContent = name
        ? "Thank you, " + name + "! Your request has been received. We will contact you shortly."
        : "Thank you! Your request has been received. We will contact you shortly.";

      msg.classList.add("show");
      form.reset();
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
});
