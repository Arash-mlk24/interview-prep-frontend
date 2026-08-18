import { RoadmapTopic } from "../../../models";

export const efcoreQueryingRelationshipsLoadingTopic: RoadmapTopic = {
  id: "topic-dotnet-efcore-querying-relationships-loading",
  stepId: "step-mid-efcore-data",
  slug: "efcore-querying-relationships-loading",
  order: 2,
  title: "Entity Relationships, Eager vs Lazy Loading & Query Projections",
  title_fa: "روابط موجودیت‌ها، استراتژی‌های بارگذاری (Eager/Lazy) و بهینه‌سازی کوئری‌ها",
  summary:
    "Master 1:1, 1:N, and N:M relationships, DeleteBehavior cascading, solve the N+1 query problem, mitigate Cartesian Explosion with AsSplitQuery, compare AsNoTracking vs AsNoTrackingWithIdentityResolution, and utilize ExecuteUpdateAsync/ExecuteDeleteAsync in .NET 8/9.",
  summary_fa:
    "تسلط عمیق بر انواع روابط ۱:۱، ۱:N و N:M، رفتارهای حذف آبشاری (DeleteBehavior)، حل خطای ویرانگر N+1، مهار انفجار دکارتی با AsSplitQuery، مقایسه تخصصی AsNoTracking با AsNoTrackingWithIdentityResolution، و دستورات مدرن ExecuteUpdateAsync و ExecuteDeleteAsync در دات‌نت ۸ و ۹.",
  readingTimeMinutes: 34,
  difficulty: "mid",
  content: `## 1. Evolution: The Object-Relational Impedance Mismatch in Relationships

In relational database systems, entities are connected strictly via **Foreign Keys** and primary key constraints. In object-oriented programming (C#), domain objects are connected via direct memory object references and collection navigations (\`List<OrderItem>\`, \`Customer\`).

This fundamental divergence is known as the **Object-Relational Impedance Mismatch**.

---

### The Terminology of Relational Modeling in EF Core:
- **Principal Entity**: The entity that contains the primary/unique key (e.g. \`Order\`).
- **Dependent Entity**: The entity that contains the foreign key pointing back to the principal (e.g. \`OrderItem\`).
- **Reference Navigation**: A property referencing a single entity (e.g. \`orderItem.Order\`).
- **Collection Navigation**: A property referencing multiple entities (e.g. \`order.Items\`).

---

### Configuring Relationships via Fluent API:

#### 1. One-to-Many (1:N) with Explicit Foreign Key & Cascade Delete:
\`\`\`csharp
public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems");
        builder.HasKey(i => i.Id);

        builder.HasOne(i => i.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade); // Deleting Order automatically deletes all child items
    }
}
\`\`\`

#### 2. Many-to-Many (N:M) with Explicit Join Entity (Payload Support):
While EF Core 5+ supports direct implicit Many-to-Many, enterprise architectures almost always require an **Explicit Join Entity** to hold relational metadata (e.g. \`AssignedAt\`, \`RoleInProject\`):

\`\`\`csharp
public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("UserRoles");

        // Composite Primary Key
        builder.HasKey(ur => new { ur.UserId, ur.RoleId });

        builder.HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        builder.HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);

        builder.Property(ur => ur.AssignedAtUtc)
            .HasDefaultValueSql("GETUTCDATE()");
    }
}
\`\`\`

---

### DeleteBehavior Cascade Rules Matrix:

| DeleteBehavior | Database Foreign Key Constraint | Client-Side ChangeTracker Behavior | Production Recommendation |
| :--- | :--- | :--- | :--- |
| **\`Cascade\`** | \`ON DELETE CASCADE\` | Deleting principal deletes dependents in memory | Parent-child lifecycle (Orders -> OrderItems) |
| **\`Restrict\`** | \`ON DELETE NO ACTION\` | Prevents deletion if dependents exist (throws error) | Referenced lookups (Category -> Products) |
| **\`SetNull\`** | \`ON DELETE SET NULL\` | Nullifies foreign key on dependents | Optional associations (User -> AssignedTask) |
| **\`ClientSetNull\`** | \`ON DELETE NO ACTION\` | Nullifies in memory, DB rejects if not nullable | Default EF Core behavior for optional keys |

---

## 2. The Four Loading Strategies & The Devastating N+1 Query Problem

### What is the N+1 Query Problem?
The **N+1 Query Problem** occurs when an application executes **1 initial SQL query** to retrieve $N$ parent records, and then executes **$N$ additional individual SQL queries** inside a loop to fetch related child data.

\`\`\`csharp
// DISASTROUS ANTI-PATTERN (N+1 Query Disaster):
var customers = await context.Customers.ToListAsync(); // 1 Query: Fetches 1,000 customers

foreach (var customer in customers)
{
    // Executes 1 separate SQL query PER customer!
    // Total: 1 + 1,000 = 1,001 database roundtrips!
    var orderCount = await context.Orders.CountAsync(o => o.CustomerId == customer.Id);
}
\`\`\`

---

### The Four Loading Strategies in EF Core:

#### 1. Eager Loading (\`Include\` / \`ThenInclude\`)
Loads related data upfront as part of the initial database query using SQL \`LEFT JOIN\`s:

\`\`\`csharp
var orders = await context.Orders
    .Include(o => o.Customer)
    .Include(o => o.Items)
        .ThenInclude(i => i.Product)
    .ToListAsync();
\`\`\`

**Filtered Includes (.NET 5+):** You can filter and sort included child collections directly inside the SQL query:
\`\`\`csharp
var activeOrders = await context.Orders
    .Include(o => o.Items.Where(i => !i.IsCancelled).OrderBy(i => i.ItemNumber))
    .ToListAsync();
\`\`\`

---

#### 2. Explicit Loading (\`context.Entry().LoadAsync()\`)
Explicitly requests related data on an already-loaded entity instance on demand:

\`\`\`csharp
var order = await context.Orders.FindAsync(orderId);

if (userRequestedDetails)
{
    // Explicitly loads child collection:
    await context.Entry(order)
        .Collection(o => o.Items)
        .Query()
        .Where(i => i.Price > 50)
        .LoadAsync();
}
\`\`\`

---

#### 3. Lazy Loading (The Enterprise Anti-Pattern)
Automatically loads related entities the moment a navigation property is accessed:

\`\`\`csharp
// Requires 'Microsoft.EntityFrameworkCore.Proxies' and 'virtual' navigation properties
public class Order
{
    public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
\`\`\`

> [!WARNING]
> **Why Lazy Loading is strictly prohibited in REST Web APIs:**
> 1. **Accidental N+1 during JSON Serialization:** When ASP.NET Core serializes an entity to JSON, it reads every getter, silently triggering hundreds of synchronous database roundtrips.
> 2. **ObjectDisposedException:** Accessing a navigation property in a service layer after the scoped \`DbContext\` is disposed causes a fatal crash.
> 3. **Sync-Over-Async Blocking:** Lazy loading runs synchronously on the thread pool, causing thread starvation under load.

---

#### 4. Select Projections (The Ultimate Architecture Champion)
Projects data directly into a Data Transfer Object (DTO) using LINQ \`.Select()\`:

\`\`\`csharp
var customerDtos = await context.Customers
    .AsNoTracking()
    .Where(c => c.IsActive)
    .Select(c => new CustomerSummaryDto(
        c.Id,
        c.FullName,
        c.Email,
        c.Orders.Count,
        c.Orders.Sum(o => o.TotalAmount)
    ))
    .ToListAsync();
\`\`\`

### Why Projections Outperform All Other Strategies:
1. **Zero Tracking Overhead:** Bypasses \`ChangeTracker\` and entity snapshotting completely.
2. **Optimal SQL Generation:** Emits a single SQL query that selects **ONLY the required columns** (no \`SELECT *\`).
3. **No Entity Materialization:** Instantiates the lightweight DTO directly from the tabular stream.

---

## 3. Cartesian Explosion & Split Queries (\`AsSplitQuery\` vs. \`AsSingleQuery\`)

When an eager-loading query includes **multiple collection navigations**, EF Core's default single SQL query generates a **Cartesian Product**:

\`\`\`csharp
var blogs = await context.Blogs
    .Include(b => b.Posts)      // Collection 1 (10 posts per blog)
    .Include(b => b.Tags)       // Collection 2 (5 tags per blog)
    .Include(b => b.Authors)    // Collection 3 (2 authors per blog)
    .ToListAsync();
\`\`\`

### The Mechanics of Cartesian Explosion:
Because SQL \`JOIN\` statements operate on flat tabular result sets, the database cross-multiplies all collections:
$$\text{Rows Returned per Blog} = 10 \times 5 \times 2 = 100 \text{ rows!}$$

For 1,000 blogs, the database streams **100,000 rows** across the network, transmitting the blog title and header data 100 times redundantly. This causes massive network latency, high CPU usage, and high memory buffering!

---

### Mitigating with Split Queries (\`AsSplitQuery\`):

\`\`\`csharp
var blogs = await context.Blogs
    .Include(b => b.Posts)
    .Include(b => b.Tags)
    .AsSplitQuery() // Tells EF Core to generate separate, targeted SQL queries!
    .ToListAsync();
\`\`\`

### Generated SQL with Split Queries:
1. \`SELECT [b].[Id], [b].[Title] FROM [Blogs] AS [b]\`
2. \`SELECT [p].[Id], [p].[BlogId], [p].[Content] FROM [Posts] AS [p] INNER JOIN [Blogs] AS [b] ON [p].[BlogId] = [b].[Id]\`
3. \`SELECT [t].[Id], [t].[BlogId], [t].[Name] FROM [Tags] AS [t] INNER JOIN [Blogs] AS [b] ON [t].[BlogId] = [b].[Id]\`

$$\text{Total Rows Returned} = 1 + 10 + 5 = 16 \text{ rows (vs. 100 rows)!}$$

---

### Single Query vs. Split Query Decision Matrix:

| Evaluation Dimension | Single Query (\`AsSingleQuery\`) | Split Query (\`AsSplitQuery\`) |
| :--- | :--- | :--- |
| **SQL Queries Generated** | 1 Query with multiple \`LEFT JOIN\`s | $1 + N$ queries ($1$ per included collection) |
| **Data Redundancy** | Extremely high (Cartesian duplication) | **Zero (Every row transferred exactly once)** |
| **Database Roundtrips** | **1 Roundtrip** | Multiple Roundtrips |
| **Transactional Snapshot**| **100% Snapshot Consistency** | Potential skew if data changes mid-query |
| **Best Used When** | Reference navigations or single collection | **Multiple included collection navigations** |

---

## 4. Change Tracking Tuning: \`AsNoTracking\` vs. \`AsNoTrackingWithIdentityResolution\`

When fetching read-only data, \`AsNoTracking()\` bypasses \`ChangeTracker\` snapshotting:

\`\`\`csharp
// Standard No-Tracking Query:
var orders = await context.Orders
    .AsNoTracking()
    .Include(o => o.Customer)
    .ToListAsync();
\`\`\`

### The Duplicate Object Trap of \`AsNoTracking()\`:
In standard \`AsNoTracking()\`, EF Core skips the identity map. If 50 orders belong to the **same Customer** (ID: 101):
- EF Core instantiates **50 separate, duplicate \`Customer\` objects** in memory!
- Modifying or inspecting object reference equality (\`order1.Customer == order2.Customer\`) returns \`false\`!

---

### The Fix: \`AsNoTrackingWithIdentityResolution()\`:
\`\`\`csharp
var orders = await context.Orders
    .AsNoTrackingWithIdentityResolution()
    .Include(o => o.Customer)
    .ToListAsync();
\`\`\`

- **Mechanism:** Disables change tracking snapshots, but maintains a lightweight lookup dictionary during query materialization.
- **Result:** All 50 orders reference the **exact same single \`Customer\` instance** in memory.
- **Guideline:** Use \`AsNoTrackingWithIdentityResolution()\` whenever an eager query with \`Include()\` loads entity graphs where child objects are shared across multiple parents.

---

## 5. Modern High-Performance Set Operations: \`ExecuteUpdateAsync\` & \`ExecuteDeleteAsync\`

In older EF Core versions, updating or deleting 10,000 rows required the **"Load-Mutate-Save" anti-pattern**:

\`\`\`csharp
// ANTI-PATTERN: Pulls 10,000 objects into C# memory, creates 10,000 snapshots, and runs 10,000 UPDATE statements!
var staleUsers = await context.Users.Where(u => u.LastLogin < cutoffDate).ToListAsync();
foreach (var user in staleUsers)
{
    user.IsActive = false;
}
await context.SaveChangesAsync();
\`\`\`

---

### The Modern .NET 7/8/9 Approach: Direct Bulk SQL Execution

\`\`\`csharp
// 1. Direct Bulk Update (Executes a single SQL UPDATE command on DB server!)
int affectedRows = await context.Users
    .Where(u => u.LastLogin < cutoffDate && u.IsActive)
    .ExecuteUpdateAsync(setters => setters
        .SetProperty(u => u.IsActive, false)
        .SetProperty(u => u.DeactivatedAtUtc, DateTime.UtcNow));

// 2. Direct Bulk Delete (Executes a single SQL DELETE command on DB server!)
int deletedRows = await context.AuditLogs
    .Where(log => log.CreatedAtUtc < retentionLimit)
    .ExecuteDeleteAsync();
\`\`\`

### Key Architectural Advantages of ExecuteUpdate/ExecuteDelete:
1. **300x-500x Faster Execution**: Operates as a set-based SQL command directly on the database engine.
2. **Zero Memory Allocation**: Does not materialize entities or track them in the \`ChangeTracker\`.
3. **Respects Global Query Filters**: Automatically incorporates soft-delete and multi-tenant filters into the SQL \`WHERE\` clause.

---

## 6. Compiled Queries for Ultra-Hot Execution Paths

When an endpoint executes the exact same query thousands of times per second (e.g. \`GetProductById\`), the overhead of parsing LINQ expression trees and computing SQL translations can become a CPU bottleneck.

\`\`\`csharp
public class CatalogRepository
{
    // Pre-compiles the LINQ query to SQL once at startup and caches the delegate:
    private static readonly Func<AppDbContext, Guid, Task<ProductDto?>> GetProductByIdCompiled =
        EF.CompileAsyncQuery((AppDbContext context, Guid id) =>
            context.Products
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Select(p => new ProductDto(p.Id, p.Name, p.Price))
                .FirstOrDefault());

    public Task<ProductDto?> GetByIdAsync(AppDbContext context, Guid productId)
    {
        return GetProductByIdCompiled(context, productId); // Executes directly with zero translation overhead!
    }
}
\`\`\`

---

## 7. Master Comparison Matrix: Data Loading & Query Optimization Techniques

| Technique | Change Tracking | Memory Allocation | DB Roundtrips | SQL Efficiency | Best Production Scenario |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Eager Loading (\`Include\`)** | Enabled (unless no-tracking) | High (Full entities) | 1 Roundtrip | Medium (Large joins) | Loading aggregate roots for business mutations |
| **Split Queries (\`AsSplitQuery\`)**| Configurable | Moderate | $1 + N$ queries | **High (No Cartesian duplication)** | Loading entities with multiple child collections |
| **Lazy Loading (Proxies)** | Enabled | High + Fragmented | $1 + N$ roundtrips | ❌ Very Poor (N+1 hazard) | Legacy desktop apps (Avoid in Web APIs) |
| **Select Projections (\`Select\`)**| **Disabled (Zero)** | **Ultra-Low (DTOs only)**| **1 Roundtrip** | **Maximum (Targeted columns only)** | **All Read-Only REST Endpoints & UI Grids** |
| **\`ExecuteUpdateAsync\`** | **Bypassed (Zero)** | **Zero (Database-side)** | **1 Roundtrip** | **Maximum (Direct Set-Based SQL)** | Bulk status updates, archive operations |`,
  content_fa: `## ۱. سیر تکامل: تضاد ساختاری شیء‌گرایی و رابطه‌ای (Impedance Mismatch)

در پایگاه‌های داده رابطه‌ای، موجودیت‌ها تنها از طریق **کلیدهای خارجی (Foreign Keys)** به یکدیگر متصل می‌شوند؛ در حالی که در برنامه‌نویسی شیءگرا (C#)، اشیاء از طریق اشاره‌گرهای حافظه و کالکشن‌ها (\`List<OrderItem>\`) با یکدیگر ارتباط دارند.

این تفاوت بنیادین به عنوان **Object-Relational Impedance Mismatch** شناخته می‌شود.

---

### مفاهیم کلیدی مدلسازی رابطه‌ای در EF Core:
- **موجودیت اصلی (Principal Entity)**: موجودیتی که کلید اصلی یکتا را نگهداری می‌کند (مانند \`Order\`).
- **موجودیت وابسته (Dependent Entity)**: موجودیتی که کلید خارجی آن به موجودیت اصلی اشاره دارد (مانند \`OrderItem\`).
- **ناوبری ارجاعی (Reference Navigation)**: پراپرتی که به یک شیء واحد اشاره می‌کند (\`orderItem.Order\`).
- **ناوبری کالکشنی (Collection Navigation)**: پراپرتی که به لیستی از اشیاء اشاره دارد (\`order.Items\`).

---

### پیکربندی روابط با Fluent API:

#### ۱. رابطه یک‌به‌چند (1:N) و رفتار حذف آبشاری (Cascade Delete):
\`\`\`csharp
public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems");
        builder.HasKey(i => i.Id);

        builder.HasOne(i => i.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade); // با حذف سفارش، تمامی اقلام آن به صورت خودکار حذف می‌شوند
    }
}
\`\`\`

#### ۲. رابطه چندبه‌چند (N:M) با جدول میانی صریح (Explicit Join Entity):
در پروژه‌های سازمانی معمولاً به نگهداری اطلاعات اضافی در جدول میانی (مانند تاریخ تخصیص) نیاز است:

\`\`\`csharp
public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("UserRoles");
        // کلید اصلی ترکیبی
        builder.HasKey(ur => new { ur.UserId, ur.RoleId });

        builder.HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        builder.HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);
    }
}
\`\`\`

---

## ۲. روش‌های چهارگانه بارگذاری داده و خطای ویرانگر N+1 Query

### خطای N+1 Query چیست؟
این باگ زمانی رخ می‌دهد که برنامه ابتدا **۱ کوئری** برای واکشی $N$ رکورد والد اجرا کرده و سپس داخل یک حلقه، به ازای هر رکورد **$N$ کوئری مجزا** برای واکشی فرزندان به دیتابیس بفرستد (مجموعاً $1 + N$ رفت و برگشت به سرور دیتابیس!).

---

### روش‌های چهارگانه بارگذاری:

#### ۱. بارگذاری حریصانه (Eager Loading با متد Include):
واکشی تمام داده‌های مرتبط در همان کوئری اولیه با دستورات \`LEFT JOIN\`:
\`\`\`csharp
var orders = await context.Orders
    .Include(o => o.Customer)
    .Include(o => o.Items)
        .ThenInclude(i => i.Product)
    .ToListAsync();
\`\`\`

#### ۲. بارگذاری صریح (Explicit Loading):
واکشی داده‌های وابسته برای یک شیء که قبلاً خوانده شده است:
\`\`\`csharp
await context.Entry(order)
    .Collection(o => o.Items)
    .Query()
    .Where(i => i.Price > 50)
    .LoadAsync();
\`\`\`

#### ۳. بارگذاری تنبل (Lazy Loading):
واکشی خودکار داده‌ها در لحظه دسترسی به پراپرتی ناوبری.

> [!WARNING]
> **چرا Lazy Loading در وب APIهای سازمانی ممنوع است؟**
> ۱. **بروز خطای N+1 در زمان Serialize به JSON**: پکیج تبدیل JSON با خواندن تمام فیلدها صدها کوئری همزمان می‌فرستد.
> ۲. **خطای ObjectDisposedException**: دسترسی به فیلدها پس از بسته شدن اسکوپ \`DbContext\` منجر به کرش می‌شود.
> ۳. **بلاک کردن Thread Pool**: اجرای همگام کوئری‌ها نخ‌های پردازشی سرور را قفل می‌کند.

#### ۴. پروجکشن مستقیم به DTO با متد Select (پادشاه کارایی):
\`\`\`csharp
var dtos = await context.Customers
    .AsNoTracking()
    .Where(c => c.IsActive)
    .Select(c => new CustomerSummaryDto(c.Id, c.FullName, c.Orders.Count))
    .ToListAsync();
\`\`\`
- کوئری SQL فقط ستون‌های مورد نیاز را دریافت می‌کند.
- مصرف رم نزدیک به صفر است چون هیچ انتیتی در حافظه ساخته و ردیابی نمی‌شود.

---

## ۳. انفجار دکارتی (Cartesian Explosion) و کوئری‌های تفکیک‌شده (AsSplitQuery)

هنگامی که در یک کوئری چندین کالکشن فرزند با \`Include\` دریافت می‌شوند، حاصلضرب دکارتی در دیتابیس رخ می‌دهد:

$$\text{تعداد ردیف‌های بازگشتی} = 10 \text{ پست} \times 5 \text{ برچسب} \times 2 \text{ نویسنده} = 100 \text{ ردیف!}$$

برای ۱۰۰۰ وبلاگ، بیش از ۱۰۰,۰۰۰ رکورد تکراری در شبکه منتقل می‌شود.

### راهکار: استفاده از \`AsSplitQuery()\`:
\`\`\`csharp
var blogs = await context.Blogs
    .Include(b => b.Posts)
    .Include(b => b.Tags)
    .AsSplitQuery() // تفکیک کوئری به چند دستور مجزا و حذف ردیف‌های تکراری
    .ToListAsync();
\`\`\`
با این کار، به جای ۱ کوئری سنگین با ۱۰۰ ردیف، ۳ کوئری فوق‌سریع با مجموعاً ۱۶ ردیف اجرا می‌شود.

---

## ۴. مقایسه تخصصی AsNoTracking با AsNoTrackingWithIdentityResolution

- **\`AsNoTracking()\`**: ردیابی اشیاء را به طور کامل غیرفعال می‌کند و برای کوئری‌های ساده بالاترین سرعت را دارد. اما اگر ۵۰ سفارش متعلق به ۱ مشتری باشند، ۵۰ شیء مجزا از مشتری در رم می‌سازد.
- **\`AsNoTrackingWithIdentityResolution()\`**: ردیابی را غیرفعال می‌کند اما یک جدول سبک در حافظه نگه می‌دارد تا نمونه‌های مشترک (مانند یک مشتری برای چند سفارش) فقط یک‌بار در رم ساخته شوند.

---

## ۵. دستورات فوق‌سریع ExecuteUpdateAsync و ExecuteDeleteAsync در دات‌نت ۸ و ۹

به جای الگوی پرهزینه "خواندن در حافظه ➔ ویرایش ➔ ذخیره با SaveChanges"، از دستورات مستقیم دیتابیسی استفاده کنید:

\`\`\`csharp
// ویرایش مستقیم هزاران رکورد روی سرور دیتابیس بدون لود در رم C#:
int updated = await context.Users
    .Where(u => u.LastLogin < cutoffDate)
    .ExecuteUpdateAsync(s => s.SetProperty(u => u.IsActive, false));

// حذف مستقیم رکوردهای لاگ:
int deleted = await context.AuditLogs
    .Where(l => l.CreatedAtUtc < oldDate)
    .ExecuteDeleteAsync();
\`\`\`
این متدها **۳۰۰ تا ۵۰۰ برابر سریع‌تر** اجرا شده و هیچ مصرف رمی در سرور وب ندارند.

---

## ۶. کوئری‌های کامپایل‌شده (Compiled Queries) برای مسیرهای پرترافیک

برای اندپوینت‌هایی که هزاران بار در ثانیه اجرا می‌شوند، با \`EF.CompileAsyncQuery\` می‌توان هزینه تحلیل درخت عبارات LINQ را حذف کرد:

\`\`\`csharp
private static readonly Func<AppDbContext, Guid, Task<ProductDto?>> GetProductCompiled =
    EF.CompileAsyncQuery((AppDbContext ctx, Guid id) =>
        ctx.Products.AsNoTracking().Where(p => p.Id == id).Select(p => new ProductDto(p.Id, p.Name)).FirstOrDefault());
\`\`\`

---

## ۷. ماتریس مقایسه جامع استراتژی‌های بارگذاری و بهینه‌سازی کوئری‌ها

| تکنیک | ردیابی تغییرات | تخصیص رم | رفت‌وبرگشت به دیتابیس | سناریوی کاربردی |
| :--- | :--- | :--- | :--- | :--- |
| **Eager Loading (\`Include\`)** | فعال | بالا (انتیتی کامل) | ۱ رفت‌وبرگشت | واکشی موجودیت برای ویرایش و متدهای بیزینسی |
| **Split Queries (\`AsSplitQuery\`)** | قابل تنظیم | متوسط | $1 + N$ کوئری | واکشی انتیتی دارای چند کالکشن فرزند |
| **Lazy Loading** | فعال | بالا و تکه‌تکه | $1 + N$ رفت‌وبرگشت | برنامه‌های دسکتاپ قدیمی (ممنوع در Web API) |
| **Select Projections** | **غیرفعال (صفر)** | **بسیار اندک (فقط DTO)** | **۱ رفت‌وبرگشت** | **تمام اندپوینت‌های فقط‌خواندنی REST API** |
| **\`ExecuteUpdateAsync\`** | **بای‌پس کامل** | **صفر (سمت دیتابیس)** | **۱ رفت‌وبرگشت** | ویرایش‌های گروهی و تغییر وضعیت داده‌ها |`,
};
