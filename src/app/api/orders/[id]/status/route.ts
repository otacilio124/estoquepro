import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const resolvedParams = await params;
  const orderId = parseInt(resolvedParams.id);
  if (!orderId) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 });
  }

  try {
    const order = db
      .prepare(
        `SELECT status FROM orders WHERE id = ? AND user_id = ?`
      )
      .get(orderId, Number(session.user.id)) as { status: string } | undefined;

    if (!order) {
      return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 });
    }

    return NextResponse.json({ status: order.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
