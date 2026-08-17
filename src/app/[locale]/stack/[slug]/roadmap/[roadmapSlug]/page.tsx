import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  stackRepository,
  roadmapRepository,
} from "../../../../../../repositories";
import { RoadmapOverviewView } from "../../../../../../components/roadmaps/RoadmapOverviewView";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
    roadmapSlug: string;
  }>;
}

export async function generateStaticParams() {
  const roadmaps = roadmapRepository.getAllRoadmaps();
  const stacks = stackRepository.getAllStacks();
  const locales = ["en", "fa"];

  const paramsList: { locale: string; slug: string; roadmapSlug: string }[] = [];

  for (const locale of locales) {
    for (const stack of stacks) {
      const stackRoadmaps = roadmaps.filter((r) => r.stackId === stack.id);
      for (const roadmap of stackRoadmaps) {
        paramsList.push({
          locale,
          slug: stack.slug,
          roadmapSlug: roadmap.slug,
        });
      }
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug, roadmapSlug } = await params;
  const stack = stackRepository.getStackBySlug(slug);

  if (!stack) {
    return {
      title: locale === "fa" ? "فناوری یافت نشد - دِو‌پِرِپ" : "Stack Not Found - DevPrep",
    };
  }

  const roadmap = roadmapRepository.getRoadmapBySlug(stack.id, roadmapSlug);
  if (!roadmap) {
    return {
      title: locale === "fa" ? "نقشه راه یافت نشد - دِو‌پِرِپ" : "Roadmap Not Found - DevPrep",
    };
  }

  const stackName = locale === "fa" ? stack.name_fa || stack.name : stack.name;
  const roadmapTitle = locale === "fa" ? roadmap.title_fa || roadmap.title : roadmap.title;
  const roadmapDesc = locale === "fa" ? roadmap.description_fa || roadmap.description : roadmap.description;

  return {
    title:
      locale === "fa"
        ? `${roadmapTitle} (${stackName}) - دِو‌پِرِپ`
        : `${roadmapTitle} (${stackName}) - DevPrep`,
    description: roadmapDesc,
  };
}

export default async function RoadmapPage({ params }: PageProps) {
  const { locale, slug, roadmapSlug } = await params;

  if (locale !== "en" && locale !== "fa") {
    notFound();
  }

  const stack = stackRepository.getStackBySlug(slug);
  if (!stack) {
    notFound();
  }

  const roadmap = roadmapRepository.getRoadmapBySlug(stack.id, roadmapSlug);
  if (!roadmap) {
    notFound();
  }

  return <RoadmapOverviewView stack={stack} roadmap={roadmap} />;
}
