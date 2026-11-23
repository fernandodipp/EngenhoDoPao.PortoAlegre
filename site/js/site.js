/* Engenho do Pão: comportamento da página (sem dependências).
   - topo opaco ao rolar, menu do celular, barra fixa de encomenda
   - status "Aberto agora" e dia de hoje nos horários (fuso de Porto Alegre)
   - formulário que monta a mensagem e abre o WhatsApp (sem script, abre com mensagem padrão) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* --- topo e barra do celular --- */
  var topo = $('[data-topo]');
  var barra = $('[data-barra]');
  var heroi = $('.heroi');
  var semBarra = Array.prototype.slice.call(document.querySelectorAll('[data-sem-barra]'));
  function aoRolar() {
    var y = window.scrollY;
    if (topo) topo.classList.toggle('is-solido', y > 40);
    if (barra && heroi) {
      var passouHeroi = y > heroi.offsetHeight * 0.7;
      // esconde a barra quando já há um botão de encomenda na tela (formulário ou chamada do rodapé)
      var cobre = semBarra.some(function (el) { var r = el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; });
      barra.classList.toggle('is-visivel', passouHeroi && !cobre);
    }
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();
  // foco por teclado perto da base da tela: se cair sob a barra fixa, sobe a página o suficiente (WCAG 2.4.11)
  if (barra) {
    document.addEventListener('focusin', function (e) {
      if (!barra.classList.contains('is-visivel') || barra.contains(e.target)) return;
      var topoBarra = barra.getBoundingClientRect().top;
      var fundo = e.target.getBoundingClientRect().bottom;
      if (fundo > topoBarra - 8) window.scrollBy(0, fundo - topoBarra + 16);
    });
  }

  /* --- menu do celular --- */
  var botao = $('[data-menu]');
  if (botao && topo) {
    // com o menu aberto, o resto da página fica inerte: o Tab só percorre o topo e o painel
    var foraDoMenu = Array.prototype.slice.call(document.querySelectorAll('body > :not(header):not(script)'));
    var marcarInerte = function (sim) { foraDoMenu.forEach(function (el) { if (sim) el.setAttribute('inert', ''); else el.removeAttribute('inert'); }); };
    var estaAberto = function () { return topo.classList.contains('is-aberto'); };
    var fechar = function (devolverFoco) {
      if (!estaAberto()) return;
      topo.classList.remove('is-aberto'); document.documentElement.classList.remove('menu-aberto');
      botao.setAttribute('aria-expanded', 'false'); botao.setAttribute('aria-label', 'Abrir menu');
      marcarInerte(false);
      if (devolverFoco) botao.focus();
    };
    botao.addEventListener('click', function () {
      if (estaAberto()) { fechar(true); return; }
      topo.classList.add('is-aberto');
      document.documentElement.classList.add('menu-aberto'); // trava a página por trás
      botao.setAttribute('aria-expanded', 'true'); botao.setAttribute('aria-label', 'Fechar menu');
      marcarInerte(true);
      var primeiro = topo.querySelector('nav a');
      if (primeiro) primeiro.focus();
    });
    topo.querySelectorAll('nav a').forEach(function (a) { a.addEventListener('click', function () { fechar(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && estaAberto()) fechar(true); });
    // ao alargar a janela (ou tirar o zoom), o menu do celular some: fecha e libera a página
    var celular = window.matchMedia('(max-width: 860px)');
    var aoMudarLargura = function () { if (!celular.matches) fechar(false); };
    if (celular.addEventListener) celular.addEventListener('change', aoMudarLargura);
  }

  /* --- pausar a faixa rotativa (WCAG 2.2.2) --- */
  var faixa = $('[data-faixa]');
  var pausa = $('[data-faixa-pausa]');
  if (faixa && pausa) {
    pausa.hidden = false; // sem JS o botão não funcionaria, então só aparece aqui
    pausa.addEventListener('click', function () {
      var pausada = faixa.classList.toggle('is-pausada');
      pausa.setAttribute('aria-pressed', String(pausada));
    });
  }

  /* --- aberto agora / hoje --- */
  try {
    var p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
    var min = Number(p.hour) * 60 + Number(p.minute);
    var abre = 7 * 60, fecha = 19 * 60 + 30;
    var aberto = dia !== 0 && min >= abre && min < fecha;
    var status = $('[data-status]');
    if (status) {
      var texto = aberto ? 'Aberto agora'
        : dia !== 0 && min < abre ? 'Abre hoje às 7h'
        : dia === 6 || dia === 0 ? 'Abre segunda às 7h' : 'Abre amanhã às 7h';
      status.textContent = texto;
      status.classList.toggle('is-fechado', !aberto);
    }
    document.querySelectorAll('[data-horas] dt').forEach(function (dt) {
      if ((dt.dataset.dias || '').split(',').indexOf(String(dia)) > -1) {
        dt.classList.add('hoje'); if (dt.nextElementSibling) dt.nextElementSibling.classList.add('hoje');
        dt.insertAdjacentHTML('beforeend', ' <span class="visualmente-oculto">(hoje)</span>');
      }
    });
  } catch (e) { /* sem status: o horário continua escrito */ }

  /* --- formulário → WhatsApp --- */
  var form = $('form[data-whatsapp]');
  if (form) {
    var campos = Array.prototype.slice.call(form.querySelectorAll('input:not([type=hidden]), select, textarea'));
    var statusForm = $('[data-form-status]', form);
    // calendário: não deixa escolher dia que já passou (data de hoje no fuso de Porto Alegre)
    var campoData = document.getElementById('f-data');
    try {
      campoData.min = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
    } catch (e) {}
    // domingo a padaria fecha: o calendário nativo não desativa dias da semana, então a validação recusa
    var erroData = document.getElementById('f-data-erro');
    var textoErroData = erroData ? erroData.textContent : '';
    var conferirDomingo = function () {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(campoData.value);
      var domingo = m && new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getDay() === 0;
      campoData.setCustomValidity(domingo ? 'domingo' : '');
      if (erroData) erroData.textContent = domingo ? 'Aos domingos a padaria fica fechada. Escolha de segunda a sábado.' : textoErroData;
    };
    campoData.addEventListener('input', conferirDomingo);
    campoData.addEventListener('change', conferirDomingo);
    // "2026-12-13" -> "sábado, 13/12/2026"
    var dataPorExtenso = function (iso) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
      if (!m) return iso;
      var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      var semana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'][d.getDay()];
      return semana + ', ' + m[3] + '/' + m[2] + '/' + m[1];
    };
    var verificar = function (el) {
      var erro = el.getAttribute('aria-describedby') && document.getElementById(el.getAttribute('aria-describedby'));
      var ok = el.checkValidity();
      if (ok) { el.removeAttribute('aria-invalid'); if (erro) erro.hidden = true; }
      else { el.setAttribute('aria-invalid', 'true'); if (erro) erro.hidden = false; }
      return ok;
    };
    campos.forEach(function (el) {
      el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', function () { if (el.getAttribute('aria-invalid')) verificar(el); });
    });
    form.addEventListener('submit', function (e) {
      conferirDomingo();
      var ruins = campos.filter(function (el) { return !verificar(el); });
      if (ruins.length) {
        e.preventDefault();
        if (statusForm) statusForm.textContent = ruins.length === 1 ? '1 campo para corrigir.' : ruins.length + ' campos para corrigir.';
        ruins[0].focus();
        return;
      }
      var v = function (id) { return document.getElementById(id).value.trim(); };
      var linhas = ['Olá! Gostaria de fazer uma encomenda.', 'Pedido: ' + v('f-tipo'), 'Para quando: ' + dataPorExtenso(v('f-data'))];
      if (v('f-pessoas')) linhas.push('Pessoas: ' + v('f-pessoas'));
      linhas.push('Nome: ' + v('f-nome'));
      if (v('f-obs')) linhas.push('Detalhes: ' + v('f-obs'));
      form.elements.text.value = linhas.join('\n');
      if (statusForm) statusForm.textContent = 'Abrindo o WhatsApp.';
    });
    document.querySelectorAll('a[data-tipo]').forEach(function (a) {
      a.addEventListener('click', function () { document.getElementById('f-tipo').value = a.dataset.tipo; });
    });
  }
})();
