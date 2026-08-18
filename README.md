# Apicultura JR Maciel

Site institucional e landing page de captação da Apicultura JR Maciel — Confresa/MT.
Mel puro produzido por Junior Maciel, apicultor desde 2010. Produto certificado pelo SIAPP.

## Estrutura

- `index.html` — landing page de conversão (produtos, processo, vídeos, formulário → WhatsApp, FAQ)
- `sobre.html` — história do mel, preparo passo a passo, vídeos do canal, redes sociais e localização
- `styles.css` — estilos (CSS puro, sem dependências)
- `app.js` — menu mobile, animações, formulário → WhatsApp, players de vídeo sob demanda
- `img/` — fotos do apiário e dos produtos

## Configuração

O número de WhatsApp fica em `app.js`, primeira linha:

```js
var WHATSAPP = "5500000000000"; // 55 + DDD + número, só dígitos
```

## Deploy

Site 100% estático. Publicado na Vercel — qualquer push na branch `main` gera novo deploy.
