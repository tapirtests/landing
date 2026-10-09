/* ВАЖНО: впиши реальные адреса. Пока стоит "#", кнопки никуда не ведут. */
var LINKS = {
  app: "#",    // адрес веб-приложения Tapir (куда ведут «Войти» и «Начать сейчас»)
  github: "https://github.com/tapirtests/landing"  // адрес репозитория на GitHub
};

(function () {
  "use strict";

  // Подставляем ссылки из LINKS
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var url = LINKS[el.getAttribute("data-link")];
    if (url && url !== "#") {
      el.setAttribute("href", url);
    } else if (el.getAttribute("target") === "_blank") {
      el.removeAttribute("target"); // пока ссылки нет, не открываем пустую вкладку
    }
  });

  // Мобильное меню
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  }
  burger.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });

  // Шапка получает фон после прокрутки
  var header = document.querySelector(".header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Плавное появление блоков
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }
})();
