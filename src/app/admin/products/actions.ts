"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ProductService } from "@/services/ProductService";
import { ProductInput } from "@/dtos/ProductDTO";

const parseProductForm = (formData: FormData): ProductInput => {
  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const imageUrlRaw = String(formData.get("imageUrl") ?? "").trim();
  const imageUrlsRaw = String(formData.get("imageUrls") ?? "");
  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const priceValue = Number(formData.get("price"));
  const quantityValue = Number(formData.get("quantity"));

  if (!name || !sku || !category) {
    throw new Error("Preencha nome, SKU e categoria.");
  }

  if (Number.isNaN(priceValue) || Number.isNaN(quantityValue)) {
    throw new Error("Preco e quantidade precisam ser validos.");
  }

  const imageUrls = imageUrlsRaw
    .split(/\r?\n|,/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  const cover = imageUrls[0] ?? (imageUrlRaw.length > 0 ? imageUrlRaw : null);

  return {
    name,
    sku,
    category,
    price: priceValue,
    quantity: quantityValue,
    imageUrl: cover,
    imageUrls,
    description: descriptionRaw.length > 0 ? descriptionRaw : null,
  };
};

export async function createProduct(formData: FormData) {
  const input = parseProductForm(formData);
  await ProductService.createProduct(input);
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const input = parseProductForm(formData);
  await ProductService.updateProduct(id, input);
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("Produto nao encontrado.");
  }

  await ProductService.deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
}
