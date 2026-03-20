import { ProductRepository, ProductFilters } from "@/repositories/ProductRepository";
import { ProductImageRepository } from "@/repositories/ProductImageRepository";
import { ProductDTO, ProductInput } from "@/dtos/ProductDTO";

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type ProductView = ProductDTO & {
  status: StockStatus;
};

export type ProductQuery = ProductFilters & {
  status?: StockStatus;
  page?: number;
  pageSize?: number;
};

export type ProductListResult = {
  items: ProductView[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type StockSummary = {
  inStock: number;
  lowStock: number;
  outOfStock: number;
};

export type CategorySummary = {
  name: string;
  count: number;
  totalValue: number;
};

const LOW_STOCK_THRESHOLD = 5;

const getStatus = (quantity: number): StockStatus => {
  if (quantity <= 0) {
    return "OUT_OF_STOCK";
  }

  if (quantity <= LOW_STOCK_THRESHOLD) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
};

const normalizeImageUrls = (
  imageUrls?: string[] | null,
  fallback?: string | null
) => {
  const normalized = (imageUrls ?? [])
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
  if (normalized.length > 0) {
    return normalized;
  }
  if (fallback && fallback.trim().length > 0) {
    return [fallback.trim()];
  }
  return [];
};

export const ProductService = {
  async listProducts(filters: ProductQuery = {}): Promise<ProductListResult> {
    const products = ProductRepository.list({
      query: filters.query,
      category: filters.category,
    });

    const withStatus = products.map((product) => ({
      ...product,
      status: getStatus(product.quantity),
    }));

    const filtered = filters.status
      ? withStatus.filter((product) => product.status === filters.status)
      : withStatus;

    const total = filtered.length;
    const pageSize = filters.pageSize ?? 8;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const requestedPage = filters.page ?? 1;
    const page = Math.min(Math.max(requestedPage, 1), totalPages);
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  },

  async listCategories(): Promise<string[]> {
    return ProductRepository.listCategories();
  },

  async getDashboardMetrics() {
    const products = ProductRepository.list();
    const totalProducts = products.length;
    const lowStock = products.filter(
      (product) => getStatus(product.quantity) === "LOW_STOCK"
    ).length;
    const outOfStock = products.filter(
      (product) => getStatus(product.quantity) === "OUT_OF_STOCK"
    ).length;
    const inventoryValue = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    return {
      totalProducts,
      lowStock,
      outOfStock,
      inventoryValue,
    };
  },

  async getDashboardOverview() {
    const products = ProductRepository.list();
    const totalProducts = products.length;
    const lowStock = products.filter(
      (product) => getStatus(product.quantity) === "LOW_STOCK"
    ).length;
    const outOfStock = products.filter(
      (product) => getStatus(product.quantity) === "OUT_OF_STOCK"
    ).length;
    const inventoryValue = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    const statusSummary: StockSummary = {
      inStock: products.filter(
        (product) => getStatus(product.quantity) === "IN_STOCK"
      ).length,
      lowStock,
      outOfStock,
    };

    const categoryMap = new Map<string, { count: number; totalValue: number }>();
    products.forEach((product) => {
      const entry = categoryMap.get(product.category) ?? {
        count: 0,
        totalValue: 0,
      };
      entry.count += 1;
      entry.totalValue += product.price * product.quantity;
      categoryMap.set(product.category, entry);
    });

    const categorySummary: CategorySummary[] = Array.from(categoryMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);

    return {
      totalProducts,
      lowStock,
      outOfStock,
      inventoryValue,
      statusSummary,
      categorySummary,
    };
  },

  async getProductById(id: string): Promise<ProductView | null> {
    const product = ProductRepository.getById(id);
    if (!product) {
      return null;
    }

    const imageUrls = normalizeImageUrls(
      ProductImageRepository.listByProductId(id),
      product.imageUrl ?? null
    );

    return {
      ...product,
      status: getStatus(product.quantity),
      imageUrls,
    };
  },

  async createProduct(input: ProductInput) {
    const imageUrls = normalizeImageUrls(input.imageUrls, input.imageUrl ?? null);
    const cover = imageUrls[0] ?? input.imageUrl ?? null;
    const productId = ProductRepository.create({
      ...input,
      imageUrl: cover,
    });
    ProductImageRepository.replaceForProduct(productId, imageUrls);
    return productId;
  },

  async updateProduct(id: string, input: ProductInput) {
    const imageUrls = normalizeImageUrls(input.imageUrls, input.imageUrl ?? null);
    const cover = imageUrls[0] ?? input.imageUrl ?? null;
    ProductRepository.update(id, {
      ...input,
      imageUrl: cover,
    });
    ProductImageRepository.replaceForProduct(id, imageUrls);
  },

  async deleteProduct(id: string) {
    ProductRepository.delete(id);
  },
};
