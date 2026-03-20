import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 motion-safe:animate-fade-up">
        <h1 className="text-2xl font-semibold text-zinc-50">Relatorios</h1>
        <p className="text-sm text-zinc-400">
          Baixe relatorios atualizados do estoque em PDF ou XLSX.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface space-y-4 p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Relatorio em PDF
            </h2>
            <p className="text-xs text-zinc-500">
              Documento pronto para impressao e envio.
            </p>
          </div>
          <Link
            href="/admin/reports/pdf"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
          >
            Baixar PDF
          </Link>
        </div>
        <div className="surface space-y-4 p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Relatorio em XLSX
            </h2>
            <p className="text-xs text-zinc-500">
              Planilha para analises e dashboards externos.
            </p>
          </div>
          <Link
            href="/admin/reports/xlsx"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-zinc-900/70 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/30"
          >
            Baixar XLSX
          </Link>
        </div>
      </div>
    </div>
  );
}
