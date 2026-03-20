"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function payOrder(orderId: number) {
  if (!orderId) {
    throw new Error("ID de pedido invalido.");
  }

  const order = db
    .prepare("SELECT id, total, status FROM orders WHERE id = ?")
    .get(orderId) as { id: number; total: number; status: string } | undefined;

  if (!order) {
    throw new Error("Pedido nao encontrado.");
  }

  if (order.status === "PAID" || order.status === "CONFIRMED") {
    // Already paid
    return { success: true, total: order.total };
  }

  db.prepare("UPDATE orders SET status = 'PAID' WHERE id = ?").run(
    orderId
  );

  // Optionally revalidate some paths
  revalidatePath("/account");
  revalidatePath(`/api/orders/${orderId}/status`);

  return { success: true, total: order.total };
}
