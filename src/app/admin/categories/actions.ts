"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { CategoryService } from "@/services/CategoryService";

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  try {
    await CategoryService.createCategory(name);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    redirect(`/admin/categories?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/categories?error=Categoria%20nao%20encontrada.");
  }

  try {
    await CategoryService.deleteCategory(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    redirect(`/admin/categories?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/categories");
}
