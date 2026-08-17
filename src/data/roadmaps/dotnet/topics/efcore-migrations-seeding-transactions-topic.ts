import { RoadmapTopic } from "../../../models";

export const efcoreMigrationsSeedingTransactionsTopic: RoadmapTopic = {
  id: "topic-dotnet-efcore-migrations-seeding-transactions",
  stepId: "step-mid-efcore-data",
  slug: "efcore-migrations-seeding-transactions",
  order: 3,
  title: "Migrations Workflow, Data Seeding & Database Transactions",
  title_fa: "مایگریشن‌ها، سیدینگ داده‌های اولیه و مدیریت تراکنش‌ها (Transactions)",
  summary:
    "Master dotnet ef CLI migrations, production deployment scripts (idempotent bundle), HasData seeding, and explicit transactions with execution strategies.",
  summary_fa:
    "تسلط بر فرآیند ایجاد و اعمال Migration، تولید اسکریپت‌های استقرار پروداکشن (Idempotent Scripts)، مقداردهی اولیه داده‌ها (Seeding) و تراکنش‌های مطمئن با Execution Strategy.",
  readingTimeMinutes: 20,
  difficulty: "mid",
  content: `## 1. Migrations Workflow & Production Scripting

In professional CI/CD pipelines, **never use \`context.Database.Migrate()\` on startup** in multi-instance environments due to schema lock collisions. Instead, generate idempotent SQL migration scripts:

\`\`\`bash
# Create migration
dotnet ef migrations add AddUserBillingTable --project Infrastructure --startup-project WebApi

# Generate idempotent SQL script for Production CD pipelines
dotnet ef migrations script --idempotent --output deploy-migrations.sql
\`\`\`

---

## 2. Data Seeding Strategies

- **ModelBuilder \`HasData\`**: Best for static lookup tables (e.g. Roles, Statuses, Currency codes).
- **Custom Seeder Service**: Best for dynamic data with password hashes or environment-specific demo data.

\`\`\`csharp
builder.Entity<Role>().HasData(
    new Role { Id = 1, Name = "Administrator" },
    new Role { Id = 2, Name = "User" }
);
\`\`\`

---

## 3. Explicit Transactions with Resilient Execution Strategy

When using SQL Server or PostgreSQL with connection retries, wrap explicit transactions in the execution strategy:

\`\`\`csharp
var strategy = context.Database.CreateExecutionStrategy();

await strategy.ExecuteAsync(async () =>
{
    await using var transaction = await context.Database.BeginTransactionAsync();
    try
    {
        context.Orders.Add(order);
        await context.SaveChangesAsync();

        await paymentService.DebitAsync(order.Total);

        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
});
\`\`\``,
  content_fa: `## ۱. فرآیند مایگریشن‌ها و اسکریپت‌های پروداکشن

در محیط‌های چند نسخه‌ای پروداکشن، اجرای مستقیم \`Database.Migrate()\` در استارت برنامه می‌تواند باعث قفل شدن دیتابیس شود. استاندارد صنعتی، تولید اسکریپت‌های Idempotent در پایپ‌لاین CI/CD است:

\`\`\`bash
# ایجاد مایگریشن جدید
dotnet ef migrations add AddUserBillingTable --project Infrastructure --startup-project WebApi

# تولید اسکریپت SQL برای استقرار امن در پروداکشن
dotnet ef migrations script --idempotent --output deploy-migrations.sql
\`\`\`

---

## ۲. روش‌های Seed کردن داده‌ها (Data Seeding)

- **استفاده از \`HasData\` در Fluent API**: عالی برای داده‌های ثابت و پایه‌ای سیستم مانند نقش‌ها و وضعیت‌ها.
- **سرویس Seeder سفارشی**: مناسب داده‌های اولیه داینامیک یا محیط توسعه.

---

## ۳. تراکنش‌های صریح و استراتژی تاب‌آوری (Execution Strategy)

ترکیب تراکنش با قابلیت تلاش مجدد خودکار (Retry) برای جلوگیری از خطاهای قطعی لحظه‌ای شبکه دیتابیس.`,
};
