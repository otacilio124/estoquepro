import db from "@/lib/db";

export type CarouselSlideItem = {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  link_text: string | null;
  is_active: number;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type CarouselSlideInput = {
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  link_text?: string;
  is_active?: number;
  order_index?: number;
};

export const CarouselRepository = {
  list(onlyActive = false): CarouselSlideItem[] {
    let query = "SELECT * FROM carousel_slides";
    if (onlyActive) {
      query += " WHERE is_active = 1";
    }
    query += " ORDER BY order_index ASC, id ASC";

    return db.prepare(query).all() as CarouselSlideItem[];
  },

  getById(id: number): CarouselSlideItem | undefined {
    return db
      .prepare("SELECT * FROM carousel_slides WHERE id = ?")
      .get(id) as CarouselSlideItem | undefined;
  },

  create(data: CarouselSlideInput): number {
    const info = db
      .prepare(
        `INSERT INTO carousel_slides (title, subtitle, image_url, link_url, link_text, is_active, order_index)
         VALUES (@title, @subtitle, @image_url, @link_url, @link_text, @is_active, @order_index)`
      )
      .run({
        title: data.title,
        subtitle: data.subtitle ?? null,
        image_url: data.image_url,
        link_url: data.link_url ?? null,
        link_text: data.link_text ?? null,
        is_active: data.is_active ?? 1,
        order_index: data.order_index ?? 0,
      });
    return info.lastInsertRowid as number;
  },

  update(id: number, data: CarouselSlideInput): void {
    db.prepare(
      `UPDATE carousel_slides
       SET title = @title,
           subtitle = @subtitle,
           image_url = @image_url,
           link_url = @link_url,
           link_text = @link_text,
           is_active = @is_active,
           order_index = @order_index,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = @id`
    ).run({
      id,
      title: data.title,
      subtitle: data.subtitle ?? null,
      image_url: data.image_url,
      link_url: data.link_url ?? null,
      link_text: data.link_text ?? null,
      is_active: data.is_active ?? 1,
      order_index: data.order_index ?? 0,
    });
  },

  toggleActive(id: number): void {
    db.prepare(
      `UPDATE carousel_slides
       SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(id);
  },

  delete(id: number): void {
    db.prepare("DELETE FROM carousel_slides WHERE id = ?").run(id);
  },
};
