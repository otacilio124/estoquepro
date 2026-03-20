import db from "@/lib/db";
import { CategoryDTO } from "@/dtos/CategoryDTO";

type CategoryRow = {
  id: number | string;
  name: string;
};

const mapRow = (row: CategoryRow): CategoryDTO => ({
  id: String(row.id),
  name: row.name,
});

export const CategoryRepository = {
  list(): CategoryDTO[] {
    const rows = db
      .prepare("SELECT id, name FROM categories ORDER BY name COLLATE NOCASE")
      .all() as CategoryRow[];
    return rows.map(mapRow);
  },

  create(name: string): string {
    const info = db
      .prepare("INSERT INTO categories (name) VALUES (?)")
      .run(name);
    return String(info.lastInsertRowid);
  },

  delete(id: string) {
    db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  },

  existsByName(name: string): boolean {
    const row = db
      .prepare("SELECT 1 FROM categories WHERE name = ? LIMIT 1")
      .get(name);
    return Boolean(row);
  },

  isInUse(id: string): boolean {
    const row = db
      .prepare(
        `SELECT COUNT(*) as count
         FROM products
         WHERE category = (SELECT name FROM categories WHERE id = ?)`
      )
      .get(id) as { count: number } | undefined;

    return (row?.count ?? 0) > 0;
  },
};
