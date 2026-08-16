import {
  Question,
  GroupedByLevelNode,
  GroupedByCategoryNode,
  GroupedCategoryQuestions,
  GroupedLevelQuestions,
} from "../data/models";
import { allQuestions } from "../data/questions";
import { levelRepository } from "./levelRepository";
import { categoryRepository } from "./categoryRepository";

export const questionRepository = {
  getAllQuestions(): Question[] {
    return [...allQuestions];
  },

  getQuestionsByStackId(stackId: string): Question[] {
    return allQuestions.filter((q) => q.stackId === stackId);
  },

  getQuestionById(id: string): Question | undefined {
    return allQuestions.find((q) => q.id === id);
  },

  /**
   * Grouping Strategy A:
   * Level (Junior, Mid, Senior) -> Category (C# Basics, EF Core...) -> Questions
   */
  getQuestionsGroupedByLevelAndCategory(stackId: string): GroupedByLevelNode[] {
    const stackQuestions = this.getQuestionsByStackId(stackId);
    const sortedLevels = levelRepository.getSortedLevels();
    const allCategories = categoryRepository.getAllCategories();

    const result: GroupedByLevelNode[] = [];

    for (const level of sortedLevels) {
      const levelQuestions = stackQuestions.filter((q) => q.levelId === level.id);

      if (levelQuestions.length === 0) continue;

      const categoryMap = new Map<string, Question[]>();

      for (const question of levelQuestions) {
        const list = categoryMap.get(question.categoryId) || [];
        list.push(question);
        categoryMap.set(question.categoryId, list);
      }

      const categoryGroups: GroupedCategoryQuestions[] = [];

      for (const category of allCategories) {
        const qList = categoryMap.get(category.id);
        if (qList && qList.length > 0) {
          categoryGroups.push({
            category,
            questions: qList,
          });
        }
      }

      // Also capture any category IDs that might not be in allCategories (fallback safety)
      for (const [catId, qList] of categoryMap.entries()) {
        if (!allCategories.some((c) => c.id === catId)) {
          categoryGroups.push({
            category: { id: catId, name: catId, slug: catId },
            questions: qList,
          });
        }
      }

      result.push({
        level,
        categoryGroups,
        totalQuestions: levelQuestions.length,
      });
    }

    return result;
  },

  /**
   * Grouping Strategy B:
   * Category (C# Basics, EF Core...) -> Level (Junior, Mid, Senior) -> Questions
   */
  getQuestionsGroupedByCategoryAndLevel(stackId: string): GroupedByCategoryNode[] {
    const stackQuestions = this.getQuestionsByStackId(stackId);
    const allCategories = categoryRepository.getAllCategories();
    const sortedLevels = levelRepository.getSortedLevels();

    const result: GroupedByCategoryNode[] = [];

    for (const category of allCategories) {
      const catQuestions = stackQuestions.filter((q) => q.categoryId === category.id);

      if (catQuestions.length === 0) continue;

      const levelMap = new Map<string, Question[]>();

      for (const question of catQuestions) {
        const list = levelMap.get(question.levelId) || [];
        list.push(question);
        levelMap.set(question.levelId, list);
      }

      const levelGroups: GroupedLevelQuestions[] = [];

      for (const level of sortedLevels) {
        const qList = levelMap.get(level.id);
        if (qList && qList.length > 0) {
          levelGroups.push({
            level,
            questions: qList,
          });
        }
      }

      // Fallback for unlisted levels
      for (const [lvlId, qList] of levelMap.entries()) {
        if (!sortedLevels.some((l) => l.id === lvlId)) {
          levelGroups.push({
            level: { id: lvlId, name: lvlId, levelOrder: 99 },
            questions: qList,
          });
        }
      }

      result.push({
        category,
        levelGroups,
        totalQuestions: catQuestions.length,
      });
    }

    // Safety check for questions with unrecognized category ID
    const unlistedCategories = new Set(
      stackQuestions
        .filter((q) => !allCategories.some((c) => c.id === q.categoryId))
        .map((q) => q.categoryId)
    );

    for (const catId of unlistedCategories) {
      const catQuestions = stackQuestions.filter((q) => q.categoryId === catId);
      const levelGroups: GroupedLevelQuestions[] = sortedLevels
        .map((level) => ({
          level,
          questions: catQuestions.filter((q) => q.levelId === level.id),
        }))
        .filter((g) => g.questions.length > 0);

      result.push({
        category: { id: catId, name: catId, slug: catId },
        levelGroups,
        totalQuestions: catQuestions.length,
      });
    }

    return result;
  },
};
