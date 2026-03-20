import { CategoryRepository } from "@/repositories/CategoryRepository";

export const CategoryService = {
  async listCategories() {
    return CategoryRepository.list();
  },

  async createCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error("Nome da categoria obrigatorio.");
    }

    if (CategoryRepository.existsByName(trimmed)) {
      throw new Error("Categoria ja existe.");
    }

    return CategoryRepository.create(trimmed);
  },

  async deleteCategory(id: string) {
    if (CategoryRepository.isInUse(id)) {
      throw new Error("Categoria em uso por produtos.");
    }

    CategoryRepository.delete(id);
  },
};
