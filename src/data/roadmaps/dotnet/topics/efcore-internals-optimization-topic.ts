import { RoadmapTopic } from "../../../models";

export const efcoreInternalsOptimizationTopic: RoadmapTopic = {
  id: "topic-dotnet-efcore-internals-optimization",
  stepId: "step-db-efcore-concurrency",
  slug: "efcore-internals-change-tracker-optimization",
  order: 1,
  title: "EF Core 8/9 Internals: Change Tracker, Compiled Queries, Split Queries & Pooled DbContext",
  title_fa: "معماری داخلی EF Core 8/9: ردیابی تغییرات (Change Tracker)، کوئری‌های کامپایل‌شده، Split Queries و استخر DbContext",
  summary:
    "Explore EF Core performance internals: Snapshot vs Proxy change tracking, avoiding N+1 via AsSplitQuery, zero-allocation Compiled Queries, DbContext Pooling, and bulk operations with ExecuteUpdateAsync.",
  summary_fa:
    "بررسی عمیق معماری EF Core: نحوه عملکرد ردیاب تغییرات (Change Tracker)، حذف معضل انفجار داده با AsSplitQuery، کوئری‌های کامپایل‌شده سریع، استخر DbContext و عملیات دسته‌ای مستقیم با ExecuteUpdateAsync.",
  readingTimeMinutes: 30,
  difficulty: "senior",
  content: `## EF Core 8/9 Performance Internals & Optimization

*(Comprehensive master tutorial will be authored here following the 5-step deep research process.)*`,
  content_fa: `## کالبدشکافی عملکرد داخلی و بهینه‌سازی‌های پیشرفته EF Core 8/9

*(آموزش جامع و تخصصی این بخش طبق فرآیند ۵ مرحله‌ای پژوهش عمیق تدوین خواهد شد.)*`,
};
