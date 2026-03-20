import db from "@/lib/db";
import { ProductDTO, ProductInput } from "@/dtos/ProductDTO";

export type ProductFilters = {
  query?: string;
  category?: string;
};

type ProductRow = {
  id: number | string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  description?: string | null;
};

const mapRow = (row: ProductRow): ProductDTO => ({
  id: String(row.id),
  name: row.name,
  sku: row.sku,
  category: row.category,
  price: Number(row.price),
  quantity: Number(row.quantity),
  imageUrl: row.image_url ?? null,
  description: row.description ?? null,
});

export const ProductRepository = {
  list(filters: ProductFilters = {}): ProductDTO[] {
    const conditions: string[] = [];
    const params: Record<string, string> = {};

    if (filters.query) {
      conditions.push(
        "(name LIKE @query OR sku LIKE @query OR category LIKE @query)"
      );
      params.query = `%${filters.query}%`;
    }

    if (filters.category) {
      conditions.push("category = @category");
      params.category = filters.category;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const statement = db.prepare(
      `SELECT id, name, sku, category, price, quantity, image_url, description
       FROM products
       ${whereClause}
       ORDER BY created_at DESC`
    );

    const rows = statement.all(params) as ProductRow[];
    return rows.map(mapRow);
  },

  getById(id: string): ProductDTO | null {
    const row = db
      .prepare(
        "SELECT id, name, sku, category, price, quantity, image_url, description FROM products WHERE id = ?"
      )
      .get(id) as ProductRow | undefined;

    return row ? mapRow(row) : null;
  },

  create(input: ProductInput): string {
    const values = {
      name: input.name,
      sku: input.sku,
      category: input.category,
      price: input.price,
      quantity: input.quantity,
      imageUrl: input.imageUrl ?? null,
      description: input.description ?? null,
    };
    const info = db
      .prepare(
        `INSERT INTO products (name, sku, category, price, quantity, image_url, description)
         VALUES (@name, @sku, @category, @price, @quantity, @imageUrl, @description)`
      )
      .run(values);

    return String(info.lastInsertRowid);
  },

  update(id: string, input: ProductInput) {
    const values = {
      name: input.name,
      sku: input.sku,
      category: input.category,
      price: input.price,
      quantity: input.quantity,
      imageUrl: input.imageUrl ?? null,
      description: input.description ?? null,
    };
    db.prepare(
      `UPDATE products
       SET name = @name,
      	    sku = @sku,
           category = @category,
           price = @price,
           quantity = @quantity,
           image_url = @imageUrl,
           description = @description,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = @id`
    ).run({ ...values, id });
  },

  delete(id: string) {
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
  },

  listCategories(): string[] {
    const rows = db
      .prepare("SELECT name FROM categories ORDER BY name COLLATE NOCASE")
      .all() as { name: string }[];

    return rows.map((row) => row.name);
  },
};
