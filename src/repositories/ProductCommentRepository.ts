import db from "@/lib/db";

export type ProductCommentRecord = {
  id: string;
  userName: string;
  comment: string;
  createdAt: string;
};

export const ProductCommentRepository = {
  listByProductId(productId: string): ProductCommentRecord[] {
    const rows = db
      .prepare(
        `SELECT id, user_name, comment, created_at
         FROM product_comments
         WHERE product_id = ?
         ORDER BY created_at DESC`
      )
      .all(productId) as {
      id: number;
      user_name: string;
      comment: string;
      created_at: string;
    }[];

    return rows.map((row) => ({
      id: String(row.id),
      userName: row.user_name,
      comment: row.comment,
      createdAt: row.created_at,
    }));
  },

  create(input: {
    productId: string;
    userId: string;
    userName: string;
    comment: string;
  }): string {
    const info = db
      .prepare(
        `INSERT INTO product_comments (product_id, user_id, user_name, comment)
         VALUES (@product_id, @user_id, @user_name, @comment)`
      )
      .run({
        product_id: Number(input.productId),
        user_id: Number(input.userId),
        user_name: input.userName,
        comment: input.comment,
      });

    return String(info.lastInsertRowid);
  },
};
