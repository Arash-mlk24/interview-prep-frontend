import { Roadmap, RoadmapStep, RoadmapTopic, Question } from "../data/models";
import { allRoadmaps } from "../data/roadmaps";
import { allQuestions } from "../data/questions";

export const roadmapRepository = {
  getAllRoadmaps(): Roadmap[] {
    return [...allRoadmaps];
  },

  getRoadmapsByStackId(stackId: string): Roadmap[] {
    return allRoadmaps
      .filter((r) => r.stackId === stackId)
      .sort((a, b) => a.order - b.order);
  },

  getRoadmapBySlug(stackId: string, slug: string): Roadmap | undefined {
    return allRoadmaps.find((r) => r.stackId === stackId && r.slug === slug);
  },

  getRoadmapById(id: string): Roadmap | undefined {
    return allRoadmaps.find((r) => r.id === id);
  },

  getStepBySlug(
    roadmapSlug: string,
    stepSlug: string
  ): { roadmap: Roadmap; step: RoadmapStep } | undefined {
    for (const roadmap of allRoadmaps) {
      if (roadmap.slug === roadmapSlug) {
        const step = roadmap.steps.find((s) => s.slug === stepSlug);
        if (step) {
          return { roadmap, step };
        }
      }
    }
    return undefined;
  },

  getTopicBySlug(
    roadmapSlug: string,
    topicSlug: string
  ): { roadmap: Roadmap; step: RoadmapStep; topic: RoadmapTopic } | undefined {
    for (const roadmap of allRoadmaps) {
      if (roadmap.slug === roadmapSlug) {
        for (const step of roadmap.steps) {
          const topic = step.topics.find((t) => t.slug === topicSlug);
          if (topic) {
            return { roadmap, step, topic };
          }
        }
      }
    }
    return undefined;
  },

  /**
   * Retrieves all interview questions linked to a specific topic ID dynamically.
   */
  getQuestionsByTopicId(topicId: string): Question[] {
    return allQuestions.filter(
      (q) => q.topicIds && q.topicIds.includes(topicId)
    );
  },

  getQuestionCountForTopic(topicId: string): number {
    return this.getQuestionsByTopicId(topicId).length;
  },

  getTopicCountForStack(stackId: string): number {
    const roadmaps = this.getRoadmapsByStackId(stackId);
    let count = 0;
    for (const r of roadmaps) {
      for (const s of r.steps) {
        count += s.topics.length;
      }
    }
    return count;
  },

  /**
   * Returns previous and next topic navigation metadata within the same roadmap.
   */
  getAdjacentTopics(
    roadmapSlug: string,
    topicId: string
  ): {
    prev?: { title: string; title_fa?: string; slug: string };
    next?: { title: string; title_fa?: string; slug: string };
  } {
    const roadmap = allRoadmaps.find((r) => r.slug === roadmapSlug);
    if (!roadmap) return {};

    const flatTopics: RoadmapTopic[] = [];
    for (const step of roadmap.steps) {
      for (const topic of step.topics) {
        flatTopics.push(topic);
      }
    }

    const currentIndex = flatTopics.findIndex((t) => t.id === topicId);
    if (currentIndex === -1) return {};

    const prevTopic = currentIndex > 0 ? flatTopics[currentIndex - 1] : undefined;
    const nextTopic =
      currentIndex < flatTopics.length - 1 ? flatTopics[currentIndex + 1] : undefined;

    return {
      prev: prevTopic
        ? { title: prevTopic.title, title_fa: prevTopic.title_fa, slug: prevTopic.slug }
        : undefined,
      next: nextTopic
        ? { title: nextTopic.title, title_fa: nextTopic.title_fa, slug: nextTopic.slug }
        : undefined,
    };
  },
};
