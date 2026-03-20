export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 motion-safe:animate-fade-up">
        <h1 className="text-2xl font-semibold text-zinc-50">Configuracoes</h1>
        <p className="text-sm text-zinc-400">
          Ajustes gerais do sistema e preferencias do dashboard.
        </p>
      </section>

      <div className="surface space-y-4 p-6">
        <h2 className="text-lg font-semibold text-zinc-100">Preferencias</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-4">
            <div className="text-sm font-semibold text-zinc-200">
              Tema do painel
            </div>
            <p className="text-xs text-zinc-500">
              Paleta escura focada em leitura prolongada.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-4">
            <div className="text-sm font-semibold text-zinc-200">
              Integracoes
            </div>
            <p className="text-xs text-zinc-500">
              Em breve: integracao com ERP e BI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
