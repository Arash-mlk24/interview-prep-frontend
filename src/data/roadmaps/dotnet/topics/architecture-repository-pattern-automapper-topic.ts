import { RoadmapTopic } from "../../../models";

export const architectureRepositoryPatternAutomapperTopic: RoadmapTopic = {
  id: "topic-dotnet-architecture-repository-pattern-automapper",
  stepId: "step-mid-architecture-cqrs",
  slug: "architecture-repository-pattern-automapper",
  order: 3,
  title: "Repository & Unit of Work Patterns vs DTO Mapping",
  title_fa: "الگوهای Repository و Unit of Work در مقایسه با روش‌های مپینگ DTO",
  summary:
    "Evaluate Generic Repository and Unit of Work trade-offs over EF Core, and compare manual DTO mapping vs Mapster vs AutoMapper for performance and maintainability.",
  summary_fa:
    "بررسی مزایا و معایب الگوی Repository روی EF Core، و مقایسه روش‌های نگاشت شیء به شیء (DTO Mapping) شامل مپینگ دستی، Mapster و AutoMapper.",
  readingTimeMinutes: 20,
  difficulty: "mid",
  content: `## 1. Repository & Unit of Work on top of EF Core: Pros & Cons

Since \`DbContext\` is already an implementation of the **Unit of Work** pattern and \`DbSet<T>\` is already a **Repository**, adding another generic repository abstraction can lead to leaks and anti-patterns if done poorly.

- **Pros**: Abstracts persistence details, facilitates test mocking with memory lists.
- **Cons**: Can obscure EF Core query capabilities, prevents projection optimizations if returning \`IEnumerable<T>\`.

\`\`\`csharp
// Recommended: Specific Domain Repositories (NOT Generic CRUD)
public interface IOrderRepository
{
    Task<Order?> GetWithItemsAsync(Guid orderId, CancellationToken ct);
    Task AddAsync(Order order, CancellationToken ct);
}
\`\`\`

---

## 2. Object Mapping: Manual vs Mapster vs AutoMapper

| Approach | Performance | Safety / Diagnostics | Maintainability |
| :--- | :--- | :--- | :--- |
| **Manual Mapping (Extension Methods)** | ⚡ Fastest (zero allocation overhead) | 🛡️ Compile-time safety | Requires explicit code per DTO |
| **Mapster** | ⚡ High (compiled expression trees) | 🛡️ Good compile-time tools | Very clean and fast |
| **AutoMapper** | 🐢 Slower (runtime reflection / caching) | ⚠️ Runtime mapping errors | High automation |

\`\`\`csharp
// High-Performance Manual Mapping:
public static class UserMappingExtensions
{
    public static UserDto ToDto(this User user) => new(
        user.Id,
        user.FullName,
        user.Email
    );
}
\`\`\``,
  content_fa: `## ۱. الگوهای Repository و Unit of Work در کنار EF Core

از آنجا که خود \`DbContext\` در واقع پیاده‌سازی Unit of Work و \`DbSet\` یک Repository است، استفاده از Generic Repository غیرهوشمند می‌تواند مانع از استفاده از امکانات پیشرفته کوئری‌نویسی EF Core شود. رویکرد استاندارد، ایجاد ریپازیتوری‌های اختصاصی دامنه است.

---

## ۲. مقایسه روش‌های مپینگ DTO

- **مپینگ دستی با Extension Methods**: بالاترین کارایی و اعتبارسنجی در زمان کامپایل بدون هزینه اضافی حافظه.
- **کتابخانه Mapster**: سرعت فوق‌العاده بالا بر پایه کامپایل Expression Treeها.
- **کتابخانه AutoMapper**: امکانات خودکار اما با سربار Reflection در زمان اجرا.`,
};
