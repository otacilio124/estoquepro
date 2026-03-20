"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CarouselService } from "@/services/CarouselService";

export async function createCarouselSlide(formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const image_url = formData.get("image_url") as string;
  const link_url = formData.get("link_url") as string;
  const link_text = formData.get("link_text") as string;
  const order_index = parseInt(formData.get("order_index") as string) || 0;

  if (!title || !image_url) {
    throw new Error("Titulo e Imagem sao obrigatorios.");
  }

  await CarouselService.createSlide({
    title,
    subtitle: subtitle || undefined,
    image_url,
    link_url: link_url || undefined,
    link_text: link_text || undefined,
    order_index,
    is_active: 1,
  });

  revalidatePath("/admin/carousel");
  revalidatePath("/");
  redirect("/admin/carousel");
}

export async function updateCarouselSlide(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const image_url = formData.get("image_url") as string;
  const link_url = formData.get("link_url") as string;
  const link_text = formData.get("link_text") as string;
  const order_index = parseInt(formData.get("order_index") as string) || 0;
  const is_active = formData.get("is_active") === "on" ? 1 : 0;

  if (!id || !title || !image_url) {
    throw new Error("Dados invalidos.");
  }

  await CarouselService.updateSlide(id, {
    title,
    subtitle: subtitle || undefined,
    image_url,
    link_url: link_url || undefined,
    link_text: link_text || undefined,
    order_index,
    is_active,
  });

  revalidatePath("/admin/carousel");
  revalidatePath("/");
  redirect("/admin/carousel");
}

export async function toggleCarouselSlideActive(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  if (!id) return;

  await CarouselService.toggleActive(id);
  revalidatePath("/admin/carousel");
  revalidatePath("/");
}

export async function deleteCarouselSlide(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  if (!id) return;

  await CarouselService.deleteSlide(id);
  revalidatePath("/admin/carousel");
  revalidatePath("/");
}
