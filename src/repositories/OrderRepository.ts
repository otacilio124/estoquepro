import db from "@/lib/db";

export type OrderItemRecord = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderRecord = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItemRecord[];
};

export const OrderRepository = {
  listByUserId(userId: string): OrderRecord[] {
    const orders = db
      .prepare(
        `SELECT id, total, status, created_at
         FROM orders
         WHERE user_id = ?
         ORDER BY created_at DESC`
      )
      .all(userId) as {
      id: number;
      total: number;
      status: string;
      created_at: string;
    }[];

    return orders.map((order) => {
      const items = db
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

      return {
        id: String(order.id),
        total: Number(order.total),
        status: order.status,
        createdAt: order.created_at,
        items: items.map((item) => ({
          id: String(item.id),
          name: item.name_snapshot,
          price: Number(item.price_snapshot),
          quantity: Number(item.quantity),
        })),
      };
    });
  },

  getSalesSummary(): {
    orderCount: number;
    totalRevenue: number;
    averageTicket: number;
    itemsSold: number;
  } {
    const summary = db
      .prepare(
        `SELECT COUNT(*) as order_count,
                COALESCE(SUM(total), 0) as total_revenue,
                COALESCE(AVG(total), 0) as average_ticket
         FROM orders`
      )
      .get() as {
      order_count: number;
      total_revenue: number;
      average_ticket: number;
    };

    const items = db
      .prepare(`SELECT COALESCE(SUM(quantity), 0) as items_sold FROM order_items`)
      .get() as { items_sold: number };

    return {
      orderCount: Number(summary.order_count),
      totalRevenue: Number(summary.total_revenue),
      averageTicket: Number(summary.average_ticket),
      itemsSold: Number(items.items_sold),
    };
  },

  listSalesByDay(days: number): { date: string; orders: number; total: number }[] {
    const safeDays = Math.max(1, Math.floor(days));
    const offset = `-${safeDays - 1} days`;
    const rows = db
      .prepare(
        `SELECT date(created_at) as day,
                COUNT(*) as orders,
                COALESCE(SUM(total), 0) as total
         FROM orders
         WHERE date(created_at) >= date('now', ?)
         GROUP BY date(created_at)
         ORDER BY day ASC`
      )
      .all(offset) as { day: string; orders: number; total: number }[];

    return rows.map((row) => ({
      date: row.day,
      orders: Number(row.orders),
      total: Number(row.total),
    }));
  },
};
