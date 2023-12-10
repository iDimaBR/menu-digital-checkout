# MeuCardápio - Sistema de Menu

Um sistema de menu digital que permite que os usuários (lojas) gerenciem seus produtos e categorias de maneira eficiente.

## Sobre

Este projeto visa facilitar a criação de menus digitais para estabelecimentos, permitindo que os usuários criem, gerenciem e exibam seus produtos e categorias de forma online. Ele oferece um ambiente intuitivo para a gestão de cardápios digitais, proporcionando uma experiência simplificada tanto para os estabelecimentos quanto para os clientes.

## Funcionalidades

- Cadastro e autenticação de usuários (lojas).
- CRUD (Create, Read, Update, Delete) de produtos.
- Organização por categorias de produtos.
- Integração com um gateway de pagamento (MercadoPago).
- Checkout simplificado para usuários finais.

## Tecnologias Utilizadas

- Node.js
- Express.js
- Sequelize ORM
- TypeScript
- React
- Zustand (para gerenciamento de estado no frontend)
- MercadoPago (para processamento de pagamentos)

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/menu-digital.git

# Backend
cd menu-digital/back
npm install
npm start

# Frontend
cd menu-digital/front
npm install
npm start
