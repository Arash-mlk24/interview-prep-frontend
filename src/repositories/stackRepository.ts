import { Stack } from "../data/models";
import { stacks } from "../data/stacks";
import { allQuestions } from "../data/questions";
import { allConcepts } from "../data/concepts";

export const stackRepository = {
  getAllStacks(): Stack[] {
    return [...stacks];
  },

  getStackBySlug(slug: string): Stack | undefined {
    return stacks.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
  },

  getStackById(id: string): Stack | undefined {
    return stacks.find((s) => s.id === id);
  },

  getStackStats(stackId: string): {
    questionCount: number;
    conceptCount: number;
    categoryCount: number;
  } {
    const questions = allQuestions.filter((q) => q.stackId === stackId);
    const concepts = allConcepts.filter((c) => c.stackId === stackId);
    const categoryIds = new Set(questions.map((q) => q.categoryId));

    return {
      questionCount: questions.length,
      conceptCount: concepts.length,
      categoryCount: categoryIds.size,
    };
  },
};
