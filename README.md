# FC Monolito

Este é um projeto de e-commerce monolítico desenvolvido como parte do curso de Arquitetura Hexagonal da Full Cycle.

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express
- Sequelize
- SQLite (desenvolvimento/testes)
- Jest
- ESLint
- Prettier

## 📦 Estrutura do Projeto

O projeto segue a arquitetura hexagonal (ports and adapters) e está organizado nos seguintes módulos:

```
src/
├── modules/
│   ├── @shared/           # Código compartilhado entre módulos
│   ├── checkout/          # Módulo de checkout
│   ├── client-adm/        # Módulo de administração de clientes
│   ├── invoice/           # Módulo de faturamento
│   ├── payment/           # Módulo de pagamento
│   ├── product-adm/       # Módulo de administração de produtos
│   └── store-catalog/     # Módulo de catálogo de produtos
├── test-migrations/       # Migrações para testes
└── main/                  # Configuração da aplicação
```

Cada módulo segue a estrutura:

```
module/
├── domain/        # Entidades e regras de negócio
├── application/   # Casos de uso
├── infrastructure/# Implementações concretas
└── facade/        # Interface pública do módulo
```

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/fc-monolito.git
cd fc-monolito
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Testes
```bash
npm test
```

### Build
```bash
npm run build
```

## 📝 Funcionalidades

### Checkout
- Criação de pedidos
- Validação de estoque
- Processamento de pagamento
- Geração de fatura

### Cliente
- Cadastro de clientes
- Busca de clientes
- Atualização de dados

### Produto
- Cadastro de produtos
- Atualização de estoque
- Catálogo de produtos

### Pagamento
- Processamento de pagamentos
- Integração com gateway de pagamento

### Fatura
- Geração de faturas
- Emissão de notas fiscais

## 🧪 Testes

O projeto utiliza Jest para testes unitários e de integração. Para executar os testes:

```bash
# Executar todos os testes
npm test

# Executar testes com coverage
npm run test:coverage

# Executar testes em watch mode
npm run test:watch
```

## 📚 Documentação da API

### Checkout

#### POST /checkout
Cria um novo pedido.

**Request:**
```json
{
  "clientId": "string",
  "products": [
    {
      "productId": "string",
      "quantity": number
    }
  ]
}
```

**Response:**
```json
{
  "id": "string",
  "invoiceId": "string",
  "status": "string",
  "total": number,
  "products": [
    {
      "productId": "string",
      "quantity": number
    }
  ]
}
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add some amazing feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Seu Nome - [@seu-usuario](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Full Cycle
- Comunidade de desenvolvedores
- Todos os contribuidores 
