import Link from "next/link";

import { ProductDTO } from "@/dtos/ProductDTO";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type ProductFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<ProductDTO>;
  action: (formData: FormData) => void;
  categories: string[];
};

export function ProductForm({
  mode,
  defaultValues,
  action,
  categories,
}: ProductFormProps) {
  const defaultImages =
    defaultValues?.imageUrls && defaultValues.imageUrls.length > 0
      ? defaultValues.imageUrls.join("\n")
      : defaultValues?.imageUrl ?? "";

  return (
    <form action={action} className="surface space-y-6 p-6 motion-safe:animate-fade-up">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-zinc-200">Nome</span>
          <Input
            name="name"
            placeholder="Nome do produto"
            defaultValue={defaultValues?.name}
            required
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-zinc-200">SKU</span>
          <Input
            name="sku"
            placeholder="APP-MBP-2023"
            defaultValue={defaultValues?.sku}
            required
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-zinc-200">Categoria</span>
          <Select name="category" defaultValue={defaultValues?.category ?? ""}>
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-zinc-200">Preco</span>
          <Input
            name="price"
            type="number"
            step="0.01"
            placeholder="0,00"
            defaultValue={defaultValues?.price ?? ""}
            required
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-zinc-200">Quantidade</span>
          <Input
            name="quantity"
            type="number"
            placeholder="0"
            defaultValue={defaultValues?.quantity ?? ""}
            required
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-zinc-200">Fotos (URLs)</span>
          <textarea
            name="imageUrls"
            rows={4}
            placeholder="https://... (uma por linha)"
            defaultValue={defaultImages}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
          />
          <span className="text-xs text-zinc-500">
            A primeira URL vira a capa do produto.
          </span>
        </label>
      </div>

      <label className="space-y-1">
        <span className="text-sm font-medium text-zinc-200">Descricao</span>
        <textarea
          name="description"
          rows={5}
          placeholder="Descreva o produto..."
          defaultValue={defaultValues?.description ?? ""}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-zinc-500">
          {mode === "create"
            ? "Os dados serao gravados na camada de dados."
            : "Edite os dados e salve as alteracoes."}
        </span>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900/70 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/30"
          >
            Cancelar
          </Link>
          <Button type="submit">
            {mode === "create" ? "Cadastrar produto" : "Salvar alteracoes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
