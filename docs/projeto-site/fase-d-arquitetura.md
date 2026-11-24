# Fase D — Arquitetura e UX/UI | Engenho do Pão

## Sitemap
- `/` página única, com seções âncora.
- `/privacidade.html` política de privacidade curta (LGPD). O site não coleta dados: o formulário só abre o WhatsApp.

## Estrutura (uma seção por tela, 1440x900)
| # | Seção | Telas | Conteúdo | Foto(s) |
|---|---|---|---|---|
| 1 | Topo `#top` | 1 | H1, linha com horário, botão "Fazer encomenda" | balcão e vitrine (Google, 2000px) |
| 2 | Visita `#visita` | 1 | "Onde estamos" + endereço grande; painel com endereço, telefone, WhatsApp, horários com o dia de hoje marcado e acessibilidade | vitrine de doces, 4:3 |
| 3 | Balcão `#balcao` | 2 | Tela 1: dois grupos (Salgados / Doces e café) + foto que "revela". Tela 2: parede com oito detalhes | doguinhos + 8 detalhes |
| 4 | Encomendas `#encomendas` | 2 | Tela 1: três cartões (tortas, salgados/coffee break, cestas). Tela 2: foto + formulário para o WhatsApp | tortas, bandejas, mesa de Natal, doguinhos |
| 5 | Fechamento + rodapé `#contato` | 1 | "Faça sua encomenda pelo WhatsApp", botão, foto; colunas de links; créditos | panetones |

Celular: barra fixa no rodapé com "Fazer encomenda", que só aparece depois que o botão do topo sai da tela.

## Wireframe (desktop)
```
┌ nav: [logo] Engenho do Pão     Visita  Balcão  Encomendas      [Fazer encomenda] ┐
├───────────────────────────── foto do balcão (sangrada) ──────────────────────────┤
│ Padaria e café na             │ Pães, salgados, tortas e café.                    │
│ Chácara das Pedras            │ Segunda a sábado, das 7h às 19h30. [Fazer enc.]   │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Onde estamos                                                                     │
│ PRAÇA LIMA DUARTE, 39 (grande)                                                   │
│ ┌ painel ─────────────────┐  ┌ foto 4:3 ───────────────┐                         │
│ │ endereço   | horários   │  │                         │                         │
│ │ telefone   | hoje ●     │  │                         │                         │
│ │ acessibilidade          │  └─────────────────────────┘                         │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Salgados, doces e café no balcão            Ver no Instagram →                   │
│ Salgados     | Doces e café |  ┌ foto que revela ─────┐                          │
│ ...linhas    | ...linhas    |  └──────────────────────┘                          │
│ [8 detalhes 1:1 em 2 linhas de 4] (2ª tela)                                      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Tortas, salgados e cestas por encomenda                                          │
│ [cartão tortas] [cartão salgados] [cartão cestas]                                │
│ [foto]  [formulário: tipo · data · pessoas · nome · observações → WhatsApp]      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Faça sua encomenda pelo WhatsApp  [Fazer encomenda]   [foto panetones]           │
│ links · horários · © 2026 · Privacidade · Desenvolvido por Fernando Dipp         │
└──────────────────────────────────────────────────────────────────────────────────┘
```

## Navegação
- Barra fixa e opaca, com 3 palavras e um botão. No celular, menu em tela cheia com o endereço e os horários no pé.

## Acessibilidade
- HTML semântico e link "Pular para o conteúdo".
- Contraste AA ou melhor e foco visível.
- Formulário com rótulos visíveis e erros abaixo de cada campo.
- Alvos de toque de pelo menos 44px.
- `lang="pt-BR"` e `prefers-reduced-motion` respeitado.

## Movimento (físico e discreto)
- O topo entra uma vez, com desaceleração natural.
- A foto do balcão revela como papel fotográfico (cerca de 1,6s), uma única vez.
- Mouse e toque: foto com zoom de 1,03 dentro da moldura, cartão que sobe 2px, botão que afunda ao clicar e sublinhado que se desenha.
- Plano original: nada se mexeria sozinho. Na versão atual, a faixa de produtos roda (com botão "Pausar faixa") e os títulos de seção aparecem ao rolar (GSAP). Tudo para com movimento reduzido.

## Tecnologia
- HTML, CSS e JS estáticos, sem framework e sem build. Bibliotecas de terceiros (GSAP e Lenis) hospedadas no próprio site, em `site/js/vendor/`.
- Hospedagem estática (Netlify, Cloudflare Pages ou GitHub Pages) apontando o domínio `engenhodopao.com.br`. **Decisão da dona.**
- Imagens em WebP com `srcset`, carregamento preguiçoso fora do topo e fontes locais.
