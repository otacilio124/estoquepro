import db from "@/lib/db";

export type ProductImageRecord = {
  id: string;
  url: string;
};

export const ProductImageRepository = {
  listByProductId(productId: string): string[] {
    const rows = db
      .prepare(
        `SELECT id, url
         FROM product_images
         WHERE product_id = ?
         ORDER BY id ASC`
      )
      .all(productId) as { id: number; url: string }[];

    return rows.map((row) => row.url);
  },

  replaceForProduct(productId: string, urls: string[]) {
    const remove = db.prepare(
      "DELETE FROM product_images WHERE product_id = ?"
    );
    const insert = db.prepare(
      "INSERT INTO product_images (product_id, url) VALUES (@product_id, @url)"
    );

    const transaction = db.transaction((values: string[]) => {
      remove.run(productId);
      values.forEach((url) =>
        insert.run({ product_id: Number(productId), url })
      );
    });

    transaction(urls);
  },
};
