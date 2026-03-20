"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const registered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      email,
      password,
      callbackUrl,
    });
    setLoading(false);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <div className="surface space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-50">Entrar</h1>
          <p className="text-sm text-zinc-400">
            Acesse sua conta para comprar e acompanhar pedidos.
          </p>
        </div>

        {registered ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
            Cadastro realizado. Agora faca login.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
            Credenciais invalidas. Tente novamente.
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="space-y-1 text-sm">
            <span className="text-zinc-300">Email</span>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-zinc-300">Senha</span>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="text-sm text-zinc-400">
          Ainda nao tem conta?{" "}
          <a href="/auth/register" className="text-emerald-300 hover:text-emerald-200">
            Criar conta
          </a>
        </div>
      </div>
    </div>
  );
}
