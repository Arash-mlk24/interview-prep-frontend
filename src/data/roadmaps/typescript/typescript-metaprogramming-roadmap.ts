import { Roadmap } from "../../models";
import { conditionalTypesInferTopic } from "./topics/conditional-types-infer-topic";
import { brandTypesVarianceTopic } from "./topics/brand-types-variance-topic";
import { compilerAstTransformsTopic } from "./topics/compiler-ast-transforms-topic";

export const typescriptMetaprogrammingRoadmap: Roadmap = {
  id: "roadmap-typescript-metaprogramming",
  stackId: "typescript",
  slug: "advanced-metaprogramming",
  title: "Type-Level Metaprogramming & Advanced Type Systems",
  title_fa: "برنامه‌نویسی در سطح تایپ و سیستم تایپ پیشرفته در TypeScript",
  description: "Master conditional types, distributive laws, type inference with infer, branded types for nominal domain modeling, function type variance, and the TypeScript Compiler API.",
  description_fa: "تسلط بر تایپ‌های شرطی، قوانین توزیع‌پذیری، استخراج نوع با infer، ساخت تایپ‌های نامی، واریانس توابع و معماری کامپایلر تایپ‌اسکریپت با AST Transforms.",
  icon: "Terminal",
  order: 1,
  targetLevel: "Senior to Lead",
  targetLevel_fa: "سطح سینیور تا لید",
  estimatedHours: 55,
  steps: [
    {
      id: "step-ts-type-level",
      roadmapId: "roadmap-typescript-metaprogramming",
      slug: "conditional-types-infer",
      order: 1,
      title: "Conditional Types & Type Inference",
      title_fa: "تایپ‌های شرطی و استنتاج نوع (infer)",
      description: "Type branching, union distribution, tuple boxing, and recursive type unwrapping with infer.",
      description_fa: "انشعابات در زمان کامپایل، قوانین توزیع یونیون‌ها و حل بازگشتی تایپ‌ها با کلیدواژه infer.",
      topics: [conditionalTypesInferTopic],
    },
    {
      id: "step-ts-invariants-soundness",
      roadmapId: "roadmap-typescript-metaprogramming",
      slug: "branded-types-variance",
      order: 2,
      title: "Nominal Typing & Type Variance",
      title_fa: "تایپ‌های نامی و قواعد واریانس توابع",
      description: "Enforcing zero-overhead nominal typing with unique symbol brands and covariant/contravariant function subtyping.",
      description_fa: "شبیه‌سازی سیستم تایپ اسمی با Branded Types و قوانین واریانس پارامترها و خروجی توابع.",
      topics: [brandTypesVarianceTopic],
    },
    {
      id: "step-ts-compiler-transforms",
      roadmapId: "roadmap-typescript-metaprogramming",
      slug: "compiler-ast-transforms",
      order: 3,
      title: "Compiler API, AST Visitors & Code Generation",
      title_fa: "معماری کامپایلر، درخت نحو (AST) و تولید کد سفارشی",
      description: "Scanner, Parser, Binder, TypeChecker API, AST traversal with visitor patterns, and custom transform plugins.",
      description_fa: "مراحل ۵‌گانه کامپایلر، پیمایش درخت نحو با الگوی Visitor و ساخت پلاگین‌های ترنسفورمر کد در زمان بیلد.",
      topics: [compilerAstTransformsTopic],
    },
  ],
};
