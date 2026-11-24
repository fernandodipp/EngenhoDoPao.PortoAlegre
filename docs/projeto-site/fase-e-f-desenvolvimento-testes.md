# Fases E e F — Desenvolvimento e testes | Engenho do Pão

## Entrega (estado atual, revisado em 23/11/2026)
- `site/index.html`: página única (protótipo).
- `site/privacidade.html`: política de privacidade curta (LGPD).
- `site/css/estilo.css` e `site/css/fontes.css`: estilo e fontes.
- `site/js/site.js`: topo, menu do celular, barra fixa de encomenda, linha "Aberto agora", botão de pausar a faixa e formulário → WhatsApp (os cartões "Encomendar…" já escolhem o tipo).
- `site/js/animacoes.js`: scroll suave (Lenis) e revelação dos títulos ao rolar (GSAP + ScrollTrigger).
- `site/js/vendor/`: GSAP 3.12.5, ScrollTrigger 3.12.5 e Lenis 1.3.27, hospedados no próprio site com as licenças (até 23/11/2026 vinham das CDNs cdnjs e jsDelivr).
- `site/assets/img/`: 20 WebP (2,2 MB) a partir de fotos da própria padaria.
- `site/assets/fonts/`: Playfair Display 400 e Lato 400/700, hospedadas no próprio site.
- HTML, CSS e JS sem framework e sem build.

Para ver: `cd site && python3 -m http.server 8000` e abrir http://localhost:8000. Os scripts são comuns (não são módulos).

## Fotos (todas da Engenho do Pão)
| Arquivo | Origem | Observação |
|---|---|---|
| balcao-vitrine, vitrine-doces, doguinhos, tortas, bandejas-salgados, adega | Google Maps, postadas pela conta da padaria | Até 2000px |
| salgados, sonho-cafe, tortinhas, donuts, doguinhos-minis, natal-mesa, panetones | Instagram @padariaengenhodopao | **Só 512–640px.** Trocar pelos originais |
| logo | Avatar do Instagram | **Só 96px no site.** Pedir o logo em vetor |

Não foram usadas fotos de clientes do Google, nem a foto com a pessoa (provavelmente a dona), nem peças com texto por cima.

## O que não foi testado (atualizado em 23/11/2026)
Desde a auditoria de 23/11/2026, Chromium e Firefox, o modo sem JavaScript, o movimento reduzido, as CDNs fora do ar, o teclado e o axe foram testados. Continuam sem teste:
- Safari e um celular de verdade (só emulação; o WebKit do Playwright não abriu no Windows).
- Leitor de tela real (NVDA ou VoiceOver).
- Core Web Vitals em campo (só medição de laboratório).
- O envio real pelo WhatsApp. O link `wa.me/5551982091084?text=...` é montado, mas nenhuma mensagem foi enviada.

## Histórico: 1ª versão (substituída em 20/11/2026)
A 1ª versão partia de um kit de layout com sorteio de componentes. Ela foi refeita do zero na versão 2 (seção abaixo) e nada do kit ficou no site. O registro fica só como histórico: menu com painel de fotos, foto que "revela como papel fotográfico", verificador automático do kit com 4 falhas e 18 avisos. Nenhum desses itens existe na versão atual.

## Pendências para colocar no ar (Fase G)
1. Aprovação da dona. Ela ainda não sabe do projeto.
2. Fotos originais em alta resolução e logo em vetor.
3. Prazos, preços, entrega, formas de pagamento e encomenda mínima, para o texto das encomendas e um bloco de perguntas frequentes.
4. Razão social e CNPJ no rodapé e na política de privacidade (marcados como `<!-- PENDENTE -->`).
5. ~~Link da loja no iFood~~ Feito em 24/11/2026: link no cardápio (doguinho), na pílula "Delivery pelo iFood" da visita e no rodapé.
6. Acesso ao domínio `engenhodopao.com.br` (registro.br) e decisão de hospedagem. A ficha do Google e o link da bio já apontam para esse domínio, então colocar o site nele corrige o link quebrado.
7. Depoimentos autorizados, se ela quiser prova social.
8. Ativar a `canonical` e conferir o `og:image` (`share.jpg`) com o domínio final.
9. O fechamento usa fotos sazonais de Natal (panetones e biscoitos). Trocar depois de dezembro.

---

## Revisão visual (20/11/2026): versão 2

O usuário achou a primeira versão "muito ruim". A página foi refeita **sem o kit de layout da 1ª versão**, que impunha fundo liso, nada de camadas e quase nenhum movimento em sites de comércio local. A nova versão segue o prompt mestre (Etapa 6: profundidade, camadas, luz, texturas e física), com as skills `fisica-visual-materialidade`, `sites-cinematograficos` (só a parte de interface sobre a cena, sem sequência de frames), `scroll-suave-revelacao`, `tipografia-e-cor` e `creditos-desenvolvedor`.

