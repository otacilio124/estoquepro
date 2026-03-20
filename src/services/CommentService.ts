import { ProductCommentRepository } from "@/repositories/ProductCommentRepository";

const MIN_LENGTH = 3;
const MAX_LENGTH = 600;

export const CommentService = {
  listByProductId(productId: string) {
    return ProductCommentRepository.listByProductId(productId);
  },

  createComment(input: {
    productId: string;
    userId: string;
    userName: string;
    comment: string;
  }) {
    const content = input.comment.trim();
    if (content.length < MIN_LENGTH) {
      throw new Error("Comentario muito curto.");
    }
    if (content.length > MAX_LENGTH) {
      throw new Error("Comentario muito longo.");
    }

    return ProductCommentRepository.create({
      ...input,
      comment: content,
    });
  },
};
