# Café & Afeto — Aplicativo da Cafeteria

Protótipo acadêmico navegável baseado nos diagramas UML, modelo ER e telas do projeto da cafeteria.

## Funcionalidades
- Catálogo, categorias e busca de produtos
- Carrinho com ajuste de quantidades e cálculo do total
- Login/cadastro **simulado**
- Checkout com endereço e seleção de pagamento **fictício**
- Histórico de pedidos e rastreamento **ilustrativo**
- Layout responsivo para celular e computador

## Executar
Abra `index.html` no navegador. Não precisa instalar dependências.

## Publicar no GitHub Pages
No repositório, vá a **Settings → Pages → Build and deployment → Deploy from a branch**. Selecione a branch `main` e a pasta `/(root)` e clique em **Save**.

O site ficará disponível em `https://SEU-USUARIO.github.io/aplicativo-cafeteria/` após a publicação.

## Aviso
Esta é uma demonstração **frontend**, sem backend e sem conexão com MySQL. Os dados de carrinho, usuário e pedidos ficam apenas no `localStorage` do navegador. Não armazene dados reais nem use senhas reais. Nenhum pagamento é processado. O script SQL do projeto físico pode ser mantido no mesmo repositório para documentação.


## Revisão de qualidade (protótipo)
- Cadastro demonstrativo separado do login, confirmação de senha e prevenção de e-mail repetido **no mesmo navegador**.
- Edição de nome e e-mail da conta demonstrativa.
- Recuperação de acesso apenas ilustrativa, sem envio de e-mails.
- Carrinho com quantidade e total por item mais claros.
- Melhorias visuais nos cartões de produtos e aviso explícito de rastreamento ilustrativo.

**Limitações:** o site usa localStorage, não MySQL. Não há autenticação real, verificação de senhas, envio de e-mail, pagamentos reais ou rastreamento em tempo real. Não utilize informações pessoais verdadeiras.
