import PDFDocument from "pdfkit";
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

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc.fontSize(18).text("Relatorio de Estoque", { align: "left" });
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .fillColor("#666666")
    .text(`Gerado em ${new Date().toLocaleString("pt-BR")}`);
  doc.moveDown();

  doc.fillColor("#000000").fontSize(11).font("Helvetica-Bold");
  doc.text("Produto", 40, doc.y, { width: 220 });
  doc.text("Categoria", 270, doc.y, { width: 120 });
  doc.text("Preco", 400, doc.y, { width: 80, align: "right" });
  doc.text("Qtd.", 485, doc.y, { width: 60, align: "right" });
  doc.moveDown(0.6);

  doc.font("Helvetica").fontSize(10);
  result.items.forEach((product) => {
    if (doc.y > 750) {
      doc.addPage();
    }

    doc.text(product.name, 40, doc.y, { width: 220 });
    doc.text(product.category, 270, doc.y, { width: 120 });
    doc.text(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(product.price),
      400,
      doc.y,
      { width: 80, align: "right" }
    );
    doc.text(String(product.quantity), 485, doc.y, {
      width: 60,
      align: "right",
    });
    doc.moveDown(0.4);
  });

  doc.end();

  const buffer = await done;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=relatorio-estoque.pdf",
    },
  });
}
