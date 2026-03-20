import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock do banco de dados ───────────────────────────────────────────────────
// Precisamos mockar antes de importar o Service, pois 'server-only' e
// 'better-sqlite3' não funcionam fora do ambiente Next.js.

vi.mock("server-only", () => ({}));

const { mockAll, mockPrepare } = vi.hoisted(() => {
  const all = vi.fn();
  return {
    mockAll: all,
    mockPrepare: vi.fn(() => ({ all })),
  };
});

vi.mock("@/lib/db", () => ({
  default: { prepare: mockPrepare },
}));

// ─── Import após mock ─────────────────────────────────────────────────────────
import { OrderServiceV2 } from "../OrderServiceV2";

// ─── Dados de exemplo ─────────────────────────────────────────────────────────
const orderRow = {
  id: 1,
  total: 96.0,
  status: "FINALIZADO",
  recipient_name: "João Silva",
  street: "Rua A",
  number: "10",
  neighborhood: "Centro",
  city: "Rondonópolis",
  state: "MT",
  cep: "78700000",
  created_at: "2025-01-01T10:00:00",
};

const itemRow = {
  id: 1,
  name_snapshot: "Produto X",
  price_snapshot: 48.0,
  quantity: 2,
};

// ─── Testes ───────────────────────────────────────────────────────────────────
describe("OrderServiceV2.listarPedidos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Teste 1 – Sucesso: lista pedidos sem filtro de status
   */
  it("deve retornar sucesso com pedidos no formato CamelCase", () => {
    // Primeira chamada → retorna pedidos; segunda → retorna itens do pedido
    mockAll
      .mockReturnValueOnce([orderRow])
      .mockReturnValueOnce([itemRow]);

    const result = OrderServiceV2.listarPedidos();

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.message).toBe("Pedidos listados com sucesso");
    expect(result.data).toHaveLength(1);

    const pedido = result.data[0];
    expect(pedido.id).toBe(1);
    expect(pedido.cliente).toBe("João Silva");
    expect(pedido.status).toBe("FINALIZADO");
    expect(pedido.totalFinal).toBe(96);
    expect(pedido.subtotal).toBe(96); // 48 * 2
    expect(pedido.desconto).toBe(0);

    // Verifica endereço CamelCase
    expect(pedido.enderecoEntrega).toMatchObject({
      rua: "Rua A",
      cidade: "Rondonópolis",
      estado: "MT",
    });

    // Verifica itens
    expect(pedido.itens).toHaveLength(1);
    expect(pedido.itens[0].nome).toBe("Produto X");
    expect(pedido.itens[0].quantidade).toBe(2);
    expect(pedido.itens[0].totalItem).toBe(96);
  });

  /**
   * Teste 2 – Erro/Filtro: status inválido deve retornar VALIDATION_ERROR
   */
  it("deve retornar erro de validação quando o status for inválido", () => {
    const result = OrderServiceV2.listarPedidos("INVALIDO");

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.message).toBe("Status inválido");
    expect(result.error.code).toBe("VALIDATION_ERROR");

    // Garante que o banco NÃO foi consultado para status inválido
    expect(mockAll).not.toHaveBeenCalled();
  });
});
