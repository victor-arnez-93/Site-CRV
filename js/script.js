/* =========================================================
   CRV Soluções em TI — /bio
   Fundo animado (rede de partículas) + GSAP + ScrollMagic
   ========================================================= */
(function () {
  "use strict";

  var reduzirMovimento = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var temGSAP = typeof window.gsap !== "undefined";
  var temSM = typeof window.ScrollMagic !== "undefined";

  /* ---------- Ano automático no rodapé ---------- */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Failsafe: nunca deixar conteúdo invisível ---------- */
  function revelarTudo() {
    window.__crvRevelou = true;
    document.querySelectorAll(".reveal, .reveal-scale").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }
  // Se as bibliotecas não carregarem, ou por segurança, revela após 2.6s.
  var timerFailsafe = setTimeout(revelarTudo, 2600);

  /* =========================================================
     1) Fundo animado — rede de partículas (canvas)
     ========================================================= */
  (function fundoAnimado() {
    var canvas = document.getElementById("bg-canvas");
    if (!canvas || reduzirMovimento) return;

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, pontos = [], raf = null;
    var mouse = { x: -9999, y: -9999 };

    function dimensionar() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var alvo = Math.min(72, Math.floor((w * h) / 16000));
      pontos = [];
      for (var i = 0; i < alvo; i++) {
        pontos.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }

    function desenhar() {
      ctx.clearRect(0, 0, w, h);
      var maxDist = 130;

      for (var i = 0; i < pontos.length; i++) {
        var p = pontos[i];
        p.x += p.vx;
        p.y += p.vy;

        // leve atração ao cursor
        var dxm = mouse.x - p.x, dym = mouse.y - p.y;
        var dm2 = dxm * dxm + dym * dym;
        if (dm2 < 14000) {
          p.x += dxm * 0.0008;
          p.y += dym * 0.0008;
        }

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 212, 255, 0.7)";
        ctx.fill();

        for (var j = i + 1; j < pontos.length; j++) {
          var q = pontos[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(14, 165, 233," + (0.16 * (1 - dist / maxDist)) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(desenhar);
    }

    function iniciar() { if (!raf) desenhar(); }
    function parar() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    window.addEventListener("resize", dimensionar, { passive: true });
    window.addEventListener("mousemove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener("mouseout", function () { mouse.x = -9999; mouse.y = -9999; });
    document.addEventListener("visibilitychange", function () {
      document.hidden ? parar() : iniciar();
    });

    dimensionar();
    iniciar();

    // parallax suave dos orbes (independe das libs)
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      var o1 = document.querySelector(".orb-1");
      var o2 = document.querySelector(".orb-2");
      if (o1) o1.style.transform = "translateY(" + (y * 0.15) + "px)";
      if (o2) o2.style.transform = "translateY(" + (-y * 0.12) + "px)";
    }, { passive: true });
  })();

  /* =========================================================
     2) Animações de entrada
     ========================================================= */
  if (reduzirMovimento || (!temGSAP)) {
    // Sem GSAP ou com movimento reduzido: mostra tudo imediatamente.
    clearTimeout(timerFailsafe);
    revelarTudo();
    return;
  }

  window.addEventListener("load", iniciarAnimacoes);
  // Caso o 'load' demore (imagens), dispara logo se o DOM já estiver pronto.
  if (document.readyState === "complete") iniciarAnimacoes();

  var jaIniciou = false;
  function iniciarAnimacoes() {
    if (jaIniciou) return;
    jaIniciou = true;
    window.__crvRevelou = true;
    clearTimeout(timerFailsafe);

    /* ----- 2a) Timeline de entrada do topo (herói) ----- */
    var heroi = [];
    var halo = document.querySelector(".perfil .reveal-scale");
    if (halo) heroi.push(halo);
    document.querySelectorAll(".perfil .reveal").forEach(function (el) { heroi.push(el); });
    var cta = document.querySelector(".cta-principal");

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (halo) {
      tl.to(halo, { opacity: 1, scale: 1, duration: 0.7 });
    }
    tl.to(".perfil .reveal", { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, "-=0.35");
    if (cta) {
      tl.to(cta, { opacity: 1, y: 0, duration: 0.55 }, "-=0.2");
    }

    /* ----- 2b) Revelação no scroll (ScrollMagic + GSAP) ----- */
    var alvos = [];
    document.querySelectorAll(".links .card, #projetos, .portfolio .proj, .ver-todos, .sociais")
      .forEach(function (el) { alvos.push(el); });

    if (temSM) {
      var controller = new ScrollMagic.Controller();
      alvos.forEach(function (el, i) {
        new ScrollMagic.Scene({
          triggerElement: el,
          triggerHook: 0.94,
          reset: false
        })
        .on("enter", function () {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            delay: (i % 4) * 0.05
          });
        })
        .addTo(controller);
      });

      // Garante que itens já visíveis no carregamento apareçam.
      setTimeout(function () {
        alvos.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.95) {
            gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" });
          }
        });
      }, 120);
    } else {
      // Sem ScrollMagic: usa IntersectionObserver como alternativa.
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              gsap.to(e.target, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" });
              io.unobserve(e.target);
            }
          });
        }, { threshold: 0.15 });
        alvos.forEach(function (el) { io.observe(el); });
      } else {
        alvos.forEach(function (el) { gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.6 }); });
      }
    }
  }
})();
