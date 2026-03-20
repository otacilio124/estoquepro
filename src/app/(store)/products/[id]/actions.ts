"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { CommentService } from "@/services/CommentService";

export async function createProductComment(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const comment = String(formData.get("comment") ?? "");

  if (!productId) {
    redirect("/products");
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.name) {
    redirect(`/auth/signin?callbackUrl=/products/${productId}`);
  }

  try {
    CommentService.createComment({
      productId,
      userId: session.user.id,
      userName: session.user.name,
      comment,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro";
    redirect(`/products/${productId}?error=${encodeURIComponent(message)}#comments`);
  }

  revalidatePath(`/products/${productId}`);
  redirect(`/products/${productId}#comments`);
}
