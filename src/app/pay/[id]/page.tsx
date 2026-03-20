"use client";

import { useState, use } from "react";
import { payOrder } from "@/app/pay/actions";

export default function MobilePayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = parseInt(resolvedParams.id);

  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalStr, setTotalStr] = useState("R$ 0,00");

  const handlePay = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await payOrder(orderId);
      if (res.success) {
        setTotalStr(
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(res.total)
        );
        setIsPaid(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao pagar");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPaid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-100 relative overflow-hidden">
        {/* Confetti or simple success background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.15),_transparent_60%)] animate-pulse" />
        
        <div className="surface z-10 w-full max-w-sm rounded-3xl border border-zinc-800 p-8 shadow-2xl animate-fade-up">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-zinc-50">Pedido pago com sucesso!</h1>
            <p className="text-sm text-zinc-400">
              Seu pagamento foi confirmado pelo Pix falso da loja online.
            </p>
          </div>

          <div className="mt-8 space-y-4 rounded-2xl bg-zinc-900/50 p-6 text-sm border border-zinc-800/50">
            <div className="flex justify-between border-b border-zinc-800 pb-3">
              <span className="text-zinc-500">Valor Pago</span>
              <span className="font-medium text-emerald-300">{totalStr}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-3">
              <span className="text-zinc-500">Para</span>
              <span className="font-medium">Estoque Store S.A.</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-3">
              <span className="text-zinc-500">Pedido #</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Data e Hora</span>
              <span className="font-medium">{new Date().toLocaleString("pt-BR")}</span>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-zinc-500">
            No simulador de computador, observe que a aba foi automaticamente redirecionada para a tela de Sucesso. Você pode fechar esta aba agora.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-100">
      <div className="surface w-full max-w-sm rounded-3xl border border-zinc-800 p-8 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-100 mb-6">
             <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
             </svg>
          </div>
          <h1 className="text-xl font-semibold text-zinc-50">App Falso Pagamentos</h1>
          <p className="text-sm text-zinc-400">
            Você leu um QR code de pagamento da Estoque Store para o pedido #{orderId}.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={isLoading}
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="animate-pulse">Processando...</span>
          ) : (
            "Pagar Fatura Agora"
          )}
        </button>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Ao clicar, simularemos que o pagamento foi com sucesso no sistema principal.
        </p>
      </div>
    </div>
  );
}
