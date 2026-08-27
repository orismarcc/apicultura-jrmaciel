/* ===== Apicultura JR Maciel — interações ===== */
/* Número de WhatsApp no formato internacional, só dígitos (55 + DDD + número) */
var WHATSAPP = "5566984391028";

(function () {
  "use strict";

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- ano no rodapé ---------- */
  var ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- barra de progresso de leitura ---------- */
  var barra = document.createElement("div");
  barra.className = "progresso";
  barra.innerHTML = '<span></span>';
  document.body.appendChild(barra);
  var preencher = barra.firstChild;

  /* ---------- menu mobile ---------- */
  var burger = $("#burger");
  var links = $("#navLinks");
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

  /* ---------- header + progresso + botão topo ---------- */
  var nav = $("#nav");
  var topo = document.createElement("button");
  topo.className = "aotopo";
  topo.type = "button";
  topo.setAttribute("aria-label", "Voltar ao topo");
  topo.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 4 4.5 11.5 6 13l5-5v12h2V8l5 5 1.5-1.5Z"/></svg>';
  topo.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: semAnimacao ? "auto" : "smooth" });
  });
  document.body.appendChild(topo);

  var aoRolar = function () {
    var y = window.scrollY;
    if (nav) nav.classList.toggle("is-stuck", y > 8);
    topo.classList.toggle("is-on", y > 700);
    var alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    preencher.style.width = (alturaTotal > 0 ? (y / alturaTotal) * 100 : 0) + "%";
  };
  aoRolar();
  window.addEventListener("scroll", aoRolar, { passive: true });

  /* ---------- link ativo conforme a seção visível ---------- */
  var secoes = $$("main section[id]");
  var mapaLinks = {};
  $$(".nav__links a[href*='#']").forEach(function (a) {
    var id = a.getAttribute("href").split("#")[1];
    if (id) mapaLinks[id] = a;
  });
  if (secoes.length && "IntersectionObserver" in window) {
    var ioSec = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        var a = mapaLinks[en.target.id];
        if (a) a.classList.toggle("is-ativo", en.isIntersecting);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secoes.forEach(function (s) { ioSec.observe(s); });
  }

  /* ---------- animação de entrada ---------- */
  var alvos = $$(".reveal");
  if (alvos.length && "IntersectionObserver" in window && !semAnimacao) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    alvos.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + "ms";
      io.observe(el);
    });
  } else {
    alvos.forEach(function (el) { el.classList.add("is-in"); });
  }
  setTimeout(function () { alvos.forEach(function (el) { el.classList.add("is-in"); }); }, 2500);

  /* ---------- contadores animados ---------- */
  var contadores = $$("[data-contar]");
  if (contadores.length && "IntersectionObserver" in window) {
    var ioNum = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        ioNum.unobserve(en.target);
        var el = en.target;
        var fim = parseFloat(el.getAttribute("data-contar"));
        var sufixo = el.getAttribute("data-sufixo") || "";
        var prefixo = el.getAttribute("data-prefixo") || "";
        var ano = el.getAttribute("data-formato") === "ano";
        var fmt = function (n) { return ano ? String(n) : n.toLocaleString("pt-BR"); };
        if (semAnimacao) { el.textContent = prefixo + fmt(fim) + sufixo; return; }
        var inicio = performance.now(), dur = 1400;
        var passo = function (t) {
          var p = Math.min((t - inicio) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = prefixo + fmt(Math.round(fim * e)) + sufixo;
          if (p < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      });
    }, { threshold: 0.5 });
    contadores.forEach(function (el) { ioNum.observe(el); });
  }

  /* ---------- inclinação do card do hero conforme o mouse ---------- */
  var heroFoto = $(".foto--hero");
  if (heroFoto && !semAnimacao && window.matchMedia("(pointer:fine)").matches) {
    var palco = heroFoto.parentElement;
    palco.addEventListener("mousemove", function (e) {
      var r = palco.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      heroFoto.style.transform = "perspective(900px) rotateY(" + (x * 12).toFixed(2) + "deg) rotateX(" + (-y * 12).toFixed(2) + "deg)";
    });
    palco.addEventListener("mouseleave", function () { heroFoto.style.transform = ""; });
  }

  /* ---------- galeria com lightbox ---------- */
  var galeria = $$("[data-galeria] img");
  if (galeria.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Visualizador de fotos");
    lb.hidden = true;
    lb.innerHTML =
      '<button class="lightbox__x" type="button" aria-label="Fechar">&times;</button>' +
      '<button class="lightbox__nav lightbox__nav--ant" type="button" aria-label="Foto anterior">&#8249;</button>' +
      '<figure class="lightbox__fig"><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lightbox__nav lightbox__nav--prox" type="button" aria-label="Próxima foto">&#8250;</button>' +
      '<span class="lightbox__contador"></span>';
    document.body.appendChild(lb);

    var lbImg = $("img", lb), lbCap = $("figcaption", lb), lbNum = $(".lightbox__contador", lb);
    var atual = 0, ultimoFoco = null;

    var mostrar = function (i) {
      atual = (i + galeria.length) % galeria.length;
      var alvo = galeria[atual];
      lbImg.src = alvo.currentSrc || alvo.src;
      lbImg.alt = alvo.alt || "";
      var fig = alvo.closest("figure");
      var legenda = fig && fig.querySelector("figcaption:not(.selo)");
      lbCap.textContent = legenda ? legenda.textContent.trim() : (alvo.alt || "");
      lbNum.textContent = (atual + 1) + " / " + galeria.length;
    };
    var abrir = function (i) {
      ultimoFoco = document.activeElement;
      mostrar(i);
      lb.hidden = false;
      document.body.classList.add("trava");
      $(".lightbox__x", lb).focus();
    };
    var fechar = function () {
      lb.hidden = true;
      document.body.classList.remove("trava");
      if (ultimoFoco) ultimoFoco.focus();
    };

    galeria.forEach(function (img, i) {
      var botao = img.closest("figure") || img;
      botao.classList.add("ampliavel");
      botao.setAttribute("role", "button");
      botao.setAttribute("tabindex", "0");
      botao.setAttribute("aria-label", "Ampliar foto: " + (img.alt || "foto do apiário"));
      botao.addEventListener("click", function () { abrir(i); });
      botao.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(i); }
      });
    });

    $(".lightbox__x", lb).addEventListener("click", fechar);
    $(".lightbox__nav--ant", lb).addEventListener("click", function () { mostrar(atual - 1); });
    $(".lightbox__nav--prox", lb).addEventListener("click", function () { mostrar(atual + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) fechar(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowLeft") mostrar(atual - 1);
      if (e.key === "ArrowRight") mostrar(atual + 1);
    });
  }

  /* ---------- botões de produto pré-selecionam a opção e rolam até o form ---------- */
  var select = $("#produto");
  $$("[data-produto]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!select) return;
      var alvo = btn.getAttribute("data-produto");
      Array.prototype.forEach.call(select.options, function (op) {
        if (op.text.trim() === alvo) select.value = op.value || op.text;
      });
      select.classList.add("pisca");
      setTimeout(function () { select.classList.remove("pisca"); }, 1200);
    });
  });

  /* ---------- máscara de telefone ---------- */
  var campoTel = $("#whats");
  if (campoTel) {
    campoTel.addEventListener("input", function () {
      var d = campoTel.value.replace(/\D/g, "").slice(0, 11);
      var v = d;
      if (d.length > 2) v = "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length > 7) v = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length > 10 ? 7 : 6) + "-" + d.slice(d.length > 10 ? 7 : 6);
      campoTel.value = v;
      campoTel.removeAttribute("aria-invalid");
    });
  }
  var campoNome = $("#nome");
  if (campoNome) campoNome.addEventListener("input", function () { campoNome.removeAttribute("aria-invalid"); });

  /* ---------- formulário -> WhatsApp ---------- */
  var form = $("#leadForm");
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
      if (erro) { form.classList.add("treme"); setTimeout(function () { form.classList.remove("treme"); }, 500); return; }

      var texto =
        "Olá, JR Maciel! Meu nome é " + nome + "." +
        "\nTenho interesse em: " + prod +
        "\nMeu WhatsApp: " + tel +
        (obs ? "\nObservações: " + obs : "") +
        "\n(enviado pelo site)";
      var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);

      var ok = $("#formOk");
      if (ok) {
        $("#okName").textContent = nome.split(" ")[0];
        $("#okLink").href = url;
        ok.hidden = false;
      }
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- links diretos de WhatsApp ---------- */
  $$("[data-wpp]").forEach(function (a) {
    var msg = a.getAttribute("data-wpp") || "Olá, JR Maciel! Vim pelo site e quero saber mais sobre o mel.";
    a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
  });

  /* ---------- players do YouTube sob demanda ---------- */
  $$(".video[data-yt]").forEach(function (box) {
    var tocar = function () {
      if (box.classList.contains("is-playing")) return;
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + box.getAttribute("data-yt") + "?autoplay=1&rel=0";
      f.title = box.getAttribute("data-titulo") || "Vídeo";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      box.innerHTML = "";
      box.classList.add("is-playing");
      box.appendChild(f);
    };
    box.addEventListener("click", tocar);
    box.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tocar(); }
    });
  });
})();
