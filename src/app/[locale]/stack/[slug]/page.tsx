import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  stackRepository,
  categoryRepository,
  questionRepository,
  conceptRepository,
  roadmapRepository,
} from "../../../../repositories";
import { StackDashboardView } from "../../../../components/stacks/StackDashboardView";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const stacks = stackRepository.getAllStacks();
  const locales = ["en", "fa"];

  const paramsList: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const stack of stacks) {
      paramsList.push({
        locale,
        slug: stack.slug,
      });
    }
  }
  return paramsList;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const stack = stackRepository.getStackBySlug(slug);

  if (!stack) {
    return {
      title: locale === "fa" ? "فناوری یافت نشد - دِو‌پِرِپ" : "Stack Not Found - DevPrep",
    };
  }

  const stackName = locale === "fa" ? stack.name_fa || stack.name : stack.name;
  const stackDesc =
    locale === "fa" ? stack.description_fa || stack.description : stack.description;

  return {
    title:
      locale === "fa"
        ? `سؤالات مصاحبه و مفاهیم ${stackName} - دِو‌پِرِپ`
        : `${stackName} Interview Questions & Concepts - DevPrep`,
    description: stackDesc,
  };
}

export default async function StackPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (locale !== "en" && locale !== "fa") {
    notFound();
  }

  const stack = stackRepository.getStackBySlug(slug);

  if (!stack) {
    notFound();
  }

  const stats = stackRepository.getStackStats(stack.id);
  const categories = categoryRepository.getCategoriesForStack(stack.id);
  const byLevelData = questionRepository.getQuestionsGroupedByLevelAndCategory(stack.id);
  const byCategoryData = questionRepository.getQuestionsGroupedByCategoryAndLevel(stack.id);
  const concepts = conceptRepository.getConceptsByStackId(stack.id);
  const roadmaps = roadmapRepository.getRoadmapsByStackId(stack.id);

  return (
    <StackDashboardView
      stack={stack}
      stats={stats}
      categories={categories}
      byLevelData={byLevelData}
      byCategoryData={byCategoryData}
      concepts={concepts}
      roadmaps={roadmaps}
    />
  );
}
