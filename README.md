This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## API v2 – Padronização com Versão de Endpoint

### `GET /api/v2/pedidos`

Lista pedidos com filtro opcional por status.

#### Query Params

| Parâmetro | Tipo   | Obrigatório | Descrição                              |
|-----------|--------|-------------|----------------------------------------|
| `status`  | string | Não         | Filtra por status: `PAID`, `PENDING`, `CANCELLED`, `FINALIZADO` |

#### Retorno por pedido

| Campo             | Tipo   | Descrição                      |
|-------------------|--------|--------------------------------|
| `id`              | number | ID do pedido                   |
| `cliente`         | string | Nome do destinatário           |
| `itens`           | array  | Produtos do pedido             |
| `subtotal`        | number | Soma dos itens sem desconto    |
| `desconto`        | number | Diferença entre subtotal e total |
| `totalFinal`      | number | Valor final pago               |
| `status`          | string | Status do pedido               |
| `enderecoEntrega` | object | Endereço de entrega (CamelCase)|
| `criadoEm`        | string | Data/hora de criação           |

---

#### Exemplo de Sucesso (v2)

**Request:**
```
GET /api/v2/pedidos?status=FINALIZADO
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Pedidos listados com sucesso",
  "data": [
    {
      "id": 1,
      "cliente": "João Silva",
      "itens": [
        { "id": 1, "nome": "Produto X", "precoUnitario": 48.00, "quantidade": 2, "totalItem": 96.00 }
      ],
      "subtotal": 96.00,
      "desconto": 0.00,
      "totalFinal": 96.00,
      "status": "FINALIZADO",
      "enderecoEntrega": { "rua": "Rua A", "numero": "10", "bairro": "Centro", "cidade": "Rondonópolis", "estado": "MT", "cep": "78700000" },
      "criadoEm": "2025-01-01T10:00:00"
    }
  ]
}
```

---

#### Exemplo de Erro – Status Inválido

**Request:**
```
GET /api/v2/pedidos?status=INVALIDO
```

**Response `400 Bad Request`:**
```json
{
  "success": false,
  "message": "Status inválido",
  "error": { "code": "VALIDATION_ERROR" }
}
```

---

### Rodar os Testes Automáticos

```bash
npm run test:run
```

Dois testes são executados:
1. **Sucesso** – listagem com retorno CamelCase correto
2. **Erro/Filtro** – `VALIDATION_ERROR` para status inválido
