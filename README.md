# Portfólio pessoal

Portfólio profissional de Paulo Henrique de Freitas Coelho, desenvolvido com Next.js, React e TypeScript.

## Executar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Personalizar

Edite os dados em `src/data/portfolio.ts`:

- nome, cargo, localização e apresentação;
- links profissionais;
- projetos;
- habilidades;
- formação;
- certificados;
- hobbies.

Os campos entre colchetes são placeholders e devem ser substituídos antes da publicação.

Para adicionar fotografias:

- defina `profile.photoUrl` com o caminho de uma imagem em `public/`;
- defina `imageUrl` nos projetos, certificados ou hobbies para substituir os placeholders visuais.

## Formulário de contato

O formulário valida os campos e abre o aplicativo de e-mail do visitante. Ele não simula o envio por servidor.

Para envio automático, configure uma integração de formulário ou endpoint próprio e substitua `submitContact` em `src/components/portfolio-page.tsx`. Mantenha dados privados em variáveis de ambiente no servidor.
