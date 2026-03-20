import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import db from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { isValidCEP, isValidCPF, onlyDigits } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const payload = (await request.json()) as {
    items: { id: string; quantity: number }[];
    recipientName: string;
    cpf: string;
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    number?: string;
    complement?: string;
  };

  if (!payload.items || payload.items.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const cpf = onlyDigits(payload.cpf ?? "");
  const cep = onlyDigits(payload.cep ?? "");

  if (!isValidCPF(cpf)) {
    return NextResponse.json({ error: "CPF invalido" }, { status: 400 });
  }

  if (!isValidCEP(cep)) {
    return NextResponse.json({ error: "CEP invalido" }, { status: 400 });
  }

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    cache: "no-store",
  });
  const cepData = (await response.json()) as { erro?: boolean };
  if (!response.ok || cepData.erro) {
    return NextResponse.json({ error: "CEP nao encontrado" }, { status: 400 });
  }

  try {
    const transaction = db.transaction(() => {
      let total = 0;

      const orderInfo = db
        .prepare(
          `INSERT INTO orders
           (user_id, total, status, recipient_name, cpf, cep, street, number, neighborhood, city, state, complement)
           VALUES (@user_id, @total, @status, @recipient_name, @cpf, @cep, @street, @number, @neighborhood, @city, @state, @complement)`
        )
        .run({
          user_id: Number(session.user.id),
          total: 0,
          status: "PAID",
          recipient_name: payload.recipientName,
          cpf,
          cep,
          street: payload.street,
          number: payload.number ?? null,
          neighborhood: payload.neighborhood,
          city: payload.city,
          state: payload.state,
          complement: payload.complement ?? null,
        });

      const orderId = Number(orderInfo.lastInsertRowid);

      const insertItem = db.prepare(
        `INSERT INTO order_items
         (order_id, product_id, name_snapshot, price_snapshot, quantity)
         VALUES (@order_id, @product_id, @name_snapshot, @price_snapshot, @quantity)`
      );

      const updateStock = db.prepare(
        `UPDATE products
         SET quantity = quantity - @quantity,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = @id`
      );

      payload.items.forEach((item) => {
        if (!Number.isFinite(item.quantity) || item.quantity < 1) {
          throw new Error("Quantidade invalida");
        }

        const product = db
          .prepare(
            `SELECT id, name, price, quantity
             FROM products
             WHERE id = ?`
          )
          .get(item.id) as {
          id: number;
          name: string;
          price: number;
          quantity: number;
        } | undefined;

        if (!product) {
          throw new Error("Produto nao encontrado");
        }

        if (product.quantity < item.quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}`);
        }

        const lineTotal = product.price * item.quantity;
        total += lineTotal;

        insertItem.run({
          order_id: orderId,
          product_id: product.id,
          name_snapshot: product.name,
          price_snapshot: product.price,
          quantity: item.quantity,
        });

        updateStock.run({ id: product.id, quantity: item.quantity });
      });

      db.prepare("UPDATE orders SET total = ? WHERE id = ?").run(total, orderId);

      return { orderId, total };
    });

    const result = transaction();

    return NextResponse.json({ orderId: result.orderId, total: result.total });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
