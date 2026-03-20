import { NextResponse } from "next/server";

import { OrderServiceV2 } from "@/services/OrderServiceV2";

export const OrderControllerV2 = {
  /**
   * Handler para GET /api/v2/pedidos
   * Query params:
   *   - status?: string  – filtra pelo status do pedido
   */
  listar(request: Request): NextResponse {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;

    const result = OrderServiceV2.listarPedidos(status);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  },
};
