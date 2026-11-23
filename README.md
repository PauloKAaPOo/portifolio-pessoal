# portifolio-pessoal

## Capturas dos projetos

Salve as imagens reais das telas em `public/images/projects/` e cadastre-as no
projeto correspondente em `src/data/portfolio.ts`. Cada item de `images` contém
um `id`, o caminho público da imagem, um título e uma descrição:

```ts
images: [
  {
    id: "visao-geral",
    image: "/images/projects/nome-do-projeto-visao-geral.png",
    title: "Visão geral",
    description: "Descrição do que esta tela realmente apresenta.",
  },
],
```

Projetos sem capturas cadastradas exibem um espaço reservado; nenhuma tela
ilustrativa é gerada automaticamente.
