// Animações de rolagem (skill scroll-suave-revelacao): scroll suave (Lenis + ScrollTrigger)
// e revelação ao rolar. Regra de ouro: nada fica escondido por CSS. Só o GSAP esconde,
// e só depois de carregar. Se algo falhar (CDN fora do ar), o conteúdo continua visível.
// Convenção: o título e o texto de abertura de cada seção recebem data-revelar; nada mais
// (cards, fotos, listas e botões nunca).
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

  // 1) Scroll suave: o Lenis controla a rolagem e avisa o ScrollTrigger a cada quadro.
  function iniciarScrollSuave() {
    // Telas de toque usam a rolagem nativa (já tem inércia). O Lenis ali brigava com o pinça-zoom.
    if (window.matchMedia('(pointer: coarse)').matches) return;
    var lenis = new window.Lenis({ lerp: 0.1 });
    // Zoom do navegador (Ctrl +/-) muda o tamanho da página: o Lenis seguia animando até o destino
    // antigo e a tela "rolava sozinha". Ao redimensionar, recalcula e fixa a posição atual.
    var aoRedimensionar = function () {
      lenis.resize();
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    };
    window.addEventListener('resize', aoRedimensionar);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', aoRedimensionar);
    var quadro = function (tempo) { lenis.raf(tempo * 1000); };
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(quadro);
    gsap.ticker.lagSmoothing(0);
    // Âncoras: cancela o salto nativo e deixa o Lenis rolar (desconta o scroll-padding-top).
    document.addEventListener('click', function (evento) {
      var link = evento.target.closest('a[href^="#"]');
      var id = link && link.hash.slice(1);
      var destino = id ? document.getElementById(decodeURIComponent(id)) : null;
      if (!link || !destino) return;
      evento.preventDefault();
      lenis.scrollTo(destino);
      history.pushState(null, '', link.hash);
      if (!destino.hasAttribute('tabindex')) destino.setAttribute('tabindex', '-1');
      destino.focus({ preventScroll: true });
    });
  }

  // 2) Revelação: fade + subida, com stagger entre os itens que entram juntos.
  function iniciarRevelacoes() {
    var alvos = gsap.utils.toArray('[data-revelar]').filter(function (el) {
      return el.getBoundingClientRect().top > window.innerHeight; // o que já está na tela não pisca
    });
    if (!alvos.length) return;
    // só opacidade (não autoAlpha/visibility): o texto continua na árvore de acessibilidade (A-12)
    gsap.set(alvos, { opacity: 0, y: 32 });
    ScrollTrigger.batch(alvos, {
      start: 'top 88%',
      once: true,
      onEnter: function (lote) {
        gsap.to(lote, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity' });
      }
    });
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
    // a barra de endereço do celular aparecendo/sumindo não deve recalcular os gatilhos
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (window.Lenis) iniciarScrollSuave();
    iniciarRevelacoes();
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  } catch (erro) {
    gsap.set('[data-revelar]', { clearProps: 'all' });
    console.warn('Animações desativadas:', erro);
  }
})();
