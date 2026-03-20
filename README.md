# Estoque Pro

O **Estoque Pro** é uma plataforma inovadora e simuladora de E-commerce e Gestão de Estoque construída com o ecosistema React e Next.js. O sistema não apenas lista produtos e permite o fluxo de compra, mas simula processos modernos de checkout, geração e pagamento por QR Code em tempo real e um sistema independente de rastreamento de entregas.

## 🎓 Propósito Educacional

Este projeto foi construído e idealizado exclusivamente para fins acadêmicos, visando compor as atividades e avaliações das aulas da matéria de **Qualidade de Software**, sob supervisão do **Professor Douglas** na **Faculdade de Tecnologia SENAI Mato Grosso (FATEC SENAI MT)**.

Todo o desenvolvimento prezou por boas práticas de codificação, arquitetura baseada em Serviços e Repositórios, e testes unitários garantindo a confiabilidade exigida na disciplina de Qualidade de Software.

---

## ⚙️ Principais Funcionalidades

- **E-Commerce Completo:** Home page dinâmica em formato carrossel, catálogo de produtos com busca e página de checkout completa via carrinho de compras.
- **Painel Administrativo:** CRUD completo para produtos, categorias, gestão ativa de carrossel de marketing e dashboards de vendas.
- **Simulador de Pagamento por QR Code:** Geração dinâmica do QR Code com leitura do IP da máquina para possibilitar que um smartphone real na rede escaneie e acesse a rota simuladora de banco, confirmando a compra bidirecionalmente (Polling em Client-side).
- **Rápido Retry de Pagamentos:** Pedidos pendentes na "Minha Conta" oferecem ao cliente a opção ágil de gerar os dados de QR Code novamente.
- **Order Tracking Dinâmico:** Uma linha do tempo animada baseada unicamente na hora de criação do pedido processa o status logístico ("Na Loja", "Coletado", "Em Trânsito", "Em Rota", "Entregue") progressivamente.
- **Banco de Dados SQLite:** Usa o *Better-SQLite3* para transações locais sem necessidade de clusters em nuvem, rodando completamente local e armazenando imagens e pedidos com consistência.

---

## 🚀 Como Baixar, Instalar e Executar

Siga os passos abaixo para ter a aplicação rodando no seu ambiente localmente:

### Pré-requisitos
- Node.js (versão 18.x ou superior)
- Git instalado na máquina

### 1. Clonar o repositório

Abra seu terminal/prompt de comando e execute:
```bash
git clone https://github.com/otacilio124/estoquepro.git
cd estoque-pro
```

### 2. Instalar dependências

Ainda dentro do diretório recém baixado, rode o instalador de pacotes do Node:
```bash
npm install
```

### 3. Iniciar o servidor de Desenvolvimento

Após as dependências instalarem, execute o projeto:
```bash
npm run dev
```

O servidor detectará o IP da sua máquina e vai expor o painel em **`http://localhost:3000`**. 

---

## 🔐 Credenciais de Acesso (Teste)

Para facilitar a correção e os testes pelos professores e alunos, o banco de dados já é inicializado com um usuário Administrador padrão. 

Para testar as funcionalidades do **Painel Admin** (Dashboard, Cadastro de Produtos, Gerenciamento de Carrossel, etc), acesse a rota `/auth/signin` ou clique em "Entrar" e utilize:

- **Email:** `admin@estoquepro.local`
- **Senha:** `Admin123!`

*(Ou, se preferir, crie uma conta nova de cliente na tela de Cadastro para testar o fluxo completo de checkout como usuário normal).*

---

## 🧪 Testes Automáticos

Visando atestar a resiliência dos endpoints (requisito de Qualidade de Software), o projeto está equipado com o Vitest.
Rode no terminal:
```bash
npm run test:run
```

---

## 📡 Rotas de API e Exemplos para Postman

O sistema contém diversas rotas para manipulação de compras via Client Component, as principais e mais recentes para simulação via Postman ou Insomnia encontram-se abaixo:

### 1. `GET /api/v2/pedidos` (Listagem com Padrão CamelCase)
Retorna os pedidos padronizados e estruturados obedecendo o mapeamento de boas práticas. Você pode enviar a *query string* `?status=VALOR` para filtrar.

**Exemplo Request:**
`GET http://localhost:3000/api/v2/pedidos?status=PENDING`

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Pedidos listados com sucesso",
  "data": [
    {
      "id": 1,
      "cliente": "João Silva",
      "itens": [
        { "id": 1, "nome": "MacBook Pro M2", "precoUnitario": 12499.9, "quantidade": 1, "totalItem": 12499.9 }
      ],
      "subtotal": 12499.9,
      "desconto": 0.00,
      "totalFinal": 12499.9,
      "status": "PENDING",
      "enderecoEntrega": { 
        "rua": "Praça da Sé", "numero": "100", "bairro": "Sé", "cidade": "São Paulo", "estado": "SP", "cep": "01001-000" 
      },
      "criadoEm": "2026-03-20T10:00:00.000Z"
    }
  ]
}
```

### 2. `POST /api/orders` (Criação do Pedido)
Endpoint protegido para a finalização do carrinho de compras. O payload requer objetos contendo items do carrinho e endereço. (Requer Sessão do Next-Auth). Retorna o Id e transaciona o status para PENDING.

### 3. `GET /api/orders/[id]/status` (Polling de QR Code)
Usado publicamente pelo sistema para conferir a cada X segundos se o Pedido foi efetivamente pago. Ideal para ser rodado no Postman enquanto simula fluxos reais de tempo de pagamento.

**Exemplo Request:**
`GET http://localhost:3000/api/orders/3/status`

**Response (`200 OK`):**
```json
{
  "status": "PENDING"
}
```

### 4. `GET /api/internal/ip` (Busca de Rede IPv4)
Pesquisa em todo o SO onde o Node.js está ancorado em busca do IP primário público do Router Local.
**Response (`200 OK`):**
```json
{
  "ip": "[IP_ADDRESS]"
}
```

---

## 👨‍💻 Autoria

Desenvolvido por **Otacílio de Oliveira Neto**  
*Aluno de Análise e Desenvolvimento de Sistemas*  
**FATEC SENAI MT** - Disciplina de Qualidade de Software
