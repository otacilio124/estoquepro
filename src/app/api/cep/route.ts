import { NextResponse } from "next/server";

import { isValidCEP, onlyDigits } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cepParam = searchParams.get("cep") ?? "";
  const cep = onlyDigits(cepParam);

  if (!isValidCEP(cep)) {
    return NextResponse.json({ error: "CEP invalido" }, { status: 400 });
  }

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "CEP nao encontrado" }, { status: 404 });
  }

  const data = (await response.json()) as { erro?: boolean };
  if (data.erro) {
    return NextResponse.json({ error: "CEP invalido" }, { status: 404 });
  }

  return NextResponse.json(data);
}
