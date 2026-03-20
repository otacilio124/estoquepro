import * as XLSX from "xlsx";
import { getServerSession } from "next-auth";

import { ProductService } from "@/services/ProductService";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await ProductService.listProducts({ pageSize: 1000 });

  const data = result.items.map((product) => ({
    Produto: product.name,
    SKU: product.sku,
    Categoria: product.category,
    Preco: product.price,
    Quantidade: product.quantity,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=relatorio-estoque.xlsx",
    },
  });
}
