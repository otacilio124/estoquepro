"use server";

import { redirect } from "next/navigation";

import { UserService } from "@/services/UserService";
import { isValidCEP, isValidCPF, onlyDigits } from "@/lib/validators";

const fetchCep = async (cep: string) => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("CEP nao encontrado.");
  }

  const data = (await response.json()) as { erro?: boolean };
  if (data.erro) {
    throw new Error("CEP invalido.");
  }

  return data as {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
  };
};

export async function registerUser(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const cpfRaw = String(formData.get("cpf") ?? "");
  const cepRaw = String(formData.get("cep") ?? "");
  const number = String(formData.get("number") ?? "").trim();
  const complement = String(formData.get("complement") ?? "").trim();

  const cpf = onlyDigits(cpfRaw);
  const cep = onlyDigits(cepRaw);

  if (!name || !email || !password) {
    redirect("/auth/register?error=Preencha%20os%20campos%20obrigatorios");
  }

  if (!isValidCPF(cpf)) {
    redirect("/auth/register?error=CPF%20invalido");
  }

  if (!isValidCEP(cep)) {
    redirect("/auth/register?error=CEP%20invalido");
  }

  let address;
  try {
    address = await fetchCep(cep);
  } catch (error) {
    const message = error instanceof Error ? error.message : "CEP invalido";
    redirect(`/auth/register?error=${encodeURIComponent(message)}`);
  }

  try {
    await UserService.registerUser({
      name,
      email,
      password,
      cpf,
      cep,
      street: address.logradouro,
      neighborhood: address.bairro,
      city: address.localidade,
      state: address.uf,
      number: number || null,
      complement: complement || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    redirect(`/auth/register?error=${encodeURIComponent(message)}`);
  }

  redirect("/auth/signin?registered=1");
}
