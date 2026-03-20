"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { registerUser } from "@/app/auth/actions";
import { isValidCEP, onlyDigits } from "@/lib/validators";

type CepResponse = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<CepResponse | null>(null);
  const [cepError, setCepError] = useState<string | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepBlur = async () => {
    const normalized = onlyDigits(cep);
    if (!isValidCEP(normalized)) {
      setCepError("CEP invalido");
      setAddress(null);
      return;
    }

    setCepError(null);
    setLoadingCep(true);

    try {
      const response = await fetch(`/api/cep?cep=${normalized}`);
      if (!response.ok) {
        throw new Error("CEP nao encontrado");
      }
      const data = (await response.json()) as CepResponse;
      setAddress(data);
    } catch {
      setCepError("CEP nao encontrado");
      setAddress(null);
    } finally {
      setLoadingCep(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-12">
      <div className="surface space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-50">Criar conta</h1>
          <p className="text-sm text-zinc-400">
            Cadastre-se para comprar, acompanhar pedidos e salvar enderecos.
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
            {decodeURIComponent(error)}
          </div>
        ) : null}

        <form action={registerUser} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-zinc-300">Nome completo</span>
              <input
                name="name"
                required
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-zinc-300">Email</span>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-zinc-300">Senha</span>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-zinc-300">CPF</span>
              <input
                name="cpf"
                required
                placeholder="000.000.000-00"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-zinc-300">CEP</span>
              <input
                name="cep"
                required
                value={cep}
                onChange={(event) => setCep(event.target.value)}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              />
              {loadingCep ? (
                <span className="text-xs text-zinc-500">Buscando CEP...</span>
              ) : null}
              {cepError ? (
                <span className="text-xs text-rose-300">{cepError}</span>
              ) : null}
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-zinc-300">Numero</span>
              <input
                name="number"
                placeholder="Numero"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-zinc-300">Logradouro</span>
              <input
                name="street"
                value={address?.logradouro ?? ""}
                readOnly
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-zinc-300">Bairro</span>
              <input
                name="neighborhood"
                value={address?.bairro ?? ""}
                readOnly
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-1 text-sm md:col-span-2">
              <span className="text-zinc-300">Cidade</span>
              <input
                name="city"
                value={address?.localidade ?? ""}
                readOnly
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-zinc-300">UF</span>
              <input
                name="state"
                value={address?.uf ?? ""}
                readOnly
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
          </div>

          <label className="space-y-1 text-sm">
            <span className="text-zinc-300">Complemento</span>
            <input
              name="complement"
              placeholder="Opcional"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Criar conta
          </button>
        </form>

        <div className="text-sm text-zinc-400">
          Ja tem conta?{" "}
          <a href="/auth/signin" className="text-emerald-300 hover:text-emerald-200">
            Entrar
          </a>
        </div>
      </div>
    </div>
  );
}
