export type ProductDTO = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  description?: string | null;
  imageUrls?: string[];
};

export type ProductInput = Omit<ProductDTO, "id">;
