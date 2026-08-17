import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  stackRepository,
  categoryRepository,
  levelRepository,
  roadmapRepository,
} from "../../../../../../../../repositories";
import { TopicPageView } from "../../../../../../../../components/roadmaps/TopicPageView";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
    roadmapSlug: string;
    topicSlug: string;
  }>;
}

export async function generateStaticParams() {
  const roadmaps = roadmapRepository.getAllRoadmaps();
  const stacks = stackRepository.getAllStacks();
  const locales = ["en", "fa"];

  const paramsList: {
    locale: string;
    slug: string;
    roadmapSlug: string;
    topicSlug: string;
  }[] = [];

  for (const locale of locales) {
    for (const stack of stacks) {
      const stackRoadmaps = roadmaps.filter((r) => r.stackId === stack.id);
      for (const roadmap of stackRoadmaps) {
        for (const step of roadmap.steps) {
          for (const topic of step.topics) {
            paramsList.push({
              locale,
              slug: stack.slug,
              roadmapSlug: roadmap.slug,
              topicSlug: topic.slug,
            });
          }
        }
      }
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug, roadmapSlug, topicSlug } = await params;
  const stack = stackRepository.getStackBySlug(slug);

  if (!stack) {
    return {
      title: locale === "fa" ? "فناوری یافت نشد - دِو‌پِرِپ" : "Stack Not Found - DevPrep",
    };
  }

  const topicData = roadmapRepository.getTopicBySlug(roadmapSlug, topicSlug);
  if (!topicData) {
    return {
      title: locale === "fa" ? "مبحث آموزشی یافت نشد - دِو‌پِرِپ" : "Topic Not Found - DevPrep",
    };
  }

  const { topic, roadmap } = topicData;
  const topicTitle = locale === "fa" ? topic.title_fa || topic.title : topic.title;
  const roadmapTitle = locale === "fa" ? roadmap.title_fa || roadmap.title : roadmap.title;
  const topicSummary = locale === "fa" ? topic.summary_fa || topic.summary : topic.summary;

  return {
    title:
      locale === "fa"
        ? `${topicTitle} - ${roadmapTitle} - دِو‌پِرِپ`
        : `${topicTitle} - ${roadmapTitle} - DevPrep`,
    description: topicSummary,
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { locale, slug, roadmapSlug, topicSlug } = await params;

  if (locale !== "en" && locale !== "fa") {
    notFound();
  }

  const stack = stackRepository.getStackBySlug(slug);
  if (!stack) {
    notFound();
  }

  const topicData = roadmapRepository.getTopicBySlug(roadmapSlug, topicSlug);
  if (!topicData) {
    notFound();
  }

  const { roadmap, step, topic } = topicData;
  const questions = roadmapRepository.getQuestionsByTopicId(topic.id);
  const categories = categoryRepository.getAllCategories();
  const levels = levelRepository.getAllLevels();
  const adjacentTopics = roadmapRepository.getAdjacentTopics(roadmap.slug, topic.id);

  return (
    <TopicPageView
      stack={stack}
      roadmap={roadmap}
      step={step}
      topic={topic}
      questions={questions}
      categories={categories}
      levels={levels}
      adjacentTopics={adjacentTopics}
    />
  );
}