**Estrutura nova:** herói em tela cheia com a foto do balcão e cartão de vidro com "Aberto agora" → faixa dourada com os produtos rodando → Balcão (cardápio + mosaico de 6 fotos com etiquetas e elevação) → Encomendas (seção escura, 3 cartões em relevo, 3 passos, formulário em "papel" sobre a mesa) → Visita (endereço grande, cartão de informações, fotos em camadas sobre um bloco dourado) → rodapé escuro com o nome grande em marca d'água.

**Arquivos:** `site/index.html`, `site/css/estilo.css`, `site/css/fontes.css`, `site/js/site.js` (topo, menu, barra do celular, aberto agora, formulário → WhatsApp), `site/js/animacoes.js` (Lenis + revelação só nos títulos). Em `site/assets/` ficam só `img/` e `fonts/`.

**Física visual:** luz única no canto superior esquerdo, com tokens `--elev-1/2/3`. A elevação no hover anima só a opacidade de um pseudo-elemento (box-shadow nunca é animado). Botões com contato e compressão. Vidro com base opaca de reserva e `-webkit-`. Textura fosca de farinha no fundo. Parallax do herói via `animation-timeline: view()` dentro de `@supports`.

**Movimento:** a entrada do herói acontece uma vez. A faixa roda, mas para ao passar o mouse e desliga com movimento reduzido. A revelação ao rolar vale só para títulos e textos de abertura (`data-revelar`). Com `prefers-reduced-motion`, tudo fica parado, inclusive o Lenis. Se a CDN falhar, o conteúdo continua visível.

**Dependências externas:** GSAP 3.12.5 e Lenis 1.3.27, com versão exata. Desde 23/11/2026 ficam em `site/js/vendor/` (antes vinham de cdnjs e jsDelivr).

**Testes (Playwright/Chromium, 1440×900 e 390×844):** 0 erros no console, sem rolagem lateral, Lenis ativo, revelações completas ao rolar. Corrigido depois da primeira captura: contraste do botão do rodapé, telefone quebrando no passo 2, cartão de horário encostado na borda do celular, barra fixa cobrindo o botão do rodapé e foto pequena da visita colada na borda.
**Não testado na época:** Safari, Firefox, celular real, Core Web Vitals e os modos sem JS e com movimento reduzido no navegador. Ver a seção "O que não foi testado", atualizada.

---

## Aprovação social (20/11/2026)

Seção `#clientes`, entre Balcão e Encomendas. Usa **só comentários reais e públicos**:
- **Instagram** (lidos nos posts, inclusive com a conta logada): reels CwhvqDBLf2D, DfrxAmMjLVp, DfHyA6pD-B2, Ddge7H1jJ9v e DdTso_bAJpv. Foram 60 posts verificados.
- **Google Maps:** uma avaliação 5★ e um destaque do resumo de avaliações. Sem login, o Google mostra poucas avaliações. Com o login no navegador de automação incompleto (parou na senha), não deu para ordenar por nota.
- Ajustes mínimos de grafia ("env comenda" → "encomenda"). Trechos positivos de avaliações de 2★ e 3★ não foram usados, porque seria enganoso.
- **Sem nome nem @ dos autores** (LGPD). Cada citação aponta a fonte com link.
- **Pendência:** autorização da dona (e, se ela quiser nomes, dos clientes). Com acesso ao Google Business dela, dá para escolher mais avaliações 5★.

**SEO:** H2 com "padaria", texto real e rastreável (`figure > blockquote[cite] + figcaption > cite`) e links para as fontes. **Sem marcação `Review`/`AggregateRating`, de propósito:** avaliações da própria empresa no próprio site são "self-serving reviews". O Google não mostra estrelas para elas e pode tratar a marcação como manipulação. A nota 4,1 também não é exibida (fica abaixo dos concorrentes).

**Divergência encontrada:** o perfil do Instagram mostra CEP **90830-470**, e o Google mostra **91330-380** (este é o usado no site). A dona precisa confirmar.

## Publicação (prévia)

- Repositório: https://github.com/fernandodipp/EngenhoDoPao.PortoAlegre (público). Publicação no GitHub Pages via Actions (`.github/workflows/pages.yml`, pasta `site/`).
- Endereço da prévia: https://fernandodipp.github.io/EngenhoDoPao.PortoAlegre/
- **Fora dos buscadores** até a aprovação da dona: `<meta name="robots" content="noindex, nofollow">` nas duas páginas e `robots.txt` com `Disallow: /`. Na versão final: remover os dois, adicionar `sitemap.xml`, ativar a `canonical` com o domínio `engenhodopao.com.br` e configurar o domínio no Pages.
- `referencias/` (fotos brutas baixadas) e artefatos de teste ficam fora do git.
