import { RoadmapTopic } from "../../../models";

export const aspnetDependencyInjectionLifetimesTopic: RoadmapTopic = {
  id: "topic-dotnet-aspnet-dependency-injection-lifetimes",
  stepId: "step-mid-aspnet-webapi",
  slug: "aspnet-dependency-injection-lifetimes",
  order: 2,
  title: "Dependency Injection (DI): Lifetimes, Keyed Services & Pitfalls",
  title_fa: "تزریق وابستگی (DI): طول عمر سرویس‌ها، Keyed Services و خطاهای رایج",
  summary:
    "Master Transient, Scoped, and Singleton lifetimes, prevent Captive Dependencies, understand Keyed Services in .NET 8, and factory registrations.",
  summary_fa:
    "تسلط بر طول عمرهای Transient، Scoped و Singleton، جلوگیری از باگ‌های Captive Dependency و استفاده از Keyed Services در دات‌نت ۸.",
  readingTimeMinutes: 24,
  difficulty: "mid",
  content: `## 1. Service Lifetimes in ASP.NET Core

The built-in IoC container supports three primary service lifetimes:

- **Transient (\`AddTransient\`)**: Created every time they are requested. Ideal for lightweight, stateless services.
- **Scoped (\`AddScoped\`)**: Created once per client HTTP request. Perfect for stateful services within a request (e.g. \`DbContext\`, User Context).
- **Singleton (\`AddSingleton\`)**: Created the first time they are requested and shared across the entire application lifetime. Must be thread-safe!

\`\`\`csharp
builder.Services.AddTransient<IEmailSender, SmtpEmailSender>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddSingleton<ICacheService, MemoryCacheService>();
\`\`\`

---

## 2. Captive Dependencies (The #1 DI Trap)

A **Captive Dependency** occurs when a service with a longer lifetime captures a service with a shorter lifetime (e.g., a **Singleton** consuming a **Scoped** service like \`DbContext\`):

\`\`\`csharp
// DANGEROUS ANTI-PATTERN:
public class SingletonReportWorker
{
    private readonly AppDbContext _db; // Scoped DbContext trapped in a Singleton!

    public SingletonReportWorker(AppDbContext db) => _db = db;
}

// CORRECT APPROACH (Create Scope On-Demand):
public class SingletonReportWorker
{
    private readonly IServiceScopeFactory _scopeFactory;

    public SingletonReportWorker(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task DoWorkAsync()
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Orders.ToListAsync();
    }
}
\`\`\`

---

## 3. Keyed Services in .NET 8

Register multiple implementations of the same interface differentiated by key:

\`\`\`csharp
builder.Services.AddKeyedScoped<INotificationService, EmailNotification>("email");
builder.Services.AddKeyedScoped<INotificationService, SmsNotification>("sms");

// Injected via [FromKeyedServices]:
public class AlertService(
    [FromKeyedServices("sms")] INotificationService smsSender)
{
    // ...
}
\`\`\``,
  content_fa: `## ۱. طول عمر سرویس‌ها در تزریق وابستگی

کانتینر DI توکار ASP.NET Core سه نوع طول عمر اصلی را پشتیبانی می‌کند:

- **Transient**: با هر بار درخواست یک نمونه جدید ساخته می‌شود. مناسب سرویس‌های بدون وضعیت (Stateless).
- **Scoped**: به ازای هر درخواست HTTP یک نمونه واحد ساخته و در طول همان درخواست به اشتراک گذاشته می‌شود (مانند \`DbContext\`).
- **Singleton**: در اولین فراخوانی ساخته شده و در کل طول اجرای برنامه زنده می‌ماند. پیاده‌سازی آن باید کاملاً Thread-Safe باشد.

---

## ۲. خطای وابستگی به دام افتاده (Captive Dependency)

این باگ مهلک زمانی رخ می‌دهد که یک سرویس با طول عمر طولانی‌تر (مانند Singleton) یک سرویس با طول عمر کوتاه‌تر (مانند Scoped) را در سازنده خود به عنوان وابستگی ذخیره کند:

\`\`\`csharp
// روش صحیح برای استفاده از سرویس Scoped درون Singleton:
public class SingletonReportWorker
{
    private readonly IServiceScopeFactory _scopeFactory;

    public SingletonReportWorker(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task DoWorkAsync()
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Orders.ToListAsync();
    }
}
\`\`\`

---

## ۳. قابلیت Keyed Services در دات‌نت ۸

ثبت چندین پیاده‌سازی از یک اینترفیس واحد با کلیدهای اختصاصی:

\`\`\`csharp
builder.Services.AddKeyedScoped<INotificationService, EmailNotification>("email");
builder.Services.AddKeyedScoped<INotificationService, SmsNotification>("sms");

public class AlertService([FromKeyedServices("sms")] INotificationService smsSender)
{
}
\`\`\``,
};
