import { RoadmapTopic } from "../../../models";

export const efcoreQueryingRelationshipsLoadingTopic: RoadmapTopic = {
  id: "topic-dotnet-efcore-querying-relationships-loading",
  stepId: "step-mid-efcore-data",
  slug: "efcore-querying-relationships-loading",
  order: 2,
  title: "Entity Relationships, Eager vs Lazy Loading & Query Projections",
  title_fa: "روابط بین موجودیت‌ها، بارگذاری حریصانه (Eager Loading) و Projectionها",
  summary:
    "Master 1:1, 1:N, and N:M relationships, avoid N+1 query traps, compare Eager/Explicit/Lazy loading, and optimize read queries with AsNoTracking and Select projections.",
  summary_fa:
    "تسلط بر روابط یک‌به‌یک، یک‌به‌چند و چندبه‌چند، جلوگیری از خطای ویرانگر N+1 Query، مقایسه روش‌های بارگذاری داده و بهینه‌سازی خواندن با AsNoTracking و Select Projections.",
  readingTimeMinutes: 24,
  difficulty: "mid",
  content: `## 1. Relationships in EF Core

- **One-to-Many**: An Author has many Books.
- **Many-to-Many**: In EF Core 5+, configured implicitly or with explicit join entities.
- **One-to-One**: Configured with explicit principal/dependent foreign key.

\`\`\`csharp
// One-to-Many Relationship Fluent API
builder.HasMany(a => a.Books)
       .WithOne(b => b.Author)
       .HasForeignKey(b => b.AuthorId)
       .OnDelete(DeleteBehavior.Cascade);
\`\`\`

---

## 2. Eager Loading vs Lazy Loading & The N+1 Problem

The **N+1 Problem** occurs when an application executes 1 initial query to fetch N parent records, then N additional queries inside a loop to fetch related child records.

\`\`\`csharp
// EAGER LOADING: Single SQL JOIN query
var orders = await context.Orders
    .Include(o => o.Items)
        .ThenInclude(i => i.Product)
    .ToListAsync();
\`\`\`

---

## 3. High-Performance Projections with AsNoTracking

Avoid loading full entity graphs when only read-only DTOs are needed:

\`\`\`csharp
// Zero tracking overhead, generates optimal SQL SELECT with ONLY needed columns:
var userSummaries = await context.Users
    .AsNoTracking()
    .Where(u => u.IsActive)
    .Select(u => new UserSummaryDto(u.Id, u.FullName, u.Email, u.Orders.Count))
    .ToListAsync();
\`\`\``,
  content_fa: `## ۱. انواع روابط بین موجودیت‌ها در EF Core

- **یک‌به‌چند (One-to-Many)**: رابطه پرکاربرد میان والد و فرزندان (مانند سفارش و اقلام سفارش).
- **چندبه‌چند (Many-to-Many)**: با جدول میانی (Join Table) خودکار یا سفارشی.
- **یک‌به‌یک (One-to-One)**: با کلید خارجی روی موجودیت وابسته (Dependent).

---

## ۲. خطای N+1 Query و روش‌های بارگذاری داده

خطای N+1 زمانی رخ می‌دهد که به ازای هر رکورد والد، یک کوئری مجزا به دیتابیس ارسال شود. با **Eager Loading** و متد \`Include\`، تمامی داده‌ها در یک کوئری بهینه با JOIN واکشی می‌شوند:

\`\`\`csharp
var orders = await context.Orders
    .Include(o => o.Items)
        .ThenInclude(i => i.Product)
    .ToListAsync();
\`\`\`

---

## ۳. کوئری‌های سریع با AsNoTracking و Projection

برای سناریوهای فقط خواندنی (Read-Only)، استفاده از \`AsNoTracking\` و پروجکشن مستقیم به DTO با متد \`Select\`، مصرف حافظه و زمان پردازش را به شدت کاهش می‌دهد:

\`\`\`csharp
var userSummaries = await context.Users
    .AsNoTracking()
    .Where(u => u.IsActive)
    .Select(u => new UserSummaryDto(u.Id, u.FullName, u.Email, u.Orders.Count))
    .ToListAsync();
\`\`\``,
};
