import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stackRepository, categoryRepository } from "../../repositories";
import { HomeView } from "../../components/home/HomeView";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isFa = locale === "fa";

  return {
    title: isFa
      ? "دِو‌پِرِپ — آمادگی مصاحبه‌های مهندسی و مرور مفاهیم عمیق"
      : "DevPrep - Professional Interview Preparation & Concepts",
    description: isFa
      ? "مجموعه سؤالات تخصصی مصاحبه فنی، پاسخ‌های تحلیلی و مفاهیم عمیق معماری در دات‌نت، ری‌اکت، تایپ‌اسکریپت و ..."
      : "Curated technical interview questions, answers, and deep-dive engineering concepts across .NET, React, TypeScript, and more.",
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== "en" && locale !== "fa") {
    notFound();
  }

  const stacks = stackRepository.getAllStacks();

  const stacksData = stacks.map((stack) => ({
    stack,
    stats: stackRepository.getStackStats(stack.id),
    categories: categoryRepository.getCategoriesForStack(stack.id),
  }));

  const totalQuestions = stacksData.reduce((acc, item) => acc + item.stats.questionCount, 0);
  const totalConcepts = stacksData.reduce((acc, item) => acc + item.stats.conceptCount, 0);

  return (
    <HomeView
      stacksData={stacksData}
      totalQuestions={totalQuestions}
      totalConcepts={totalConcepts}
    />
  );
}
