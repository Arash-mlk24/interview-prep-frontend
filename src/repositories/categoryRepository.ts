import { Category } from "../data/models";
import { categories } from "../data/categories";
import { allQuestions } from "../data/questions";

export const categoryRepository = {
  getAllCategories(): Category[] {
    return [...categories];
  },

  getCategoryById(id: string): Category | undefined {
    return categories.find((c) => c.id === id);
  },

  getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((c) => c.slug === slug);
  },

  getCategoriesForStack(stackId: string): Category[] {
    const stackQuestions = allQuestions.filter((q) => q.stackId === stackId);
    const categoryIds = new Set(stackQuestions.map((q) => q.categoryId));
    return categories.filter((c) => categoryIds.has(c.id));
  },
};
