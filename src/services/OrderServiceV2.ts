import db from "@/lib/db";

// Status válidos do sistema
const VALID_STATUSES = ["PAID", "PENDING", "CANCELLED", "FINALIZADO"] as const;
type OrderStatus = (typeof VALID_STATUSES)[number];

export type ItemPedido = {
  id: number;
  nome: string;
  precoUnitario: number;
  quantidade: number;
  totalItem: number;
};

export type EnderecoEntrega = {
  rua: string;
  numero: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

export type PedidoV2 = {
  id: number;
  cliente: string;
  itens: ItemPedido[];
  subtotal: number;
  desconto: number;
  totalFinal: number;
  status: string;
  enderecoEntrega: EnderecoEntrega;
  criadoEm: string;
};

export type ListarPedidosResult =
  | { success: true; message: string; data: PedidoV2[] }
  | { success: false; message: string; error: { code: string } };

export const OrderServiceV2 = {
  /**
   * Lista pedidos com filtro opcional por status.
   * Retorna: cliente, itens, subtotal, desconto, totalFinal, status, enderecoEntrega.
   */
  listarPedidos(filtroStatus?: string): ListarPedidosResult {
    // Validação de status
    if (
      filtroStatus &&
      !VALID_STATUSES.includes(filtroStatus as OrderStatus)
    ) {
      return {
        success: false,
        message: "Status inválido",
        error: { code: "VALIDATION_ERROR" },
      };
    }

    // Query com filtro opcional
    const query = filtroStatus
      ? `SELECT o.id, o.total, o.status, o.recipient_name,
                o.street, o.number, o.neighborhood, o.city, o.state, o.cep,
                o.created_at
         FROM orders o
         WHERE o.status = ?
         ORDER BY o.created_at DESC`
      : `SELECT o.id, o.total, o.status, o.recipient_name,
                o.street, o.number, o.neighborhood, o.city, o.state, o.cep,
                o.created_at
         FROM orders o
         ORDER BY o.created_at DESC`;

    const rows = (
      filtroStatus
        ? db.prepare(query).all(filtroStatus)
        : db.prepare(query).all()
    ) as {
      id: number;
      total: number;
      status: string;
      recipient_name: string;
      street: string;
      number: string | null;
      neighborhood: string;
      city: string;
      state: string;
      cep: string;
      created_at: string;
    }[];

    const pedidos: PedidoV2[] = rows.map((order) => {
      // Busca itens do pedido
      const itensRaw = db
        .prepare(
          `SELECT id, name_snapshot, price_snapshot, quantity
           FROM order_items
           WHERE order_id = ?`
        )
        .all(order.id) as {
        id: number;
        name_snapshot: string;
        price_snapshot: number;
        quantity: number;
      }[];

      const itens: ItemPedido[] = itensRaw.map((item) => ({
        id: item.id,
        nome: item.name_snapshot,
        precoUnitario: Number(item.price_snapshot),
        quantidade: item.quantity,
        totalItem: Number(item.price_snapshot) * item.quantity,
      }));

      // Subtotal = soma dos itens (sem desconto)
      const subtotal = itens.reduce((sum, item) => sum + item.totalItem, 0);
      const totalFinal = Number(order.total);
      // Desconto = diferença entre subtotal e total pago (se positivo)
      const desconto = Math.max(0, subtotal - totalFinal);

      return {
        id: order.id,
        cliente: order.recipient_name,
        itens,
        subtotal: Number(subtotal.toFixed(2)),
        desconto: Number(desconto.toFixed(2)),
        totalFinal: Number(totalFinal.toFixed(2)),
        status: order.status,
        enderecoEntrega: {
          rua: order.street,
          numero: order.number,
          bairro: order.neighborhood,
          cidade: order.city,
          estado: order.state,
          cep: order.cep,
        },
        criadoEm: order.created_at,
      };
    });

    return {
      success: true,
      message: "Pedidos listados com sucesso",
      data: pedidos,
    };
  },
};
