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
  topicIds?: string[]; // Associated Roadmap Topic IDs for dynamic M:N linkage
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

// ── Roadmap Models ──────────────────────────────────────────────
export interface RoadmapTopic {
  id: string;
  stepId: string;
  slug: string;
  order: number;
  title: string;
  title_fa?: string;
  summary: string;
  summary_fa?: string;
  readingTimeMinutes: number;
  difficulty: "junior" | "mid" | "senior" | "lead";
  content: string; // Comprehensive Markdown tutorial in English
  content_fa?: string; // Comprehensive Markdown tutorial in Persian
}

export interface RoadmapStep {
  id: string;
  roadmapId: string;
  slug: string;
  order: number;
  title: string;
  title_fa?: string;
  description: string;
  description_fa?: string;
  topics: RoadmapTopic[];
}

export interface Roadmap {
  id: string;
  stackId: string;
  slug: string;
  title: string;
  title_fa?: string;
  description: string;
  description_fa?: string;
  icon?: string;
  order: number;
  targetLevel: string; // e.g. "Mid to Senior", "Senior to Architect"
  targetLevel_fa?: string;
  estimatedHours: number;
  steps: RoadmapStep[];
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
