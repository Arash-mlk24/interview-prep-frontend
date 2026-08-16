export interface Stack {
  id: string;
  name: string;
  name_fa?: string;
  slug: string;
  description: string;
  description_fa?: string;
  icon: string; // Identifier or icon name e.g. "dotnet", "react", "typescript"
}

export interface Category {
  id: string;
  name: string;
  name_fa?: string;
  slug: string;
}

export interface Level {
  id: string;
  name: string;
  name_fa?: string;
  levelOrder: number; // e.g. 1 = Junior, 2 = Mid-Level, 3 = Senior, 4 = Lead/Architect
}

export interface Question {
  id: string;
  stackId: string;
  categoryId: string;
  levelId: string;
  questionTitle: string;
  questionTitle_fa?: string;
  answerContent: string; // Supports Markdown formatting
  answerContent_fa?: string;
}

export interface Concept {
  id: string;
  stackId: string;
  title: string;
  title_fa?: string;
  content: string; // Supports Markdown formatting
  content_fa?: string;
}

// Helper types for grouped views in the presentation layer
export interface GroupedCategoryQuestions {
  category: Category;
  questions: Question[];
}

export interface GroupedByLevelNode {
  level: Level;
  categoryGroups: GroupedCategoryQuestions[];
  totalQuestions: number;
}

export interface GroupedLevelQuestions {
  level: Level;
  questions: Question[];
}

export interface GroupedByCategoryNode {
  category: Category;
  levelGroups: GroupedLevelQuestions[];
  totalQuestions: number;
}
