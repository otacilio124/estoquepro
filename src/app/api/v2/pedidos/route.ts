import { NextResponse } from "next/server";

import { OrderControllerV2 } from "@/controllers/OrderControllerV2";

export const runtime = "nodejs";

/**
 * GET /api/v2/pedidos
 *
 * Query params:
 *   - status?: string  → filtra os pedidos pelo status (ex: PAID, PENDING, CANCELLED)
 *
 * Exemplo de sucesso:
 *   GET /api/v2/pedidos?status=PAID
 *   → { success: true, message: "...", data: [...] }
 *
 * Exemplo de erro:
 *   GET /api/v2/pedidos?status=INVALIDO
 *   → { success: false, message: "Status inválido", error: { code: "VALIDATION_ERROR" } }
 */
export async function GET(request: Request): Promise<NextResponse> {
  return OrderControllerV2.listar(request);
}
