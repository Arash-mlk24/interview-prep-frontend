import { RoadmapTopic } from "../../../models";

export const aspnetDependencyInjectionLifetimesTopic: RoadmapTopic = {
  id: "topic-dotnet-aspnet-dependency-injection-lifetimes",
  stepId: "step-mid-aspnet-webapi",
  slug: "aspnet-dependency-injection-lifetimes",
  order: 2,
  title: "Dependency Injection (DI): Lifetimes, Keyed Services & Pitfalls",
  title_fa: "تزریق وابستگی (DI): طول عمر سرویس‌ها، Keyed Services و خطاهای مهلک",
  summary:
    "Master the internal mechanics of Microsoft.Extensions.DependencyInjection, Transient IDisposable root memory leaks, Captive Dependencies, Scoped validation, BackgroundService scope creation, and .NET 8/9 Keyed Services.",
  summary_fa:
    "تسلط عمیق بر معماری داخلی کانتینر DI در دات‌نت، نشت حافظه ناشی از Transient IDisposable، باگ مهلک Captive Dependency، اعتبارسنجی اسکوپ‌ها با ValidateScopes، مدیریت اسکوپ در BackgroundService و استفاده از Keyed Services در دات‌نت ۸ و ۹.",
  readingTimeMinutes: 28,
  difficulty: "mid",
  content: `## 1. Evolution: From Service Locator Anti-Patterns to First-Class IoC

In legacy .NET Framework architectures, applications frequently relied on the **Service Locator Anti-Pattern** or static dependency accessors:

\`\`\`csharp
// ANTI-PATTERN: Service Locator (Hidden dependencies, impossible to unit test)
public class OrderProcessor
{
    public void Process(Order order)
    {
        // Hidden runtime dependency! The class signature hides what it needs to function.
        var db = ServiceLocator.Current.GetInstance<AppDbContext>();
        var payment = ServiceLocator.Current.GetInstance<IPaymentGateway>();
        var logger = ServiceLocator.Current.GetInstance<ILogger<OrderProcessor>>();

        // ...
    }
}
\`\`\`

### Architectural Flaws of Service Locator:
1. **Hidden Contract**: Callers cannot determine an object's external dependencies without inspecting its implementation.
2. **Runtime Failures**: Missing registrations cause runtime crashes rather than fail-fast initialization errors.
3. **Impaired Testability**: Mocking requires setting up global static ambient state across parallel unit tests, resulting in test race conditions.

ASP.NET Core elevated **Dependency Injection (DI)** into a core architectural primitive via \`Microsoft.Extensions.DependencyInjection\` (MEDIB), enforcing **Explicit Constructor Injection** and strict lifetime management.

---

## 2. Deep Architectural Breakdown: DI Container Internals & Scope Hierarchy

![.NET Dependency Injection (DI) Service Lifetimes and Scope Hierarchy](/images/roadmaps/aspnet-dependency-injection-lifetimes.jpg)

### 1. How the IoC Container Resolves Services Internally
When you build the application (\`builder.Build()\`), the DI engine operates through specialized internal components:
1. **\`ServiceTable\`**: An internal indexed registry storing every \`ServiceDescriptor\` (ServiceType, ImplementationType, Lifetime, ImplementationFactory/Instance).
2. **\`CallSiteFactory\`**: Analyzes constructor parameter graphs at runtime or compile-time to construct an abstract **Call Site Tree**.
3. **\`ServiceProviderEngine\`**: Compiles the Call Site Tree into optimized IL code (via \`ILEmitResolverBuilder\` or \`DynamicMethod\`) or compiled expressions. Once warmed up, service resolution performs at near hand-written \`new\` speed!

---

### 2. The Three Service Lifetimes

| Lifetime | Method | Instantiation Rule | Container Scope | Disposal Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Transient** | \`AddTransient<T, U>()\` | New instance created **every single time** requested | Resolved at callsite | Disposed when enclosing \`IServiceScope\` is disposed |
| **Scoped** | \`AddScoped<T, U>()\` | Single instance created **once per \`IServiceScope\`** | Tied to HTTP Request or custom scope | Automatically disposed at end of HTTP request/scope |
| **Singleton** | \`AddSingleton<T, U>()\` | Single instance created **once for entire app lifetime** | Root \`IServiceProvider\` | Disposed only when application shuts down |

---

## 3. The Transient \`IDisposable\` Memory Leak (The Silent Root Leak)

One of the most dangerous and elusive memory leaks in high-scale .NET services occurs when resolving **Transient** services that implement \`IDisposable\` or \`IAsyncDisposable\` from the **Root Provider**:

\`\`\`csharp
public class FileExporter : IDisposable
{
    private readonly FileStream _stream;
    public FileExporter() => _stream = new FileStream("export.log", FileMode.Append);

    public void Dispose() => _stream.Dispose();
}

// In Program.cs:
builder.Services.AddTransient<FileExporter>();
var app = builder.Build();

// DISASTROUS ANTI-PATTERN: Resolving Transient Disposable from Root Provider
app.MapGet("/export", (IServiceProvider rootProvider) =>
{
    // The container creates a new FileExporter on EVERY request...
    var exporter = rootProvider.GetRequiredService<FileExporter>();
    exporter.DoExport();
    
    // Even if you call exporter.Dispose(), the ROOT CONTAINER holds a strong reference
    // to exporter inside its internal '_disposables' list until the application terminates!
    return Results.Ok();
});
\`\`\`

### The Mechanics of the Leak:
The IoC container takes ownership of every disposable object it instantiates. Because the root container never terminates during normal operation, its internal \`List<IDisposable>\` grows monotonically with every HTTP request, leaking millions of bytes and native file handles until an **OutOfMemoryException** crashes the server!

**Golden Rule:** Always resolve disposable services within a dedicated \`IServiceScope\` (such as an incoming HTTP request scope or an explicitly created scope).

---

## 4. Captive Dependencies: Mechanics, Catastrophic Pitfalls & Automated Detection

A **Captive Dependency** occurs when a service with a longer lifetime captures a service with a shorter lifetime (most commonly, a **Singleton capturing a Scoped service**).

\`\`\`csharp
// SCENARIO: A Singleton Background Service capturing a Scoped DbContext
public class MetricPublisherSingleton
{
    private readonly AppDbContext _dbContext; // FATAL: Scoped DbContext trapped inside Singleton!

    public MetricPublisherSingleton(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task PublishMetricsAsync()
    {
        // 1. Thread Safety Violation: Concurrent HTTP requests and worker threads
        // access the SAME DbContext instance concurrently!
        // Throws: "InvalidOperationException: A second operation was started on this context before a previous operation completed."
        
        // 2. Memory Leak: EF Core's ChangeTracker retains every queried entity in RAM forever,
        // continuously ballooning heap memory!
        
        // 3. Stale Data: Cached entities are never re-queried from the database.
        var metrics = await _dbContext.SystemMetrics.ToListAsync();
    }
}
\`\`\`

---

### Automated Prevention: \`ValidateScopes\` and \`ValidateOnBuild\`

ASP.NET Core provides built-in validation in the \`DefaultServiceProviderFactory\`:

\`\`\`csharp
var builder = WebApplication.CreateBuilder(args);

// Ensure strict container validation in ALL environments (including Staging/Production CI):
builder.Host.UseDefaultServiceProvider((context, options) =>
{
    // Throws exception immediately if a Singleton resolves/captures a Scoped service:
    options.ValidateScopes = true;

    // Validates that ALL registered services can be successfully resolved at startup:
    options.ValidateOnBuild = true;
});
\`\`\`

> [!WARNING]
> By default, \`ValidateScopes\` is only enabled when \`EnvironmentName == "Development"\`. In Production, missing scope validation will allow Captive Dependencies to pass silently, causing concurrency crashes under live customer load!

---

## 5. Managing Scopes in Background Services & Hosted Services

\`BackgroundService\` and \`IHostedService\` implementations are registered as **Singletons** by the framework. To use Scoped dependencies (like EF Core \`DbContext\` or MediatR \`ISender\`), you must create an explicit scope:

\`\`\`csharp
public class OrderProcessingWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<OrderProcessingWorker> _logger;

    public OrderProcessingWorker(
        IServiceScopeFactory scopeFactory,
        ILogger<OrderProcessingWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // Use 'await using' with CreateAsyncScope() for deterministic async cleanup (.NET 8/9):
            await using (var scope = _scopeFactory.CreateAsyncScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var processor = scope.ServiceProvider.GetRequiredService<IOrderProcessor>();

                var pendingOrders = await db.Orders
                    .Where(o => o.Status == OrderStatus.Pending)
                    .Take(10)
                    .ToListAsync(stoppingToken);

                foreach (var order in pendingOrders)
                {
                    await processor.ProcessAsync(order, stoppingToken);
                }

                await db.SaveChangesAsync(stoppingToken);
            } // Scope disposed here: DbContext connections and resources deterministically released!

            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }
}
\`\`\`

---

## 6. Keyed Services in .NET 8 and .NET 9

In previous .NET versions, resolving different implementations of the same interface required custom factory delegates or third-party containers (Autofac). .NET 8 introduced first-class **Keyed Services**:

\`\`\`csharp
// 1. Service Registration with Unique Keys
builder.Services.AddKeyedSingleton<ICacheService, MemoryCacheService>("in-memory");
builder.Services.AddKeyedSingleton<ICacheService, RedisCacheService>("distributed");

builder.Services.AddKeyedScoped<IPaymentGateway, StripePaymentGateway>("stripe");
builder.Services.AddKeyedScoped<IPaymentGateway, PayPalPaymentGateway>("paypal");

// 2. Primary Constructor Injection with [FromKeyedServices]
public class CheckoutService(
    [FromKeyedServices("stripe")] IPaymentGateway primaryGateway,
    [FromKeyedServices("paypal")] IPaymentGateway fallbackGateway,
    [FromKeyedServices("distributed")] ICacheService cache)
{
    public async Task CheckoutAsync(Order order)
    {
        // Clean, direct, compile-time verified injection!
        await primaryGateway.ProcessPaymentAsync(order);
    }
}

// 3. Dynamic Runtime Key Resolution with IKeyedServiceProvider
public class DynamicPaymentFactory(IKeyedServiceProvider serviceProvider)
{
    public IPaymentGateway GetGateway(string providerName)
    {
        return serviceProvider.GetKeyedService<IPaymentGateway>(providerName)
            ?? throw new NotSupportedException($"Payment provider '{providerName}' is not configured.");
    }
}
\`\`\`

---

## 7. Master Comparison Matrix: Service Lifetimes in .NET

| Dimension | Transient (\`AddTransient\`) | Scoped (\`AddScoped\`) | Singleton (\`AddSingleton\`) |
| :--- | :--- | :--- | :--- |
| **Instance Count** | Multiplicity (N instances) | 1 per Scope / HTTP Request | **Strictly 1 per Application** |
| **Statefulness** | Strictly Stateless | Request-Stateful | Globally Stateful (Thread-Safe) |
| **Thread Safety** | Safe (Used by 1 thread/callsite) | Safe within single request | **Mandatory Thread-Safety (Concurrent locks/CAS)** |
| **Typical Examples** | Lightweight calculators, formatters | \`DbContext\`, \`IUnitOfWork\`, \`TenantContext\` | \`MemoryCache\`, \`HttpClient\`, Feature Flags |
| **Disposal Point** | When enclosing Scope dies | At end of HTTP request | At application termination |
| **Biggest Pitfall** | Resolving from Root leaks memory | Captive Dependency in Singleton | Mutable state concurrency race conditions |`,
  content_fa: `## ۱. سیر تکامل: از الگوهای ضدکارایی Service Locator تا معماری استاندارد IoC

در معماری‌های قدیمی دات‌نت، دسترسی به سرویس‌ها غالباً از طریق الگوهای ضدکارایی مانند **Service Locator** یا متغیرهای استاتیک انجام می‌شد:

\`\`\`csharp
// الگوی ضدکارایی Service Locator (وابستگی‌های پنهان و تست‌ناپذیر)
public class OrderProcessor
{
    public void Process(Order order)
    {
        // وابستگی پنهان! امضای کلاس مشخص نمی‌کند که برای کار به چه سرویس‌هایی نیاز دارد.
        var db = ServiceLocator.Current.GetInstance<AppDbContext>();
        var payment = ServiceLocator.Current.GetInstance<IPaymentGateway>();
        // ...
    }
}
\`\`\`

### معایب الگوی Service Locator:
۱. **پنهان ماندن وابستگی‌ها**: برای فهمیدن نیازمندی‌های یک کلاس باید تمام خطوط کد آن بررسی شود.
۲. **خطاهای زمان اجرا**: در صورت فراموشی ثبت یک سرویس، خطا در زمان اجرای متد رخ می‌دهد نه در زمان استارتاپ.
۳. **تداخل در تست‌های موازی**: تست‌های واحد به متغیرهای گلوبال وابسته شده و در اجرای چندنخی دچار تصادم می‌شوند.

فریم‌ورک ASP.NET Core با معرفی کانتینر توکار \`Microsoft.Extensions.DependencyInjection\`، **تزریق صریح از طریق سازنده (Explicit Constructor Injection)** را به استاندارد قطعی تبدیل کرد.

---

## ۲. کالبدشکافی معماری کانتینر DI و سلسله‌مراتب اسکوپ‌ها

![.NET Dependency Injection (DI) Service Lifetimes and Scope Hierarchy](/images/roadmaps/aspnet-dependency-injection-lifetimes.jpg)

### ۱. فرآیند درونی تحلیل و ساخت سرویس‌ها:
۱. **\`ServiceTable\`**: جدول ایندکس‌شده داخلی که مشخصات تمام سرویس‌های ثبت‌شده (\`ServiceDescriptor\`) را نگهداری می‌کند.
۲. **\`CallSiteFactory\`**: نمودار درخت وابستگی‌های سازنده را تحلیل می‌کند.
۳. **\`ServiceProviderEngine\`**: با استفاده از کامپایل پویا کدهای IL مستقیمی تولید می‌کند تا سرعت ساخت نمونه‌ها معادل دستور \`new\` مستقیم در C# باشد.

---

### ۲. مقایسه طول عمرهای سه‌گانه (Service Lifetimes)

| طول عمر | نحوه ثبت | قاعده نمونه‌سازی | حوزه کانتینر | نحوه پاکسازی (Disposal) |
| :--- | :--- | :--- | :--- | :--- |
| **Transient** | \`AddTransient\` | در هر بار فراخوانی یک نمونه کاملاً جدید | محل فراخوانی (Callsite) | با نابودی اسکوپ دربرگیرنده آزاد می‌شود |
| **Scoped** | \`AddScoped\` | یک نمونه واحد به ازای هر اسکوپ یا درخواست HTTP | وابسته به درخواست HTTP | در انتهای درخواست وب به صورت خودکار آزاد می‌شود |
| **Singleton** | \`AddSingleton\` | تنها یک نمونه واحد برای کل طول عمر اپلیکیشن | کانتینر ریشه (Root Provider) | تنها در زمان خاموش شدن برنامه آزاد می‌شود |

---

## ۳. نشت حافظه پنهان با Transient IDisposable در کانتینر ریشه

یکی از خطرناک‌ترین نشت‌های حافظه زمانی رخ می‌دهد که یک سرویس **Transient** که اینترفیس \`IDisposable\` را پیاده‌سازی کرده، مستقیماً از **کانتینر ریشه (Root Provider)** فراخوانی شود:

\`\`\`csharp
// خطای مهلک: فراخوانی Transient یکبارمصرف از Root Provider
app.MapGet("/export", (IServiceProvider rootProvider) =>
{
    var exporter = rootProvider.GetRequiredService<FileExporter>();
    exporter.DoExport();
    
    // حتی با فراخوانی Dispose دستی، کانتینر ریشه یک ارجاع قوی در لیست داخلی '_disposables'
    // خود تا زمان متوقف شدن سرور نگه می‌دارد!
    return Results.Ok();
});
\`\`\`

کانتینر DI مسئولیت آزادسازی تمام اشیای ساخت‌شده را بر عهده می‌گیرد. چون کانتینر ریشه هرگز تا پایان کار برنامه نابود نمی‌شود، لیست داخلی اشیای Disposable آن با هر درخواست رشد کرده و در نهایت خطای **OutOfMemoryException** رخ می‌دهد.

---

## ۴. خطای وابستگی به دام افتاده (Captive Dependency) و اعتبارسنجی خودکار

باگ **Captive Dependency** زمانی رخ می‌دهد که یک سرویس با طول عمر طولانی‌تر، سرویسی با طول عمر کوتاه‌تر را در سازنده خود به دام بیندازد (مانند تزریق \`DbContext\` اسکوپ‌شده در یک سرویس \`Singleton\`):

\`\`\`csharp
public class MetricPublisherSingleton
{
    private readonly AppDbContext _dbContext; // فاجعه: به دام افتادن DbContext در Singleton!

    public MetricPublisherSingleton(AppDbContext dbContext) => _dbContext = dbContext;

    public async Task PublishMetricsAsync()
    {
        // ۱. خطای همزمانی چندنخی: درخواست‌های همزمان به یک DbContext مشترک دسترسی پیدا می‌کنند:
        // "InvalidOperationException: A second operation was started on this context..."
        // ۲. نشت رم: کش داخلی ChangeTracker هیچ‌گاه پاک نشده و رم سرور را پر می‌کند.
        var metrics = await _dbContext.SystemMetrics.ToListAsync();
    }
}
\`\`\`

### جلوگیری خودکار با \`ValidateScopes\`:
\`\`\`csharp
builder.Host.UseDefaultServiceProvider((context, options) =>
{
    options.ValidateScopes = true; // جلوگیری از Captive Dependency و پرتاب خطا در استارتاپ
    options.ValidateOnBuild = true; // اطمینان از ثبت بودن تمام وابستگی‌ها
});
\`\`\`

---

## ۵. مدیریت صحیح اسکوپ در سرویس‌های پس‌زمینه (BackgroundService)

کلاس‌های \`BackgroundService\` به صورت پیش‌فرض **Singleton** هستند. برای استفاده از سرویس‌های Scoped باید از \`IServiceScopeFactory\` استفاده شود:

\`\`\`csharp
public class OrderProcessingWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public OrderProcessingWorker(IServiceScopeFactory scopeFactory) => _scopeFactory = scopeFactory;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // ساخت اسکوپ موقت با متد مدرن CreateAsyncScope (.NET 8/9):
            await using (var scope = _scopeFactory.CreateAsyncScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var pendingOrders = await db.Orders.Where(o => o.Status == OrderStatus.Pending).ToListAsync(stoppingToken);
                // ...
            } // پاکسازی قطعی منابع دیتابیس در انتهای این بلاک

            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }
}
\`\`\`

---

## ۶. قابلیت Keyed Services در دات‌نت ۸ و ۹

با این قابلیت می‌توان چندین پیاده‌سازی از یک اینترفیس را با کلیدهای مجزا ثبت و تزریق کرد:

\`\`\`csharp
// ۱. ثبت سرویس‌ها با کلیدهای اختصاصی
builder.Services.AddKeyedSingleton<ICacheService, MemoryCacheService>("in-memory");
builder.Services.AddKeyedSingleton<ICacheService, RedisCacheService>("distributed");

// ۲. تزریق مستقیم در سازنده با [FromKeyedServices]
public class CheckoutService(
    [FromKeyedServices("distributed")] ICacheService cache,
    [FromKeyedServices("stripe")] IPaymentGateway paymentGateway)
{
    // ...
}
\`\`\`

---

## ۷. ماتریس مقایسه جامع طول عمرهای تزریق وابستگی در دات‌نت

| بعد مقایسه | طول عمر Transient | طول عمر Scoped | طول عمر Singleton |
| :--- | :--- | :--- | :--- |
| **تعداد نمونه‌ها** | نامحدود (به ازای هر فراخوانی) | **۱ نمونه به ازای هر درخواست/اسکوپ** | **دقیقاً ۱ نمونه برای کل اپلیکیشن** |
| **نگهداری وضعیت** | کاملاً بدون وضعیت (Stateless) | دارای وضعیت در طول همان درخواست | **وضعیت سراسری (نیازمند Thread-Safety)** |
| **ایمنی چندنخی** | امن (استفاده در یک نخ/فراخوانی) | امن در طول همان درخواست وب | **الزام رعایت ایمنی در برابر Race Condition** |
| **نمونه‌های کاربردی** | محاسبات سبک و فرمت‌کننده‌ها | \`DbContext\`، \`IUnitOfWork\`، \`TenantContext\` | \`MemoryCache\`، \`HttpClient\`، تنظیمات ثابت |
| **زمان آزادسازی** | هنگام نابودی اسکوپ جاری | **در انتهای پردازش درخواست HTTP** | در زمان خاموش شدن کامل سرور |
| **بزرگ‌ترین تله فنی** | نشت حافظه در فراخوانی از ریشه | **خطای Captive Dependency در Singleton** | تداخل داده‌ها در پردازش همزمان چندنخی |`,
};
