import { RoadmapTopic } from "../../../models";

export const diagnosticsStructuredLoggingSerilogTopic: RoadmapTopic = {
  id: "topic-dotnet-diagnostics-structured-logging-serilog",
  stepId: "step-mid-diagnostics-docker",
  slug: "diagnostics-structured-logging-serilog",
  order: 1,
  title: "Structured Logging with Serilog & Log Levels",
  title_fa: "لاگینگ ساخت‌یافته (Structured Logging) با Serilog و استانداردهای لاگ",
  summary:
    "Master structured semantic logging, message templates vs string interpolation, Log Levels (Trace to Critical), Serilog sinks (Elasticsearch, Seq, Console), and contextual enrichment.",
  summary_fa:
    "تسلط بر ثبت ساخت‌یافته لاگ‌ها (JSON)، پرهیز از چسباندن رشته‌ها با Template، سطوح لاگینگ (از Trace تا Critical)، اتصال به Sinks و غنی‌سازی متادیتا (Enrichment).",
  readingTimeMinutes: 20,
  difficulty: "mid",
  content: `## 1. Message Templates vs String Interpolation

**Critical Rule**: Never use string interpolation ($\`"..."\`) in loggers! It destroys structured properties for indexing in Elasticsearch / Seq / CloudWatch.

\`\`\`csharp
// ❌ WRONG (String interpolation loses searchable property values):
logger.LogInformation($"Order {order.Id} placed by user {order.UserId} for amount {order.Total}");

// ✅ CORRECT (Structured Message Template):
logger.LogInformation("Order {OrderId} placed by user {UserId} for amount {TotalAmount}",
    order.Id, order.UserId, order.Total);
\`\`\`

---

## 2. Serilog Setup in ASP.NET Core

\`\`\`csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console(new JsonFormatter())
    .WriteTo.Seq("http://seq:5341")
    .CreateLogger();

builder.Host.UseSerilog();
\`\`\`

---

## 3. Log Levels & Best Practices

- **Trace / Debug**: Diagnostic development details (payloads, internal steps).
- **Information**: Normal business events (UserRegistered, OrderCreated).
- **Warning**: Unexpected non-fatal issues (PaymentRetry, DegradedCache).
- **Error**: Operation failures requiring investigation (DatabaseTimeoutException).
- **Critical**: System crash or catastrophic failure (OutOfMemory, DataCorruption).`,
  content_fa: `## ۱. الگوهای پیامی (Message Templates) در مقابل الحاق رشته

استفاده از \`$"..."\` در متدهای لاگینگ اشتباه است زیرا فیلدهای داده را به یک متن ساده تبدیل کرده و قابلیت جستجو و فیلتر ساختاریافته در ابزارهایی مانند Seq و Elasticsearch را از بین می‌برد:

\`\`\`csharp
// روش صحیح با استفاده از متغیرهای نام‌گذاری شده در قالب:
logger.LogInformation("Order {OrderId} placed by user {UserId} for amount {TotalAmount}",
    order.Id, order.UserId, order.Total);
\`\`\`

---

## ۲. پیکربندی Serilog و افزودن متادیتا (Enrichment)

تنظیم Serilog برای درج خودکار شناسه درخواست، نام ماشین، محیط اجرا و خروجی با فرمت JSON.

---

## ۳. سطوح استاندارد لاگینگ (Log Levels)

از سطوح Information برای رویدادهای نرمال تجاری، Warning برای رفتارهای غیرمنتظره قابل بازیافت و Error برای خطاهایی که نیاز به بررسی توسعه‌دهنده دارند استفاده می‌شود.`,
};
