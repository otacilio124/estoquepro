"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/store/CartContext";
import { isValidCEP, onlyDigits } from "@/lib/validators";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

type CheckoutFormProps = {
  user: {
    name: string;
    cpf: string;
    cep: string;
    street: string;
    number?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    complement?: string | null;
  };
};

type CepResponse = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export function CheckoutForm({ user }: CheckoutFormProps) {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [cpf, setCpf] = useState(user.cpf);
  const [cep, setCep] = useState(user.cep);
  const [address, setAddress] = useState<CepResponse>({
    logradouro: user.street,
    bairro: user.neighborhood,
    localidade: user.city,
    uf: user.state,
  });
  const [number, setNumber] = useState(user.number ?? "");
  const [complement, setComplement] = useState(user.complement ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCepBlur = async () => {
    const normalized = onlyDigits(cep);
    if (!isValidCEP(normalized)) {
      setError("CEP invalido");
      return;
    }

    setError(null);
    const response = await fetch(`/api/cep?cep=${normalized}`);
    if (!response.ok) {
      setError("CEP nao encontrado");
      return;
    }

    const data = (await response.json()) as CepResponse;
    setAddress(data);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
          recipientName: user.name,
          cpf,
          cep,
          street: address.logradouro,
          neighborhood: address.bairro,
          city: address.localidade,
          state: address.uf,
          number,
          complement,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Erro ao finalizar compra");
      }

      clear();
      router.push("/account?success=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="surface space-y-6 p-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Endereco</h2>
          <p className="text-xs text-zinc-500">
            Confirmar dados para entrega.
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-zinc-300">CPF</span>
            <input
              value={cpf}
              onChange={(event) => setCpf(event.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-300">CEP</span>
            <input
              value={cep}
              onChange={(event) => setCep(event.target.value)}
              onBlur={handleCepBlur}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-zinc-300">Logradouro</span>
            <input
              value={address.logradouro}
              readOnly
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-300">Bairro</span>
            <input
              value={address.bairro}
              readOnly
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-zinc-300">Cidade</span>
            <input
              value={address.localidade}
              readOnly
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-300">UF</span>
            <input
              value={address.uf}
              readOnly
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-zinc-300">Numero</span>
            <input
              value={number}
              onChange={(event) => setNumber(event.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-300">Complemento</span>
            <input
              value={complement}
              onChange={(event) => setComplement(event.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
        </div>
      </div>

      <div className="surface space-y-4 p-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Resumo</h2>
          <p className="text-xs text-zinc-500">Checkout simulado.</p>
        </div>

        <div className="space-y-2 text-sm text-zinc-300">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800 pt-4 text-sm">
          <span>Total</span>
          <span className="text-lg font-semibold text-emerald-300">
            {formatCurrency(total)}
          </span>
        </div>

        <button
          type="button"
          disabled={loading || items.length === 0}
          onClick={handleSubmit}
          className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/60"
        >
          {loading ? "Processando..." : "Finalizar compra"}
        </button>
      </div>
    </div>
  );
}
