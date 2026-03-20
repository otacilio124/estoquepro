import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";
import { OrderRepository } from "@/repositories/OrderRepository";
import { OrderTracking } from "@/components/store/OrderTracking";

export const dynamic = "force-dynamic";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

type AccountPageProps = {
  searchParams?: Promise<{ success?: string }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = UserRepository.getByEmail(session.user.email);
  if (!user) {
    redirect("/auth/signin");
  }

  const orders = OrderRepository.listByUserId(user.id);
  const resolvedSearchParams = await searchParams;
  const success = resolvedSearchParams?.success;

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-50">Minha conta</h1>
        <p className="text-sm text-zinc-400">
          Consulte seus dados e pedidos recentes.
        </p>
      </section>

      {success ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          Pedido confirmado com sucesso!
        </div>
      ) : null}

      <div className="surface p-6">
        <h2 className="text-lg font-semibold text-zinc-100">Dados pessoais</h2>
        <div className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-wide text-zinc-500">Nome</span>
            <p>{user.name}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-zinc-500">Email</span>
            <p>{user.email}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-zinc-500">CPF</span>
            <p>{user.cpf}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-zinc-500">Endereco</span>
            <p>
              {user.street}, {user.number ?? "S/N"} - {user.neighborhood}
            </p>
            <p>
              {user.city} / {user.state} - {user.cep}
            </p>
          </div>
        </div>
      </div>

      <div className="surface p-6">
        <h2 className="text-lg font-semibold text-zinc-100">Pedidos</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">
            Nenhum pedido realizado ainda.
          </p>
        ) : (
          <div className="mt-4 space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-zinc-800/70 p-4 bg-zinc-950/40">
                <div className="flex flex-wrap items-center justify-between text-sm text-zinc-300">
                  <span className="font-medium text-emerald-400">Pedido #{order.id}</span>
                  <span>{new Date(order.createdAt).toLocaleString("pt-BR")}</span>
                </div>
                <div className="mt-2 text-sm text-zinc-200">
                  Total da compra: <span className="font-semibold text-emerald-300">{formatCurrency(order.total)}</span>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-zinc-400 border-b border-zinc-800/60 pb-4">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name} <span className="text-zinc-500">x{item.quantity}</span></span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 pt-2">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="text-sm font-medium text-zinc-300">Acompanhe seu pedido</h3>
                    {order.status === "PENDING" && (
                      <Link
                        href={`/checkout/payment/${order.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-400"
                      >
                        Realizar Pagamento
                      </Link>
                    )}
                  </div>
                  <OrderTracking createdAtStr={order.createdAt} status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
