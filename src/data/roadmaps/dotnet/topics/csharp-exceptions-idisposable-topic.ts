import { RoadmapTopic } from "../../../models";

export const csharpExceptionsIdisposableTopic: RoadmapTopic = {
  id: "topic-dotnet-csharp-exceptions-idisposable",
  stepId: "step-mid-csharp-fundamentals",
  slug: "csharp-exceptions-idisposable",
  order: 4,
  title: "Exception Handling, Filters & IDisposable Resource Management",
  title_fa: "مدیریت استثناها، فیلترها و آزادسازی منابع با IDisposable",
  summary:
    "Understand structured exception handling, exception filters (when clause), IDisposable and IAsyncDisposable patterns for unmanaged resource cleanup.",
  summary_fa:
    "درک مدیریت ساخت‌یافته خطاها، فیلترهای استثنا (عبارت when)، و الگوهای IDisposable و IAsyncDisposable برای پاک‌سازی منابع و جلوگیری از Memory Leak.",
  readingTimeMinutes: 20,
  difficulty: "mid",
  content: `## 1. Structured Exception Handling & Exception Filters

C# exception filters with \`when\` allow catching exceptions based on conditional expressions without unwinding the stack:

\`\`\`csharp
try
{
    await httpClient.GetAsync(url);
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
{
    logger.LogWarning("Resource not found at {Url}", url);
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.ServiceUnavailable)
{
    logger.LogError("External upstream service down");
}
\`\`\`

---

## 2. Resource Management with IDisposable & using Declarations

Unmanaged resources (file handles, database connections, sockets) require deterministic cleanup:

\`\`\`csharp
// C# 8+ using declaration (disposed at end of scope)
using var fileStream = new FileStream("data.bin", FileMode.Open);

// Async disposal for asynchronous streams/network
await using var asyncStream = new MemoryStream();
\`\`\`

---

## 3. The Standard Dispose Pattern

\`\`\`csharp
public class ResourceHolder : IDisposable, IAsyncDisposable
{
    private bool _disposed;

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;
        if (disposing)
        {
            // Free managed objects
        }
        // Free unmanaged resources
        _disposed = true;
    }

    public async ValueTask DisposeAsync()
    {
        await DisposeAsyncCore();
        Dispose(false);
        GC.SuppressFinalize(this);
    }

    protected virtual async ValueTask DisposeAsyncCore()
    {
        // Async cleanup
    }
}
\`\`\``,
  content_fa: `## ۱. مدیریت ساخت‌یافته استثناها و Exception Filters

فیلترهای استثنا با کلیدواژه \`when\` به شما اجازه می‌دهند خطاها را بر اساس شرایط خاص بدون تغییر در Stack Trace مدیریت کنید:

\`\`\`csharp
try
{
    await httpClient.GetAsync(url);
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
{
    logger.LogWarning("Resource not found at {Url}", url);
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.ServiceUnavailable)
{
    logger.LogError("External upstream service down");
}
\`\`\`

---

## ۲. آزادسازی منابع با IDisposable و عبارات using

منابع غیرمدیریت‌شده (اتصالات دیتابیس، فایل‌ها و سوکت‌ها) باید به سرعت و بدون تکیه بر Garbage Collector آزاد شوند:

\`\`\`csharp
// عبارت using در پایان حوزه به صورت خودکار Dispose را فراخوانی می‌کند
using var fileStream = new FileStream("data.bin", FileMode.Open);

// آزادسازی ناهمگام با IAsyncDisposable
await using var asyncStream = new MemoryStream();
\`\`\`

---

## ۳. الگوی استاندارد Dispose Pattern

پیاده‌سازی صحیح این الگو مانع از نشت منابع (Resource Leak) و صدا زدن غیرضروری Finalizer توسط GC می‌شود.`,
};
