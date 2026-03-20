import { StatCard } from "@/components/products/StatCard";
import { ProductService } from "@/services/ProductService";
import { SalesService } from "@/services/SalesService";

export const dynamic = "force-dynamic";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatDayLabel = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));

export default async function DashboardPage() {
  const [overview, sales] = await Promise.all([
    ProductService.getDashboardOverview(),
    SalesService.getSalesOverview(7),
  ]);

  const maxStatus = Math.max(
    overview.statusSummary.inStock,
    overview.statusSummary.lowStock,
    overview.statusSummary.outOfStock,
    1
  );
  const topCategories = overview.categorySummary.slice(0, 5);
  const maxCategory = Math.max(
    ...topCategories.map((item) => item.count),
    1
  );
  const maxDailySales = Math.max(
    ...sales.daily.map((day) => day.total),
    1
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 motion-safe:animate-fade-up">
        <h1 className="text-2xl font-semibold text-zinc-50">
          Dashboard Administrativo
        </h1>
        <p className="text-sm text-zinc-400">
          Vendas, estoque e performance da loja em tempo real.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total vendido"
          value={formatCurrency(sales.summary.totalRevenue)}
          hint="Receita acumulada"
          accent="emerald"
          delay={0}
        />
        <StatCard
          title="Pedidos"
          value={sales.summary.orderCount.toString()}
          hint={`${sales.summary.itemsSold} itens vendidos`}
          accent="zinc"
          delay={120}
        />
        <StatCard
          title="Ticket medio"
          value={formatCurrency(sales.summary.averageTicket)}
          hint="Media por pedido"
          accent="amber"
          delay={220}
        />
        <StatCard
          title="Alertas de estoque"
          value={`${overview.lowStock + overview.outOfStock}`}
          hint={`${overview.lowStock} baixos, ${overview.outOfStock} zerados`}
          accent="rose"
          delay={320}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="surface space-y-5 p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Vendas nos ultimos 7 dias
            </h2>
            <p className="text-xs text-zinc-500">
              Volume diario de pedidos e faturamento
            </p>
          </div>
          <div className="space-y-4">
            {sales.daily.map((day) => (
              <div key={day.date} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>{formatDayLabel(day.date)}</span>
                  <span>
                    {formatCurrency(day.total)} · {day.orders} pedidos
                  </span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800/80">
                  <div
                    className="h-2 rounded-full bg-emerald-400/70"
                    style={{ width: `${(day.total / maxDailySales) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface space-y-5 p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Total de produtos
            </h2>
            <p className="text-xs text-zinc-500">
              Itens cadastrados no catalogo
            </p>
          </div>
          <div className="text-3xl font-semibold text-zinc-50">
            {overview.totalProducts.toString()}
          </div>
          <div className="text-xs text-zinc-500">
            Valor total em estoque: {formatCurrency(overview.inventoryValue)}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface space-y-5 p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Distribuicao por estoque
            </h2>
            <p className="text-xs text-zinc-500">
              Monitoramento rapido dos niveis
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Em estoque",
                value: overview.statusSummary.inStock,
                color: "bg-emerald-400",
              },
              {
                label: "Estoque baixo",
                value: overview.statusSummary.lowStock,
                color: "bg-amber-400",
              },
              {
                label: "Sem estoque",
                value: overview.statusSummary.outOfStock,
                color: "bg-rose-400",
              },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800/80">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${(item.value / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface space-y-5 p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Performance por categoria
            </h2>
            <p className="text-xs text-zinc-500">
              Volume de itens e valor em estoque
            </p>
          </div>
          <div className="space-y-4">
            {topCategories.length === 0 ? (
              <div className="text-sm text-zinc-500">
                Nenhuma categoria cadastrada.
              </div>
            ) : (
              topCategories.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.totalValue)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800/80">
                    <div
                      className="h-2 rounded-full bg-emerald-400/70"
                      style={{ width: `${(item.count / maxCategory) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
