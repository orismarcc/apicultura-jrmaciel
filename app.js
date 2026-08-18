/* ===== JR Maciel Apicultura — interações ===== */
/* ALTERE AQUI: número de WhatsApp no formato internacional, só dígitos (55 + DDD + número) */
var WHATSAPP = "5500000000000";

(function () {
  "use strict";

  /* ano no rodapé */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* menu mobile */
  var burger = document.getElementById("burger");
  var links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var aberto = links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(aberto));
      burger.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* sombra do header ao rolar */
  var nav = document.getElementById("nav");
  if (nav) {
    var marcaScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    marcaScroll();
    window.addEventListener("scroll", marcaScroll, { passive: true });
  }

  /* animação de entrada */
  var alvos = document.querySelectorAll(".reveal");
  if (alvos.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    Array.prototype.forEach.call(alvos, function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + "ms";
      io.observe(el);
    });
  } else {
    Array.prototype.forEach.call(alvos, function (el) { el.classList.add("is-in"); });
  }
  /* rede de segurança: nada fica invisível se o observer não disparar */
  setTimeout(function () {
    Array.prototype.forEach.call(alvos, function (el) { el.classList.add("is-in"); });
  }, 2500);

  /* botões de produto pré-selecionam a opção no formulário */
  var select = document.getElementById("produto");
  document.querySelectorAll("[data-produto]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!select) return;
      var alvo = btn.getAttribute("data-produto");
      Array.prototype.forEach.call(select.options, function (op) {
        if (op.text.trim() === alvo) select.value = op.value || op.text;
      });
    });
  });

  /* formulário -> WhatsApp */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim();
      var tel = form.whats.value.trim();
      var prod = form.produto.value;
      var obs = form.obs.value.trim();
      var erro = false;

      [["nome", nome.length >= 2], ["whats", tel.replace(/\D/g, "").length >= 10]].forEach(function (par) {
        var campo = form[par[0]];
        campo.setAttribute("aria-invalid", String(!par[1]));
        if (!par[1] && !erro) { campo.focus(); erro = true; }
      });
      if (erro) return;

      var texto =
        "Olá, JR Maciel! Meu nome é " + nome + "." +
        "\nTenho interesse em: " + prod +
        "\nMeu WhatsApp: " + tel +
        (obs ? "\nObservações: " + obs : "") +
        "\n(enviado pelo site)";
      var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);

      var ok = document.getElementById("formOk");
      if (ok) {
        document.getElementById("okName").textContent = nome.split(" ")[0];
        document.getElementById("okLink").href = url;
        ok.hidden = false;
      }
      window.open(url, "_blank", "noopener");
    });
  }

  /* botões diretos de WhatsApp (float / nav) sem formulário na página */
  document.querySelectorAll("[data-wpp]").forEach(function (a) {
    a.href = "https://wa.me/" + WHATSAPP + "?text=" +
      encodeURIComponent("Olá, JR Maciel! Vim pelo site e quero saber mais sobre o mel.");
  });

  /* players do YouTube sob demanda (carrega só ao clicar = página mais leve) */
  document.querySelectorAll(".video[data-yt]").forEach(function (box) {
    box.addEventListener("click", function () {
      var id = box.getAttribute("data-yt");
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = box.getAttribute("data-titulo") || "Vídeo";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      f.loading = "lazy";
      box.innerHTML = "";
      box.classList.add("is-playing");
      box.appendChild(f);
    });
    box.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); box.click(); }
    });
  });
})();
