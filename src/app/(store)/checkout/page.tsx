import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { CheckoutForm } from "@/components/store/CheckoutForm";
import { authOptions } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/checkout");
  }

  const user = UserRepository.getByEmail(session.user.email);
  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-50">Checkout</h1>
        <p className="text-sm text-zinc-400">
          Confirme seus dados e finalize a compra.
        </p>
      </section>
      <CheckoutForm
        user={{
          name: user.name,
          cpf: user.cpf,
          cep: user.cep,
          street: user.street,
          number: user.number,
          neighborhood: user.neighborhood,
          city: user.city,
          state: user.state,
          complement: user.complement,
        }}
      />
    </div>
  );
}
