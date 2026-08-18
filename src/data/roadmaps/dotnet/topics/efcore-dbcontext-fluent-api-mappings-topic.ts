import { RoadmapTopic } from "../../../models";

export const efcoreDbContextFluentApiMappingsTopic: RoadmapTopic = {
  id: "topic-dotnet-efcore-dbcontext-fluent-api-mappings",
  stepId: "step-mid-efcore-data",
  slug: "efcore-dbcontext-fluent-api-mappings",
  order: 1,
  title: "DbContext Internals, Entity Configurations & Fluent API Mappings",
  title_fa: "معماری داخلی DbContext، کانفیگ موجودیت‌ها و الگوهای Fluent API",
  summary:
    "Master Entity Framework Core internals: DbContext architecture as Unit of Work, ChangeTracker mechanics, DbContext Pooling (AddDbContextPool), IEntityTypeConfiguration, Value Converters, Strongly-Typed IDs, JSON columns (ToJson), Shadow Properties, and Global Query Filters.",
  summary_fa:
    "تسلط عمیق بر معماری داخلی Entity Framework Core: کالبدشکافی DbContext به عنوان Unit of Work، مکانیزم‌های ChangeTracker، استخر نمونه‌ها با AddDbContextPool، تفکیک پیکربندی با IEntityTypeConfiguration، نگاشت Strongly-Typed IDs، ستون‌های JSON با ToJson، ویژگی‌های سایه (Shadow Properties) و فیلترهای سراسری کوئری.",
  readingTimeMinutes: 32,
  difficulty: "mid",
  content: `## 1. Evolution: From Raw ADO.NET and Data Annotations to Clean Fluent API

In the early days of .NET data access, developers wrote low-level **ADO.NET** commands with manual SQL concatenation, connection lifecycle handling, and brittle data reader index parsing:

\`\`\`csharp
// Legacy ADO.NET (Manual plumbing, prone to SQL Injection & connection leaks)
using var connection = new SqlConnection(connectionString);
using var command = new SqlCommand("SELECT Id, TotalAmount FROM Orders WHERE CustomerId = @cId", connection);
command.Parameters.AddWithValue("@cId", customerId);
await connection.OpenAsync();
using var reader = await command.ExecuteReaderAsync();
while (await reader.ReadAsync())
{
    var order = new Order { Id = reader.GetGuid(0), TotalAmount = reader.GetDecimal(1) };
}
\`\`\`

When ORMs like Entity Framework arrived, developers initially used **Data Annotations** directly on domain entities:

\`\`\`csharp
// ANTI-PATTERN: Data Annotations pollute pure Domain Models with database metadata
[Table("tbl_Orders", Schema = "sales")]
public class Order
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int OrderId { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("order_number", TypeName = "varchar(50)")]
    public string OrderNumber { get; set; } = string.Empty;
}
\`\`\`

### Architectural Flaws of Data Annotations in Modern DDD:
1. **Pollutes Clean Architecture & Domain Entities**: In Domain-Driven Design (DDD), Domain Entities should be pure C# POCOs, completely free of persistence concerns and database annotations.
2. **Limited Expressiveness**: Data Annotations cannot express advanced mapping scenarios such as composite keys, filtered indexes, temporal tables, value object owned types, shadow properties, or table-per-hierarchy discriminators.
3. **Violates Single Responsibility**: The entity class simultaneously dictates business rules and database schema topology.

**The Solution:** The **Fluent API** configured via **\`IEntityTypeConfiguration<T>\`** completely isolates persistence concerns into dedicated configuration classes in the Infrastructure layer.

---

## 2. DbContext Internal Architecture & ChangeTracker Mechanics

At its architectural core, **\`DbContext\`** is a concrete implementation of two classic Martin Fowler Enterprise Patterns:
- **Unit of Work**: Coordinates transactions, manages database connection lifecycles, and commits atomic batches via \`SaveChangesAsync()\`.
- **Repository (\`DbSet<T>\`)**: Provides an abstraction for querying and persisting collections of domain entities.

---

### 1. The Core Internal Subsystems of \`DbContext\`
When a \`DbContext\` is initialized, it coordinates several internal engines:

1. **\`IModel\` (The Compiled Metadata Model)**:
   - EF Core executes \`OnModelCreating\` to build the complete metadata graph (entity types, foreign keys, table names, indexes, conversions).
   - **Model Caching:** Building the model is computationally expensive. EF Core compiles and caches the \`IModel\` once per \`DbContext\` type. Subsequent instances of \`AppDbContext\` reuse the cached metadata model with near-zero overhead.
2. **\`IStateManager\` & \`ChangeTracker\`**:
   - The heart of entity tracking. It stores internal \`EntityEntry\` objects that record the entity reference, its **EntityState** (\`Added\`, \`Modified\`, \`Unchanged\`, \`Deleted\`, \`Detached\`), and snapshot dictionaries of original property values.
3. **\`IDatabaseFacade\` & \`IExecutionStrategy\`**:
   - Manages physical database connections, transactions, and transient failure recovery (e.g. automatic SQL connection retries).

---

### 2. How the ChangeTracker Detects Modifications
When you query an entity without \`AsNoTracking()\`:
1. **Snapshot Creation**: EF Core reads the row from the database, instantiates the C# object, and takes a **deep clone snapshot** of all scalar and navigation properties inside the \`StateManager\`.
2. **Entity Mutation**: Your business logic modifies entity properties in memory (e.g. \`order.UpdateStatus(OrderStatus.Shipped)\`).
3. **DetectChanges Execution**: When \`SaveChangesAsync()\` is called, the \`ChangeTracker\` runs a property-by-property comparison between the current object values and the initial snapshot values.
4. **SQL Command Generation**: For every detected difference, EF Core generates an optimized, parameterized \`UPDATE\` SQL statement containing only the modified columns.

---

## 3. High-Scale Optimization: DbContext Pooling (\`AddDbContextPool\`)

In high-throughput microservices processing thousands of requests per second, instantiating and tearing down \`DbContext\` instances on every HTTP request produces noticeable CPU and Gen 0 memory allocation overhead.

### How \`AddDbContextPool\` Works Under the Hood:
Instead of creating a \`new AppDbContext()\` per request, EF Core maintains a thread-safe object pool of reusable context instances:

\`\`\`csharp
// In Program.cs:
builder.Services.AddDbContextPool<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("Database"));
}, poolSize: 1024);
\`\`\`

\`\`\`text
[HTTP Request 1] ──> Borrow DbContext from Pool ──> Execute Query ──> ResetState() ──> Return to Pool
[HTTP Request 2] ──> Borrow Same DbContext ───────> Execute Query ──> ResetState() ──> Return to Pool
\`\`\`

### The \`ResetState()\` Lifecycle:
When a pooled context is returned to the pool:
- The internal \`ChangeTracker\` is cleared and all tracked \`EntityEntry\` items are evicted.
- Active transactions and physical connection states are reset.
- Internal event listeners and cancellation token sources are cleared.

> [!IMPORTANT]
> **Constraint of DbContext Pooling:** Your \`DbContext\` class cannot store custom per-request state in private fields (e.g. injecting a scoped \`ICurrentUser\` into the context constructor). If you need per-request state, resolve it via interceptors or pass it as method arguments.

---

## 4. Mastering Fluent API: \`IEntityTypeConfiguration<T>\` & Clean Architecture

In Clean Architecture, keep your entities pure and organize mappings into dedicated configuration classes:

\`\`\`csharp
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        // 1. Table & Primary Key Mapping
        builder.ToTable("Orders", schema: "sales");
        builder.HasKey(o => o.Id);

        // 2. Strongly-Typed ID Conversion
        builder.Property(o => o.Id)
            .HasConversion(id => id.Value, value => new OrderId(value));

        // 3. Property Constraints
        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(32)
            .IsUnicode(false); // Maps to VARCHAR instead of NVARCHAR (saves 50% storage!)

        builder.Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        // 4. Concurrency Token (Optimistic Locking)
        builder.Property(o => o.RowVersion)
            .IsRowVersion();

        // 5. Unique & Filtered Indexes
        builder.HasIndex(o => o.OrderNumber)
            .IsUnique();

        builder.HasIndex(o => o.Status)
            .HasFilter("[Status] = 'Pending'")
            .HasDatabaseName("IX_Orders_PendingStatus");

        // 6. JSON Column Mapping (.NET 8/9 Feature)
        builder.OwnsOne(o => o.ShippingDetails, details =>
        {
            details.ToJson(); // Serializes the entire object graph into a single JSONB/JSON column!
        });
    }
}
\`\`\`

### Automatic Assembly Discovery:
Never register configurations manually line by line in \`OnModelCreating\`. Use assembly scanning:

\`\`\`csharp
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Customer> Customers => Set<Customer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Automatically scans the assembly and applies all IEntityTypeConfiguration classes:
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
\`\`\`

---

## 5. Advanced Mapping Patterns: Strongly-Typed IDs & Value Converters

Primitive obsession (using raw \`Guid\` or \`int\` for IDs) leads to subtle runtime bugs where an \`OrderId\` is accidentally passed into a parameter expecting a \`CustomerId\`.

### Implementing Strongly-Typed IDs with \`ValueConverter\`:

\`\`\`csharp
public readonly record struct OrderId(Guid Value)
{
    public static OrderId New() => new(Guid.NewGuid());
    public static OrderId Empty => new(Guid.Empty);
}

// Custom reusable ValueConverter
public class OrderIdConverter : ValueConverter<OrderId, Guid>
{
    public OrderIdConverter() : base(
        id => id.Value,           // To Database (OrderId -> Guid)
        value => new OrderId(value) // From Database (Guid -> OrderId)
    ) {}
}

// In Entity Configuration:
builder.Property(e => e.Id)
    .HasConversion<OrderIdConverter>();
\`\`\`

---

## 6. Shadow Properties & Global Query Filters

### 1. Shadow Properties (Persistence Without Domain Pollution)
Shadow properties are properties that exist in the database table and EF Core metadata model, but **do not exist as C# properties on the domain entity class**:

\`\`\`csharp
// Defining audit shadow properties for all auditable entities:
public class AuditConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.Property<DateTime>("CreatedAt").IsRequired();
        builder.Property<DateTime?>("LastModifiedAt");
        builder.Property<string>("CreatedBy").HasMaxLength(100);
    }
}

// Reading shadow properties in LINQ queries using EF.Property<T>:
var recentOrders = await context.Orders
    .Where(o => EF.Property<DateTime>(o, "CreatedAt") >= DateTime.UtcNow.AddDays(-7))
    .ToListAsync();
\`\`\`

### 2. Global Query Filters (Soft Deletes & Multi-Tenancy)
Global Query Filters are LINQ predicates automatically applied to all queries against an entity type:

\`\`\`csharp
// 1. Soft Delete & Multi-Tenant Global Filter
builder.Entity<Order>().HasQueryFilter(o => !o.IsDeleted && o.TenantId == _tenantProvider.CurrentTenantId);

// 2. Executing standard queries (Filter is automatically injected into generated SQL WHERE clause):
var activeOrders = await context.Orders.ToListAsync(); 
// SQL: SELECT * FROM Orders WHERE IsDeleted = 0 AND TenantId = 'tenant-123'

// 3. Bypassing the filter when needed (e.g. Admin audit logs or restore deleted items):
var allOrdersIncludingDeleted = await context.Orders
    .IgnoreQueryFilters()
    .ToListAsync();
\`\`\`

---

## 7. Master Comparison Matrix: Data Annotations vs. Fluent API vs. IEntityTypeConfiguration

| Feature / Metric | Data Annotations | Inline \`OnModelCreating\` | \`IEntityTypeConfiguration<T>\` |
| :--- | :--- | :--- | :--- |
| **Separation of Concerns** | ❌ Poor (Pollutes Domain Entities) | Moderate (Stored in DbContext) | **✅ Perfect (Dedicated Mapping Class)** |
| **Domain-Driven Design Purity** | ❌ Violates DDD POCO rules | ✅ Preserves DDD Entities | **✅ 100% DDD Compliant** |
| **Advanced Features Support** | ❌ Basic properties only | ✅ Full EF Core capability | **✅ Full EF Core capability** |
| **Maintainability in Large Apps** | ❌ Scattered across models | ❌ Monolithic 2000-line method | **✅ 1 File per Entity (Clean & Modular)** |
| **Composite Keys & Filtered Indexes** | ❌ Unsupported | ✅ Supported | **✅ Fully Supported** |
| **Strongly-Typed IDs & Value Converters** | ❌ Unsupported | ✅ Supported | **✅ Fully Supported** |
| **Assembly Scanning Support** | N/A | ❌ Manual | **✅ Automatic (\`ApplyConfigurationsFromAssembly\`)** |`,
  content_fa: `## ۱. سیر تکامل: از کدهای دستی ADO.NET و Data Annotations تا معماری تمیز Fluent API

در نسخه‌های ابتدایی دسترسی به داده در دات‌نت، برنامه‌نویسان ناچار به استفاده از کدهای سطح پایین **ADO.NET** با اتصال مستقیم به رشته‌های متنی SQL و مدیریت دستی کانکشن‌ها بودند:

\`\`\`csharp
// کدهای سنتی ADO.NET (سربار بالا، مدیریت دستی کانکشن و ریسک نشت منابع)
using var connection = new SqlConnection(connectionString);
using var command = new SqlCommand("SELECT Id, TotalAmount FROM Orders WHERE CustomerId = @cId", connection);
command.Parameters.AddWithValue("@cId", customerId);
await connection.OpenAsync();
using var reader = await command.ExecuteReaderAsync();
// ...
\`\`\`

با پیدایش ORMها، در ابتدا اتریبیوت‌های **Data Annotations** مستقیماً روی انتیتی‌ها قرار می‌گرفتند:

\`\`\`csharp
// الگوی ضدکارایی: آلوده کردن انتیتی‌های دامنه به متادیتای دیتابیس
[Table("tbl_Orders")]
public class Order
{
    [Key]
    public int OrderId { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("order_number")]
    public string OrderNumber { get; set; } = string.Empty;
}
\`\`\`

### معایب Data Annotations در معماری‌های نوین (DDD):
۱. **نقض اصول معماری تمیز (Clean Architecture)**: موجودیت‌های دامنه (Domain Entities) باید کلاس‌های خالص C# (POCO) باشند و نباید به جزئیات لایه پایگاه داده وابسته شوند.
۲. **محدودیت‌های فنی**: امکان تعریف کلیدهای ترکیبی، ایندکس‌های شرطی (Filtered Indexes)، کانورترهای اختصاصی و ستون‌های JSON با اتریبیوت‌ها وجود ندارد.
۳. **تداخل وظایف**: کلاس انتیتی به جای تمرکز بر منطق تجاری، مسئولیت تعریف ساختار فیزیکی جداول دیتابیس را نیز بر عهده می‌گیرد.

**راهکار قطعی:** استفاده از **Fluent API** و تفکیک هر انتیتی در کلاس مستقل با اینترفیس **\`IEntityTypeConfiguration<T>\`** در لایه زیرساخت (Infrastructure).

---

## ۲. کالبدشکافی معماری داخلی DbContext و موتور ChangeTracker

در مهندسی نرم‌افزار، شیء **\`DbContext\`** پیاده‌سازی دو الگوی کلاسیک مارتین فاولر است:
- **Unit of Work**: مدیریت یکپارچه تراکنش‌ها، ارتباط با دیتابیس و ذخیره اتمیک تغییرات با \`SaveChangesAsync\`.
- **Repository (\`DbSet<T>\`)**: انتزاع مجموعه‌ای از داده‌ها جهت کوئری‌گیری و اعمال تغییرات روی موجودیت‌ها.

---

### ۱. زیرسیستم‌های داخلی DbContext:
۱. **موتور مدل متادیتا (\`IModel\`)**:
   - در اولین فراخوانی متد \`OnModelCreating\`، نگاشت تمام موجودیت‌ها، ایندکس‌ها و کلیدهای خارجی استخراج می‌شود.
   - **کشینگ مدل (Model Caching):** از آنجا که ساخت مدل بسیار سنگین است، EF Core این ساختار را در سطح کل برنامه کش می‌کند تا نمونه‌های بعدی \`DbContext\` بدون کوچک‌ترین تاخیری شروع به کار کنند.
۲. **موتور ردیابی تغییرات (\`ChangeTracker\` و \`StateManager\`)**:
   - قلب ردیابی اشیاء در حافظه. برای هر انتیتی یک شیء داخلی \`EntityEntry\` ایجاد کرده و وضعیت آن را در پنج حالت (\`Added\`، \`Modified\`، \`Unchanged\`، \`Deleted\`، \`Detached\`) نگهداری می‌کند.

---

### ۲. نحوه تشخیص تغییرات توسط ChangeTracker:
۱. **ایجاد تصویر لحظه‌ای (Snapshot):** در زمان کوئری‌گیری، داده‌ها خوانده شده و یک کپی کامل از مقادیر اولیه تمام فیلدها در \`StateManager\` ذخیره می‌شود.
۲. **تغییر در متغیرها:** متدهای بیزینسی مقادیر پراپرتی‌ها را در رم تغییر می‌دهند.
۳. **فراخوانی DetectChanges:** هنگام اجرای \`SaveChangesAsync\`، موتور ChangeTracker مقادیر فعلی شیء را با تصویر اولیه مقایسه می‌کند.
۴. **تولید کوئری SQL بهینه:** دقیقاً برای ستون‌هایی که تغییر کرده‌اند، دستور بهینه‌سازی‌شده \`UPDATE\` با پارامترهای SQL تولید و به دیتابیس ارسال می‌شود.

---

## ۳. بهینه‌سازی مقیاس‌بالا: استخر نمونه‌ها با DbContext Pooling (\`AddDbContextPool\`)

در میکروسرویس‌های پرترافیک، ساخت و نابودی مداوم شیء \`DbContext\` در هر درخواست وب باعث فشار به Garbage Collector و تخصیص مداوم رم در Gen 0 می‌شود.

### سازوکار استخر \`AddDbContextPool\`:
به جای ساخت شیء با دستور \`new\`، فریم‌ورک یک استخر از نمونه‌های آماده نگهداری می‌کند:

\`\`\`csharp
// در فایل Program.cs:
builder.Services.AddDbContextPool<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("Database"));
}, poolSize: 1024);
\`\`\`

### چرخه حیات متد \`ResetState()\`:
هنگامی که یک نمونه \`DbContext\` به استخر بازگردانده می‌شود:
- کلیه انتیتی‌های ردیابی‌شده در \`ChangeTracker\` پاکسازی می‌شوند.
- تراکنش‌ها و کانکشن‌های فعال ریست می‌گردند.
- منابع آزاد شده و شیء برای درخواست بعدی آماده می‌شود.

---

## ۴. پیکربندی حرفه‌ای با \`IEntityTypeConfiguration<T>\`

\`\`\`csharp
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        // ۱. نگاشت جدول و کلید اصلی
        builder.ToTable("Orders", schema: "sales");
        builder.HasKey(o => o.Id);

        // ۲. نگاشت Strongly-Typed ID
        builder.Property(o => o.Id)
            .HasConversion(id => id.Value, value => new OrderId(value));

        // ۳. محدودیت‌های فیلدها و بهینه‌سازی ذخیره‌سازی
        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(32)
            .IsUnicode(false); // نگاشت به VARCHAR به جای NVARCHAR جهت کاهش ۵۰ درصدی حجم دیسک!

        builder.Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        // ۴. مدیریت همزمانی با Concurrency Token (RowVersion)
        builder.Property(o => o.RowVersion)
            .IsRowVersion();

        // ۵. ایندکس‌های فیلترشده (Filtered Indexes)
        builder.HasIndex(o => o.Status)
            .HasFilter("[Status] = 'Pending'")
            .HasDatabaseName("IX_Orders_Pending");

        // ۶. نگاشت ستون JSON در دات‌نت ۸ و ۹
        builder.OwnsOne(o => o.ShippingDetails, details =>
        {
            details.ToJson(); // ذخیره کل ساختار به عنوان ستون JSONB در دیتابیس!
        });
    }
}
\`\`\`

### اسکن خودکار در متد \`OnModelCreating\`:
\`\`\`csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    // اسکن خودکار اسمبلی و اعمال تمامی کلاس‌های IEntityTypeConfiguration:
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
}
\`\`\`

---

## ۵. نگاشت شناسه‌های با تایپ قوی (Strongly-Typed IDs) با ValueConverter

برای جلوگیری از خطای Primitive Obsession (ارسال اشتباهی \`CustomerId\` به جای \`OrderId\`):

\`\`\`csharp
public readonly record struct OrderId(Guid Value)
{
    public static OrderId New() => new(Guid.NewGuid());
}

// در کلاس پیکربندی انتیتی:
builder.Property(e => e.Id)
    .HasConversion(id => id.Value, value => new OrderId(value));
\`\`\`

---

## ۶. ویژگی‌های سایه (Shadow Properties) و فیلترهای سراسری کوئری (Global Query Filters)

### ۱. ویژگی‌های سایه (Shadow Properties):
فیلدهایی که در جدول پایگاه داده وجود دارند اما در کلاس دامنه‌ای C# تعریف نشده‌اند (جهت عدم آلودگی دامنه):
\`\`\`csharp
builder.Property<DateTime>("CreatedAt").IsRequired();
builder.Property<string>("LastModifiedBy").HasMaxLength(100);

// کوئری‌گیری روی ویژگی‌های سایه با EF.Property:
var recent = await context.Orders
    .Where(o => EF.Property<DateTime>(o, "CreatedAt") >= DateTime.UtcNow.AddDays(-1))
    .ToListAsync();
\`\`\`

### ۲. فیلترهای سراسری کوئری (Global Query Filters):
اعمال خودکار شروط روی تمام کوئری‌ها (مانند حذف نرم یا تفکیک داده‌های مشتریان Multi-Tenancy):
\`\`\`csharp
// فیلتر خودکار حذف منطقی:
builder.Entity<Order>().HasQueryFilter(o => !o.IsDeleted);

// دور زدن فیلتر در صورت نیاز (مانند پنل ادمین جهت بازیابی):
var allOrders = await context.Orders.IgnoreQueryFilters().ToListAsync();
\`\`\`

---

## ۷. ماتریس مقایسه جامع روش‌های پیکربندی در EF Core

| بعد مقایسه | روش Data Annotations | کدنویسی مستقیم در \`OnModelCreating\` | تفکیک با \`IEntityTypeConfiguration<T>\` |
| :--- | :--- | :--- | :--- |
| **تفکیک دغدغه‌ها (SoC)** | ❌ ضعیف (آلودگی دامنه به دیتابیس) | متوسط (تجمع در کلاس DbContext) | **✅ بی‌نقص (کلاس‌های اختصاصی در لایه Infra)** |
| **سازگاری با DDD خالص** | ❌ نقض اصول POCO | ✅ حفظ انتیتی‌های خالص | **✅ ۱۰۰٪ منطبق بر اصول Domain-Driven Design** |
| **پشتیبانی از قابلیت‌های پیشرفته** | ❌ فقط تعاریف ابتدایی | ✅ پشتیبانی کامل از تمام امکانات | **✅ پشتیبانی کامل از ایندکس، JSON و Concurrency** |
| **نگهداری در پروژه‌های بزرگ** | ❌ پراکنده در مدل‌ها | ❌ ایجاد متدهای غول‌پیکر چند هزار خطی | **✅ تفکیک منظم (یک فایل به ازای هر انتیتی)** |
| **کلیدهای ترکیبی و ایندکس شرطی** | ❌ پشتیبانی نمی‌شود | ✅ پشتیبانی می‌شود | **✅ کاملاً پشتیبانی می‌شود** |
| **ثبت خودکار با اسکن اسمبلی** | کاربردی ندارد | ❌ نیازمند ثبت دستی | **✅ کاملاً خودکار با \`ApplyConfigurationsFromAssembly\`** |`,
};
