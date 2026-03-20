import { OrderRepository } from "@/repositories/OrderRepository";

export type DailySales = {
  date: string;
  orders: number;
  total: number;
};

export type SalesOverview = {
  summary: {
    orderCount: number;
    totalRevenue: number;
    averageTicket: number;
    itemsSold: number;
  };
  daily: DailySales[];
};

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

export const SalesService = {
  async getSalesOverview(days = 7): Promise<SalesOverview> {
    const summary = OrderRepository.getSalesSummary();
    const rows = OrderRepository.listSalesByDay(days);

    const map = new Map(rows.map((row) => [row.date, row]));
    const safeDays = Math.max(1, Math.floor(days));
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (safeDays - 1));

    const daily: DailySales[] = [];
    for (let i = 0; i < safeDays; i += 1) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      const key = toDateKey(current);
      const row = map.get(key);
      daily.push({
        date: key,
        orders: row?.orders ?? 0,
        total: row?.total ?? 0,
      });
    }

    return { summary, daily };
  },
};
