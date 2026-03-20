"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const [loading, setLoading] = useState(true);

  // Define the mobile payment URL based on the current origin
  const [mobileUrl, setMobileUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Find the best URL to show
      const resolveUrl = async () => {
        let base = window.location.origin;
        if (base.includes("localhost")) {
           try {
             const res = await fetch("/api/internal/ip");
             const data = await res.json();
             if (data.ip) {
               base = `http://${data.ip}:${window.location.port || 3000}`;
             }
           } catch {
             // Fallback to localhost if error
           }
        }
        setMobileUrl(`${base}/pay/${orderId}`);
      };

      resolveUrl();
    }
  }, [orderId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}/status`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === "PAID" || data.status === "CONFIRMED") {
            router.push("/account?success=1");
          }
        }
      } catch (err) {
        console.error("Erro ao verificar status do pedido", err);
      } finally {
        setLoading(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  return (
    <div className="mx-auto max-w-xl space-y-8 py-12">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-50">Pagamento</h1>
        <p className="text-sm text-zinc-400">
          Escaneie o QR Code abaixo pelo simulador do seu celular para finalizar o pedido #{orderId}.
        </p>
      </div>

      <div className="surface flex flex-col items-center justify-center space-y-6 p-10">
        <div className="relative flex h-64 w-64 items-center justify-center rounded-2xl bg-white p-4 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
          {/* Real QR Code Visuals */}
          <div className="absolute inset-0 m-4 border-4 border-zinc-950/10 rounded-xl border-dashed pointer-events-none"></div>
          
          {mobileUrl ? (
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(mobileUrl)}`}
              alt="QR Code de Pagamento"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center">
               <span className="text-zinc-400 animate-pulse text-sm">Gerando QR...</span>
             </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="bg-emerald-500 rounded-full p-3 shadow-xl">
                <svg className="w-8 h-8 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
             </div>
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-emerald-400 animate-pulse">
            Aguardando pagamento...
          </p>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            Abra o simulador no celular escaneando o QR Code ou clicando no botão abaixo para testar no computador.
          </p>
          {mobileUrl && (
            <p className="pt-2 text-[10px] text-zinc-600 font-mono break-all px-4">
              Link: {mobileUrl}
            </p>
          )}
        </div>

        {mobileUrl && (
          <Link
            href={mobileUrl}
            target="_blank"
            className="mt-4 inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/50 px-6 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
          >
            Abrir Simulador Mobile na Nova Aba
          </Link>
        )}
      </div>
    </div>
  );
}
