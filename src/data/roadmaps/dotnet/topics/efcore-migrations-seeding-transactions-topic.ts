import { RoadmapTopic } from "../../../models";

export const efcoreMigrationsSeedingTransactionsTopic: RoadmapTopic = {
  id: "topic-dotnet-efcore-migrations-seeding-transactions",
  stepId: "step-mid-efcore-data",
  slug: "efcore-migrations-seeding-transactions",
  order: 3,
  title: "Migrations Workflow, Data Seeding & Database Transactions",
  title_fa: "مایگریشن‌ها، سیدینگ داده‌های اولیه و مدیریت تراکنش‌ها (Transactions)",
  summary:
    "Master EF Core migrations architecture, ModelDiffer mechanics, zero-downtime deployment strategies (Migration Bundles vs Idempotent Scripts vs Database.Migrate), HasData vs runtime seeders, Savepoints, and Resilient Transactions with ExecutionStrategy.",
  summary_fa:
    "تسلط عمیق بر معماری داخلی مایگریشن‌ها، مقایسه روش‌های استقرار در پروداکشن (Migration Bundles، اسکریپت‌های Idempotent و خطرات Database.Migrate)، استراتژی‌های Seeding داده‌ها، نقاط ذخیره موقت (Savepoints) و تراکنش‌های تاب‌آور با ExecutionStrategy.",
  readingTimeMinutes: 32,
  difficulty: "mid",
  content: `## 1. Evolution: From Manual Schema Delta Scripts to Code-First Migrations

In early enterprise database architectures, developers wrote manual SQL scripts for schema updates (\`001_CreateUsers.sql\`, \`002_AddEmailColumn.sql\`).

This manual process suffered from severe vulnerabilities:
1. **Schema Drift**: Divergence between the database schema and application C# models.
2. **Missing Rollbacks**: Writing rollback scripts was error-prone and frequently neglected.
3. **Multi-Environment Desynchronization**: Staging, QA, and Production databases ended up in inconsistent states.

EF Core solved this through **Code-First Migrations**, a deterministic engine that synchronizes C# entity configurations with the relational database schema.

---

## 2. EF Core Migrations Architecture & The \`__EFMigrationsHistory\` Engine

When you execute \`dotnet ef migrations add <Name>\`, EF Core activates three internal architectural components:

\`\`\`text
┌────────────────────────────────────────┐       ┌────────────────────────────────────────┐
│  Previous Model State (ModelSnapshot)  │  vs.  │  Current C# DbContext Entity Metadata  │
└───────────────────┬────────────────────┘       └───────────────────┬────────────────────┘
                    │                                                │
                    └───────────────────────┬────────────────────────┘
                                            ▼
                            ┌───────────────────────────────┐
                            │    IMigrationsModelDiffer     │
                            └───────────────┬───────────────┘
                                            ▼ Generates
            ┌───────────────────────────────────────────────────────────────┐
            │ 1. {Timestamp}_{Name}.cs (Up & Down migration operations)    │
            │ 2. {Timestamp}_{Name}.Designer.cs (Metadata target)           │
            │ 3. AppDbContextModelSnapshot.cs (Updated latest model graph)  │
            └───────────────────────────────────────────────────────────────┘
\`\`\`

---

### The Three Core Artifacts of a Migration:
1. **The Migration File (\`{Timestamp}_{Name}.cs\`)**:
   - Contains the \`Up(MigrationBuilder)\` method (applying changes) and \`Down(MigrationBuilder)\` method (reverting changes).
2. **The Designer File (\`{Timestamp}_{Name}.Designer.cs\`)**:
   - Stores an exact metadata snapshot of the model at the time this specific migration was created.
3. **The Model Snapshot (\`AppDbContextModelSnapshot.cs\`)**:
   - A single C# file representing the **current complete state** of your entire database model. When the next migration is added, EF Core compares your C# models against this snapshot.

---

### The \`__EFMigrationsHistory\` Table:
When migrations are applied, EF Core creates and maintains a dedicated metadata table in the database:

\`\`\`sql
CREATE TABLE [__EFMigrationsHistory] (
    [MigrationId] nvarchar(150) NOT NULL CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY,
    [ProductVersion] nvarchar(32) NOT NULL
);
\`\`\`

Before running any migration, EF Core queries \`SELECT [MigrationId] FROM [__EFMigrationsHistory]\`. It skips all migrations already present in the table and applies only the pending migrations in chronological order.

---

## 3. Production Deployment Strategies: Bundles vs. Scripts vs. \`Database.Migrate()\`

One of the most dangerous architectural mistakes in production is calling \`context.Database.Migrate()\` inside application startup code (\`Program.cs\`).

### Why \`Database.Migrate()\` on Startup is a Production Anti-Pattern:
1. **Multi-Replica Race Conditions**: In Kubernetes or containerized clusters where 10 pods boot simultaneously, all 10 instances attempt to execute schema migrations concurrently, causing deadlocks, timeout errors, or schema corruption.
2. **Principle of Least Privilege**: Your web application runtime database user should only have **DML permissions** (\`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`). Calling \`Database.Migrate()\` forces the web application to hold elevated **DDL permissions** (\`CREATE TABLE\`, \`ALTER TABLE\`, \`DROP TABLE\`), creating a major security risk.
3. **Container Health-Check Timeouts**: If a migration takes 45 seconds to alter a large table, Kubernetes readiness/liveness probes will fail and kill the pod mid-migration!

---

### The Enterprise Solution 1: Migration Bundles (\`dotnet ef migrations bundle\`)

Introduced in .NET 6+, a **Migration Bundle** is a self-contained, single-file native executable containing all migrations and the EF Core runtime:

\`\`\`bash
# Generate the bundle executable inside your CI pipeline:
dotnet ef migrations bundle --project Infrastructure --startup-project WebApi --output ./bundle.exe

# Execute the bundle in your CD deployment pipeline (using elevated DBA credentials):
./bundle.exe --connection "Server=db.prod;Database=AppDb;User Id=db_deployer;Password=***;"
\`\`\`

#### Advantages of Migration Bundles:
- **Zero .NET SDK Dependency**: Runs as a standalone binary on the target deployment machine.
- **Isolated Deployment Phase**: Executes in the CI/CD pipeline **BEFORE** new web application pods are scheduled.
- **Strict Role Separation**: Uses dedicated DBA service accounts without exposing schema alteration rights to the Web API.

---

### The Enterprise Solution 2: Idempotent SQL Scripts

For enterprise organizations requiring formal DBA review before any database change:

\`\`\`bash
# Generates a safe, idempotent SQL script:
dotnet ef migrations script --idempotent --output deploy-migrations.sql
\`\`\`

The \`--idempotent\` flag wraps every migration in a check against \`__EFMigrationsHistory\`:

\`\`\`sql
IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260818120000_AddUserBilling')
BEGIN
    CREATE TABLE [Billing] (
        [Id] uniqueidentifier NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        CONSTRAINT [PK_Billing] PRIMARY KEY ([Id])
    );

    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260818120000_AddUserBilling', N'9.0.0');
END;
\`\`\`

---

## 4. Data Seeding Strategies: \`HasData()\` vs. Runtime Seeders

### Strategy 1: ModelBuilder \`HasData()\` (Static Lookup Tables)
Best for static reference data that **never changes at runtime** (e.g. System Roles, Order Statuses, Currency Codes):

\`\`\`csharp
public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        // Static seed data embedded directly into EF Core migrations:
        builder.HasData(
            new Role { Id = 1, Name = "Administrator", NormalizedName = "ADMINISTRATOR" },
            new Role { Id = 2, Name = "Customer", NormalizedName = "CUSTOMER" },
            new Role { Id = 3, Name = "SupportAgent", NormalizedName = "SUPPORTAGENT" }
        );
    }
}
\`\`\`

> [!IMPORTANT]
> **Strict Rules for \`HasData\` Seeding:**
> 1. **Primary Keys MUST be explicitly assigned** (EF Core will not auto-generate IDs for seed data).
> 2. **Non-deterministic calls are strictly forbidden** (never use \`DateTime.UtcNow\` or \`Guid.NewGuid()\` because every migration generation will detect a change and create duplicate \`UPDATE\` scripts!).

---

### Strategy 2: Custom Async Runtime Seeder (Dynamic / Environment Data)
Best for initializing default admin users with hashed passwords, mock catalog items for development, or fetching seed data from external microservices:

\`\`\`csharp
public interface IDataSeeder
{
    Task SeedAsync(CancellationToken cancellationToken = default);
}

public class AdminUserSeeder(AppDbContext context, IPasswordHasher<User> passwordHasher) : IDataSeeder
{
    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await context.Users.AnyAsync(u => u.Email == "admin@enterprise.com", cancellationToken))
            return; // Idempotent check: already seeded!

        var admin = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@enterprise.com",
            FullName = "System Administrator",
            CreatedAtUtc = DateTime.UtcNow
        };
        admin.PasswordHash = passwordHasher.HashPassword(admin, "SuperSecretP@ssw0rd!");

        context.Users.Add(admin);
        await context.SaveChangesAsync(cancellationToken);
    }
}
\`\`\`

---

## 5. Transactions, Savepoints & Resilient Execution Strategies

### 1. Implicit Transactions in \`SaveChangesAsync()\`
Every time you call \`context.SaveChangesAsync()\`, EF Core automatically wraps all tracked entity inserts, updates, and deletes in a **single atomic database transaction**. If any single statement fails, the entire batch is rolled back automatically.

---

### 2. Explicit Transactions with Savepoints
When business logic spans multiple independent \`SaveChangesAsync()\` calls or external operations:

\`\`\`csharp
await using var transaction = await context.Database.BeginTransactionAsync();

try
{
    // Step 1: Create Order
    context.Orders.Add(order);
    await context.SaveChangesAsync();

    // Step 2: Create Savepoint (Allows partial rollback)
    await transaction.CreateSavepointAsync("OrderCreatedSavepoint");

    try
    {
        // Step 3: Deduct Reward Points
        await rewardPointService.DeductAsync(order.CustomerId, order.PointsUsed);
        await context.SaveChangesAsync();
    }
    catch (RewardPointException)
    {
        // Rollback ONLY reward point deduction, keep the Order intact!
        await transaction.RollbackToSavepointAsync("OrderCreatedSavepoint");
    }

    // Step 4: Commit entire transaction
    await transaction.CommitAsync();
}
catch (Exception)
{
    await transaction.RollbackAsync();
    throw;
}
\`\`\`

---

### 3. Resilient Transactions with \`ExecutionStrategy\` (\`EnableRetryOnFailure\`)
When connecting to cloud databases (Azure SQL, AWS RDS, PostgreSQL), transient network drops occur. Enabling \`EnableRetryOnFailure()\` configures automatic connection retries.

> [!WARNING]
> If you start a manual transaction with \`BeginTransactionAsync()\` while \`EnableRetryOnFailure()\` is active, EF Core will throw an \`InvalidOperationException\` because retrying a transaction that partially committed on the server could duplicate operations.

#### The Correct Pattern: \`CreateExecutionStrategy()\`
Wrap your explicit transaction inside the execution strategy delegate:

\`\`\`csharp
var strategy = context.Database.CreateExecutionStrategy();

await strategy.ExecuteAsync(async () =>
{
    // The entire transaction block will be safely re-executed if a transient failure occurs:
    await using var transaction = await context.Database.BeginTransactionAsync();

    context.Orders.Add(order);
    await context.SaveChangesAsync();

    context.Invoices.Add(new Invoice { OrderId = order.Id, Amount = order.TotalAmount });
    await context.SaveChangesAsync();

    await transaction.CommitAsync();
});
\`\`\`

---

## 6. Master Comparison Matrix: Migration Deployment Strategies

| Deployment Strategy | Execution Timing | Multi-Pod Safe? | Security (Least Privilege) | CI/CD Integration |
| :--- | :--- | :--- | :--- | :--- |
| **\`Database.Migrate()\`** | Web App Startup | ❌ **NO (Race conditions & locks)** | ❌ Poor (Web app requires DDL) | Trivial (Automatic) |
| **Migration Bundle** | CI/CD Pre-Deploy Phase | **✅ 100% Safe (Single executable)** | **✅ Excellent (Dedicated DBA user)** | **Best Practice for Modern CI/CD** |
| **Idempotent SQL Script** | CI/CD or DBA Review | **✅ 100% Safe** | **✅ Excellent (Auditable SQL)** | **Best for Strict Enterprise DBAs** |
| **\`EnsureCreated()\`** | Startup / Testing | ❌ **NO (Bypasses migrations table)** | ❌ Poor | **Testing / In-Memory only** |`,
  content_fa: `## ۱. سیر تکامل: از اسکریپت‌های دستی SQL تا مایگریشن‌های مدرن Code-First

در معماری‌های سنتی، تغییرات پایگاه داده از طریق اسکریپت‌های متنی دستی SQL توسط توسعه‌دهندگان اعمال می‌شد که با چالش‌های بزرگی روبرو بود:
۱. **ناهماهنگی شمای دیتابیس (Schema Drift)**: عدم انطباق ساختار پایگاه داده با کلاس‌های دامنه‌ای C#.
۲. **نبود سازوکار بازگشت (Rollback)**: عدم وجود اسکریپت‌های معکوس برای بازگرداندن تغییرات در صورت شکست.
۳. **ناهماهنگی محیط‌های مختلف**: تفاوت ساختاری میان دیتابیس‌های Development، Staging و Production.

فریم‌ورک EF Core با معرفی موتور **Code-First Migrations** هماهنگی قطعی و دوطرفه میان مدل‌های دامنه‌ای و ساختار رابطه‌ای دیتابیس را تضمین کرد.

---

## ۲. معماری داخلی مایگریشن‌ها و جدول متادیتای \`__EFMigrationsHistory\`

هنگام اجرای دستور \`dotnet ef migrations add\`، سه مؤلفه زیرساختی فعال می‌شوند:

۱. **فایل مایگریشن (\`{Timestamp}_{Name}.cs\`)**:
   - دارای متد \`Up\` (اعمال تغییرات روی دیتابیس) و متد \`Down\` (بازگرداندن تغییرات در صورت Rollback).
۲. **فایل متادیتا (\`{Timestamp}_{Name}.Designer.cs\`)**:
   - نگهداری تصویر متادیتای دقیق مدل در لحظه ساخت مایگریشن.
۳. **اسنپ‌شات مدل (\`AppDbContextModelSnapshot.cs\`)**:
   - نمایانگر **وضعیت کامل فعلی کل دیتابیس** در قالب کد C#. در مایگریشن بعدی، موتور \`IMigrationsModelDiffer\` تغییرات جدید کد را با این اسنپ‌شات مقایسه می‌کند.

---

### سازوکار جدول متادیتای \`__EFMigrationsHistory\`:
فریم‌ورک در پایگاه داده جدولی به نام \`__EFMigrationsHistory\` می‌سازد و شناسه تمام مایگریشن‌های اجرا شده را در آن ذخیره می‌کند. در زمان اجرا، تنها مواردی که نام آنها در این جدول وجود ندارد به ترتیب تاریخ اعمال می‌شوند.

---

## ۳. استراتژی‌های استقرار در پروداکشن: چرا \`Database.Migrate()\` در پروداکشن ممنوع است؟

اجرای مستقیم متد \`context.Database.Migrate()\` در فایل \`Program.cs\` در محیط‌های کانتینری و پروداکشن یک **ضدالگو (Anti-Pattern)** خطرناک است:

### دلایل ممنوعیت:
۱. **بروز Race Condition در کلاسترهای چند نسخه‌ای**: هنگام بالا آمدن همزمان ۱۰ پاد (Pod) در Kubernetes، تمامی نمونه‌ها همزمان تلاش می‌کنند ساختار جداول را دستکاری کنند که منجر به Deadlock و خطاهای سیستمی می‌شود.
۲. **نقض اصل کمترین دسترسی (Least Privilege)**: کاربر دیتابیسِ وب‌اپلیکیشن فقط باید دسترسی خواندن/نوشتن (DML) داشته باشد. با اجرای Migrate، مجبور می‌شوید دسترسی‌های سطح بالای DDL (مانند ساخت و حذف جدول) به وب‌سرویس بدهید.
۳. **تایم‌اوت در پراب‌های سلامت کوبرنتیز**: در صورت طولانی شدن تغییر جدول، کوبرنتیز پاد را متوقف کرده و مایگریشن نصفه‌کاره رها می‌شود.

---

### راهکار استاندارد ۱: بسته‌های اجرایی مستقل (Migration Bundles)
از دات‌نت ۶ به بعد، دستور \`dotnet ef migrations bundle\` یک فایل اجرایی مستقل (\`bundle.exe\`) تولید می‌کند:
\`\`\`bash
# ساخت باندل در پایپ‌لاین CI:
dotnet ef migrations bundle --output ./bundle.exe

# اجرای باندل در پایپ‌لاین CD قبل از لانچ وب‌اپلیکیشن:
./bundle.exe --connection "Server=prod_db;Database=AppDb;User Id=dba_deployer;Password=***;"
\`\`\`
- این فایل قبل از بالا آمدن سرورهای وب و با دسترسی‌های اختصاصی DBA اجرا می‌شود.

---

### راهکار استاندارد ۲: اسکریپت‌های خودفرجام (Idempotent SQL Scripts)
\`\`\`bash
dotnet ef migrations script --idempotent --output deploy.sql
\`\`\`
این دستور اسکریپت‌های امنی تولید می‌کند که قبل از اجرای هر دستور، جدول \`__EFMigrationsHistory\` را بررسی کرده و در صورت اعمال قبلی، از اجرای مجدد آن جلوگیری می‌نماید.

---

## ۴. استراتژی‌های Seed کردن داده‌ها: مقایسه \`HasData\` با Seederهای داینامیک

### ۱. متد \`HasData\` در Fluent API:
- مناسب داده‌های ثابت سیستم (مانند نقش‌های کاربری و وضعیت‌ها).
- **قوانین الزامی:** کلید اصلی (ID) باید به صورت صریح مقداردهی شود و نباید از توابع تصادفی یا زمانی (مانند \`DateTime.UtcNow\` یا \`Guid.NewGuid\`) استفاده شود.

### ۲. سرویس‌های اختصاصی مقداردهی در زمان اجرا (\`IDataSeeder\`):
- مناسب ساخت اکانت ادمین پیش‌فرض با پسورد هش‌شده، داده‌های تستی محیط Development و دریافت داده از سرویس‌های خارجی.

---

## ۵. مدیریت تراکنش‌ها، Savepoints و استراتژی تاب‌آوری (ExecutionStrategy)

### ۱. نقاط ذخیره موقت (Savepoints):
امکان بازگردانی بخشی از عملیات یک تراکنش بدون لغو کل آن:
\`\`\`csharp
await using var transaction = await context.Database.BeginTransactionAsync();
// ثبت سفارش
await transaction.CreateSavepointAsync("OrderSaved");
try {
    // کسر امتیاز
} catch {
    // بازگرداندن فقط بخش امتیاز بدون حذف سفارش اصلی
    await transaction.RollbackToSavepointAsync("OrderSaved");
}
await transaction.CommitAsync();
\`\`\`

### ۲. تراکنش‌های تاب‌آور با \`CreateExecutionStrategy\`:
هنگامی که قابلیت تلاش مجدد خودکار (\`EnableRetryOnFailure\`) فعال است، تراکنش‌های دستی باید درون متد \`ExecuteAsync\` قرار گیرند تا در صورت قطع لحظه‌ای شبکه دیتابیس، کل بلاک تراکنش به صورت امن مجدداً تلاش شود:

\`\`\`csharp
var strategy = context.Database.CreateExecutionStrategy();
await strategy.ExecuteAsync(async () =>
{
    await using var transaction = await context.Database.BeginTransactionAsync();
    context.Orders.Add(order);
    await context.SaveChangesAsync();
    await transaction.CommitAsync();
});
\`\`\`

---

## ۶. ماتریس مقایسه جامع روش‌های اعمال تغییرات دیتابیس

| استراتژی | زمان اجرا | امنیت در کلاستر چند پادی | رعایت اصل Least Privilege | کاربرد در صنعت |
| :--- | :--- | :--- | :--- | :--- |
| **\`Database.Migrate()\`** | استارتاپ وب‌اپلیکیشن | ❌ **خیر (ریسک Deadlock و خرابی)** | ❌ ضعیف (نیازمند مجوز DDL) | محیط لوکال و پروژه‌های آزمایشی |
| **Migration Bundle** | قبل از استقرار وب در CI/CD | **✅ ۱۰۰٪ امن (فرآیند مجزا)** | **✅ عالی (اکانت اختصاصی دپلویمنت)** | **بهترین الگو برای CI/CD مدرن** |
| **Idempotent SQL Script** | توسط تیم DBA یا CI/CD | **✅ ۱۰۰٪ امن** | **✅ عالی (امکان بازبینی اسکریپت)** | **محیط‌های سازمانی با نظارت DBA** |
| **\`EnsureCreated()\`** | زمان اجرا | ❌ خیر (جدول تاریخچه نمی‌سازد) | ❌ ضعیف | **تست‌های واحد و In-Memory** |`,
};
