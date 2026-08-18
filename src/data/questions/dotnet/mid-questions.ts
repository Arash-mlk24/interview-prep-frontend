import { Question } from "../../models";

export const dotnetMidQuestions: Question[] = [
  // ── Advanced C# & .NET Internals (Q101 - Q115) ───────────────────
  {
    id: "dotnet-mid-q101",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    questionTitle: "How does the .NET Garbage Collector (GC) work across Generations (Gen 0, 1, 2, LOH, POH)?",
    questionTitle_fa: "سیستم Garbage Collector در دات‌نت چگونه کار می‌کند؟",
    answerContent: `### .NET Garbage Collector Generations

The .NET GC is a generational, tracing, mark-and-sweep collector based on the **generational hypothesis** (newer objects have shorter lifespans).

#### Generations:
- **Gen 0:** Newly allocated short-lived objects (DTOs, local variables). Collected frequently and very fast ($<1\\text{ms}$).
- **Gen 1:** Buffer generation for objects surviving Gen 0. Promoted to Gen 1.
- **Gen 2:** Long-lived objects (Singletons, static references, cache). Collected during a Full GC.
- **Large Object Heap (LOH):** Objects $\\ge 85,000$ bytes. Not compacted by default to avoid expensive memory copies.
- **Pinned Object Heap (POH - .NET 5+):** Dedicated for pinned objects to eliminate fragmentation in Gen 0-2.`,
    answerContent_fa: `### نحوه کارکرد زباله‌روب (GC) در دات‌نت

زباله‌روب دات‌نت بر اساس فرضیه نسلی کار می‌کند که اشیای جوان‌تر زودتر از بین می‌روند:
- **Gen 0:** اشیای تازه تخصیص‌یافته با طول عمر کوتاه که بسیار سریع پاک‌سازی می‌شوند.
- **Gen 1:** لایه بافر برای اشیایی که از Gen 0 زنده مانده‌اند.
- **Gen 2:** اشیای با طول عمر طولانی (مانند سرویس‌های Singleton) که پاک‌سازی آن Full GC نام دارد.
- **LOH:** اشیای بزرگتر از ۸۵ هزار بایت برای جلوگیری از جابجایی سنگین حافظه.
- **POH (دات‌نت ۵ به بعد):** اشیای پین‌شده در حافظه برای ارتباط با کدهای Unmanaged.`,
  },
  {
    id: "dotnet-mid-q102",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    questionTitle: "What is the purpose of IDisposable and how does the 'using' statement work?",
    questionTitle_fa: "مفهوم IDisposable چیست و بلوک using چه کاری انجام می‌دهد؟",
    answerContent: `### IDisposable & the 'using' Statement

\`IDisposable\` provides a mechanism for releasing **unmanaged resources** (database connections, file handles, network sockets) deterministically without waiting for the Garbage Collector.

\`\`\`csharp
// Modern C# using declaration
await using var connection = new SqlConnection(connString);
await connection.OpenAsync();
// Automatically calls connection.DisposeAsync() at the end of the enclosing scope
\`\`\`

The \`using\` block translates behind the scenes into a \`try-finally\` block guaranteeing \`Dispose()\` is called even if an exception occurs.`,
    answerContent_fa: `### مفهوم IDisposable و بلوک using

اینترفیس \`IDisposable\` برای آزادسازی قطعی و بی‌درنگ **منابع مدیریت‌نشده (Unmanaged)** مانند کانکشن‌های دات‌بیس و فایل‌ها استفاده می‌شود. دستور \`using\` در زمان کامپایل به یک بلوک \`try-finally\` تبدیل می‌شود تا فراخوانی متد \`Dispose\` حتی در صورت بروز خطا تضمین گردد.`,
  },
  {
    id: "dotnet-mid-q103",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    questionTitle: "What is the difference between Task.Run and Task.Factory.StartNew?",
    questionTitle_fa: "تفاوت Task.Run و Task.Factory.StartNew چیست؟",
    answerContent: `### Task.Run vs. Task.Factory.StartNew

- **\`Task.Run\` (.NET 4.5+):**
  - Shortcut for \`Task.Factory.StartNew\` with safe default flags (\`TaskScheduler.Default\` and unwraps nested tasks).
  - Recommended standard for offloading CPU-bound tasks to the ThreadPool.
- **\`Task.Factory.StartNew\`:**
  - Advanced low-level method providing granular configuration (e.g. \`TaskCreationOptions.LongRunning\` for dedicated non-ThreadPool threads).
  - **Gotcha:** Does not automatically unwrap \`Task<Task<T>>\` when passing async delegates without calling \`.Unwrap()\`.`,
    answerContent_fa: `### تفاوت Task.Run و Task.Factory.StartNew

- **\`Task.Run\`**: روش استاندارد و ساده‌تر برای اجرای کدهای محاسباتی (CPU-bound) روی ThreadPool با تنظیمات پیش‌فرض امن.
- **\`Task.Factory.StartNew\`**: متد سطح پایینی است که امکاناتی مثل ساخت ترد اختصاصی برای کارهای طولانی (\`TaskCreationOptions.LongRunning\`) را فراهم می‌کند اما نیاز به مدیریت صریح \`Unwrap\` دارد.`,
  },
  {
    id: "dotnet-junior-q104",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    questionTitle: "What causes Deadlocks in Asynchronous C# programming and how do you prevent them?",
    questionTitle_fa: "مفهوم Deadlock در برنامه‌نویسی Asynchronous چیست و چگونه رخ می‌دهد؟",
    answerContent: `### Async Deadlocks (.Result & .Wait())

Deadlocks occur when synchronous code blocks on an asynchronous task in environments with a **\`SynchronizationContext\`** (e.g., legacy ASP.NET, WPF, WinForms).

\`\`\`csharp
// DEADLOCK SCENARIO:
public string GetData()
{
    // Blocks the UI/request thread waiting for task completion
    return FetchDataAsync().Result; 
}

public async Task<string> FetchDataAsync()
{
    var data = await _client.GetStringAsync(url);
    // Tries to resume on the original SynchronizationContext thread, which is currently blocked on .Result!
    return data;
}
\`\`\`

#### Prevention:
1. **Async all the way:** Use \`async\` and \`await\` from top to bottom.
2. **\`ConfigureAwait(false)\`:** In libraries, avoid capturing the synchronization context.`,
    answerContent_fa: `### علت ددلاک در کدهای ناهمگام و راه‌های جلوگیری

ددلاک زمانی رخ می‌دهد که یک متد همگام با \`.Result\` یا \`.Wait()\` منتظر یک متد \`async\` بماند. متد async پس از پایان مرحله اول برای ادامه کار به دنبال ترد آزاد کانتکست اصلی می‌گردد، اما آن ترد توسط دستور \`.Result\` مسدود (Block) شده است.

#### راهکارها:
- استفاده از \`await\` در تمام سطوح (Async all the way).
- استفاده از \`ConfigureAwait(false)\` در کتابخانه‌ها.`,
  },
  {
    id: "dotnet-mid-q105",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    questionTitle: "What is SynchronizationContext in .NET?",
    questionTitle_fa: "مفهوم SynchronizationContext در دات‌نت چیست؟",
    answerContent: `### SynchronizationContext in .NET

\`SynchronizationContext\` coordinates executing work onto a specific thread environment (such as the UI Dispatcher thread in WPF/MAUI).

- **ASP.NET Core:** Has **no \`SynchronizationContext\`**! Every continuation runs on any free ThreadPool thread, improving scalability and eliminating classic ASP.NET async deadlocks.
- **Desktop/Mobile (WPF, Blazor Server, MAUI):** Uses a single-threaded SynchronizationContext to marshal UI updates back to the main UI thread.`,
    answerContent_fa: `### مفهوم SynchronizationContext

ابزاری برای هدایت و بازگرداندن اجرای کدهای ادامه (Continuation) به یک ترد خاص (مانند ترد اصلی UI در اپلیکیشن‌های دسکتاپ) است. در **ASP.NET Core** برای افزایش پرفورمنس هیچ SynchronizationContextای وجود ندارد و کدهای بعد از \`await\` روی هر ترد آزادی از ThreadPool اجرا می‌شوند.`,
  },
  {
    id: "dotnet-mid-q106",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "How do you write a Custom Middleware in ASP.NET Core?",
    questionTitle_fa: "چگونه یک Middleware سفارشی در ASP.NET Core می‌نویسیم؟",
    answerContent: `### Custom Middleware Implementation

#### Factory-based / Convention-based Middleware:
\`\`\`csharp
public class RequestPerformanceMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestPerformanceMiddleware> _logger;

    public RequestPerformanceMiddleware(RequestDelegate next, ILogger<RequestPerformanceMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        await _next(context); // Pass down the pipeline
        sw.Stop();

        if (sw.ElapsedMilliseconds > 500)
        {
            _logger.LogWarning("Long Request: {Path} took {Elapsed}ms", context.Request.Path, sw.ElapsedMilliseconds);
        }
    }
}

// Extension method for clean Program.cs registration:
public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseRequestPerformance(this IApplicationBuilder app)
        => app.UseMiddleware<RequestPerformanceMiddleware>();
}
\`\`\``,
    answerContent_fa: `### نحوه نوشتن میدل‌ویر سفارشی

میدل‌ویر کلاسی شامل متد \`InvokeAsync(HttpContext context)\` است که \`RequestDelegate next\` را در سازنده تزریق کرده و پس از انجام عملیات‌های مورد نیاز، ریکوئست را با \`await _next(context)\` به مرحله بعد می‌فرستد.`,
  },
  {
    id: "dotnet-mid-q107",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "What is the difference between IHostedService and BackgroundService in .NET?",
    questionTitle_fa: "استفاده از IHostedService و BackgroundService چه تفاوتی دارد؟",
    answerContent: `### IHostedService vs. BackgroundService

- **\`IHostedService\`:**
  - Raw base interface with \`StartAsync(CancellationToken)\` and \`StopAsync(CancellationToken)\`.
  - \`StartAsync\` must return quickly; running a continuous loop directly inside \`StartAsync\` blocks the entire web application startup!
- **\`BackgroundService\`:**
  - Abstract base class implementing \`IHostedService\`.
  - Exposes an abstract **\`ExecuteAsync(CancellationToken stoppingToken)\`** method designed specifically for long-running background loops.

\`\`\`csharp
public class QueueProcessor : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await ProcessNextJobAsync();
            await Task.Delay(1000, stoppingToken);
        }
    }
}
\`\`\``,
    answerContent_fa: `### تفاوت IHostedService و BackgroundService

- **\`IHostedService\`**: اینترفیسی پایه با متدهای \`StartAsync\` و \`StopAsync\` است که نباید در آن حلقه بی‌نهایت نوشت زیرا فرآیند استارت‌آپ سرور را مسدود می‌کند.
- **\`BackgroundService\`**: کلاس انتزاعی پیاده‌سازی‌کننده IHostedService است که متد \`ExecuteAsync\` را برای اجرای پردازش‌های پس‌زمینه طولانی به صورت امن فراهم می‌کند.`,
  },
  {
    id: "dotnet-mid-q108",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "What is Content Negotiation in ASP.NET Core?",
    questionTitle_fa: "مفهوم Content Negotiation در ASP.NET Core چیست؟",
    answerContent: `### Content Negotiation

Content negotiation allows a client and server to agree on the data format (JSON, XML, Protobuf) for HTTP responses based on the request's **\`Accept\`** header.

\`\`\`http
GET /api/products/1 HTTP/1.1
Accept: application/xml
\`\`\`

ASP.NET Core inspects formatters registered in \`Program.cs\` (\`AddXmlSerializerFormatters()\`) and serializes the response accordingly.`,
    answerContent_fa: `### مفهوم Content Negotiation (مذاکره محتوا)

مکانیزمی است که طی آن سرور بر اساس هدر **\`Accept\`** ارسالی کلاینت (مانند \`application/json\` یا \`application/xml\`) فرمت مناسب خروجی را انتخاب و سریالایز می‌کند.`,
  },
  {
    id: "dotnet-mid-q109",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "How do you implement Rate Limiting in ASP.NET Core (.NET 7/8)?",
    questionTitle_fa: "چگونه در ASP.NET Core عملیات Rate Limiting را پیاده‌سازی می‌کنی؟",
    answerContent: `### Native Rate Limiting in .NET 7/8

.NET 7+ includes built-in rate limiting middleware (\`Microsoft.AspNetCore.RateLimiting\`):

#### Algorithms:
1. **Fixed Window:** Fixed number of requests per time interval.
2. **Sliding Window:** Divides interval into segments to avoid boundary burst spikes.
3. **Token Bucket:** Allows controlled bursts while maintaining continuous replenishment.
4. **Concurrency:** Limits simultaneous concurrent requests.

\`\`\`csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("fixed", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueLimit = 10;
    });
});

app.UseRateLimiter();
app.MapGet("/api/data", () => Results.Ok()).RequireRateLimiting("fixed");
\`\`\``,
    answerContent_fa: `### پیاده‌سازی Rate Limiting در دات‌نت

در دات‌نت ۷ و ۸ قابلیت Rate Limiting به صورت بومی با الگوریتم‌های Fixed Window، Sliding Window و Token Bucket ارائه شده است که با متد \`AddRateLimiter\` کانفیگ شده و با \`RequireRateLimiting\` روی اندپوینت‌ها اعمال می‌گردد.`,
  },
  {
    id: "dotnet-mid-q110",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "What is the difference between ActionFilter and ResultFilter and their execution order?",
    questionTitle_fa: "تفاوت ActionFilter و ResultFilter چیست و تقدم اجرای آنها چگونه است؟",
    answerContent: `### ActionFilter vs. ResultFilter

1. **ActionFilter (\`IActionFilter\` / \`IAsyncActionFilter\`):**
   - Runs **before** the action method executes (\`OnActionExecuting\`) and **after** it returns (\`OnActionExecuted\`).
   - Ideal for validating model state, logging action inputs, or short-circuiting.
2. **ResultFilter (\`IResultFilter\` / \`IAsyncResultFilter\`):**
   - Runs **only if** the action method executes successfully.
   - Wraps the execution of the \`IActionResult\` (e.g. modifying HTTP response headers before body serialization).`,
    answerContent_fa: `### تفاوت ActionFilter و ResultFilter

- **ActionFilter:** قبل و بعد از اجرای خود متد اکشن اجرا می‌شود و برای لاگ پارامترها و اعتبارسنجی کاربرد دارد.
- **ResultFilter:** بعد از پایان موفقیت‌آمیز اکشن و در زمان تولید نتیجه خروجی (\`IActionResult\`) اجرا می‌شود.`,
  },
  {
    id: "dotnet-mid-q111",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "Why should you use IHttpClientFactory instead of 'new HttpClient()' in C#?",
    questionTitle_fa: "مزایای استفاده از IHttpClientFactory نسبت به new HttpClient() چیست؟",
    answerContent: `### Why Use IHttpClientFactory?

#### Problems with \`new HttpClient()\`:
1. **Socket Exhaustion:** Disposing \`HttpClient\` leaves underlying OS sockets in \`TIME_WAIT\` state under load.
2. **DNS Stale Records:** Keeping a singleton \`HttpClient\` instance forever fails to respect DNS changes.

#### How \`IHttpClientFactory\` Solves Both:
- Pools and manages the lifetime of the underlying **\`HttpMessageHandler\`** instances (default 2 minutes lifetime) so DNS changes are respected.
- Reuses socket connections across calls, preventing socket exhaustion.
- Seamlessly integrates with **Polly** for retry and circuit breaker policies.`,
    answerContent_fa: `### مزایای IHttpClientFactory

استفاده مستقیم از \`new HttpClient()\` به دلیل باز ماندن سوکت‌ها در وضعیت \`TIME_WAIT\` باعث خطای Socket Exhaustion می‌شود و نمونه Singleton آن نیز تغییرات DNS سرور را متوجه نمی‌شود. \`IHttpClientFactory\` طول عمر Handlerهای سوکت را در یک Pool مدیریت می‌کند و از هر دو مشکل جلوگیری می‌نماید.`,
  },
  {
    id: "dotnet-mid-q112",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "What is Socket Exhaustion and how is it resolved in .NET?",
    questionTitle_fa: "مشکل Socket Exhaustion چیست و چگونه حل می‌شود؟",
    answerContent: `### Socket Exhaustion

Socket exhaustion occurs when an application rapidly opens and closes thousands of outbound TCP connections. When a TCP socket closes, the OS holds it in the **\`TIME_WAIT\`** state for 240 seconds to ensure stray packets are discarded.

If all available ephemeral TCP ports are exhausted, subsequent network requests throw \`SocketException: No connection could be made\`.

**Resolution:** Use \`IHttpClientFactory\` or \`SocketsHttpHandler\` connection pooling.`,
    answerContent_fa: `### مشکل Socket Exhaustion

زمانی رخ می‌دهد که برنامه با سرعت بالا سوکت‌های TCP زیادی باز کرده و می‌بندد. سوکت‌های بسته شده به مدت چند دقیقه در وضعیت \`TIME_WAIT\` سیستم‌عامل باقی می‌مانند و پورت آزادی برای درخواست‌های بعدی باقی نمی‌ماند. راه حل استفاده از Connection Pooling در \`IHttpClientFactory\` است.`,
  },
  {
    id: "dotnet-mid-q113",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "What is gRPC and how does it compare to REST APIs?",
    questionTitle_fa: "پروتکل gRPC چیست و چه تفاوتی با REST دارد؟",
    answerContent: `### gRPC vs. REST

| Feature | gRPC | REST |
| :--- | :--- | :--- |
| **Protocol** | **HTTP/2** (Multiplexing, binary framing) | HTTP/1.1 or HTTP/2 |
| **Payload Format**| **Protocol Buffers (Protobuf)** (compact binary) | JSON / XML (human-readable text) |
| **Performance** | Up to $7\times-10\times$ faster than REST | Standard web speed |
| **Streaming** | Bi-directional streaming, client/server streaming | Request-Response primarily |
| **Contract** | Strict \`.proto\` contract file | OpenAPI / Swagger (optional) |
| **Ideal For** | High-throughput internal microservice communication | Public-facing client/browser APIs |`,
    answerContent_fa: `### مقایسه پروتکل gRPC با REST

پروتکل **gRPC** بر بستر **HTTP/2** و با فرمت باینری فوق‌العاده فشرده **Protocol Buffers** کار می‌کند که ۷ تا ۱۰ برابر سریع‌تر از JSON است و از Streaming دوطرفه پشتیبانی می‌کند. برای ارتباطات داخلی بین میکروسرویس‌ها بسیار ایده‌آل است.`,
  },
  {
    id: "dotnet-mid-q114",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "When and why do you use SignalR in ASP.NET Core?",
    questionTitle_fa: "چه زمانی از SignalR استفاده می‌کنیم؟",
    answerContent: `### SignalR in ASP.NET Core

SignalR is an open-source library that adds real-time web functionality to applications, enabling server code to push content to connected clients instantly.

#### Transports (automatic fallback):
1. **WebSockets** (best performance, full-duplex).
2. **Server-Sent Events (SSE)**.
3. **Long Polling**.

#### Use Cases:
- Real-time dashboards, financial price tickers, chat applications, and live order status notifications.`,
    answerContent_fa: `### کاربرد SignalR در دات‌نت

کتابخانه‌ای برای ارتباط بلادرنگ (Real-Time) دوطرفه بین سرور و کلاینت است که از پروتکل‌هایی مانند WebSockets استفاده می‌کند و برای سیستم‌های چت، پنل‌های مانیتورینگ زنده و اعلان‌های وضعیت تراکنش‌ها به کار می‌رود.`,
  },
  {
    id: "dotnet-mid-q115",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "How do you manage Connection Strings and Secrets securely in production?",
    questionTitle_fa: "نحوه مدیریت Connection Stringها و Secretها در محیط پروداکشن چگونه است؟",
    answerContent: `### Secure Secrets Management in Production

1. **Never Commit Secrets to Git:** Keep \`appsettings.json\` sanitized with empty placeholder values.
2. **Environment Variables:** Inject secrets into Linux/Docker containers via OS environment variables.
3. **Secret Stores:** Use managed vaults such as **Azure Key Vault**, **HashiCorp Vault**, or AWS Secrets Manager with managed identities (RBAC).
4. **Local Development:** Use \`dotnet user-secrets\`.`,
    answerContent_fa: `### مدیریت امن سکرت‌ها و رمزها در پروداکشن

- عدم قرار دادن رمزها در سورس‌کد و فایل‌های کانفیگ گیت.
- استفاده از **Secret Managerهای ابری** مانند Azure Key Vault یا HashiCorp Vault.
- تزریق کانکشن‌استرینگ‌ها از طریق **Environment Variables** در کانتینرهای داکر.
- استفاده از \`dotnet user-secrets\` در محیط لوکال.`,
  },

  // ── Software Architecture, DDD & Clean Architecture (Q116 - Q130) 
  {
    id: "dotnet-mid-q116",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    topicIds: ["topic-dotnet-clean-arch-modular-monolith"],
    questionTitle: "Name the layers in Clean Architecture and describe their responsibilities.",
    questionTitle_fa: "لایه‌های Clean Architecture را نام ببر و وظیفه هر کدام را بگو.",
    answerContent: `### Clean Architecture Layers

Clean Architecture enforces the **Dependency Rule** (dependencies point inward toward the core domain):

1. **Domain Layer (Core):**
   - Contains Enterprise Entities, Value Objects, Domain Events, Enums, and Domain Exceptions. Zero external dependencies.
2. **Application Layer:**
   - Contains Use Cases, CQRS Commands/Queries, DTOs, FluentValidation rules, and Port/Interface definitions.
3. **Infrastructure Layer:**
   - External implementations: EF Core \`DbContext\`, Repositories, Email/SMS senders, RabbitMQ event bus, Redis caches.
4. **Presentation Layer (Web / API):**
   - Controllers, Minimal API endpoints, Middleware, Swagger, ViewModels.`,
    answerContent_fa: `### لایه‌های معماری تمیز (Clean Architecture)

۱. **Domain:** هسته اصلی شامل موجودیت‌ها (Entities)، Value Objectها و رویدادهای دامنه بدون هیچ‌گونه وابستگی به کتابخانه‌های خارجی.
۲. **Application:** لایه Use Caseها، دستورات CQRS، اعتبارسنجی‌ها و تعریف اینترفیس‌های سرویس‌ها.
۳. **Infrastructure:** پیاده‌سازی جزئیات فنی مانند EF Core، دیتابیس، صف‌های پیام و کش.
۴. **Presentation:** کنترلرها و APIها که نقطه ورود کلاینت هستند.`,
  },
  {
    id: "dotnet-mid-q117",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    topicIds: ["topic-dotnet-clean-arch-modular-monolith"],
    questionTitle: "Why must the Domain Layer have zero dependencies on outer layers in Clean Architecture?",
    questionTitle_fa: "چرا لایه Domain در معماری تمیز نباید هیچ وابستگی‌ای به لایه‌های دیگر داشته باشد؟",
    answerContent: `### Domain Layer Independence

- **Business Rules Outlive Technology:** The domain represents core enterprise business logic and must remain pure and unaffected by changes to frameworks, ORMs, or database vendors.
- **Testability:** Pure C# domain entities can be unit tested instantly without setting up databases or mocking external libraries.
- **Portability:** The business logic can be ported to different runtime environments without rewrites.`,
    answerContent_fa: `### دلیل استقلال کامل لایه Domain

قوانین بیزینس مهم‌ترین دارایی نرم‌افزار هستند و نباید با تغییر فریم‌ورک‌ها، دیتابیس‌ها یا ابزارهای خارجی دچار تغییر شوند. این استقلال باعث تست‌پذیری فوق‌العاده سریع و طول عمر بالای کد می‌شود.`,
  },
  {
    id: "dotnet-mid-q118",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    topicIds: ["topic-dotnet-clean-arch-modular-monolith"],
    questionTitle: "What is CQRS (Command Query Responsibility Segregation)?",
    questionTitle_fa: "مفهوم CQRS چیست؟",
    answerContent: `### CQRS (Command Query Responsibility Segregation)

CQRS segregates the data modification model (**Commands**) from the data reading model (**Queries**).

- **Commands:** Mutate state, execute business validation, return void or ID (e.g. \`CreateOrderCommand\`).
- **Queries:** Return flat DTOs without modifying state (e.g. \`GetOrderByIdQuery\`).

#### Benefits:
- Optimized read models (e.g. Dapper for fast reads, EF Core for rich command domain logic).
- Independent scaling of read and write workloads.`,
    answerContent_fa: `### مفهوم الگوی CQRS

الگوی CQRS مدل خواندن داده‌ها (Queries) را از مدل نوشتن و تغییر داده‌ها (Commands) کاملاً تفکیک می‌کند. این کار اجازه می‌دهد مدل خواندن برای سرعت بالا بهینه شود (مثلاً با Dapper یا کش) و مدل نوشتن برای صحت قوانین دامنه و تراکنش‌ها (با EF Core و DDD).`,
  },
  {
    id: "dotnet-mid-q119",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "What is the difference between a Command and a Query in CQRS?",
    questionTitle_fa: "تفاوت Command و Query در معماری CQRS چیست؟",
    answerContent: `### Command vs. Query

| Aspect | Command | Query |
| :--- | :--- | :--- |
| **Intent** | Mutate state ("Do something") | Fetch data ("Tell me something") |
| **Side Effects** | Modifies database state | **Idempotent and side-effect free** |
| **Return Value** | Result status, Created ID, or void | Strongly-typed DTO payload |
| **Validation** | Rich business invariants | Query parameter/filter validation |`,
    answerContent_fa: `### تفاوت Command و Query

- **Command:** وضعیت سیستم را تغییر می‌دهد (مانند ثبت سفارش یا پرداخت) و قواعد اعتبارسنجی بیزینس را اجرا می‌کند.
- **Query:** صرفاً داده را واکشی می‌کند و هیچ‌گونه اثر جانبی (Side-effect) روی دیتابیس ندارد.`,
  },
  {
    id: "dotnet-mid-q120",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "How does MediatR work and what problem does it solve in CQRS?",
    questionTitle_fa: "کتابخانه MediatR چگونه کار می‌کند و چه مشکلی را در CQRS حل می‌کند؟",
    answerContent: `### MediatR in CQRS

MediatR implements the **In-Process Mediator Pattern**, decoupling the sender of a request from its handler.

\`\`\`csharp
// 1. Request definition
public record CreateUserCommand(string Email, string Name) : IRequest<Guid>;

// 2. Isolated Handler
public class CreateUserHandler : IRequestHandler<CreateUserCommand, Guid>
{
    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken ct)
    {
        // Business logic...
        return userId;
    }
}

// 3. Controller sends via Mediator (Single line)
[HttpPost]
public async Task<IActionResult> Create(CreateUserCommand cmd) 
    => Ok(await _mediator.Send(cmd));
\`\`\`

#### Solves:
Eliminates bloated controllers with 15+ injected service dependencies and enables **Pipeline Behaviors** (logging, validation, caching wrappers).`,
    answerContent_fa: `### نقش کتابخانه MediatR در CQRS

کتابخانه MediatR الگوی Mediator درون‌فرآیندی را پیاده‌سازی می‌کند تا کنترلرها مستقیماً به سرویس‌ها وابسته نباشند و صرفاً یک شیء Command را به MediatR بفرستند. همچنین قابلیت **Pipeline Behaviors** را برای اضافه کردن لاگینگ و ولیدیشن خودکار روی تمام دستورات فراهم می‌کند.`,
  },
  {
    id: "dotnet-mid-q121",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "Explain the Repository and Unit of Work Patterns.",
    questionTitle_fa: "الگوی Repository و Unit of Work را توضیح بده.",
    answerContent: `### Repository & Unit of Work Patterns

- **Repository Pattern:** Mediates between domain and data mapping layers, acting like an in-memory collection of domain objects (\`GetById\`, \`Add\`, \`Remove\`).
- **Unit of Work Pattern:** Maintains a list of business objects affected by a business transaction and coordinates writing changes as a single atomic database transaction.`,
    answerContent_fa: `### الگوهای Repository و Unit of Work

- **Repository:** دسترسی به داده‌ها را انتزاعی کرده و با آن شبیه به یک کالکشن درون حافظه رفتار می‌کند.
- **Unit of Work:** تغییرات چند موجودیت مختلف را در طول یک تراکنش ردیابی کرده و همه را با هم در قالب یک تراکنش واحد ثبت می‌کند.`,
  },
  {
    id: "dotnet-mid-q122",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "Is it sensible to create a Repository pattern on top of EF Core when DbContext is already a Unit of Work?",
    questionTitle_fa: "آیا استفاده از الگوی Repository روی EF Core منطقی است؟",
    answerContent: `### The Repository on EF Core Debate

- **Arguments Against (Often considered anti-pattern):**
  - \`DbContext\` is already a Unit of Work, and \`DbSet<T>\` is already a Generic Repository.
  - Wrapping EF Core in generic repositories often cripples advanced LINQ features (projections, split queries, eager loading).
- **Arguments In Favor (Architectural Boundary):**
  - Keeps the Application layer decoupled from direct EF Core references.
  - Useful when using **Specific Repositories** per Aggregate Root in Domain-Driven Design (\`IOrderRepository\`).`,
    answerContent_fa: `### آیا استفاده از Repository روی EF Core منطقی است؟

خود \`DbContext\` در واقع پیاده‌سازی Unit of Work و \`DbSet\` ریپازیتوری است. ساخت Generic Repository عمومی روی EF Core معمولاً باعث از دست رفتن قدرت LINQ می‌شود. اما ساخت **ریپازیتوری‌های اختصاصی برای Aggregate Rootها** در معماری DDD برای تست‌پذیری و حفظ مرزهای دامین کاملاً معتبر و استاندارد است.`,
  },
  {
    id: "dotnet-mid-q123",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "What is the difference between a Rich Domain Model and an Anemic Domain Model?",
    questionTitle_fa: "تفاوت Rich Domain Model با Anemic Domain Model چیست؟",
    answerContent: `### Rich vs. Anemic Domain Model

- **Anemic Domain Model (Anti-pattern in DDD):**
  - Entities are just dumb data holders with public getters and setters (\`get; set;\`).
  - Business logic is scattered across various service classes.
- **Rich Domain Model (Encapsulated OOP):**
  - Entities protect their invariants with private setters.
  - Business operations and mutations are performed via methods on the entity itself (\`order.Cancel()\`, \`order.AddItem()\`).`,
    answerContent_fa: `### تفاوت مدل غنی (Rich) و مدل کم‌خون (Anemic)

- **Anemic Domain Model:** کلاس‌های موجودیت فقط پراپرتی‌های get/set دارند و هیچ منطقی ندارند و بیزینس در لایه سرویس پخش شده است.
- **Rich Domain Model:** موجودیت‌ها دارای Setterهای خصوصی بوده و متدهای تغییر وضعیت و اعتبارسنجی قوانین درون خود کلاس قرار دارند (مانند \`account.Withdraw(amount)\`).`,
  },
  {
    id: "dotnet-mid-q124",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "What is a Value Object in Domain-Driven Design (DDD)?",
    questionTitle_fa: "مفهوم Value Object در Domain-Driven Design (DDD) چیست؟",
    answerContent: `### Value Objects in DDD

A **Value Object** is an immutable object defined by its attributes rather than a unique identity (\`Id\`).

#### Characteristics:
1. **No Conceptual Identity:** Two \`Money(100, "USD")\` objects with the same attributes are completely equal.
2. **Immutability:** Once created, its values cannot change (use C# \`record\` or readonly class).
3. **Self-Validation:** Validates itself upon construction.`,
    answerContent_fa: `### مفهوم Value Object در DDD

شیئی تغییرناپذیر (Immutable) است که شناسه یکتا (\`Id\`) ندارد و هویت آن وابسته به مقادیر ویژگی‌هایش است (مانند \`Money\`، \`Address\` یا \`DateRange\`). دو Value Object با مقادیر یکسان کاملاً با هم برابر در نظر گرفته می‌شوند.`,
  },
  {
    id: "dotnet-mid-q125",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "What is the difference between an Entity and an Aggregate Root in DDD?",
    questionTitle_fa: "مفهوم Entity و Aggregate Root در DDD چیست؟",
    answerContent: `### Entity vs. Aggregate Root

- **Entity:** An object defined by its persistent **unique Identity (\`Id\`)** that runs through its entire lifecycle.
- **Aggregate Root (AR):** The master entity that serves as the single entry point to an **Aggregate** (a cluster of associated entities and value objects).
  - External objects can only hold a direct reference to the Aggregate Root.
  - The Aggregate Root guarantees transactional consistency for the entire cluster.`,
    answerContent_fa: `### تفاوت Entity و Aggregate Root

- **Entity:** شیئی که دارای یک شناسه یکتای اختصاصی (\`Id\`) است و در طول زمان تغییر وضعیت می‌دهد.
- **Aggregate Root:** موجودیت اصلی و نگهبان یک کلاستر از موجودیت‌ها است (مانند \`Order\` که حاوی \`OrderItem\`ها است). ارتباطات بیرونی فقط باید از طریق Aggregate Root انجام شود تا یکپارچگی داده‌ها حفظ شود.`,
  },
  {
    id: "dotnet-mid-q126",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "What is the difference between a Domain Event and an Integration Event?",
    questionTitle_fa: "تفاوت Domain Event و Integration Event چیست؟",
    answerContent: `### Domain Event vs. Integration Event

- **Domain Event:**
  - In-process event signaling that something important happened **within the same Bounded Context / database transaction** (e.g. \`OrderCreatedDomainEvent\`).
  - Handled synchronously or asynchronously via MediatR within the same application process.
- **Integration Event:**
  - Published over a message broker (**RabbitMQ**, Kafka) to notify **external microservices and bounded contexts** (e.g. \`OrderPaidIntegrationEvent\`).`,
    answerContent_fa: `### تفاوت Domain Event و Integration Event

- **Domain Event:** رویدادی درون‌برنامه‌ای است که در محدوده همان میکروسرویس و تراکنش دیتابیس منتشر و بررسی می‌شود (با MediatR).
- **Integration Event:** رویدادی است که از طریق صف‌های پیام (RabbitMQ) برای باخبر کردن سایر میکروسرویس‌های مستقل فرستاده می‌شود.`,
  },
  {
    id: "dotnet-mid-q127",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "What is the purpose of the Factory Method Design Pattern?",
    questionTitle_fa: "الگوی Factory Method چه کاربردی دارد؟",
    answerContent: `### Factory Method Pattern

Defines an interface or method for creating an object, letting subclasses or internal factory methods decide which class to instantiate.

\`\`\`csharp
public class PaymentGatewayFactory
{
    public IPaymentGateway Create(PaymentProvider provider) => provider switch
    {
        PaymentProvider.Zarinpal => new ZarinpalGateway(),
        PaymentProvider.Saman => new SamanGateway(),
        _ => throw new NotSupportedException()
    };
}
\`\`\``,
    answerContent_fa: `### الگوی طراحی Factory Method

الگویی برای ساخت اشیاء بدون نیاز به مشخص کردن کلاس دقیق در زمان فراخوانی است و تصمیم‌گیری برای ساخت شیء مناسب را بر اساس پارامترهای ورودی کپسوله می‌کند.`,
  },
  {
    id: "dotnet-mid-q128",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "What is the Singleton Pattern and why can it cause issues in multithreaded environments?",
    questionTitle_fa: "الگوی Singleton چیست و چرا در محیط Multi-thread مشکل‌ساز می‌شود؟",
    answerContent: `### Singleton Pattern & Thread-Safety

Ensures a class has only one instance and provides a global point of access to it.

#### Multithreaded Issues:
If not initialized properly, multiple concurrent threads can enter the constructor simultaneously and create multiple instances.

#### Thread-safe C# Singleton:
\`\`\`csharp
public sealed class CacheManager
{
    private static readonly Lazy<CacheManager> _lazy =
        new Lazy<CacheManager>(() => new CacheManager());

    public static CacheManager Instance => _lazy.Value;
    private CacheManager() { }
}
\`\`\``,
    answerContent_fa: `### الگوی Singleton و چالش‌های Multi-threading

تضمین می‌کند که فقط یک نمونه از یک کلاس در کل برنامه وجود داشته باشد. در محیط چندتردی اگر پیاده‌سازی Lazy ایمن (Thread-safe) نباشد، ممکن است چند ترد همزمان وارد سازنده شده و چند نمونه ساخته شود. استفاده از \`Lazy<T>\` در دات‌نت بهترین راه حل است.`,
  },
  {
    id: "dotnet-mid-q129",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "Where is the Strategy Pattern applied in a FinTech or Insurance platform?",
    questionTitle_fa: "الگوی Strategy Pattern در کجای یک سیستم فین‌تک کاربرد دارد؟",
    answerContent: `### Strategy Pattern in FinTech / InsurTech

Defines a family of interchangeable algorithms and encapsulates each one inside a separate class.

#### Real-world FinTech Use Cases:
- **Fee Calculation:** Different calculation strategies for Debit Cards, Credit Cards, and Cryptocurrency.
- **Insurance Premium Calculation:** Different risk-scoring strategies for Third-Party Auto Insurance, Life Insurance, and Fire Insurance.`,
    answerContent_fa: `### کاربرد الگوی Strategy در سیستم‌های مالی و بیمه‌ای

برای پیاده‌سازی الگوریتم‌های مختلف محاسبه (مانند محاسبه کارمزد تراکنش، فرمول‌های قیمت‌گذاری بیمه شخص ثالث یا تخفیف‌های مناسبتی) استفاده می‌شود تا بتوان بدون تغییر کدهای قبلی، فرمول‌های جدید اضافه کرد.`,
  },
  {
    id: "dotnet-mid-q130",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "When should you use the Decorator Design Pattern?",
    questionTitle_fa: "دیزاین پترن Decorator چه زمانی استفاده می‌شود؟",
    answerContent: `### Decorator Pattern

Attaches additional responsibilities to an object dynamically without modifying its underlying code (Open/Closed Principle).

#### Common .NET Uses:
- Wrapping a repository with a **Caching Decorator** or **Logging Decorator**.

\`\`\`csharp
public class CachedProductRepository : IProductRepository
{
    private readonly IProductRepository _inner;
    private readonly IMemoryCache _cache;
    // Intercepts call, checks cache, delegates to _inner if cache miss
}
\`\`\``,
    answerContent_fa: `### کاربرد الگوی Decorator

برای افزودن قابلیت‌های جدید (مانند کشینگ، لاگینگ یا مانیتورینگ زمان اجرا) به یک کلاس موجود بدون دستکاری سورس‌کد آن کلاس استفاده می‌شود (مانند قرار دادن لایه Caching دور یک Repository).`,
  },

  // ── Database, EF Core & Optimization (Q131 - Q145) ───────────────
  {
    id: "dotnet-mid-q131",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "How do you detect and fix the N+1 query problem in EF Core?",
    questionTitle_fa: "مشکل N+1 در EF Core چیست و چگونه حل می‌شود؟",
    answerContent: `### Resolving N+1 in EF Core

1. **Use Eager Loading (\`Include\` / \`ThenInclude\`):**
   \`\`\`csharp
   var orders = await _context.Orders.Include(o => o.Items).ToListAsync();
   \`\`\`
2. **Explicit Projection (\`Select\`):**
   Only queries the specific fields needed.
3. **Split Queries (\`AsSplitQuery\`):**
   Prevents Cartesian explosive joins when including multiple child collections.`,
    answerContent_fa: `### حل مشکل N+1 در EF Core

استفاده از **Eager Loading** با دستور \`Include\`، پروژکشن فیلدهای مورد نیاز با \`Select\` و استفاده از **\`AsSplitQuery\`** برای جلوگیری از ضرب دکارتی جدول‌ها.`,
  },
  {
    id: "dotnet-mid-q132",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "What is AsNoTracking in EF Core and what performance benefits does it provide?",
    questionTitle_fa: "متد AsNoTracking در EF Core چه می‌کند و چه زمانی باید استفاده شود؟",
    answerContent: `### AsNoTracking Deep Dive

- Bypasses the EF Core Change Tracker snapshot generation.
- Reduces memory allocations by ~40-60% and speeds up read queries by avoiding object identity tracking.
- **Rule:** Use \`AsNoTracking()\` for all read-only API endpoints and reporting queries.`,
    answerContent_fa: `### کاربرد و مزایای AsNoTracking

ردیابی تغییرات توسط Change Tracker را غیرفعال می‌کند و مصرف حافظه رم را ۴۰ تا ۶۰ درصد کاهش داده و سرعت کوئری را به شدت بالا می‌برد. باید در تمامی اندپوینت‌های Read-Only استفاده شود.`,
  },
  {
    id: "dotnet-mid-q133",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "What is a Concurrency Token in EF Core and how is Optimistic Concurrency implemented?",
    questionTitle_fa: "مفهوم Concurrency Token در EF Core چیست؟",
    answerContent: `### Concurrency Tokens & Optimistic Concurrency

A **Concurrency Token** (such as a \`rowversion\` or \`xmin\` timestamp) detects conflicting updates between multiple users.

\`\`\`csharp
public class BankAccount
{
    public int Id { get; set; }
    public decimal Balance { get; set; }

    [Timestamp] // Concurrency Token
    public byte[] RowVersion { get; set; }
}
\`\`\`

If another user modified the row between read and write, EF Core generates a SQL \`WHERE RowVersion = @original\` clause and throws a **\`DbUpdateConcurrencyException\`**.`,
    answerContent_fa: `### توکن همزمانی (Concurrency Token) در EF Core

روشی برای پیاده‌سازی **Optimistic Concurrency** با استفاده از یک فیلد \`[Timestamp]\` (مانند rowversion) است. اگر کاربری رکورد را ویرایش کند و همزمان کاربر دیگری قصد ذخیره تغییرات را داشته باشد، خطای \`DbUpdateConcurrencyException\` صادر شده و از بازنویسی اشتباه داده جلوگیری می‌شود.`,
  },
  {
    id: "dotnet-mid-q134",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "What is the difference between Optimistic and Pessimistic Concurrency in databases?",
    questionTitle_fa: "تفاوت Optimistic Concurrency و Pessimistic Concurrency در دیتابیس چیست؟",
    answerContent: `### Optimistic vs. Pessimistic Concurrency

- **Optimistic Concurrency:**
  - Assumes conflicts are rare.
  - Does not lock records during reading; checks for conflicts at write time using version numbers.
  - Ideal for web apps and microservices with high read throughput.
- **Pessimistic Concurrency:**
  - Assumes conflicts will happen.
  - Acquires database locks (e.g. \`SELECT ... FOR UPDATE\` / \`XLOCK\`) from read until commit, blocking other transactions.`,
    answerContent_fa: `### مقایسه قفل‌گذاری خوش‌بینانه و بدبینانه

- **Optimistic:** هیچ قفلی روی سطرها نمی‌گذارد و موقع ذخیره چک می‌کند که نسخه داده تغییر نکرده باشد (مناسب وب و API).
- **Pessimistic:** از زمان خواندن روی سطرها قفل سخت دیتابیسی می‌گذارد و سایر تراکنش‌ها را معطل نگه می‌دارد (مناسب عملیات‌های فوق‌حساس مالی).`,
  },
  {
    id: "dotnet-mid-q135",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "How do you identify and optimize slow database queries?",
    questionTitle_fa: "چگونه کوئری‌های کند دیتابیس را پیدا و بهینه‌سازی می‌کنی؟",
    answerContent: `### Identifying & Optimizing Slow Queries

1. **Identify:** Use SQL Server Profiler, Extended Events, \`pg_stat_statements\` (PostgreSQL), and APM tools (OpenTelemetry/SigNoz).
2. **Analyze:** Inspect the **Execution Plan** to find **Index Scans**, Table Scans, and High-cost Key Lookups.
3. **Optimize:**
   - Add targeted **Covering Indexes**.
   - Eliminate non-SARGable operators (e.g. \`WHERE YEAR(Date) = 2024\`).
   - Use pagination (\`OFFSET/FETCH\`).`,
    answerContent_fa: `### شناسایی و بهینه‌سازی کوئری‌های کند

۱. شناسایی از طریق ابزارهای مانیتورینگ APM و لاگ کوئری‌های کند دیتابیس.
۲. بررسی **Execution Plan** و پیدا کردن Index Scanها و عملیات‌های گران‌قیمت.
۳. اصلاح با ساخت ایندکس‌های مناسب (Covering Index)، حذف توابع از روی ستون‌های شرط و صفحه‌بندی.`,
  },
  {
    id: "dotnet-mid-q136",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "What is an Execution Plan in SQL Server?",
    questionTitle_fa: "مفهوم Execution Plan در SQL Server چیست؟",
    answerContent: `### SQL Execution Plans

An Execution Plan is the graphic or text roadmap generated by the database query optimizer detailing how it executes a SQL statement (Index Seek, Index Scan, Nested Loops Join, Hash Match).`,
    answerContent_fa: `### مفهوم Execution Plan

نقشه راه و برنامه اجرایی بهینه‌سازی‌شده‌ای است که موتور دیتابیس برای اجرای یک کوئری (نحوه سرچ در ایندکس‌ها، انواع Join و مرتب‌سازی) تولید می‌کند.`,
  },
  {
    id: "dotnet-mid-q137",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "What is the difference between a Clustered Index and a Non-Clustered Index?",
    questionTitle_fa: "تفاوت Clustered Index و Non-Clustered Index چیست؟",
    answerContent: `### Clustered vs. Non-Clustered Index

- **Clustered Index:**
  - Dictates the **physical storage order** of data rows in the table.
  - Only **one** clustered index per table (typically the Primary Key).
- **Non-Clustered Index:**
  - A separate B-Tree structure containing index key columns and row locators (pointers back to clustered index keys).
  - Multiple non-clustered indexes per table.`,
    answerContent_fa: `### تفاوت Clustered Index و Non-Clustered Index

- **Clustered Index:** ترتیب فیزیکی ذخیره‌سازی داده‌ها روی هارد دیسک را مشخص می‌کند (فقط یک عدد در هر جدول).
- **Non-Clustered Index:** ساختار جداگانه‌ای از اشاره‌گرها برای جستجوی سریع روی ستون‌های خاص است (چندین عدد در هر جدول).`,
  },
  {
    id: "dotnet-mid-q138",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "What is a Covering Index in SQL?",
    questionTitle_fa: "مفهوم Covering Index در SQL چیست؟",
    answerContent: `### Covering Index

A **Covering Index** contains all columns requested by a query, either in the index key or via the **\`INCLUDE\`** clause.

\`\`\`sql
CREATE NONCLUSTERED INDEX IX_Orders_CustomerId
ON Orders (CustomerId)
INCLUDE (OrderDate, TotalAmount);
\`\`\`

#### Benefit:
Eliminates expensive **Key Lookups** to the clustered index because the query engine retrieves all needed fields directly from the index.`,
    answerContent_fa: `### ایندکس پوششی (Covering Index)

ایندکسی است که تمام ستون‌های مورد نیاز در شرط و فیلدهای خروجی کوئری را پوشش می‌دهد (با عبارت \`INCLUDE\`) و نیاز به عملیات پرهزینه **Key Lookup** را به صفر می‌رساند.`,
  },
  {
    id: "dotnet-mid-q139",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "How does handling JSON data in PostgreSQL (JSONB) differ from SQL Server?",
    questionTitle_fa: "نحوه مدیریت داده‌های نوع JSON در PostgreSQL چه تفاوتی با SQL Server دارد؟",
    answerContent: `### JSON in PostgreSQL (JSONB) vs. SQL Server

- **PostgreSQL (\`JSONB\`):**
  - Stores JSON in a decomposed, indexed binary format.
  - Supports **GIN indexes** for blazingly fast lookups directly inside nested JSON keys.
- **SQL Server:**
  - Stores JSON as standard \`NVARCHAR\` text and parses it at query time via functions (\`JSON_VALUE\`, \`JSON_QUERY\`).`,
    answerContent_fa: `### تفاوت مدیریت JSON در PostgreSQL و SQL Server

در **PostgreSQL** فرمت \`JSONB\` داده‌ها را به صورت باینری ذخیره می‌کند و می‌توان روی فیلدهای داخلی جیسون ایندکس **GIN** گذاشت که بسیار سریع است. در **SQL Server** جیسون به صورت متن \`NVARCHAR\` ذخیره شده و با توابع پارس می‌شود.`,
  },
  {
    id: "dotnet-mid-q140",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "What is Database Connection Pooling and how does it work?",
    questionTitle_fa: "مفهوم Connection Pooling در ارتباط با دیتابیس چیست؟",
    answerContent: `### Database Connection Pooling

Opening physical TCP database connections is expensive (authentication, handshakes). A **Connection Pool** keeps a pool of open, warm connections in memory.

When code calls \`connection.Open()\`, it borrows an existing connection from the pool. Calling \`connection.Close()\` returns it to the pool rather than terminating the physical TCP socket.`,
    answerContent_fa: `### مفهوم Connection Pooling

باز کردن کانکشن فیزیکی به دیتابیس بسیار زمان‌بر است. Connection Pool مجموعه‌ای از کانکشن‌های باز را در حافظه نگه می‌دارد تا هنگام درخواست برنامه سریعاً به آن اختصاص داده و پس از \`Dispose\` به جای بستن فیزیکی، به استخر کانکشن‌ها بازگرداند.`,
  },
  {
    id: "dotnet-mid-q141",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "How is Data Seeding performed in EF Core?",
    questionTitle_fa: "نحوه Seed کردن داده‌های اولیه در EF Core چگونه است؟",
    answerContent: `### Data Seeding in EF Core

1. **Model Seed Data (\`HasData\` in \`OnModelCreating\`):**
   - Managed directly through EF Core migrations. Requires static primary keys.
2. **Custom Seeding at Application Startup:**
   - Query \`DbContext\` on startup inside \`Program.cs\` to insert initial lookup tables and default admin users.`,
    answerContent_fa: `### نحوه Seed کردن داده‌های اولیه

استفاده از متد \`modelBuilder.Entity<T>().HasData()\` در متد \`OnModelCreating\` برای اعمال از طریق مایگریشن یا اجرای اسکریپت سفارشی درج داده‌های پایه در زمان استارت‌آپ برنامه.`,
  },
  {
    id: "dotnet-mid-q142",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "What are Global Query Filters in EF Core (e.g. for Soft Delete and Multi-Tenancy)?",
    questionTitle_fa: "مفهوم Global Query Filters در EF Core چیست؟",
    answerContent: `### Global Query Filters

Automatically applies LINQ query predicates to all queries on an entity type.

\`\`\`csharp
modelBuilder.Entity<Product>()
    .HasQueryFilter(p => !p.IsDeleted && p.TenantId == _currentTenantId);
\`\`\`

To bypass the filter when needed: \`_context.Products.IgnoreQueryFilters().ToListAsync()\`.`,
    answerContent_fa: `### مفهوم Global Query Filters

فیلترهای سراسری هستند که به صورت خودکار روی تمامی کوئری‌های یک موجودیت اعمال می‌شوند و برای پیاده‌سازی **حذف منطقی (Soft Delete)** یا تفکیک داده‌های مستاجران در **Multi-Tenancy** کاربرد دارند.`,
  },
  {
    id: "dotnet-mid-q143",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "How do you perform Bulk Insert and Bulk Update efficiently in modern .NET / EF Core?",
    questionTitle_fa: "چگونه عملیات Bulk Insert یا Bulk Update را در دات‌نت بهینه انجام می‌دهی؟",
    answerContent: `### Bulk Operations in EF Core 7+

- **\`ExecuteUpdateAsync\` / \`ExecuteDeleteAsync\` (.NET 7+):**
  - Executes directly in the database without loading entities into memory or change tracking.
  \`\`\`csharp
  await _context.Products
      .Where(p => p.Price > 100)
      .ExecuteUpdateAsync(s => s.SetProperty(p => p.Discount, 10));
  \`\`\`
- **Bulk Insert:** Use libraries like \`EFCore.BulkExtensions\` or \`SqlBulkCopy\`.`,
    answerContent_fa: `### بهینه‌سازی عملیات Bulk Insert و Bulk Update

در دات‌نت ۷ و ۸ متدهای **\`ExecuteUpdateAsync\`** و **\`ExecuteDeleteAsync\`** تغییرات را بدون لود کردن داده‌ها در رم مستقیماً در دیتابیس اعمال می‌کنند. برای درج‌های میلیونی از \`SqlBulkCopy\` استفاده می‌شود.`,
  },
  {
    id: "dotnet-mid-q144",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "What is a Value Converter in EF Core?",
    questionTitle_fa: "مفهوم Value Converter در EF Core چیست؟",
    answerContent: `### Value Converters in EF Core

Value converters convert property values when reading from or writing to the database (e.g. converting strongly-typed IDs, encrypting strings, or mapping enums to strings).

\`\`\`csharp
modelBuilder.Entity<Order>()
    .Property(e => e.Status)
    .HasConversion<string>(); // Stores enum as string in DB
\`\`\``,
    answerContent_fa: `### مفهوم Value Converter در EF Core

ابزاری برای تبدیل مقادیر پراپرتی‌ها هنگام ذخیره یا خواندن از دیتابیس است (مانند ذخیره Enum به صورت متنی در دیتابیس یا تبدیل آبجکت به JSON).`,
  },
  {
    id: "dotnet-mid-q145",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    questionTitle: "What is Client Evaluation vs. Server Evaluation in EF Core?",
    questionTitle_fa: "تفاوت Client Evaluation و Server Evaluation هنگام واکشی اطلاعات چیست؟",
    answerContent: `### Server vs. Client Evaluation in EF Core

- **Server Evaluation:** LINQ expressions translated into native SQL commands executed inside the database engine.
- **Client Evaluation:** Operations that cannot be translated to SQL are evaluated in .NET memory on the server after downloading the dataset.
- **Rule in EF Core 3.0+:** EF Core throws an exception if a top-level query clause cannot be translated to SQL, preventing accidental mass data downloads.`,
    answerContent_fa: `### مقایسه Client Evaluation و Server Evaluation

- **Server Evaluation:** بخش‌هایی از کوئری LINQ که مستقیماً به SQL تبدیل شده و در دیتابیس اجرا می‌شوند.
- **Client Evaluation:** دستوراتی که دیتابیس نمی‌شناسد و پس از دانلود داده‌ها در رم سرور دات‌نت محاسبه می‌شوند.`,
  },

  // ── Message Brokers, Caching & Microservices (Q146 - Q160) ───────
  {
    id: "dotnet-mid-q146",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What are the trade-offs of Microservices architecture compared to a Monolith?",
    questionTitle_fa: "مزایا و معایب معماری میکروسرویس نسبت به Monolith چیست؟",
    answerContent: `### Microservices vs. Monolith Trade-offs

#### Advantages:
- Independent deployments, scalability, and technological diversity per service.
- Isolated failure domains.

#### Disadvantages & Complexity:
- Distributed data consistency (no ACID across services).
- Network latency and serialization overhead.
- Operational complexity (monitoring, tracing, service discovery).`,
    answerContent_fa: `### مزایا و معایب معماری میکروسرویس

- **مزایا:** دیپلوی مستقل تیم‌ها، مقیاس‌پذیری مجزای هر ماژول و ایزوله بودن خطاها.
- **معایب:** پیچیدگی بالا در حفظ یکپارچگی داده‌ها (عدم وجود تراکنش سراسری)، افزایش ترافیک شبکه و نیاز به زیرساخت‌های پیچیده مانیتورینگ.`,
  },
  {
    id: "dotnet-mid-q147",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What is the role of an API Gateway (like Ocelot or YARP) in Microservices?",
    questionTitle_fa: "ابزار API Gateway (مثل Ocelot یا YARP) چه وظیفه‌ای در میکروسرویس دارد؟",
    answerContent: `### API Gateway (YARP / Ocelot)

Acts as a single entry point for all clients, abstracting the internal microservice topology.

#### Responsibilities:
1. **Reverse Proxy & Routing:** Forwards requests to internal service instances.
2. **Authentication & Authorization:** Validates tokens at the edge.
3. **Rate Limiting & Throttling**.
4. **Request Aggregation & SSL Termination**.`,
    answerContent_fa: `### وظایف API Gateway (مثل YARP یا Ocelot)

نقطه ورود واحد کلاینت‌ها به سیستم است و وظایفی چون مسیریابی درخواست‌ها، احراز هویت اولیه، Rate Limiting، تجمیع پاسخ‌ها و SSL Termination را انجام می‌دهد.`,
  },
  {
    id: "dotnet-mid-q148",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What is the difference between Synchronous and Asynchronous communication between microservices?",
    questionTitle_fa: "ارتباط Synchronous و Asynchronous بین میکروسرویس‌ها چه تفاوتی دارند؟",
    answerContent: `### Sync vs. Async Microservice Communication

- **Synchronous (HTTP REST / gRPC):**
  - Client waits for an immediate response from the downstream service.
  - **Risk:** Cascading failures and temporal coupling.
- **Asynchronous (Message-Driven / RabbitMQ / Kafka):**
  - Publisher emits an event to a broker and continues immediately.
  - Highly resilient, decoupled, and handles traffic spikes seamlessly.`,
    answerContent_fa: `### مقایسه ارتباط همگام و ناهمگام در میکروسرویس‌ها

- **همگام (REST / gRPC):** سرویس منتظر پاسخ می‌ماند که باعث ایجاد وابستگی زمانی و سرایت خرابی (Cascading Failure) می‌شود.
- **ناهمگام (RabbitMQ):** پیام در صف قرار گرفته و سرویس‌ها بدون قفل شدن کار خود را ادامه می‌دهند که پایداری سیستم را به شدت افزایش می‌دهد.`,
  },
  {
    id: "dotnet-mid-q149",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What is RabbitMQ and what problems does it solve in distributed systems?",
    questionTitle_fa: "RabbitMQ چیست و چه مشکلی را در سیستم‌های توزیع‌شده حل می‌کند؟",
    answerContent: `### RabbitMQ

RabbitMQ is an enterprise message broker implementing the **AMQP** protocol.

#### Solves:
- **Decoupling:** Decouples producer systems from consumer systems.
- **Load Leveling (Buffering):** Absorbs sudden spikes in traffic and processes messages at a controlled pace.
- **Guaranteed Delivery:** Retries and persists messages in case of worker downtime.`,
    answerContent_fa: `### مفهوم و کاربرد RabbitMQ

یک Message Broker بر پایه پروتکل AMQP است که ارتباط ناهمگام بین سرویس‌ها، توزیع بار (Load Leveling) در زمان ترافیک سنگین و اطمینان از عدم مفقودی پیام‌ها در صورت خرابی سرورها را تضمین می‌کند.`,
  },
  {
    id: "dotnet-mid-q150",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What is the difference between an Exchange and a Queue in RabbitMQ?",
    questionTitle_fa: "تفاوت Queue و Exchange در RabbitMQ چیست؟",
    answerContent: `### RabbitMQ: Exchange vs. Queue

- **Exchange:** Message routing agent. Receives messages from producers and pushes them to queues based on **Bindings** and **Routing Keys**.
- **Queue:** Buffer stored in memory/disk that holds messages until consumed by worker applications.`,
    answerContent_fa: `### تفاوت Exchange و Queue در RabbitMQ

- **Exchange:** مسیریاب پیام است که پیام‌ها را از فرستنده گرفته و بر اساس قوانین (Routing Key) به صف‌های مربوطه هدایت می‌کند.
- **Queue:** صف ذخیره‌سازی پیام‌ها در حافظه/دیسک تا زمانی که گیرنده‌ها (Consumers) آن‌ها را پردازش کنند.`,
  },
  {
    id: "dotnet-mid-q151",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "Explain the types of Exchanges in RabbitMQ (Direct, Fanout, Topic, Headers).",
    questionTitle_fa: "انواع Exchange در RabbitMQ (Direct, Topic, Fanout) را توضیح بده.",
    answerContent: `### RabbitMQ Exchange Types

1. **Direct Exchange:** Routes messages to queues based on an **exact match** of the routing key.
2. **Fanout Exchange:** Broadcasts messages to **all bound queues** unconditionally (ignores routing keys).
3. **Topic Exchange:** Routes messages based on wildcard pattern matching (\`*\` matches one word, \`#\` matches zero or more words, e.g. \`order.payment.#\`).
4. **Headers Exchange:** Routes based on message header attributes instead of routing keys.`,
    answerContent_fa: `### انواع Exchange در RabbitMQ

۱. **Direct:** هدایت پیام به صفی که Routing Key آن دقیقاً تطابق دارد.
۲. **Fanout:** ارسال کپی پیام به تمامی صف‌های متصل (Broadcast).
۳. **Topic:** هدایت پیام بر اساس الگوهای Wildcard (مانند \`order.*.paid\`).
۴. **Headers:** مسیریابی بر اساس مقادیر هدر پیام.`,
  },
  {
    id: "dotnet-mid-q152",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What is a Dead Letter Queue (DLQ) in RabbitMQ?",
    questionTitle_fa: "مفهوم Dead Letter Queue (DLQ) در RabbitMQ چیست؟",
    answerContent: `### Dead Letter Queue (DLQ)

A DLQ captures messages that cannot be processed successfully after exceeding max retry limits (e.g. poison messages or malformed payloads). This prevents failing messages from clogging main processing queues.`,
    answerContent_fa: `### مفهوم Dead Letter Queue (DLQ)

صفی اختصاصی برای نگه‌داری پیام‌هایی است که به دلیل خطای غیرمنتظره پس از چندین بار تلاش مجدد (Retry) پردازش نشده‌اند تا مانع از متوقف شدن صف اصلی شوند.`,
  },
  {
    id: "dotnet-mid-q153",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What is MassTransit and what capabilities does it add on top of RabbitMQ?",
    questionTitle_fa: "کتابخانه MassTransit چیست و چه امکاناتی به RabbitMQ اضافه می‌کند؟",
    answerContent: `### MassTransit in .NET

MassTransit is a high-level service bus framework for .NET that abstracts message brokers.

#### Capabilities:
- Strongly-typed consumers.
- Automatic retry policies with exponential backoff.
- Outbox pattern implementation.
- Saga state machines for distributed workflow orchestration.`,
    answerContent_fa: `### نقش کتابخانه MassTransit

یک فریم‌ورک Service Bus قدرتمند در دات‌نت است که کار با صف‌های پیام را ساده کرده و امکاناتی چون مدیریت خودکار خطاها و تلاش مجدد (Retries)، الگوی Outbox و ماشین‌های وضعیت Saga را فراهم می‌سازد.`,
  },
  {
    id: "dotnet-mid-q154",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What is Redis and what are its use cases beyond caching?",
    questionTitle_fa: "ابزار Redis چیست و چه کاربردهایی فراتر از Caching دارد؟",
    answerContent: `### Redis Capabilities

Redis is an in-memory key-value data structure store used as a:
1. **High-speed Cache**.
2. **Distributed Locks (Redlock algorithm)** for concurrency coordination.
3. **Rate Limiting Counters** (\`INCR\` with TTL).
4. **Pub/Sub and Stream Message Broker**.
5. **Leaderboards / Real-time rankings** using Sorted Sets (\`ZSET\`).`,
    answerContent_fa: `### کاربردهای Redis فراتر از کشینگ

ردیس یک پایگاه داده In-Memory فوق‌العاده سریع است که علاوه بر کش، برای **قفل‌های توزیع‌شده (Distributed Lock)**، شمارنده‌های **Rate Limiting**، سیستم‌های **Pub/Sub** و صف‌بندی اولویت‌دار استفاده می‌شود.`,
  },
  {
    id: "dotnet-mid-q155",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What are the common Data Structures in Redis (String, Hash, Set, Sorted Set)?",
    questionTitle_fa: "ساختارهای داده در Redis چه کاربردهایی دارند؟",
    answerContent: `### Redis Data Structures

- **Strings:** Binary-safe strings, tokens, JSON blobs, counters (\`INCR\`).
- **Hashes:** Objects with field-value pairs (ideal for user profiles).
- **Sets:** Unordered unique collections (tags, unique visitors).
- **Sorted Sets (ZSET):** Sets ordered by a floating-point score (leaderboards, priority queues).
- **Lists:** Ordered string lists (queues with \`LPUSH\` and \`RPOP\`).`,
    answerContent_fa: `### ساختارهای داده در ردیس

- **String:** ذخیره توکن‌ها، شمارنده‌ها و مقادیر ساده.
- **Hash:** ذخیره اشیاء و فیلدهای آبجکت (مثل پروفایل کاربر).
- **Set:** کالکشن مقادیر یکتا بدون تکرار.
- **Sorted Set (ZSET):** کالکشن مرتب‌شده بر اساس امتیاز (مناسب رتبه‌بندی و صف‌های اولویت‌دار).`,
  },
  {
    id: "dotnet-mid-q156",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What is the difference between Redis Pub/Sub and RabbitMQ?",
    questionTitle_fa: "تفاوت Redis Pub/Sub با RabbitMQ چیست؟",
    answerContent: `### Redis Pub/Sub vs. RabbitMQ

- **Redis Pub/Sub:**
  - Fire-and-forget message broadcasting.
  - **No persistence or guaranteed delivery:** If a subscriber is offline, the message is permanently lost.
- **RabbitMQ:**
  - Full-fledged enterprise message broker with message acknowledgments (\`ack\`), persistent disk storage, routing exchanges, and dead-lettering.`,
    answerContent_fa: `### تفاوت Redis Pub/Sub و RabbitMQ

- **Redis Pub/Sub:** سبک و سریع است اما رویکرد Fire-and-forget دارد و در صورت قطعی کلاینت، پیام‌ها از دست می‌روند (فاقد صف و تضمین تحویل).
- **RabbitMQ:** دارای صف‌های دائمی، تضمین تحویل و سیستم تایید دریافت (Ack) برای سناریوهای حیاتی بیزینسی است.`,
  },
  {
    id: "dotnet-mid-q157",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What are the Caching Strategies in ASP.NET Core (IMemoryCache vs. IDistributedCache)?",
    questionTitle_fa: "استراتژی‌های پیاده‌سازی Cache در ASP.NET Core چیست؟",
    answerContent: `### IMemoryCache vs. IDistributedCache

- **\`IMemoryCache\` (In-Memory):**
  - Stores cache directly in local web server RAM.
  - Fastest, but not shared across multi-instance load-balanced servers.
- **\`IDistributedCache\` (Distributed - Redis / SQL Server):**
  - Shared external cache accessible by all scaled instances.
- **HybridCache (.NET 9):** Combines L1 (in-memory) and L2 (Redis) caching.`,
    answerContent_fa: `### استراتژی‌های کشینگ در دات‌نت

- **IMemoryCache:** کش در حافظه رم سرور فعلی (فوق‌العاده سریع اما مخصوص تک‌سرور).
- **IDistributedCache:** کش توزیع‌شده مشترک بین تمام سرورها در کلاستر (بر پایه Redis).`,
  },
  {
    id: "dotnet-mid-q158",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What is the Cache Stampede (Thundering Herd) problem and how do you prevent it?",
    questionTitle_fa: "مشکل Cache Stampede چیست و چگونه حل می‌شود؟",
    answerContent: `### Cache Stampede (Thundering Herd)

Occurs when a popular cached item expires, and thousands of concurrent requests simultaneously miss the cache and hit the database at once, overwhelming and crashing the database.

#### Solutions:
1. **Locking / Mutex:** Only allow one request to recalculate and populate the cache (\`SemaphoreSlim\` or Redis lock).
2. **Early Expiration / Probabilistic Refresh:** Background refresh before expiration.`,
    answerContent_fa: `### مشکل Cache Stampede

زمانی رخ می‌دهد که کلید یک کش پربازدید منقضی شود و هزاران ریکوئست همزمان به دیتابیس هجوم ببرند. راهکار استفاده از قفل‌گذاری روی کلید کش یا استفاده از \`HybridCache\` در دات‌نت است.`,
  },
  {
    id: "dotnet-mid-q159",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What are the best strategies for Cache Invalidation?",
    questionTitle_fa: "چه زمانی و با چه استراتژی‌ای باید کش را Invalidate کنیم؟",
    answerContent: `### Cache Invalidation Strategies

1. **TTL (Time-To-Live):** Automatic expiration after a set duration.
2. **Write-Through / Write-Aside Invalidation:** Explicitly remove or update the cache key whenever data is updated or deleted.
3. **Event-Driven Invalidation:** Publish domain/integration events upon data changes to clear related cache tags.`,
    answerContent_fa: `### استراتژی‌های ابطال کش (Cache Invalidation)

استفاده از مدت زمان انقضا (TTL)، حذف صریح کلید کش به محض تغییر در متدهای Update و استفاده از معماری رویدادمحور برای حذف کش‌های مرتبط.`,
  },
  {
    id: "dotnet-mid-q160",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    questionTitle: "What is Service Discovery (e.g. Consul) in Microservices?",
    questionTitle_fa: "مفهوم Service Discovery (مانند Consul) در میکروسرویس‌ها چیست؟",
    answerContent: `### Service Discovery

In dynamic container environments (Kubernetes, Docker Swarm), service IP addresses change frequently. **Service Discovery** acts as an automated phonebook (Service Registry) where microservice instances register on startup and discover other services dynamically.`,
    answerContent_fa: `### مفهوم Service Discovery

در محیط‌های داینامیک کانتینری که آی‌پی سرویس‌ها دائم تغییر می‌کند، ابزارهایی مانند Consul یا DNS داخلی کوبرنتیز وظیفه ثبت خودکار و یافتن آدرس آی‌پی سرویس‌های فعال را به عهده دارند.`,
  },

  // ── Linux, DevOps, CI/CD & Observability (Q161 - Q175) ───────────
  {
    id: "dotnet-mid-q161",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "How do you Dockerize a .NET 8 application for production with a Multi-Stage build?",
    questionTitle_fa: "چگونه یک اپلیکیشن .NET 8 را برای پروداکشن با Multi-stage build داکرایز می‌کنی؟",
    answerContent: `### Production .NET 8 Dockerfile

\`\`\`dockerfile
# Stage 1: Build & Publish (Uses heavy SDK image)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MyApp.csproj", "./"]
RUN dotnet restore "MyApp.csproj"
COPY . .
RUN dotnet publish "MyApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime Image (Uses lightweight ASP.NET runtime image)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app
COPY --from=build /app/publish .
USER app
EXPOSE 8080
ENTRYPOINT ["dotnet", "MyApp.dll"]
\`\`\``,
    answerContent_fa: `### ساخت Dockerfile بهینه با Multi-stage build

استفاده از ایمیج سنگین \`sdk\` صرفاً برای کامپایل و پابلیش برنامه در مرحله اول، و کپی فایل‌های نهایی به یک ایمیج بسیار سبک \`aspnet:8.0-alpine\` در مرحله دوم جهت کاهش چشمگیر حجم Image و افزایش امنیت.`,
  },
  {
    id: "dotnet-mid-q162",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "What is a Multi-Stage build in Docker and why is it important?",
    questionTitle_fa: "مفهوم Multi-stage build در فایل‌های داکر چیست و چه کمکی به حجم Image می‌کند؟",
    answerContent: `### Multi-Stage Docker Builds

Multi-stage builds allow using multiple \`FROM\` statements in a single Dockerfile.
- Build tools, compilers, and source code remain in the build stage.
- Only the final compiled binaries are copied into the lean production runtime container, reducing image size from $>800\\text{MB}$ down to $<100\\text{MB}$.`,
    answerContent_fa: `### مزایای Multi-stage build

ابزارهای بیلد و سورس‌کد در لایه بیلد باقی مانده و تنها فایل‌های اجرایی کامپایل‌شده به ایمیج نهایی منتقل می‌شوند که حجم ایمیج را از ۸۰۰ مگابایت به کمتر از ۱۰۰ مگابایت می‌رساند.`,
  },
  {
    id: "dotnet-mid-q163",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "What is the difference between ENTRYPOINT and CMD in a Dockerfile?",
    questionTitle_fa: "تفاوت ENTRYPOINT و CMD در Dockerfile چیست؟",
    answerContent: `### ENTRYPOINT vs. CMD

- **\`ENTRYPOINT\`:** Sets the default executable command that cannot be easily overridden (e.g. \`ENTRYPOINT ["dotnet", "App.dll"]\`).
- **\`CMD\`:** Provides default arguments for the \`ENTRYPOINT\` that can be overridden by passing arguments in \`docker run\`.`,
    answerContent_fa: `### تفاوت ENTRYPOINT و CMD

- **ENTRYPOINT:** دستور اصلی و ثابتی است که کانتینر همیشه با آن اجرا می‌شود.
- **CMD:** پارامترهای پیش‌فرضی است که می‌توان هنگام دستور \`docker run\` به سادگی آن‌ها را جایگزین کرد.`,
  },
  {
    id: "dotnet-mid-q164",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "Explain core Kubernetes concepts: Pod, Node, Deployment, and Service.",
    questionTitle_fa: "مفاهیم پایه Kubernetes (Pod, Node, Service) را توضیح بده.",
    answerContent: `### Kubernetes Core Concepts

- **Pod:** The smallest deployable computing unit in Kubernetes; encapsulates one or more containers sharing network and storage.
- **Node:** A physical or virtual worker machine running Pods.
- **Deployment:** Manages the desired state, scaling, and rolling updates of Pods.
- **Service:** An abstraction that defines a stable IP and DNS name to load balance traffic across a set of Pods.`,
    answerContent_fa: `### مفاهیم پایه کوبرنتیز

- **Pod:** کوچک‌ترین واحد محاسباتی شامل یک یا چند کانتینر.
- **Node:** سرور فیزیکی یا مجازی اجراکننده پادها.
- **Deployment:** مدیریت تعداد کپی‌ها (Replicas) و به‌روزرسانی بدون قطعی پادها.
- **Service:** ایجاد یک آدرس IP ثابت و لودبالانسینگ ترافیک به سمت پادها.`,
  },
  {
    id: "dotnet-mid-q165",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "How do you configure Nginx as a Reverse Proxy for an ASP.NET Core app on Linux?",
    questionTitle_fa: "نحوه کانفیگ Nginx به عنوان Reverse Proxy برای اپلیکیشن دات‌نت در لینوکس چگونه است؟",
    answerContent: `### Nginx Reverse Proxy Configuration

\`\`\`nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass         http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
\`\`\`
In ASP.NET Core, enable \`app.UseForwardedHeaders()\` to read the real client IP.`,
    answerContent_fa: `### کانفیگ Nginx به عنوان Reverse Proxy

در فایل کانفیگ Nginx با دستور \`proxy_pass http://127.0.0.1:5000;\` ترافیک به Kestrel فوروارد شده و هدرهای \`X-Forwarded-For\` تنظیم می‌شوند. در دات‌نت نیز میدل‌ویر \`UseForwardedHeaders\` فعال می‌گردد.`,
  },
  {
    id: "dotnet-mid-q166",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "What steps do you follow to deploy a .NET app on an Ubuntu Linux server using systemd?",
    questionTitle_fa: "برای دیپلوی پروژه‌های دات‌نت روی سرور لینوکسی چه مراحلی طی می‌کنی؟",
    answerContent: `### Deploying .NET on Ubuntu with systemd

1. Publish application binaries to \`/var/www/my-app\`.
2. Create a systemd service file: \`/etc/systemd/system/kestrel-myapp.service\`:
   \`\`\`ini
   [Unit]
   Description=My .NET Web App
   [Service]
   WorkingDirectory=/var/www/my-app
   ExecStart=/usr/bin/dotnet /var/www/my-app/MyApp.dll
   Restart=always
   RestartSec=10
   SyslogIdentifier=dotnet-myapp
   User=www-data
   Environment=ASPNETCORE_ENVIRONMENT=Production
   [Install]
   WantedBy=multi-user.target
   \`\`\`
3. Enable and start: \`systemctl enable --now kestrel-myapp.service\`.`,
    answerContent_fa: `### دیپلوی دات‌نت در اوبونتو با systemd

کپی باینری‌های برنامه در سرور، ساخت یک سرویس \`systemd\` با تنظیم \`Restart=always\` و متغیرهای پروداکشن، و در نهایت استارت سرویس با \`systemctl enable --now\`.`,
  },
  {
    id: "dotnet-mid-q167",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "What is the structure of a .gitlab-ci.yml pipeline file?",
    questionTitle_fa: "فایل .gitlab-ci.yml چه ساختاری دارد؟",
    answerContent: `### GitLab CI Pipeline Structure

\`\`\`yaml
stages:
  - build
  - test
  - publish
  - deploy

build_job:
  stage: build
  script:
    - dotnet build -c Release

test_job:
  stage: test
  script:
    - dotnet test --no-build -c Release

docker_publish:
  stage: publish
  script:
    - docker build -t my-registry.com/app:$CI_COMMIT_SHA .
    - docker push my-registry.com/app:$CI_COMMIT_SHA
  only:
    - main
\`\`\``,
    answerContent_fa: `### ساختار فایل .gitlab-ci.yml

تعریف مراحل (Stages) مختلف مانند \`build\`، \`test\`، \`publish\` و \`deploy\` که با هر Push به گیت‌لب دستورات خط فرمان به ترتیب در رانرها اجرا می‌شوند.`,
  },
  {
    id: "dotnet-mid-q168",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "What is the difference between Continuous Integration (CI) and Continuous Deployment (CD)?",
    questionTitle_fa: "تفاوت Continuous Integration (CI) و Continuous Deployment (CD) چیست؟",
    answerContent: `### CI vs. CD

- **Continuous Integration (CI):** Developers merge code frequently; automated pipeline builds and runs unit tests to catch integration bugs early.
- **Continuous Delivery (CD):** Automatically prepares release artifacts and deploys to staging environments with manual approval for production.
- **Continuous Deployment:** Every passing build is automatically deployed to production with zero manual intervention.`,
    answerContent_fa: `### تفاوت CI و CD

- **CI:** بیلد و اجرای خودکار تست‌ها با هر کامیت.
- **CD (Delivery):** آماده‌سازی خودکار پکیج‌های انتشار برای دیپلوی با تایید دستی.
- **CD (Deployment):** انتشار خودکار و مستقیم کدهای تاییدشده در محیط پروداکشن بدون دخالت انسان.`,
  },
  {
    id: "dotnet-mid-q169",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "What is Observability and how does it differ from traditional Monitoring?",
    questionTitle_fa: "مفهوم Observability چیست و چه تفاوتی با Monitoring ساده دارد؟",
    answerContent: `### Observability vs. Monitoring

- **Monitoring:** Tells you **that** a system is broken (e.g. CPU $>90\%$, HTTP 500 error rate high).
- **Observability:** Enables you to understand **why** the system is broken by inferring internal system states from external outputs (combining Metrics, Traces, and Structured Logs).`,
    answerContent_fa: `### تفاوت Observability با Monitoring

- **Monitoring:** به شما می‌گوید که سیستم خراب شده است (مثلاً خطای ۵۰۰ یا مصرف بالای CPU).
- **Observability:** به شما اجازه می‌دهد از طریق تحلیل لاگ‌ها، تریس‌ها و متریک‌ها بفهمید **چرا** سیستم دچار مشکل شده است.`,
  },
  {
    id: "dotnet-mid-q170",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "Explain the Three Pillars of Observability: Logs, Metrics, and Traces.",
    questionTitle_fa: "تفاوت Log، Metric و Trace در مانیتورینگ چیست؟",
    answerContent: `### The 3 Pillars of Observability

1. **Logs:** Timestamped discrete text events detailing what occurred (\`User 42 failed password attempt\`).
2. **Metrics:** Numeric aggregated telemetry measured over intervals (Request rate, memory usage, P99 latency).
3. **Traces:** End-to-end journey of a request as it travels across multiple distributed microservices.`,
    answerContent_fa: `### ۳ ستون اصلی Observability

۱. **Logs:** وقایع متنی زمان‌بندی‌شده از اتفاقات رخ‌داده در برنامه.
۲. **Metrics:** مقادیر عددی تجمیعی برای سنجش سلامت سیستم (مانند زمان پاسخ‌دهی و مصرف رم).
۳. **Traces:** ردیابی مسیر کامل یک ریکوئست در بین چندین میکروسرویس مختلف.`,
  },
  {
    id: "dotnet-mid-q171",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "What is OpenTelemetry and how is it instrumented in .NET?",
    questionTitle_fa: "ابزار OpenTelemetry چیست و چگونه در دات‌نت استفاده می‌شود؟",
    answerContent: `### OpenTelemetry (OTel) in .NET

OpenTelemetry is the vendor-neutral industry standard for generating, collecting, and exporting traces, metrics, and logs.

\`\`\`csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddOtlpExporter());
\`\`\``,
    answerContent_fa: `### نقش OpenTelemetry در دات‌نت

استاندارد جهانی و فراجامع برای جمع‌آوری لاگ، متریک و تریس در اپلیکیشن‌ها است که به سادگی با پکیج‌های \`OpenTelemetry.Extensions.Hosting\` به ASP.NET Core متصل شده و داده‌ها را به SigNoz، Jaeger یا Prometheus صادر می‌کند.`,
  },
  {
    id: "dotnet-mid-q172",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "What is SigNoz and how does it compare to the ELK Stack?",
    questionTitle_fa: "ابزار SigNoz چه کاربردی دارد و چه تفاوتی با ELK Stack دارد؟",
    answerContent: `### SigNoz vs. ELK Stack

- **SigNoz:** All-in-one open-source APM native to **OpenTelemetry**, built on top of **ClickHouse** (columnar database). Extremely fast query speeds for traces and metrics with much lower RAM requirements.
- **ELK Stack (Elasticsearch, Logstash, Kibana):** Excellent for full-text log search, but heavier on memory and resource consumption.`,
    answerContent_fa: `### مقایسه SigNoz و ELK Stack

ابزار **SigNoz** پلتفرمی مدرن و مبتنی بر ClickHouse و OpenTelemetry است که متریک، تریس و لاگ را یکپارچه نمایش می‌دهد و مصرف منابع کمتری نسبت به **ELK Stack** دارد.`,
  },
  {
    id: "dotnet-mid-q173",
    stackId: "dotnet",
    categoryId: "devops-docker",
    levelId: "mid",
    questionTitle: "Explain the architecture of the ELK Stack (Elasticsearch, Logstash, Kibana).",
    questionTitle_fa: "معماری Elasticsearch و کاربرد Logstash و Kibana را توضیح بده.",
    answerContent: `### ELK Stack Architecture

1. **Logstash / Filebeat:** Shippers that collect, parse, and ingest logs from servers.
2. **Elasticsearch:** Distributed search and analytics engine storing inverted index documents.
3. **Kibana:** Web UI for searching logs and creating visualization dashboards.`,
    answerContent_fa: `### معماری ELK Stack

شامل **Logstash/Filebeat** برای جمع‌آوری و فیلتر کردن لاگ‌ها، **Elasticsearch** به عنوان پایگاه داده جستجوی متنی سریع و **Kibana** به عنوان رابط گرافیکی نمایش داشبوردها و جستجوی لاگ‌ها.`,
  },
  {
    id: "dotnet-mid-q174",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "mid",
    questionTitle: "What is your strategy for Integration Testing with databases using Testcontainers?",
    questionTitle_fa: "استراتژی شما برای تست‌های Integration با دیتابیس (مثلاً Testcontainers) چیست؟",
    answerContent: `### Integration Testing with Testcontainers

**Testcontainers** spins up lightweight, real Docker containers (PostgreSQL, SQL Server, Redis) during test execution and tears them down automatically.

\`\`\`csharp
public class IntegrationTestFixture : IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder().Build();

    public async Task InitializeAsync() => await _dbContainer.StartAsync();
    public async Task DisposeAsync() => await _dbContainer.DisposeAsync();
}
\`\`\``,
    answerContent_fa: `### تست‌های Integration با Testcontainers

ابزار Testcontainers هنگام اجرای تست‌های خودکار، کانتینرهای داکر واقعی دیتابیس (مانند PostgreSQL یا Redis) را استارت زده، مایگریشن‌ها را اعمال می‌کند و پس از اتمام تست‌ها، کانتینر را پاک می‌کند تا نیازی به دیتابیس In-Memory یا Mock نباشد.`,
  },
  {
    id: "dotnet-mid-q175",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "How do you implement Health Checks in ASP.NET Core?",
    questionTitle_fa: "نحوه پیاده‌سازی Health Check در سرویس‌های دات‌نت چگونه است؟",
    answerContent: `### Health Checks in ASP.NET Core

\`\`\`csharp
builder.Services.AddHealthChecks()
    .AddSqlServer(connString, name: "database")
    .AddRedis(redisConn, name: "cache");

app.MapHealthChecks("/health");
\`\`\`
Kubernetes uses this endpoint for **Liveness** (restart crashed containers) and **Readiness** probes (route traffic only when ready).`,
    answerContent_fa: `### پیاده‌سازی Health Check در ASP.NET Core

با متد \`AddHealthChecks\` وضعیت دیتابیس، ردیس و صف‌ها بررسی شده و در مسیر \`/health\` اکسپوز می‌شود تا کوبرنتیز پادهای سالم را شناسایی کند (Liveness & Readiness Probes).`,
  },

  // ── Security, Logging & Daily Scenarios (Q176 - Q200) ────────────
  {
    id: "dotnet-mid-q176",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "How do you implement API Versioning in ASP.NET Core?",
    questionTitle_fa: "نحوه Versioning در Web APIها را چگونه پیاده‌سازی می‌کنی؟",
    answerContent: `### API Versioning Strategies

1. **URI Path Versioning (Recommended):** \`/api/v1/orders\` vs \`/api/v2/orders\`.
2. **Query String:** \`/api/orders?api-version=2.0\`.
3. **Header Versioning:** \`X-Version: 2.0\`.

Implemented via \`Asp.Versioning.Mvc\` package in ASP.NET Core.`,
    answerContent_fa: `### ورژن‌بندی (Versioning) در Web API

روش استاندارد از طریق URL (مانند \`/api/v1/products\`) با استفاده از پکیج \`Asp.Versioning.Mvc\` است که امکان ارتقای ساختار API را بدون از کار انداختن کلاینت‌های نسخه قدیمی فراهم می‌کند.`,
  },
  {
    id: "dotnet-mid-q177",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "What is Structured Logging and why use Serilog?",
    questionTitle_fa: "مفهوم Structured Logging چیست و چرا از Serilog استفاده می‌کنیم؟",
    answerContent: `### Structured Logging & Serilog

Traditional text logs (\`Log("User 42 logged in")\`) are hard to query.
**Structured Logging** captures properties as JSON key-value pairs:
\`\`\`csharp
_logger.LogInformation("User {UserId} placed order {OrderId}", userId, orderId);
\`\`\`
Enables searching logs in Elasticsearch/Kibana by \`UserId == 42\` and \`OrderId == 100\`.`,
    answerContent_fa: `### مفهوم Structured Logging و Serilog

لاگ ساختاریافته پارامترها را به شکل کلید/مقدار ذخیره می‌کند تا بتوان در ابزارهایی مانند الستیک‌سرچ بر اساس فیلدهای خاص (مانند \`UserId\`) کوئری و فیلتر دقیق انجام داد.`,
  },
  {
    id: "dotnet-mid-q178",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "How do you handle Timezones and Dates in enterprise applications?",
    questionTitle_fa: "مدیریت Timezoneها و تاریخ‌ها (UTC در مقابل Local) در دیتابیس را چگونه هندل می‌کنی؟",
    answerContent: `### Timezone Handling Best Practices

1. **Store in UTC:** Always store timestamps in UTC (\`DateTimeOffset\` or UTC \`DateTime\`) in the database.
2. **Convert at UI Boundary:** Convert UTC to the client's local timezone (or Persian Solar calendar) only when rendering to the user.`,
    answerContent_fa: `### مدیریت تاریخ‌ها و Timezoneها

همیشه تاریخ‌ها در دیتابیس به صورت **UTC** ذخیره می‌شوند و تبدیل به ساعت محلی یا تقویم شمسی صرفاً در لایه نمایش به کاربر (UI) صورت می‌گیرد.`,
  },
  {
    id: "dotnet-mid-q179",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "What is the difference between Policy-based and Claim-based Authorization in ASP.NET Core?",
    questionTitle_fa: "تفاوت Policy-based Authorization و Claim-based Authorization چیست؟",
    answerContent: `### Claim vs. Policy Authorization

- **Claim:** A key-value identity pair (e.g. \`Department: Finance\`, \`Age: 25\`).
- **Policy:** A rule combining multiple requirements and claims:
\`\`\`csharp
options.AddPolicy("SeniorFinancePolicy", policy =>
    policy.RequireClaim("Department", "Finance")
          .RequireRole("Manager"));
\`\`\``,
    answerContent_fa: `### تفاوت Claim و Policy در احراز دسترسی

- **Claim:** یک جفت کلید/مقدار هویتی کاربر است (مانند \`Role: Admin\`).
- **Policy:** قانونی ترکیبی است که می‌تواند مجموعه‌ای از Claimها، نقش‌ها و شرایط منطقی را برای دسترسی به یک اندپوینت بررسی کند.`,
  },
  {
    id: "dotnet-mid-q180",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "What is a JWT (JSON Web Token) and what are its components?",
    questionTitle_fa: "مفهوم JWT (JSON Web Token) چیست و شامل چه بخش‌هایی است؟",
    answerContent: `### JWT Structure

A JWT consists of three Base64Url-encoded parts separated by dots (\`.\`):
1. **Header:** Algorithm & token type (\`{"alg": "HS256", "typ": "JWT"}\`).
2. **Payload:** Claims, User ID, Expiration timestamp (\`exp\`).
3. **Signature:** \`HMACSHA256(Header + Payload, SecretKey)\` ensuring token tamper resistance.`,
    answerContent_fa: `### ساختار JWT

توکن JWT شامل ۳ بخش کدگذاری‌شده با نقطه است:
۱. **Header:** الگوریتم امضا.
۲. **Payload:** اطلاعات کاربر و Claimها.
۳. **Signature:** امضای دیجیتال با کلید سکرت سرور برای تضمین عدم تغییر توکن.`,
  },
  {
    id: "dotnet-mid-q181",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "What is the difference between Access Tokens and Refresh Tokens?",
    questionTitle_fa: "توکن‌های Access و Refresh چه تفاوتی دارند و چرا به Refresh Token نیاز داریم؟",
    answerContent: `### Access Token vs. Refresh Token

- **Access Token:** Short-lived (e.g., 15 minutes), sent with every HTTP request. If stolen, window of vulnerability is small.
- **Refresh Token:** Long-lived (e.g., 30 days), stored securely in database, used exclusively to request a new Access Token.`,
    answerContent_fa: `### تفاوت Access Token و Refresh Token

- **Access Token:** طول عمر کوتاه (مثلاً ۱۵ دقیقه) دارد و با هر ریکوئست ارسال می‌شود.
- **Refresh Token:** طول عمر طولانی دارد و فقط برای تمدید Access Token به کار می‌رود تا نیاز به لاگین مجدد نباشد.`,
  },
  {
    id: "dotnet-mid-q182",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "How do you securely store passwords in a database (Hashing vs. Encryption)?",
    questionTitle_fa: "نحوه ایمن‌سازی پسوردها در دیتابیس (Hashing vs Encryption) چیست؟",
    answerContent: `### Password Security: Hashing vs. Encryption

- **Encryption (Two-way):** Can be decrypted with a private key (NEVER use for passwords).
- **Hashing (One-way):** Mathematically irreversible. Always use slow, salted cryptographic hashing algorithms (**Argon2id**, **BCrypt**, **PBKDF2**).`,
    answerContent_fa: `### ذخیره ایمن پسوردها

پسوردها هرگز نباید رمزنگاری (Encryption) شوند چون قابل رمزگشایی هستند، بلکه باید با الگوریتم‌های هشینگ یک‌طرفه و کند مانند **BCrypt** یا **Argon2** به همراه **Salt** هش شوند.`,
  },
  {
    id: "dotnet-mid-q183",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "What is a Salt in password hashing and how does BCrypt work?",
    questionTitle_fa: "الگوریتم‌های Hashing مثل BCrypt را توضیح بده و بگو Salt چیست؟",
    answerContent: `### Password Salting & BCrypt

A **Salt** is a unique cryptographically random string appended to the password before hashing.
- Prevents **Rainbow Table attacks** and ensures two identical passwords produce completely different hash outputs.`,
    answerContent_fa: `### مفهوم Salt در هشینگ

یک رشته رندوم منحصر‌به‌فرد است که قبل از هش به پسورد اضافه می‌شود تا مانع از حملات جدول رنگین‌کمان (Rainbow Table) شود.`,
  },
  {
    id: "dotnet-mid-q184",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "What is a CSRF attack and how is it prevented in ASP.NET Core?",
    questionTitle_fa: "حمله CSRF چیست و چگونه در دات‌نت از آن جلوگیری می‌کنیم؟",
    answerContent: `### CSRF (Cross-Site Request Forgery)

Tricks an authenticated user's browser into submitting unwanted actions to a web app using stored cookies.

**Prevention:** Use Anti-Forgery Tokens (\`[ValidateAntiForgeryToken]\`) or SameSite cookie attributes (\`SameSite=Strict/Lax\`).`,
    answerContent_fa: `### حمله CSRF و راه‌های مقابله

حمله‌ای است که کاربر لاگین‌شده را فریب می‌دهد تا فرم ناخواسته‌ای را بدون اطلاع ارسال کند. راهکار استفاده از توکن‌های ضدجعل (\`Anti-Forgery Tokens\`) و تنظیم \`SameSite=Strict\` روی کوکی‌ها است.`,
  },
  {
    id: "dotnet-mid-q185",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "What is an XSS attack and how is it mitigated?",
    questionTitle_fa: "حمله XSS چیست و چگونه مهار می‌شود؟",
    answerContent: `### XSS (Cross-Site Scripting)

Occurs when malicious JavaScript is injected into web pages viewed by other users.

**Prevention:** HTML-encode all dynamic user inputs, use Content Security Policy (CSP) headers, and sanitize inputs.`,
    answerContent_fa: `### حمله XSS و پیشگیری از آن

تزریق کدهای مخرب جاوااسکریپت به صفحات وب است. راهکار، Encode کردن خروجی‌های ارسالی کاربر و تنظیم هدرهای CSP (Content Security Policy) است.`,
  },
  {
    id: "dotnet-mid-q186",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "How do you prevent SQL Injection in EF Core and Dapper?",
    questionTitle_fa: "جلوگیری از SQL Injection در EF Core و Dapper چگونه انجام می‌شود؟",
    answerContent: `### Preventing SQL Injection

1. **EF Core / LINQ:** Automatically parameterizes all queries.
2. **Dapper / Raw SQL:** Always use parameterized queries (\`@parameter\`), NEVER string concatenation!`,
    answerContent_fa: `### جلوگیری از SQL Injection

در EF Core و Dapper همیشه باید از کوئری‌های پارامتری استفاده کرد و هرگز رشته‌های ورودی کاربر را با متن SQL ترکیب نکرد.`,
  },
  {
    id: "dotnet-mid-q187",
    stackId: "dotnet",
    categoryId: "security-practices",
    levelId: "mid",
    questionTitle: "How do you handle large file uploads securely in ASP.NET Core?",
    questionTitle_fa: "نحوه آپلود و مدیریت فایل‌های حجیم به صورت امن در یک Web API چگونه است؟",
    answerContent: `### Secure Large File Uploads

1. **Streaming Uploads:** Use streaming multipart parsers to avoid buffering multi-gigabyte files into server RAM.
2. **Validation:** Validate magic file header bytes (not just extension) and scan for malware.
3. **Storage:** Store on cloud blob storage (S3 / Azure Blob) rather than web server disk.`,
    answerContent_fa: `### آپلود امن فایل‌های حجیم

استفاده از رویکرد Streaming برای جلوگیری از اشغال حافظه رم، اعتبارسنجی بایت‌های واقعی هدر فایل (Magic Bytes) و ذخیره‌سازی در Object Storage (مانند S3 یا MinIO).`,
  },
  {
    id: "dotnet-mid-q188",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "What is the difference between IOptions, IOptionsSnapshot, and IOptionsMonitor?",
    questionTitle_fa: "تفاوت IOptions، IOptionsSnapshot و IOptionsMonitor برای خواندن کانفیگ‌ها چیست؟",
    answerContent: `### IOptions vs. IOptionsSnapshot vs. IOptionsMonitor

- **\`IOptions<T>\`:** Registered as Singleton; does **not** read updated configuration files after startup.
- **\`IOptionsSnapshot<T>\`:** Registered as Scoped; recomputes options on **every HTTP request** when configuration files change.
- **\`IOptionsMonitor<T>\`:** Registered as Singleton; supports dynamic real-time change notifications via \`OnChange\`.`,
    answerContent_fa: `### مقایسه اینترفیس‌های خواندن تنظیمات (Options Pattern)

- **\`IOptions\`**: سینگلتون است و تغییرات فایل کانفیگ پس از استارت سرور را متوجه نمی‌شود.
- **\`IOptionsSnapshot\`**: اسکوپد است و با هر ریکوئست مقادیر آپدیت‌شده را بازخوانی می‌کند.
- **\`IOptionsMonitor\`**: سینگلتون است و امکان گوش دادن به رویداد تغییر کانفیگ را به صورت بلادرنگ دارد.`,
  },
  {
    id: "dotnet-mid-q189",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "What is the Polly library and how do you implement the Retry Pattern in C#?",
    questionTitle_fa: "کتابخانه Polly چیست و Retry Pattern را چگونه پیاده‌سازی می‌کنی؟",
    answerContent: `### Polly & Retry Pattern

Polly is a .NET resilience and transient-fault-handling library.

\`\`\`csharp
var retryPolicy = Policy
    .Handle<HttpRequestException>()
    .WaitAndRetryAsync(3, retryAttempt => 
        TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))); // Exponential Backoff
\`\`\``,
    answerContent_fa: `### کتابخانه Polly و الگوی Retry

کتابخانه‌ای برای مدیریت خطاهای موقت شبکه و دیتابیس است که با الگوی Retry و فاصله زمانی تصاعدی (Exponential Backoff) درخواست‌ها را مجدداً تلاش می‌کند.`,
  },
  {
    id: "dotnet-mid-q190",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "What is the Circuit Breaker Pattern and how does it prevent cascading failures?",
    questionTitle_fa: "الگوی Circuit Breaker چیست و در ارتباطات بین سرویس‌ها چه کمکی می‌کند؟",
    answerContent: `### Circuit Breaker Pattern

Prevents an application from repeatedly trying to execute an operation likely to fail:
- **Closed:** Normal operations; calls go through.
- **Open:** Tripped after repeated failures; requests fail fast immediately without hitting downstream servers.
- **Half-Open:** Periodically sends trial requests to check if downstream service recovered.`,
    answerContent_fa: `### الگوی Circuit Breaker

مانع از ارسال درخواست‌های پیاپی به سرویسی می‌شود که هم‌اکنون از کار افتاده است و دارای ۳ وضعیت Closed (عادی)، Open (قطع کامل و پاسخ سریع خطا) و Half-Open (ارسال آزمایشی چند درخواست) است.`,
  },
  {
    id: "dotnet-mid-q191",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "mid",
    questionTitle: "What is your checklist and approach during a Code Review?",
    questionTitle_fa: "چگونه کد ریویو (Code Review) انجام می‌دهی؟ چه چیزهایی برایت مهم است؟",
    answerContent: `### Code Review Checklist

1. **Correctness & Edge Cases:** Null checks, boundary conditions, thread-safety.
2. **Architecture & Clean Code:** SRP, proper layering, readability, DRY.
3. **Performance & Security:** N+1 queries, unindexed SQL filters, SQL injection, resource disposal.
4. **Test Coverage:** Are unit/integration tests included?`,
    answerContent_fa: `### چک‌لیست و اصول Code Review

بررسی صحت منطق بیزینس و هندل کردن خطاهای نال، رعایت اصول معماری و SOLID، امنیت و پرفورمنس کوئری‌ها (عدم وجود N+1) و پوشش مناسب تست‌های واحد.`,
  },
  {
    id: "dotnet-mid-q192",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "mid",
    questionTitle: "How do you estimate complex engineering tasks?",
    questionTitle_fa: "چگونه تخمین زمان (Estimation) برای تسک‌های پیچیده را انجام می‌دهی؟",
    answerContent: `### Task Estimation Technique

- **Decomposition:** Break large tasks into subtasks $<1$ day of effort.
- **Spike:** If high architectural uncertainty exists, create a timeboxed Research Spike first.
- **Buffer:** Factor in code reviews, integration testing, and deployment overhead.`,
    answerContent_fa: `### نحوه تخمین تسک‌های پیچیده

شکستن تسک به بخش‌های کوچک، ایجاد یک تسک تحقیقی محدود (Spike) در صورت وجود ابهام فنی و در نظر گرفتن زمان برای تست، ریویو و دیپلوی.`,
  },
  {
    id: "dotnet-mid-q193",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "mid",
    questionTitle: "How do you handle incomplete tasks at the end of a sprint?",
    questionTitle_fa: "اگر یک تسک در اسپرینت تمام نشود، چه واکنشی نشان می‌دهی؟",
    answerContent: `### Incomplete Sprint Tasks

1. **Early Communication:** Raise risks during Daily Standups before sprint end.
2. **Split Task:** Move unfinished work back to Product Backlog to be reprioritized by the Product Owner for the next sprint.
3. **Retrospective:** Analyze root cause during retrospective.`,
    answerContent_fa: `### مدیریت تسک‌های ناتمام در انتهای اسپرینت

اطلاع‌رسانی زودهنگام در دیلی استندآپ، برگرداندن بخش ناتمام به بک‌لاگ برای اولویت‌بندی مجدد و بررسی علت تاخیر در جلسه Retrospective.`,
  },
  {
    id: "dotnet-mid-q194",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "mid",
    questionTitle: "How do you handle technical disagreements with teammates or tech leads?",
    questionTitle_fa: "نحوه برخورد با اختلاف نظر فنی با هم‌تیمی‌ها یا مدیر فنی چگونه است؟",
    answerContent: `### Resolving Technical Disagreements

- Base arguments on **data, benchmarks, and architectural trade-offs** rather than personal opinions.
- Create a quick Proof of Concept (PoC).
- Practice "Disagree and Commit" once a team decision is finalized.`,
    answerContent_fa: `### حل اختلاف نظر فنی در تیم

گفتگوی مبتنی بر بنچمارک، شواهد فنی و بررسی Trade-offها، ساخت نمونه اولیه (PoC) و پایبندی به تصمیم نهایی تیم (Disagree and Commit).`,
  },
  {
    id: "dotnet-mid-q195",
    stackId: "dotnet",
    categoryId: "general-engineering",
    levelId: "mid",
    questionTitle: "What is your approach to mentoring junior engineers?",
    questionTitle_fa: "تجربه شما در منتور کردن کارآموزان چه چالش‌هایی دارد و چگونه آن را هدایت می‌کنی؟",
    answerContent: `### Mentoring Junior Engineers

- Practice Pair Programming to model debugging workflows.
- Provide constructive, kind code review feedback explaining the **"Why"**.
- Encourage autonomy by guiding them to answers rather than dictating solutions.`,
    answerContent_fa: `### رویکرد منتورینگ نیروهای جونیور

انجام Pair Programming، ارائه فیدبک‌های سازنده در کد ریویو با توضیح چرایی، و هدایت آنها به سمت کشف راهکار به جای دیکته کردن مستقیم پاسخ.`,
  },
  {
    id: "dotnet-mid-q196",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    questionTitle: "How do you standardize API Responses across an enterprise application?",
    questionTitle_fa: "فرمت کردن و استانداردسازی پاسخ‌های API را چگونه انجام می‌دهی؟",
    answerContent: `### Standardized API Responses

Use standard envelopes or RFC 7807 ProblemDetails:
\`\`\`json
{
  "success": true,
  "data": { "id": 1, "name": "Product A" },
  "errors": null,
  "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00"
}
\`\`\``,
    answerContent_fa: `### استانداردسازی ساختار پاسخ‌های API

استفاده از ساختار پاکت پاسخ یکپارچه (شامل \`data\`، \`success\` و \`errors\`) یا استاندارد جهانی **RFC 7807 (ProblemDetails)** برای خطاها.`,
  },
  {
    id: "dotnet-mid-q197",
    stackId: "dotnet",
    categoryId: "clean-code-testing",
    levelId: "mid",
    questionTitle: "What is the role of Static Code Analyzers like SonarQube in .NET?",
    questionTitle_fa: "ابزارهای Code Analyzer در دات‌نت مانند SonarQube چه نقشی دارند؟",
    answerContent: `### SonarQube & Code Quality Gates

Automates static code analysis in CI pipelines:
- Detects security vulnerabilities and code smells.
- Tracks test code coverage and duplicates.
- Enforces Quality Gates before allowing pull request merges.`,
    answerContent_fa: `### نقش SonarQube در تضمین کیفیت کد

تحلیل ایستای سورس‌کد در پایپ‌لاین CI برای شناسایی آسیب‌پذیری‌های امنیتی، کد اسمِل‌ها و بررسی عبور از خطوط قرمز کیفی (Quality Gates).`,
  },
  {
    id: "dotnet-mid-q198",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    questionTitle: "How do you prevent NullReferenceExceptions structurally (Nullable Reference Types & Result Pattern)?",
    questionTitle_fa: "نحوه هندل کردن Null Reference Exception به طور ساختاری چیست؟",
    answerContent: `### Structural Null Safety in C#

1. **Nullable Reference Types (C# 8+):** Enable \`<Nullable>enable</Nullable>\` to get compile-time warnings.
2. **Result Pattern:** Avoid returning null by returning a \`Result<T>\` object indicating success or failure.`,
    answerContent_fa: `### جلوگیری ساختاری از خطای NullReferenceException

فعال‌سازی قابلیت **Nullable Reference Types** در سی‌شارپ ۸ به بعد و استفاده از **الگوی Result** به جای بازگرداندن مقادیر \`null\`.`,
  },
  {
    id: "dotnet-mid-q199",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    questionTitle: "How do you process a 500MB Excel/CSV file in .NET without exhausting server RAM?",
    questionTitle_fa: "برای پردازش یک فایل اکسل ۵۰۰ مگابایتی در بک‌اند از چه رویکردی استفاده می‌کنی تا RAM پر نشود؟",
    answerContent: `### Processing Large Files with Constant Memory

- **DO NOT** load the entire file into memory using DOM parsers.
- Use **Streaming / SAX readers** (e.g., \`ExcelDataReader\` in streaming mode, \`CsvHelper\` reading line-by-line via \`IEnumerable\`).
- Process and batch-insert records into the database in chunks of $1,000$ rows.`,
    answerContent_fa: `### پردازش فایل‌های فوق‌حجیم بدون اشغال رم

استفاده از کتابخانه‌های استریمینگ (مانند \`ExcelDataReader\` یا \`CsvHelper\`) که سطرها را تک‌تک با \`yield\` می‌خوانند و درج دسته‌ای رکوردهای پردازش‌شده در دسته‌های ۱۰۰۰ تایی.`,
  },
  {
    id: "dotnet-mid-q200",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    questionTitle: "How do you design background workers for bulk email or SMS sending?",
    questionTitle_fa: "استفاده از Background Tasks برای ارسال ایمیل یا پیامک انبوه در سیستم.",
    answerContent: `### High-Throughput Background Job Processing

1. Enqueue job messages into a persistent queue (RabbitMQ / Redis / Hangfire).
2. Worker services consume messages with rate limiting according to SMS provider limits.
3. Use the **Outbox Pattern** to guarantee messages are never lost if database transactions commit.`,
    answerContent_fa: `### طراحی سرویس‌های پس‌زمینه برای ارسال انبوه پیامک/ایمیل

قرار دادن درخواست‌ها در صف‌های ناهمگام (RabbitMQ یا Hangfire)، پردازش دسته‌ای با اعمال محدودیت نرخ ارسال و استفاده از الگوی Outbox برای اطمینان از ثبت قطعی پیام.`,
  },
  {
    id: "dotnet-mid-q201",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-expression-trees"],
    questionTitle: "What is an Expression Tree in C# and what is the fundamental difference between Expression<Func<T, bool>> and Func<T, bool>?",
    questionTitle_fa: "مفهوم درخت عبارات (Expression Tree) در سی‌شارپ چیست و تفاوت بنیادین Expression<Func<T, bool>> با Func<T, bool> در چیست؟",
    answerContent: `### Expression Trees vs. Delegates

- **\`Func<T, bool>\` (Delegate):**
  - Compiled directly to executable **Intermediate Language (IL) bytecode**.
  - Treated as a black-box executable pointer by the CLR.
  - Used in LINQ-to-Objects (\`IEnumerable<T>\`) to filter items in **Application RAM**.

- **\`Expression<Func<T, bool>>\` (Expression Tree):**
  - Represents code as an in-memory **Abstract Syntax Tree (AST)** data structure.
  - Transparent and inspectable at runtime (e.g. examining parameter names, property access, binary operators).
  - Used in LINQ-to-Entities (\`IQueryable<T>\`) where EF Core translates the AST nodes into native **SQL WHERE clauses** executed on the database server.
  - To execute locally in memory, it must be explicitly compiled via \`.Compile()\`, which has a small runtime compilation cost.`,
    answerContent_fa: `### تفاوت درخت عبارات (Expression Tree) و Delegate

- **\`Func<T, bool>\`:**
  - مستقیماً به بایت‌کد اجرایی IL کامپایل شده و در حافظه رم به صورت یک تابع آماده اجرا فراخوانی می‌شود.
  - در کوئری‌های \`IEnumerable\` (درون حافظه RAM) استفاده می‌شود.

- **\`Expression<Func<T, bool>>\`:**
  - کد را به صورت یک **ساختار داده درختی (AST)** در حافظه ذخیره می‌کند.
  - موتورهای ORM مانند EF Core با پیمایش این درخت، متغیرها و عملگرها را به کدهای **SQL** تبدیل می‌کنند تا فیلتر روی سرور دیتابیس اجرا شود.
  - برای اجرای درون حافظه، نیازمند کامپایل با متد \`.Compile()\` است.`,
  },
  {
    id: "dotnet-mid-q202",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-span-memory"],
    questionTitle: "What is a 'ref struct' in C#, how does it differ from a standard struct, and what stack-only constraints does the CLR enforce?",
    questionTitle_fa: "مفهوم 'ref struct' در سی‌شارپ چیست، چه تفاوتی با struct معمولی دارد و چه محدودیت‌هایی توسط CLR برای آن اعمال می‌شود؟",
    answerContent: `### 'ref struct' and Stack-Only Invariants

A **\`ref struct\`** is a value type that the CLR strictly enforces to live **exclusively on the execution stack**, never on the managed heap.

\`\`\`csharp
public readonly ref struct FastStringReader {
    private readonly ReadOnlySpan<char> _buffer;
    public FastStringReader(ReadOnlySpan<char> buffer) => _buffer = buffer;
}
\`\`\`

#### Enforced CLR Rules:
1. **No Boxing:** Cannot be cast to \`object\`, \`dynamic\`, or \`ValueType\`.
2. **No Heap Fields:** Cannot be a field of a regular \`class\` or normal \`struct\`.
3. **No Lambda Closures:** Cannot be captured in lambda expressions or local functions.
4. **No Async Boundaries:** Cannot be used across \`await\` expressions in \`async\` methods.
5. **No Thread Transitions:** Cannot be passed across threads (e.g. background tasks).

#### Purpose:
Enables zero-allocation high-performance types like **\`Span<T>\`** and **\`ReadOnlySpan<T>\`** that hold interior managed pointers safely.`,
    answerContent_fa: `### ساختار 'ref struct' و تضمین‌های حافظه Stack

یک **\`ref struct\`** ساختار داده مقداری است که CLR تضمین می‌کند **صرفاً روی Stack تخصیص یافته و هرگز به Heap منتقل نشود**.

#### محدودیت‌های اعمال‌شده توسط CLR:
۱. **عدم امکان Boxing:** هرگز نمی‌تواند به \`object\` یا اینترفیس تبدیل شود.
۲. **عدم امکان تعریف در کلاس:** نمی‌تواند فیلدی از یک \`class\` یا \`struct\` عادی باشد.
۳. **عدم کپچر در لامبدا:** درون توابع ناشناس یا Closureها قابل استفاده نیست.
۴. **عدم عبور از مرز Async:** در متدهای حاوی \`async/await\` در محدوده عبارات ناهمگام قابل استفاده نیست.

#### کاربرد اصلی:
پیاده‌سازی ساختارهای فوق‌سریع و بدون Allocation مانند **\`Span<T>\`** و **\`ReadOnlySpan<T>\`**.`,
  },
  {
    id: "dotnet-mid-q203",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-span-memory"],
    questionTitle: "Compare Span<T> and Memory<T>. Why can Span<T> NOT be used across await points in async methods?",
    questionTitle_fa: "مقایسه Span<T> و Memory<T>: چرا Span<T> نمی‌تواند از مرز await در متدهای async عبور کند؟",
    answerContent: `### Span<T> vs. Memory<T> in Asynchronous Code

| Feature | \`Span<T>\` | \`Memory<T>\` |
| :--- | :--- | :--- |
| **Type** | \`ref struct\` (Stack-Only) | Standard \`struct\` (Heap-Safe) |
| **Async Support** | ❌ Cannot cross \`await\` points | ✅ Can be used across \`await\` |
| **Heap Storage** | ❌ Cannot live on heap | ✅ Can be a field of a class or task state |
| **Usage** | Synchronous, high-speed slicing | Asynchronous I/O pipelines |

#### Why Span<T> Fails in Async Methods:
When compiling an \`async\` method, the C# compiler generates an **\`IAsyncStateMachine\`** struct/class that is hoisted onto the **Managed Heap** when an asynchronous operation yields. Because a \`ref struct\` cannot exist on the heap, holding a \`Span<T>\` across an \`await\` throws a compiler error (**CS4007**).

#### Solution:
Pass \`Memory<T>\` or \`ReadOnlyMemory<T>\` into async methods, and obtain a stack-allocated \`.Span\` synchronously only when slicing data.`,
    answerContent_fa: `### تفاوت Span<T> و Memory<T> در کدهای ناهمگام

| ویژگی | \`Span<T>\` | \`Memory<T>\` |
| :--- | :--- | :--- |
| **نوع ساختار** | \`ref struct\` (فقط روی Stack) | \`struct\` معمولی (قابل ذخیره روی Heap) |
| **پشتیبانی از Async** | ❌ عدم امکان عبور از \`await\` | ✅ کاملاً سازگار با متدهای ناهمگام |
| **محل نگهداری** | فقط فریم جاری استک | فیلدهای کلاس، استیت ماشین و پایپ‌لاین‌ها |

#### علت عدم امکان استفاده از Span در متدهای Async:
کامپایلر دات‌نت متد \`async\` را به یک State Machine تبدیل کرده و هنگام معلق شدن متد با \`await\`، متغیرهای محلی را روی **Heap** می‌برد. چون \`ref struct\` حق قرار گرفتن روی Heap را ندارد، کامپایلر ارور می‌دهد. برای حل این مشکل، از \`Memory<T>\` استفاده شده و در زمان پردازش همگام با \`.Span\` خوانده می‌شود.`,
  },
  {
    id: "dotnet-mid-q204",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    topicIds: ["topic-dotnet-rabbitmq-advanced"],
    questionTitle: "How do Publisher Confirms and Consumer Acknowledgements (Ack, Nack, Reject) guarantee message safety in RabbitMQ?",
    questionTitle_fa: "مکانیزم‌های Publisher Confirms و Consumer Acknowledgements (مانند Ack، Nack و Reject) در RabbitMQ چگونه از مفقود شدن پیام جلوگیری می‌کنند؟",
    answerContent: `### End-to-End Reliability in RabbitMQ

#### 1. Publisher Confirms (Producer $\to$ Broker Safety):
- Traditional channel publishing is fire-and-forget.
- With **Publisher Confirms** enabled (\`channel.ConfirmSelect()\`), the RabbitMQ broker asynchronously returns an \`Ack\` to the producer once the message is written to disk or replicated to quorum queues.
- If disk write fails, the broker sends a \`Nack\`, allowing the producer to retry.

#### 2. Consumer Acknowledgements (Broker $\to$ Consumer Safety):
- **Auto-Ack (\`autoAck: true\`):** The broker deletes the message the moment it sends it over the TCP socket. If consumer crashes during processing, the message is permanently lost.
- **Manual Ack (\`autoAck: false\`):**
  - \`BasicAck(deliveryTag, multiple: false)\`: Confirms successful processing; broker removes message from queue.
  - \`BasicNack(deliveryTag, multiple: false, requeue: true/false)\`: Rejects single/multiple messages. If \`requeue: false\`, routes to Dead Letter Exchange (DLX).
  - \`BasicReject(deliveryTag, requeue: false)\`: Rejects a single message.`,
    answerContent_fa: `### تضمین عدم مفقودی پیام در RabbitMQ

#### ۱. مکانیزم Publisher Confirms (از تولیدکننده به بروکر):
- فعال‌سازی تاییدیه انتشار باعث می‌شود بروکر پس از اطمینان از ذخیره پیام روی دیسک یا کپی روی نودهای کلاستر، سیگنال \`Ack\` به تولیدکننده ارسال کند تا در صورت بروز خطا پیام مجدداً ارسال شود.

#### ۲. مکانیزم Consumer Acknowledgements (از مصرف‌کننده به بروکر):
- **حالت خودکار (Auto-Ack):** خطرناک؛ به محض تحویل بسته TCP پیام از صف پاک می‌شود.
- **حالت دستی (Manual Ack):**
  - **\`BasicAck\`:** اعلام پردازش موفق و حذف قطعی از صف.
  - **\`BasicNack\` / \`BasicReject\`:** در صورت بروز خطا، با \`requeue: true\` پیام دوباره در صف قرار می‌گیرد و با \`requeue: false\` به صف Dead Letter هدایت می‌شود.`,
  },
  {
    id: "dotnet-mid-q205",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    topicIds: ["topic-dotnet-outbox-dlq", "topic-dotnet-rabbitmq-advanced"],
    questionTitle: "How do you implement Retry Policies with Exponential Backoff and Dead Letter Exchanges (DLX) in RabbitMQ and MassTransit?",
    questionTitle_fa: "چگونه می‌توان با استفاده از صف Dead Letter (DLX)، افزونه Delayed Exchange و کتابخانه MassTransit، استراتژی Retry با تاخیر تصاعدی (Exponential Backoff) پیاده‌سازی کرد؟",
    answerContent: `### Resilient Messaging: Retries & Dead Lettering

#### 1. Why Immediate Retries Are Dangerous:
Immediate retries on database deadlocks or network hiccups cause **retry storms** and consume 100% CPU.

#### 2. Exponential Backoff with Jitter:
Wait intervals increase exponentially (e.g. $1s \to 2s \to 4s \to 8s$) with randomized jitter to prevent thundering herd problems.

#### 3. Delayed Message Exchange & Dead Letter Exchange (DLX):
- Messages failing transient retries are republished to a **Delayed Exchange** (\`x-delayed-message\`) with a \`x-delay\` header.
- Poison pills (permanent validation or deserialization errors) are forwarded to a **Dead Letter Queue (DLQ)** for manual inspection without blocking the primary queue.

\`\`\`csharp
// MassTransit Configuration:
services.AddMassTransit(x => {
    x.UsingRabbitMq((ctx, cfg) => {
        cfg.UseMessageRetry(r => r.Exponential(
            retryCount: 5,
            minInterval: TimeSpan.FromSeconds(1),
            maxInterval: TimeSpan.FromSeconds(30),
            intervalDelta: TimeSpan.FromSeconds(2)
        ));
    });
});
\`\`\``,
    answerContent_fa: `### مدیریت خطای پیام‌ها با Retry تصاعدی و DLX

#### ۱. خطر Retryهای آنی:
تلاش مجدد پشت سر هم هنگام قطعی دیتابیس یا وب‌سرویس خارجی موجب اشباع CPU و ایجاد طوفان درخواست (Retry Storm) می‌شود.

#### ۲. تاخیر تصاعدی (Exponential Backoff):
افزایش تصاعدی فواصل تلاش مجدد (مثلاً ۱، ۲، ۴، ۸ و ۱۶ ثانیه) به همراه مقداری نویز تصادفی (Jitter).

#### ۳. صف خطا (Dead Letter Queue):
پیام‌هایی که پس از چند بار تلاش پردازش نمی‌شوند، با Nack و \`requeue: false\` به صف **Dead Letter** منتقل می‌شوند تا بدون بلاک کردن صف اصلی، توسط توسعه‌دهندگان بررسی و لاگ‌گیری شوند.`,
  },
  {
    id: "dotnet-mid-q206",
    stackId: "dotnet",
    categoryId: "microservices",
    levelId: "mid",
    topicIds: ["topic-dotnet-redis-internals"],
    questionTitle: "What are Redis Eviction Policies (LRU, LFU, TTL, noeviction) and how do you handle memory pressure (OOM)?",
    questionTitle_fa: "سیاست‌های آزادسازی حافظه (Eviction Policies مانند LRU، LFU، TTL و noeviction) در Redis چگونه کار می‌کنند و فشار حافظه (OOM) چگونه مدیریت می‌شود؟",
    answerContent: `### Redis Memory Eviction Policies

When Redis memory reaches \`maxmemory\`, it executes the configured eviction algorithm to free space:

1. **\`noeviction\` (Default):** Returns an Out-of-Memory (OOM) error for any write command. Ideal when Redis is used as a strict datastore rather than a disposable cache.
2. **\`allkeys-lru\`:** Evicts the **Least Recently Used** keys among ALL keys. Best general-purpose caching policy for standard Web APIs.
3. **\`volatile-lru\`:** Evicts the Least Recently Used keys only among keys with an expiration (**TTL**) set.
4. **\`allkeys-lfu\` / \`volatile-lfu\`:** Evicts the **Least Frequently Used** keys (tracks access frequency counters, ideal for hot-key protection).
5. **\`volatile-ttl\`:** Evicts keys with an expiration set, prioritizing keys with the **shortest remaining time-to-live**.

#### Production Best Practice:
Set \`maxmemory\` to $70-80\\%$ of total server RAM to allow memory overhead for Redis background replication buffers and fork snapshot processes.`,
    answerContent_fa: `### سیاست‌های پاک‌سازی حافظه در Redis

هنگامی که حجم داده‌های Redis به سقف مجاز (\`maxmemory\`) می‌رسد، یکی از سیاست‌های زیر اعمال می‌شود:

۱. **\`noeviction\` (پیش‌فرض):** رد کردن دستورات نوشتن جدید با خطای OOM (مناسب زمانی که ردیس دیتابیس اصلی است).
۲. **\`allkeys-lru\`:** پاک‌سازی کلیدهایی که در دورترین زمان استفاده شده‌اند (بهترین گزینه برای کشینگ وب‌سرویس‌ها).
۳. **\`allkeys-lfu\`:** پاک‌سازی کلیدهایی که کمترین تعداد دفعات استفاده را داشته‌اند (محافظت از کلیدهای پرکاربرد).
۴. **\`volatile-ttl\`:** حذف کلیدهایی که کمترین زمان انقضا (TTL) برای آن‌ها باقی مانده است.`,
  },
  {
    id: "dotnet-mid-q207",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-db-concurrency-locks"],
    questionTitle: "Compare Optimistic and Pessimistic Concurrency Control in SQL Server and EF Core (RowVersion vs UPDLOCK).",
    questionTitle_fa: "مقایسه کنترل همزمانی خوش‌بینانه (Optimistic) و بدبینانه (Pessimistic) در SQL Server و EF Core: در چه شرایطی از هر کدام استفاده می‌شود؟",
    answerContent: `### Optimistic vs. Pessimistic Concurrency Control

#### 1. Optimistic Concurrency (EF Core Default Approach):
- **Principle:** Assumes conflicts are rare; does not lock database rows during reads.
- **Implementation:** Adds a \`byte[] RowVersion\` property configured with \`[Timestamp]\` or \`.IsRowVersion()\`.
- **SQL Generated:** \`UPDATE Products SET Stock = 5 WHERE Id = @Id AND RowVersion = @OldVersion\`.
- **Conflict Handling:** If another user modified the row, zero rows are affected and EF Core throws **\`DbUpdateConcurrencyException\`**, allowing the application to reload and retry.

#### 2. Pessimistic Concurrency (Direct SQL Locking):
- **Principle:** Assumes conflicts are frequent; locks the target rows immediately upon reading to prevent concurrent modifications.
- **Implementation:** Uses raw SQL query hints:
  \`\`\`csharp
  var product = await dbContext.Products
      .FromSqlInterpolated($"SELECT * FROM Products WITH (UPDLOCK, ROWLOCK) WHERE Id = {id}")
      .FirstOrDefaultAsync();
  \`\`\`
- **Trade-off:** High contention and risk of deadlocks, but guarantees serialization for financial seat reservations or flash sales.`,
    answerContent_fa: `### مقایسه همزمانی خوش‌بینانه و بدبینانه در EF Core

#### ۱. کنترل خوش‌بینانه (Optimistic):
- عدم ایجاد قفل هنگام خواندن؛ فرض بر این است که تداخل به ندرت رخ می‌دهد.
- استفاده از فیلد \`[Timestamp] byte[] RowVersion\`.
- در صورت تغییر همزمان داده توسط کاربر دیگر، EF Core خطای **\`DbUpdateConcurrencyException\`** صادر می‌کند تا برنامه تصمیم به Retry یا بازخوانی بگیرد.

#### ۲. کنترل بدبینانه (Pessimistic):
- قفل کردن فوری سطر به محض خواندن با دستورات \`UPDLOCK\` در SQL Server یا \`FOR UPDATE\` در PostgreSQL.
- سایر درخواست‌ها تا پایان تراکنش منتظر می‌مانند (مناسب سناریوهای پرریسک مانند خرید بلیت یا کسر موجودی فین‌تک).`,
  },
  {
    id: "dotnet-mid-q208",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-polyglot-persistence"],
    questionTitle: "What is Polyglot Persistence and how do you choose between Relational, Document (MongoDB), Key-Value (Redis), Columnar (ClickHouse), and Graph databases?",
    questionTitle_fa: "معماری Polyglot Persistence چیست و چگونه بین دیتابیس‌های رابطه‌ای، سندمحور (MongoDB)، کلید-مقدار (Redis)، ستونی (ClickHouse) و گراف تصمیم‌گیری می‌کنیم؟",
    answerContent: `### Polyglot Persistence Strategy

**Polyglot Persistence** means utilizing different database storage engines within the same system, matching each microservice or component to the database technology that best suits its data model and access patterns.

| Database Type | Examples | Primary Strengths | Typical Use Case |
| :--- | :--- | :--- | :--- |
| **Relational (RDBMS)** | PostgreSQL, SQL Server | ACID guarantees, complex relational joins | Financial ledgers, core transactional accounts, orders |
| **Document (NoSQL)** | MongoDB, Cosmos DB | Dynamic schema, fast nested JSON persistence | Product catalogs, user profile preferences, audit logs |
| **Key-Value / Cache** | Redis, KeyDB | Sub-millisecond latency, in-memory structures | Session tokens, distributed locks, rate-limit counters |
| **Columnar (OLAP)** | ClickHouse, DuckDB | Aggregations over billions of rows at lightning speed | Financial analytics, business intelligence dashboards |
| **Search Engine** | Elasticsearch, OpenSearch | Inverted indexes, full-text fuzzy queries | E-commerce product search, centralized log monitoring |
| **Graph** | Neo4j, AWS Neptune | Index-free adjacency, complex relationship traversal | Social networks, fraud detection in money transfers |`,
    answerContent_fa: `### معماری چندگانگی پایگاه‌داده (Polyglot Persistence)

در معماری‌های میکروسرویس مدرن، برای هر بخش از دیتابیسی استفاده می‌شود که بیشترین تطابق را با ساختار داده و نیاز پرفورمنسی آن دارد:

- **رابطه‌ای (PostgreSQL / SQL Server):** تراکنش‌های مالی، سیستم سفارشات و مواردی که به سازگاری قطعی ACID و روابط کلید خارجی نیاز دارند.
- **سندمحور (MongoDB):** کاتالوگ محصولات با ساختار نامتقارن و لاگ‌های انعطاف‌پذیر JSON.
- **کلید-مقدار (Redis):** مدیریت نشست‌ها، قفل‌های توزیع‌شده، Rate Limiting و کشینگ سریع.
- **ستونی (ClickHouse):** گزارش‌گیری و تحلیل روی میلیاردها سطر لاگ یا تراکنش‌های تحلیلی (OLAP).
- **گرافی (Neo4j):** کشف تقلب‌های مالی و تحلیل شبکه‌های پیچیده ارتباطی.`,
  },
  {
    id: "dotnet-mid-q209",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    topicIds: ["topic-dotnet-chain-of-responsibility", "topic-dotnet-gof-patterns"],
    questionTitle: "How is the Chain of Responsibility Pattern applied in ASP.NET Core Middleware and MediatR Pipeline Behaviors?",
    questionTitle_fa: "الگوی طراحی زنجیره مسئولیت (Chain of Responsibility) در Middleware دات‌نت و Pipeline Behaviors کتابخانه MediatR چگونه پیاده‌سازی می‌شود؟",
    answerContent: `### Chain of Responsibility in .NET

The **Chain of Responsibility** pattern decouples the sender of a request from its receivers by giving multiple handlers a chance to process the request sequentially along a pipeline.

#### 1. ASP.NET Core Middleware Pipeline:
Each middleware receives an \`HttpContext\` and a \`RequestDelegate next\`:
\`\`\`csharp
public async Task InvokeAsync(HttpContext context, RequestDelegate next) {
    // Pre-processing (e.g. start stopwatch, authenticate token)
    await next(context); // Pass to next handler in chain
    // Post-processing (e.g. log response time, add headers)
}
\`\`\`

#### 2. MediatR Pipeline Behaviors:
Implements cross-cutting concerns around command/query handlers:
\`\`\`csharp
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse> {
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators) => _validators = validators;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct) {
        var context = new ValidationContext<TRequest>(request);
        var failures = _validators.Select(v => v.Validate(context)).SelectMany(r => r.Errors).Where(f => f != null).ToList();
        if (failures.Count != 0) throw new ValidationException(failures);

        return await next(); // Forward along pipeline
    }
}
\`\`\``,
    answerContent_fa: `### الگوی زنجیره مسئولیت (Chain of Responsibility) در دات‌نت

این الگو درخواست را از میان زنجیره‌ای از پردازنده‌ها عبور می‌دهد؛ هر پردازنده می‌تواند قبل و بعد از پردازنده بعدی کدهای جانبی (Cross-Cutting Concerns) را اجرا کند:

۱. **خط لوله Middleware در ASP.NET Core:**
   - با دریافت نماینده \`RequestDelegate next\`، درخواست را پس از بررسی احراز هویت یا مدیریت خطا به مرحله بعد می‌فرستد.

۲. **رفتارهای MediatR (Pipeline Behaviors):**
   - برای اعتبارسنجی خودکار ورودی‌ها با FluentValidation، لاگ‌گیری زمان اجرای دستورات و مدیریت ترنزکشن‌های دیتابیس قبل از رسیدن به Handler اصلی.`,
  },
  {
    id: "dotnet-mid-q210",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-gof-patterns", "topic-dotnet-csharp-delegates-lambdas-events"],
    questionTitle: "What are the architectural differences between Observer Pattern, Mediator Pattern, and Pub/Sub in .NET, and how do you prevent Memory Leaks?",
    questionTitle_fa: "تفاوت‌های معماری میان الگوهای Observer، Mediator و Pub/Sub در دات‌نت چیست و چگونه از نشت حافظه (Memory Leak) در رویدادها جلوگیری کنیم؟",
    answerContent: `### Observer vs. Mediator vs. Pub/Sub

| Dimension | Observer Pattern | Mediator Pattern | Pub/Sub Pattern |
| :--- | :--- | :--- | :--- |
| **Coupling** | High (Subject keeps list of observers) | Loose (Sender and handlers known only to mediator) | None (Publisher and subscribers completely decoupled) |
| **Scope** | Single object / class in-memory | In-process application boundary | Distributed cross-service network |
| **.NET Tech** | C# \`event\`, \`IObservable<T>\` | MediatR | RabbitMQ, Kafka, Redis |

#### Preventing Memory Leaks in Observer Pattern:
When a long-lived publisher holds an event subscription to a short-lived subscriber, the publisher's invocation list maintains a strong reference to the subscriber, preventing the Garbage Collector from collecting it (**Lapsed Listener Problem**).

#### Prevention Techniques:
1. Explicitly **unsubscribe** in \`Dispose()\`: \`publisher.OnChanged -= HandleChange;\`
2. Use **\`WeakEventManager\`** or weak delegates.
3. Replace direct event subscriptions with **MediatR In-Process Notifications** (\`INotification\`).`,
    answerContent_fa: `### مقایسه Observer، Mediator و Pub/Sub و جلوگیری از نشت حافظه

- **الگوی Observer:** اتصال مستقیم و درون‌حافظه‌ای با رویدادهای C# (\`event\`).
- **الگوی Mediator:** هاب ارتباطی درون‌برنامه‌ای (مانند MediatR) برای جداسازی فرستنده و گیرنده.
- **الگوی Pub/Sub:** ارتباط کاملاً مستقل و توزیع‌شده بین سرورها از طریق بروکر (مانند RabbitMQ).

#### علت و رفع Memory Leak در رویدادهای C#:
اگر یک کلاس با طول عمر بالا (مانند Singleton) به رویداد یک کلاس با طول عمر کوتاه (مانند Scoped Controller) متصل شود، رفرنس قوی مانع جمع‌آوری زباله (GC) شده و نشت حافظه رخ می‌دهد.
**راهکارها:** لغو اشتراک صریح (\`-=\`) در متد \`Dispose\`، استفاده از \`WeakEventManager\` یا جایگزینی با MediatR.`,
  },
  {
    id: "dotnet-mid-q211",
    stackId: "dotnet",
    categoryId: "architecture-ddd",
    levelId: "mid",
    topicIds: ["topic-dotnet-gof-patterns"],
    questionTitle: "Compare Template Method Pattern and Strategy Pattern in C#. When should you choose Inheritance over Composition?",
    questionTitle_fa: "مقایسه الگوی Template Method با Strategy Pattern در سی‌شارپ: چه زمانی از ارث‌بری و چه زمانی از ترکیب (Composition) استفاده می‌شود؟",
    answerContent: `### Template Method vs. Strategy Pattern

#### 1. Template Method Pattern (Inheritance-Based):
- Defines the skeleton of an algorithm in a base class, deferring some steps to subclasses via \`abstract\` or \`virtual\` methods.
- **Pros:** Enforces invariant execution order; subclasses only override specific hooks.
- **Cons:** Rigid compile-time inheritance hierarchy; violates "Favor composition over inheritance".

\`\`\`csharp
public abstract class DataImporter {
    public void Import() { // Template Method
        ReadRawData();
        Validate();
        SaveToDatabase();
    }
    protected abstract void ReadRawData();
    protected virtual void Validate() { /* default validation */ }
    protected abstract void SaveToDatabase();
}
\`\`\`

#### 2. Strategy Pattern (Composition-Based):
- Encapsulates algorithms into independent classes implementing a common interface (\`IDiscountStrategy\`).
- Injected via Dependency Injection and swappable dynamically at runtime.
- Strictly adheres to the **Open/Closed Principle**.

#### Decision Rule:
Use **Template Method** when the invariant workflow sequence is fixed across all subclasses. Use **Strategy** when you need pluggable, interchangeable algorithms that can be swapped dynamically or mocked easily in unit tests.`,
    answerContent_fa: `### مقایسه الگوی Template Method و Strategy

- **الگوی Template Method (بر پایه ارث‌بری):**
  - ساختار کلی و مراحل اجرای یک الگوریتم را در یک متد از کلاس والد (Base Class) قفل کرده و پیاده‌سازی بخش‌های متغیر را با متدهای \`abstract\` به فرزندان واگذار می‌کند.
  - مناسب زمانی که ترتیب اجرای مراحل باید در تمام کلاس‌ها ثابت و غیرقابل تغییر بماند.

- **الگوی Strategy (بر پایه Composition):**
  - هر الگوریتم را درون یک کلاس مستقل پشت یک اینترفیس پیاده کرده و از طریق DI تزریق می‌کند.
  - کاملاً انعطاف‌پذیر، قابل تعویض در زمان اجرا و سازگار با اصل Open/Closed.`,
  },
  {
    id: "dotnet-mid-q212",
    stackId: "dotnet",
    categoryId: "csharp-basics",
    levelId: "mid",
    topicIds: ["topic-dotnet-gof-patterns"],
    questionTitle: "How do you implement the Builder Pattern with a Fluent API in C# for constructing complex domain entities?",
    questionTitle_fa: "الگوی Builder و طراحی Fluent API در سی‌شارپ چگونه برای ساخت اشیای پیچیده دامین و تضمین ثبات داده‌ها پیاده‌سازی می‌شود؟",
    answerContent: `### Builder Pattern & Fluent API in C#

The **Builder Pattern** is essential when creating complex domain entities with multiple optional configurations, multi-step dependencies, or strict validation requirements.

\`\`\`csharp
public class InsurancePolicyBuilder {
    private readonly InsurancePolicy _policy = new();

    public InsurancePolicyBuilder ForVehicle(string licensePlate, string vin) {
        _policy.VehicleLicense = licensePlate;
        _policy.VinNumber = vin;
        return this; // Method Chaining
    }

    public InsurancePolicyBuilder WithCoverage(decimal coverageAmount, decimal deductible) {
        _policy.CoverageAmount = coverageAmount;
        _policy.Deductible = deductible;
        return this;
    }

    public InsurancePolicy Build() {
        // Enforce domain invariants
        if (string.IsNullOrWhiteSpace(_policy.VehicleLicense))
            throw new DomainValidationException("License plate is mandatory.");
        if (_policy.CoverageAmount <= 0)
            throw new DomainValidationException("Coverage amount must be positive.");

        _policy.IssueDate = DateTime.UtcNow;
        return _policy;
    }
}
\`\`\`

#### Key Advantages:
- Eliminates giant constructors with dozens of nullable parameters ("Telescoping Constructor Anti-Pattern").
- Provides readable, self-documenting code via Fluent method chaining.
- Guarantees the resulting entity is always in a valid domain state upon calling \`.Build()\`.`,
    answerContent_fa: `### الگوی Builder و طراحی Fluent API در سی‌شارپ

الگوی Builder برای ساخت اشیای پیچیده با پارامترهای متعدد استفاده می‌شود تا از ایجاد سازنده‌های طولانی با پارامترهای اختیاری (Telescoping Constructor) جلوگیری کند:

- متدهای زنجیره‌ای (\`return this\`) خوانایی کد را به شدت افزایش می‌دهند.
- در متد نهایی \`.Build()\` تمام قوانین اعتبارسنجی بیزینس بررسی می‌شوند تا از ساخته شدن اشیای ناقص یا نامعتبر در حافظه جلوگیری گردد.`,
  },
  {
    id: "dotnet-mid-q213",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-oop-records-pattern-matching"],
    questionTitle: "How do C# Records work under the hood, and what code does the Roslyn compiler synthesize?",
    questionTitle_fa: "ساختار Records در سی‌شارپ در پشت صحنه چگونه کار می‌کند و کامپایلر Roslyn چه کدهایی برای آن تولید می‌کند؟",
    answerContent: `### Roslyn Record Code Synthesis Under the Hood

When declaring a positional record in C#:

\`\`\`csharp
public record OrderPlacedEvent(Guid OrderId, decimal Amount, DateTime Timestamp);
\`\`\`

The Roslyn compiler emits a reference type (\`class\`) with extensive compiler-generated boilerplate:

1. **Value-based Equality Contract (\`IEquatable<T>\`):**
   - Implements \`IEquatable<OrderPlacedEvent>\` with a strongly-typed \`Equals(OrderPlacedEvent? other)\` method comparing every field using \`EqualityComparer<T>.Default\`.
   - Overrides \`object.Equals(object?)\` and \`object.GetHashCode()\` (combining hashes of all positional fields via \`HashCode.Combine\`).
   - Generates overloaded \`operator ==\` and \`operator !=\`.

2. **Non-Destructive Mutation Clone Constructor:**
   - Synthesizes a \`protected OrderPlacedEvent(OrderPlacedEvent original)\` copy constructor that copies all state.
   - Emits a compiler-internal virtual method \`<Clone>$()\` invoked by the \`with\` expression to clone the instance before modifying target properties.

3. **Positional Deconstruction & Formatting:**
   - Emits a \`public void Deconstruct(out Guid OrderId, out decimal Amount, out DateTime Timestamp)\` method enabling tuple-style deconstruction.
   - Overrides \`ToString()\` and emits a \`PrintMembers(StringBuilder)\` method returning a clean, JSON-like representation (\`"OrderPlacedEvent { OrderId = ..., Amount = ... }"\`).

4. **Immutable Properties with \`init\`-only Setters:**
   - Generates \`public Guid OrderId { get; init; }\` preventing field mutations after object initialization.`,
    answerContent_fa: `### سازوکار داخلی کامپایلر Roslyn در تولید رکوردهای سی‌شارپ

هنگامی که یک Positional Record تعریف می‌کنید:
\`\`\`csharp
public record OrderPlacedEvent(Guid OrderId, decimal Amount, DateTime Timestamp);
\`\`\`

کامپایلر Roslyn در پشت صحنه یک کلاس با قابلیت‌های تولیدشده زیر ایجاد می‌کند:

۱. **برابری مقداری (Value-based Equality):**
   - پیاده‌سازی اینترفیس \`IEquatable<T>\` و متد \`Equals\` برای مقایسه تک‌تک فیلدها با \`EqualityComparer<T>.Default\`.
   - بازنویسی (Override) متدهای \`GetHashCode\` و \`Equals(object)\`.
   - بارگذاری مجدد عملگرهای \`==\` و \`!=\`.

۲. **سازنده کپی برای عملگر \`with\`:**
   - ساخت سازنده کپی \`protected\` و متد اختصاصی \`<Clone>$()\` جهت کلون کردن ایمن مقادیر بدون تغییر شیء اصلی.

۳. **متد Deconstruct و چاپ متنی:**
   - تولید متد \`Deconstruct\` برای باز کردن پارامترها به صورت Tuple و بازنویسی \`ToString\` با فرمت خوانا.

۴. **تغییرناپذیری با \`init\`:**
   - تبدیل تمامی پارامترها به Propertyهایی با اکسسور \`init\` جهت جلوگیری از تغییر مقدار پس از ساخت.`,
  },
  {
    id: "dotnet-mid-q214",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-oop-records-pattern-matching"],
    questionTitle: "What are the differences and performance trade-offs between 'record class', 'record struct', and 'readonly record struct'?",
    questionTitle_fa: "تفاوت‌ها و موازنه‌های عملکردی (Performance Trade-offs) بین record class، record struct و readonly record struct چیست؟",
    answerContent: `### record class vs record struct vs readonly record struct

C# 10 introduced record structs to bring value-based equality and \`with\` semantics to value types.

| Metric / Behavior | \`record class\` (default \`record\`) | \`record struct\` | \`readonly record struct\` |
| :--- | :--- | :--- | :--- |
| **CLR Storage** | Managed Heap | Thread Stack (or inline in containing class) | Thread Stack (or inline in containing class) |
| **Header Overhead** | 16-24 bytes (SyncBlock + TypeHandle) | **0 bytes** | **0 bytes** |
| **Default Field Mutability** | Immutable (\`init\`) | **Mutable (\`set\`)** | **Immutable (\`init\`)** |
| **Assignment Semantics** | Reference copy (8-byte pointer) | Value payload copy | Value payload copy |
| **GC Pressure** | Triggers GC collections (Gen 0) | **Zero GC pressure (Stack local)** | **Zero GC pressure (Stack local)** |
| **Defensive Copy Overhead** | None | Potential defensive copies if not readonly | None (JIT optimizes with \`in\` params) |

\`\`\`csharp
// 1. Reference type: DTOs, API responses, Domain Events
public record UserDto(Guid Id, string Email);

// 2. Mutable value type: High-frequency math, local aggregations (use with caution)
public record struct Coordinate(double X, double Y);

// 3. Recommended value object: High-throughput, zero-allocation Value Objects
public readonly record struct Money(decimal Amount, string Currency);
\`\`\`

#### Production Best Practice:
- Use \`record class\` for API contracts, MediatR requests/responses, and Entity Framework Core projection DTOs.
- Use \`readonly record struct\` for lightweight domain value objects (<= 16 bytes, e.g. \`Money\`, \`GeoPoint\`, \`DateRange\`) to eliminate heap allocations in high-throughput loops (> 50,000 ops/sec).`,
    answerContent_fa: `### مقایسه record class، record struct و readonly record struct

| ویژگی | \`record class\` | \`record struct\` | \`readonly record struct\` |
| :--- | :--- | :--- | :--- |
| **محل تخصیص** | روی Managed Heap | روی Thread Stack یا درون کلاس والد | روی Thread Stack یا درون کلاس والد |
| **سربار هدر شیء** | ۱۶ تا ۲۴ بایت | **صفر بایت** | **صفر بایت** |
| **تغییرپذیری پیش‌فرض** | تغییرناپذیر (\`init\`) | **تغییرپذیر (\`set\`)** | **تغییرناپذیر (\`init\`)** |
| **فشار بر GC** | ایجاد سربار روی Gen 0 | **بدون سربار روی Heap** | **بدون سربار روی Heap** |

- **\`record class\`:** مناسب‌ترین گزینه برای DTOها، پیام‌های ایونت، و درخواست‌های MediatR.
- **\`readonly record struct\`:** بهترین انتخاب برای Value Objectهای سبک دامین (زیر ۱۶ بایت مانند \`Money\` و \`Coordinate\`) جهت به صفر رساندن بار GC در سیستم‌های پرترافیک.`,
  },
  {
    id: "dotnet-mid-q215",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-oop-records-pattern-matching"],
    questionTitle: "How do Property, Positional, Relational, and List Patterns work in C# Pattern Matching, and how does the JIT optimize them?",
    questionTitle_fa: "الگوهای Property، Positional، Relational و List در Pattern Matching سی‌شارپ چگونه کار می‌کنند و JIT چگونه آنها را بهینه‌سازی می‌کند؟",
    answerContent: `### Advanced Pattern Matching in C#

Pattern matching provides declarative, null-safe data inspection without clumsy casting or cascading \`if/else\` chains.

#### 1. Property Patterns (Nested & Combined):
\`\`\`csharp
public static decimal GetShippingCost(Order order) => order switch
{
    { DeliveryAddress.Country: "IR", TotalWeightKg: < 5 } => 50_000m,
    { DeliveryAddress.Country: "IR", TotalWeightKg: >= 5 } => 120_000m,
    { DeliveryAddress.IsInternational: true, Customer.IsVip: true } => 250_000m,
    { DeliveryAddress.IsInternational: true } => 500_000m,
    _ => 0m
};
\`\`\`

#### 2. Positional Patterns (with \`Deconstruct\`):
\`\`\`csharp
public readonly record struct Point(int X, int Y);

public static string ClassifyQuadrant(Point p) => p switch
{
    (0, 0)      => "Origin",
    ( > 0, > 0) => "Quadrant I",
    ( < 0, > 0) => "Quadrant II",
    ( < 0, < 0) => "Quadrant III",
    ( > 0, < 0) => "Quadrant IV",
    _           => "On Axis"
};
\`\`\`

#### 3. List Patterns (C# 11+ Slice and Discard):
\`\`\`csharp
public static string ParseCommand(string[] tokens) => tokens switch
{
    ["AUTH", var user, var pass]       => $"Authenticate user: {user}",
    ["GET", "users", var id]           => $"Fetch user by ID: {id}",
    ["POST", "orders", .., "urgent"]   => "Urgent order creation",
    ["PING"]                           => "PONG",
    []                                 => "Empty command",
    _                                  => "Invalid command syntax"
};
\`\`\`

#### JIT / IL Optimization:
The Roslyn compiler and RyuJIT optimize switch expressions into **direct jump tables** (IL \`switch\` instruction) or binary decision trees, executing conditions in \`O(1)\` or \`O(log N)\` instead of linear \`O(N)\` sequential condition checks.`,
    answerContent_fa: `### الگوهای پیشرفته Pattern Matching در سی‌شارپ

۱. **الگوهای ویژگی (Property Patterns):**
   - بررسی مشخصات اشیای تودرتو بدون نیاز به بررسی دستی \`null\` یا کست کردن نوع داده.

۲. **الگوهای موقعیتی (Positional Patterns):**
   - استفاده مستقیم از متد \`Deconstruct\` رکوردها یا Tupleها جهت بررسی مختصات داده‌ها.

۳. **الگوهای لیستی (List Patterns در C# 11+):**
   - تطبیق ساختار آرایه‌ها و لیست‌ها با الگوهای برش \`..\` (Slice) و نادیده‌گیری \`_\` (Discard).

#### بهینه‌سازی در سطح JIT:
کامپایلر Roslyn و رانتایم JIT عبارات \`switch\` را به جداول پرش مستقیم (Jump Table در IL) یا درخت‌های دودویی تصمیم‌گیری تبدیل می‌کنند که پیچیدگی زمانی ارزیابی شروط را از \`O(N)\` به \`O(1)\` یا \`O(log N)\` کاهش می‌دهد.`,
  },
  {
    id: "dotnet-mid-q216",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-oop-records-pattern-matching"],
    questionTitle: "How should Domain-Driven Design (DDD) Value Objects be implemented using C# Records, and what are the EF Core mapping pitfalls?",
    questionTitle_fa: "الگوی Value Object در DDD چگونه با استفاده از C# Records پیاده‌سازی می‌شود و چالش‌های مپینگ آن در EF Core چیست؟",
    answerContent: `### Implementing DDD Value Objects with C# Records

In Domain-Driven Design (DDD), a **Value Object** has no conceptual identity; it is defined solely by its attributes, is immutable, and enforces validation invariants upon creation.

\`\`\`csharp
public sealed record Money
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency)
    {
        if (amount < 0)
            throw new ArgumentOutOfRangeException(nameof(amount), "Amount cannot be negative.");
        if (string.IsNullOrWhiteSpace(currency) || currency.Length != 3)
            throw new ArgumentException("Currency must be a 3-letter ISO code.", nameof(currency));

        Amount = amount;
        Currency = currency.ToUpperInvariant();
    }

    public static Money operator +(Money a, Money b)
    {
        if (a.Currency != b.Currency)
            throw new InvalidOperationException($"Cannot add {a.Currency} to {b.Currency}.");
        return new Money(a.Amount + b.Amount, a.Currency);
    }
}
\`\`\`

#### EF Core Mapping Strategies & Pitfalls:
1. **Owned Entity Types (\`OwnsOne\`):**
   \`\`\`csharp
   builder.Entity<Order>().OwnsOne(o => o.TotalAmount, money =>
   {
       money.Property(m => m.Amount).HasColumnName("TotalAmount").HasPrecision(18, 2);
       money.Property(m => m.Currency).HasColumnName("Currency").HasMaxLength(3);
   });
   \`\`\`

2. **EF Core Tracking Pitfall with Records:**
   - **Problem:** EF Core's change tracker compares entities by identity. Because records implement value-based equality, treating a record as an EF Core Entity (with an \`Id\`) can cause EF Core's Change Tracker to confuse two distinct database rows if all their field values happen to be identical!
   - **Rule:** Use \`record\` for **Value Objects** and **DTOs**. Use standard \`class\` (with reference equality) for **Aggregate Roots** and **Entities**.`,
    answerContent_fa: `### پیاده‌سازی Value Objectهای DDD با رکوردهای سی‌شارپ

در الگوی DDD، شیء مقداری (Value Object) شناسه (Identity) ندارد، غیرقابل تغییر (Immutable) است و برابری آن بر پایه مقادیر فیلدهاست.

\`\`\`csharp
public sealed record Money(decimal Amount, string Currency)
{
    public Money
    {
        if (Amount < 0) throw new ArgumentException("مبلغ نمی‌تواند منفی باشد.");
        Currency = Currency.ToUpperInvariant();
    }
}
\`\`\`

#### مپینگ در EF Core و چالش‌های Change Tracker:
۱. **استفاده از \`OwnsOne\`:** برای ذخیره Value Objectها به صورت ستون‌های درون همان جدول موجودیت اصلی.
۲. **هشدار مهم:** از \`record\` برای موجودیت‌های اصلی (Entities با کلید اصلی Id) در EF Core استفاده نکنید؛ زیرا برابری مقداری در رکوردها باعث اختلال در مکانیزم Change Tracking دیتابیس در صورت برابر بودن تمامی فیلدهای دو ردیف مختلف می‌شود. موجودیت‌های دارای Identity باید همیشه \`class\` باشند.`,
  },
  {
    id: "dotnet-mid-q217",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-oop-records-pattern-matching"],
    questionTitle: "What causes hidden Boxing/Unboxing memory allocations with Structs, and how do 'readonly struct', 'in' parameters, and 'ref struct' prevent them?",
    questionTitle_fa: "چه عواملی باعث Boxing و Unboxing پنهان در استراکت‌ها می‌شوند و چگونه readonly struct، پارامترهای in و ref struct مانع آن می‌شوند؟",
    answerContent: `### Boxing, Unboxing, and High-Performance Value Types

**Boxing** occurs when a Value Type (\`struct\`) is converted into a Reference Type (\`object\` or an \`interface\`). The CLR allocates a box on the Managed Heap, copies the struct value into it, and returns an object reference.

#### Common Hidden Boxing Traps in Backend Code:
1. **Calling Non-Overridden Methods on \`System.Object\`:** Calling \`GetType()\` or default un-overridden \`ToString()\` on a struct forces boxing.
2. **Casting Struct to Interfaces:** Passing a struct to a method expecting \`IComparable\`, \`IDisposable\`, or \`IEnumerable\` causes heap allocations.
3. **String Interpolation / String.Format:** \`$"Total: {myStruct}"\` boxes the struct if \`IFormattable\` isn't implemented.

\`\`\`csharp
// TRAP: Boxing on interface cast
public interface IValidator<T> { bool IsValid(T item); }
public struct OrderValidator : IValidator<Order> { public bool IsValid(Order item) => true; }

public void Process(IValidator<Order> validator) // Heap allocation (Boxing) on every call!
{
    validator.IsValid(new Order());
}

// SOLUTION: Generic type parameter with struct constraint (Zero allocations)
public void ProcessOptimized<TValidator>(TValidator validator) where TValidator : struct, IValidator<Order>
{
    validator.IsValid(new Order()); // Direct non-virtual call, zero heap allocation
}
\`\`\`

#### Preventing Memory Copies with \`in\` and \`ref struct\`:
- **\`in\` Parameter Modifier:** Passes a large struct by readonly reference (pointer size: 8 bytes) instead of copying the whole payload across stack frames.
- **\`readonly struct\`:** Assures the JIT compiler that no internal fields mutate, preventing the compiler from creating hidden defensive copies when accessing fields via \`in\` references.
- **\`ref struct\` (\`Span<T>\`, \`ReadOnlySpan<T>\`):** Stack-only struct that can **never be boxed**, cannot be placed on the heap, cannot be stored in fields of normal classes, and cannot be used across async/await boundaries.`,
    answerContent_fa: `### بررسی Boxing، Unboxing و تکنیک‌های بهینه‌سازی حافظه در استراکت‌ها

**Boxing** زمانی رخ می‌دهد که یک نوع مقداری (Value Type) به \`object\` یا یک \`interface\` تبدیل شود. در این حالت CLR یک شیء جدید روی Heap ایجاد کرده و داده‌ها را در آن کپی می‌کند.

#### تله‌های رایج Boxing در کدهای بک‌اند:
۱. کست کردن استراکت به اینترفیس‌ها (مانند \`IComparable\` یا \`IDisposable\`).
۲. استفاده از کالکشن‌های غیرجنریک یا \`List<object>\`.
۳. صدا زدن متدهایی مثل \`GetType()\` روی استراکت.

#### راهکارهای پیشگیری:
- **متدهای جنریک با قید \`where T : struct\`:** مانع بوکسینگ در اینترفیس‌ها می‌شود.
- **پیراینده \`in\`:** ارسال استراکت با ارجاع فقط‌خواندنی (Read-only Reference) به جای کپی فیزیکی بایت‌ها.
- **\`readonly struct\`:** حذف کپی‌های دفاعی (Defensive Copies) توسط کامپایلر در زمان استفاده از \`in\`.
- **\`ref struct\` (مانند \`Span<T>\`):** استراکتی با تضمین ۱۰۰٪ تخصیص فقط روی Stack که در زمان کامپایل امکان بوکسینگ یا قرارگیری روی Heap را نمی‌پذیرد.`,
  },
  {
    id: "dotnet-mid-q218",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-generics-collections-linq"],
    questionTitle: "How does the .NET CLR handle generic type compilation differently for Value Types versus Reference Types, and what are the memory and runtime implications?",
    questionTitle_fa: "سازوکار کامپایل کدهای جنریک در CLR برای انواع مقداری (Value Types) در مقایسه با انواع ارجاعی (Reference Types) چگونه است و چه تاثیری بر حافظه و کارایی دارد؟",
    answerContent: `### CLR Generics Compilation: Value Types vs. Reference Types

The .NET Common Language Runtime (CLR) uses **Reified Generics**, preserving complete type information at runtime. When compiling generic types (e.g. \`List<T>\` or \`Dictionary<TKey, TValue>\`), the JIT (Just-In-Time) compiler employs two distinct compilation strategies:

#### 1. Value Type Specialization (Dedicated Machine Code):
- For every distinct value type parameter (\`int\`, \`Guid\`, \`DateTime\`, or custom \`struct\`), the JIT compiler produces a dedicated, separate native machine code implementation.
- **Why?** Value types differ in physical byte size (\`int\` is 4 bytes, \`Guid\` is 16 bytes, \`decimal\` is 16 bytes). Operating on them requires specialized CPU instructions, direct stack offsets, and registers.
- **Benefits:**
  - **Zero Boxing:** Elements are stored inline inside the contiguous array without pointer indirection.
  - **Maximum CPU Performance:** Enables CPU register allocation, loop unrolling, and SIMD hardware acceleration.
- **Trade-off:** Minimal "code bloat" as each unique value type instantiates a separate native method table in memory.

#### 2. Reference Type Canonical Code Sharing (\`List<object>\`):
- For all reference types (\`string\`, \`Customer\`, \`Order\`), the physical memory layout is identical: an 8-byte address pointer on 64-bit architectures.
- To prevent native code bloat, the JIT compiles a **single shared canonical machine code implementation** (effectively compiled against \`List<object>\`).
- **How type safety is maintained:** The CLR passes a hidden runtime parameter (a pointer to the type's \`MethodTable*\`) to generic methods so the runtime can enforce type checks, invoke correct virtual methods, and instantiate the exact type.

\`\`\`csharp
// JIT Compilation Reality:
List<int> intList = new();       // Unique native machine code specialized for 4-byte integers
List<double> dblList = new();    // Unique native machine code specialized for 8-byte floating point
List<string> strList = new();     // Shares compiled canonical code with List<object>
List<UserDto> userList = new();   // Shares compiled canonical code with List<object>
\`\`\`

#### Production Architectural Takeaways:
1. Generics eliminate the heavy GC Gen 0 pressure and Boxing overhead of legacy collections (\`ArrayList\`).
2. Generic structs and math operations execute at the same speed as hand-written, non-generic assembly code.`,
    answerContent_fa: `### سازوکار کامپایل Generics در رانتایم CLR برای Value Typeها و Reference Typeها

رانتایم دات‌نت (CLR) بر خلاف جاوا از **Reified Generics** استفاده می‌کند و نوع داده‌ها را در زمان اجرا به طور کامل حفظ می‌نماید. کامپایلر JIT بر اساس ماهیت نوع داده \`T\` از دو استراتژی مجزا استفاده می‌کند:

#### ۱. تخصص‌یافتگی کامل برای Value Typeها (Specialization):
- برای هر نوع مقداری متمایز (مانند \`int\`، \`Guid\`، \`DateTime\` یا استراکت‌های سفارشی)، کامپایلر JIT یک نسخه کد ماشین (Native Code) کاملاً مجزا و بهینه‌سازی‌شده تولید می‌کند.
- **علت:** انواع مقداری اندازه بایت متفاوتی در حافظه دارند (\`int\` چهار بایت، \`Guid\` شانزده بایت) و دستورات پردازنده برای مدیریت آنها کاملاً متفاوت است.
- **مزایا:** عدم ایجاد هیچ‌گونه Boxing، ذخیره متوالی داده‌ها در حافظه، و استفاده حداکثری از رجیسترهای CPU و دستورات برداری SIMD.

#### ۲. اشتراک کد ماشین برای Reference Typeها (Canonical Code Sharing):
- تمامی انواع ارجاعی (مانند \`string\`، \`Customer\`، \`Order\`) بر روی معماری ۶۴ بیتی یک اشاره‌گر ۸ بایتی یکسان دارند.
- جهت جلوگیری از اتلاف رم و اشغال بیهوده حافظه کد (Code Bloat)، کامپایلر JIT صرفاً **یک نسخه کد ماشین مشترک** (بر پایه \`List<object>\`) کامپایل می‌کند و نوع واقعی هر کلاس را با ارسال اشاره‌گر مخفی \`MethodTable*\` در زمان اجرا تشخیص می‌دهد.`,
  },
  {
    id: "dotnet-mid-q219",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-generics-collections-linq"],
    questionTitle: "Deep dive into the internal data structure of Dictionary<TKey, TValue> in .NET. How are buckets, entries, and hash collisions managed, and what happens during a resize?",
    questionTitle_fa: "کالبدشکافی معماری داخلی Dictionary<TKey, TValue> در دات‌نت: باکت‌ها، آرایه Entryها و برخوردهای هش چگونه مدیریت می‌شوند و در زمان تغییر اندازه (Resize) چه رخ می‌دهد؟",
    answerContent: `### Internal Architecture of Dictionary<TKey, TValue> in .NET

The .NET \`Dictionary<TKey, TValue>\` does not allocate separate heap objects for linked list nodes. Instead, it is built upon a high-performance **Separate Chaining with Flat Struct Arrays** architecture.

\`\`\`csharp
public class Dictionary<TKey, TValue>
{
    private int[] _buckets;      // Array storing 1-based indices pointing into _entries (-1/0 means empty)
    private Entry[] _entries;    // Flat array storing elements and collision chain links
    private int _count;          // Number of active entries
    private int _freeList;       // Head index of deleted slots for reuse (O(1) recycling)
    private int _freeCount;
    private int _version;        // Incremented on mutation to invalidate iterators

    private struct Entry
    {
        public uint HashCode;    // Cached 31-bit hash code (with top bit masked)
        public int Next;         // Index of next entry in collision chain (-1 if tail)
        public TKey Key;         // Key instance
        public TValue Value;     // Value instance
    }
}
\`\`\`

---

#### 1. Lookup & Collision Mechanics (\`O(1)\` Average):
1. **Hash Calculation:** The dictionary calls \`comparer.GetHashCode(key)\` and masks the result to produce a positive 31-bit integer.
2. **Bucket Indexing:** The target bucket is resolved via \`bucketIndex = hashCode % _buckets.Length\`.
3. **Chain Traversal:** 
   - It reads \`entryIndex = _buckets[bucketIndex] - 1\`.
   - It inspects \`_entries[entryIndex]\`. If \`entry.HashCode == hashCode\` AND \`comparer.Equals(entry.Key, key)\`, the value is returned immediately.
   - If not equal, it follows \`entry.Next\` down the linked chain in the flat \`_entries\` array.
   - If \`entry.Next == -1\`, the key is absent (\`O(1)\` average, worst-case \`O(N)\` under malicious hash collisions).

---

#### 2. What Happens During a Resize?
When \`_count == _entries.Length\` (Load factor reaches 1.0):
1. **Prime Number Allocation:** The runtime allocates new \`_buckets\` and \`_entries\` arrays sized to the **next prime number** greater than 2 * currentCapacity (e.g. 3 -> 7 -> 17 -> 37 -> 79 ...). Prime sizes minimize bucket collisions caused by non-uniform hash distributions.
2. **Re-Hashing & Array Migration:**
   - Existing entries are copied to the new \`_entries\` array.
   - All entries are re-bucketed: for each entry, \`newBucket = entry.HashCode % newBuckets.Length\`.
   - The collision chain \`entry.Next\` pointers and \`_buckets\` indices are completely reconstructed.
3. **Latency Impact:** Resizing is an \`O(N)\` operation that triggers GC allocations and CPU spikes. In high-throughput APIs (> 10,000 req/sec), always **pre-size the dictionary** using \`new Dictionary<TKey, TValue>(expectedCapacity)\`.`,
    answerContent_fa: `### کالبدشکافی معماری داخلی Dictionary<TKey, TValue> در دات‌نت

دیکشنری دات‌نت بر خلاف پیاده‌سازی‌های سنتی، برای نودهای لیست پیوندی آبجکت‌های مجزا روی Heap نمی‌سازد؛ بلکه از معماری بهینه **Separate Chaining با آرایه‌های تخت استراکت** استفاده می‌کند:

\`\`\`csharp
private int[] _buckets;      // آرایه‌ای از اندیس‌های ۱-پایه که به آرایه entries اشاره دارند
private Entry[] _entries;    // آرایه پیوسته و تختی از استراکت‌های حاوی داده

private struct Entry
{
    public uint HashCode;    // مقدار هش کش‌شده جهت مقایسه سریع عددی
    public int Next;         // اندیس نود بعدی در زنجیره برخورد (-1 یعنی انتهای زنجیره)
    public TKey Key;         // کلید
    public TValue Value;     // مقدار
}
\`\`\`

#### ۱. فرآیند جستجو و مدیریت برخوردهای هش (Hash Collisions):
۱. مقدار هش کلید محاسبه شده و با فرمول \`hashCode % _buckets.Length\` اندیس باکت به دست می‌آید.
۲. باکت اندیس خانه مربوطه در آرایه \`_entries\` را می‌دهد.
۳. مقدار کش‌شده \`entry.HashCode\` و سپس متد \`Equals\` کلید بررسی می‌شود. در صورت عدم تطابق، فیلد \`entry.Next\` در همان آرایه تخت دنبال می‌شود تا مقدار پیدا شود یا به \`-1\` برسد.

#### ۲. در زمان تغییر اندازه (Resize) چه اتفاقی می‌افتد؟
- با پر شدن ظرفیت (Load Factor = 1.0)، اندازه آرایه‌ها به **اولین عدد اول بزرگتر از دو برابر ظرفیت فعلی** افزایش می‌یابد (اعداد اول توزیع یکنواخت‌تری از باکت‌ها می‌سازند).
- آرایه‌های قبلی در حافظه رها شده و کل عناصر Re-hash می‌شوند که عملیاتی با پیچیدگی \`O(N)\` است.
- **نکته پروداکشن:** برای جلوگیری از افت ناگهانی Latency در پردازش‌های پرترافیک، همیشه ظرفیت اولیه دیکشنری را از قبل با \`new Dictionary<K, V>(capacity)\` مشخص کنید.`,
  },
  {
    id: "dotnet-mid-q220",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-generics-collections-linq"],
    questionTitle: "What is the difference between Deferred Execution and Immediate Execution in LINQ, and how does the compiler's 'yield return' state machine operate under the hood?",
    questionTitle_fa: "تفاوت اجرای تنبل (Deferred Execution) با اجرای فوری در LINQ چیست و ماشین حالت کامپایلر برای yield return در پشت صحنه چگونه کار می‌کند؟",
    answerContent: `### LINQ Execution Model: Deferred vs. Immediate Execution

LINQ to Objects operates on the \`IEnumerable<T>\` pulling protocol. Rather than loading whole datasets into memory, LINQ expressions define **declarative pipelines**.

---

#### 1. Deferred Execution (Lazy Evaluation)
Execution is postponed until the sequence is actively enumerated (e.g. via \`foreach\`, \`ToList()\`, or \`await foreach\`).

- **Streaming Operators (\`Where\`, \`Select\`, \`Take\`, \`Skip\`):**
  - Process items **one at a time on demand**.
  - Memory consumption is \`O(1)\` constant overhead.
- **Buffering Operators (\`OrderBy\`, \`GroupBy\`, \`Reverse\`):**
  - Still deferred, but **must consume all upstream elements** into an internal buffer before yielding the very first output item (\`O(N)\` memory buffer).

\`\`\`csharp
// Zero execution, 0 database queries, 0 allocations here:
var query = dbContext.Orders
    .Where(o => o.Status == OrderStatus.Pending)
    .Select(o => new OrderDto(o.Id, o.TotalAmount));

// Execution triggers HERE:
foreach (var order in query) { /* items streamed */ }
\`\`\`

---

#### 2. Immediate Execution
Operators that trigger the query immediately and materialize results into memory:
- **Materializers:** \`ToList()\`, \`ToArray()\`, \`ToDictionary()\`, \`ToHashSet()\`
- **Aggregators & Reducers:** \`Count()\`, \`Sum()\`, \`Min()\`, \`Max()\`, \`Average()\`
- **Element Operators:** \`First()\`, \`FirstOrDefault()\`, \`Single()\`, \`Any()\`, \`All()\`

---

#### 3. How the \`yield return\` State Machine Works Under the Hood
When you write an iterator method containing \`yield return\`, the Roslyn compiler synthesizes a nested private class implementing \`IEnumerable<T>\`, \`IEnumerator<T>\`, and \`IDisposable\`:

\`\`\`csharp
public static IEnumerable<int> GetEvenNumbers(int max)
{
    for (int i = 0; i < max; i++)
    {
        if (i % 2 == 0)
            yield return i;
    }
}
\`\`\`

#### Synthesized State Machine Mechanics:
1. **State Field (\`<>1__state\`):** Tracks execution progress:
   - \`0\`: Initialized / not started.
   - \`-1\`: Currently running / inside iterator loop.
   - \`1\`: Yielded a value (paused).
   - \`-2\`: Disposed / terminated.
2. **\`MoveNext()\` Method:** Implements a \`switch (<>1__state)\` jump table. It resumes execution from the exact line where \`yield return\` previously yielded, restores local variables stored as fields in the state machine class, computes the next item, assigns it to \`<>2__current\`, sets state to \`1\`, and returns \`true\`. When the loop terminates, it returns \`false\`.`,
    answerContent_fa: `### مدل اجرای LINQ: اجرای به تعویق افتاده (Deferred) در برابر اجرای فوری (Immediate)

کوئری‌های LINQ مبتنی بر اینترفیس \`IEnumerable<T>\` هستند و تا زمانی که داده‌ها صریحاً پیمایش نشوند، هیچ داده‌ای در حافظه بارگذاری یا پردازش نمی‌شود.

#### ۱. عملگرهای با اجرای به تعویق افتاده (Deferred / Lazy Execution):
- **عملگرهای جریانی (Streaming):** مانند \`Where\` و \`Select\`؛ عناصر را تک‌به‌تک بر حسب تقاضا پردازش کرده و مصرف حافظه \`O(1)\` دارند.
- **عملگرهای بافرکننده (Buffering):** مانند \`OrderBy\` و \`GroupBy\`؛ اجرای آنها به تعویق می‌افتد اما برای تولید اولین خروجی، کل دیتای ورودی را در رم بافر می‌کنند (\`O(N)\` حافظه).

#### ۲. عملگرهای با اجرای فوری (Immediate Execution):
متدهایی مانند \`ToList()\`, \`ToArray()\`, \`Count()\`, \`Sum()\`, \`Any()\` که کل کوئری را در همان لحظه ارزیابی و نتیجه را در حافظه مادی‌سازی می‌کنند.

#### ۳. سازوکار ماشین حالت کامپایلر Roslyn برای \`yield return\`:
هنگام استفاده از \`yield return\`، کامپایلر یک کلاس داخلی ماشین حالت (State Machine) می‌سازد که فیلد \`<>1__state\` وضعیت حلقه را نگهداری می‌کند. با هر فراخوانی \`MoveNext\`، رانتایم اجرای کد را دقیقاً از نقطه توقف قبلی ادامه داده، متغیرهای محلی را بازیابی کرده و پس از مقداردهی به \`Current\`، وضعیت را مجدداً متوقف (Pause) می‌سازد.`,
  },
  {
    id: "dotnet-mid-q221",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-generics-collections-linq"],
    questionTitle: "Explain Generic Variance in C# (Covariance 'out', Contravariance 'in', and Invariance). Why are classes invariant while interfaces can be variant?",
    questionTitle_fa: "مفهوم واریانس در جنریک‌های سی‌شارپ (Covariance با out، Contravariance با in و Invariance) چیست و چرا کلاس‌ها Invariant هستند اما اینترفیس‌ها می‌توانند Variant باشند؟",
    answerContent: `### Generic Variance in C#: Covariance, Contravariance & Invariance

Variance controls how inheritance relationships between underlying types (\`Dog : Animal\`) apply to generic types wrapping them.

---

| Mode | Keyword | Position | Subtyping Rule | Supported Construct |
| :--- | :--- | :--- | :--- | :--- |
| **Covariance** | \`out T\` | **Output only** (Return types) | \`IEnumerable<Dog>\` -> \`IEnumerable<Animal>\` | Interfaces, Delegates |
| **Contravariance** | \`in T\` | **Input only** (Parameters) | \`IComparable<Animal>\` -> \`IComparable<Dog>\` | Interfaces, Delegates |
| **Invariance** | None | **Both Input & Output** | \`List<Dog>\` != \`List<Animal>\` | Classes, Structs, Invariant Interfaces |

---

#### 1. Covariance (\`out T\`):
Used when a generic interface or delegate **only outputs / produces** values of type \`T\`.
\`\`\`csharp
public interface IReadOnlyRepository<out T>
{
    T GetById(Guid id); // T is in OUTPUT position
}

IReadOnlyRepository<Dog> dogRepo = new DogRepository();
IReadOnlyRepository<Animal> animalRepo = dogRepo; // VALID: Every Dog is an Animal
Animal animal = animalRepo.GetById(Guid.NewGuid());
\`\`\`

#### 2. Contravariance (\`in T\`):
Used when a generic interface or delegate **only accepts / consumes** values of type \`T\` as input parameters.
\`\`\`csharp
public interface IConsumer<in T>
{
    void Consume(T item); // T is in INPUT position
}

IConsumer<Animal> animalConsumer = new GeneralAnimalConsumer();
IConsumer<Dog> dogConsumer = animalConsumer; // VALID: Can process any Dog using Animal consumer!
dogConsumer.Consume(new Dog());
\`\`\`

---

#### 3. Why Classes and Mutable Collections Are Strictly Invariant
Classes in C# cannot be variant. If \`List<T>\` supported covariance, it would lead to fatal runtime memory corruption and type-safety violations:

\`\`\`csharp
List<Dog> dogs = new List<Dog>();

// If List<T> were covariant:
List<Animal> animals = dogs; // Hypothetical compiler allowance

// CRITICAL TYPE VIOLATION:
animals.Add(new Cat()); // Adds Cat into an actual List<Dog> instance!

// Now accessing dogs[0] expects a Dog but receives a Cat -> Memory & Runtime Crash!
Dog dog = dogs[0]; 
\`\`\`

Because \`List<T>\` allows reading (\`T this[int index]\` - Output) AND writing (\`void Add(T item)\` - Input), it is strictly **Invariant**.`,
    answerContent_fa: `### واریانس در جنریک‌های C#: تفاوت Covariance، Contravariance و Invariance

واریانس مشخص می‌کند که وراثت بین دو کلاس (مانند \`Dog : Animal\`) چگونه به جنریک‌های دربرگیرنده آنها اعمال می‌شود:

#### ۱. هم‌وردایی یا Covariance (\`out T\`):
- زمانی که نوع جنریک **صرفاً در موقعیت خروجی (Return Type)** متدها قرار می‌گیرد.
- امکان نسبت دادن نوع مشتق‌شده‌تر به نوع پایه: \`IEnumerable<Animal> animals = new List<Dog>();\`

#### ۲. پادوردایی یا Contravariance (\`in T\`):
- زمانی که نوع جنریک **صرفاً در موقعیت ورودی (Parameter)** متدها قرار می‌گیرد.
- امکان نسبت دادن نوع عمومی‌تر به متغیر مشتق‌شده: \`IComparer<Dog> comparer = new AnimalComparer();\`

#### ۳. علت Invariant بودن کلاس‌ها و کالکشن‌های تغییرپذیر:
کلاس‌ها نمی‌توانند Variant باشند چون همزمان متدهای خواندن (خروجی) و نوشتن (ورودی) دارند. اگر \`List<T>\` از Covariance پشتیبانی می‌کرد:
\`\`\`csharp
List<Dog> dogs = new List<Dog>();
List<Animal> animals = dogs; // اگر مجاز بود
animals.Add(new Cat());      // یک گربه درون لیست سگ‌ها درج می‌شد و رانتایم کرش می‌کرد!
\`\`\``,
  },
  {
    id: "dotnet-mid-q222",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-generics-collections-linq"],
    questionTitle: "When should you use FrozenDictionary<TKey, TValue>, ImmutableDictionary, ConcurrentDictionary, or standard Dictionary in .NET 8/9, and how does CollectionsMarshal optimize hot paths?",
    questionTitle_fa: "چه زمانی در دات‌نت ۸ و ۹ باید از FrozenDictionary، ImmutableDictionary، ConcurrentDictionary یا Dictionary استاندارد استفاده کنیم و CollectionsMarshal چگونه دسترسی‌های پرترافیک را بهینه می‌کند؟",
    answerContent: `### Choosing the Right Dictionary in Modern .NET 8/9

Choosing the correct dictionary structure has a massive impact on memory allocations, thread contention, and lookup throughput (> 50,000 ops/sec).

---

| Collection | Thread Safety | Mutation Cost | Read Throughput | Best Architectural Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **\`Dictionary<K, V>\`** | None (Single-threaded) | \`O(1)\` fast | \`O(1)\` fast | Local request-scoped lookups, per-thread caches |
| **\`ConcurrentDictionary<K, V>\`** | Lock-Free Reads + Striped Locks on Writes | \`O(1)\` (with lock striping) | \`O(1)\` fast | Multi-threaded shared caches, singleton services with concurrent writes |
| **\`ImmutableDictionary<K, V>\`** | Thread-Safe (Immutable AVL Tree) | \`O(log N)\` (rebuilds tree path) | \`O(log N)\` (tree traversal) | Functional pipelines, Roslyn analyzers, state snapshots |
| **\`FrozenDictionary<K, V>\`** (.NET 8+) | Thread-Safe (Immutable Perfect Hash) | Immutable (constructed once) | **\`O(1)\` Blazing Fast (2x-3x standard)** | Static lookup tables initialized at Startup (Routing, Enum/ISO mappings) |

---

#### 1. Why \`FrozenDictionary\` Outperforms Everything for Read-Only Lookups
Introduced in \`.NET 8\` (\`System.Collections.Frozen\`), \`FrozenDictionary\` performs upfront algorithmic analysis during \`.ToFrozenDictionary()\`:
- If key count is small (<= 10), it builds an unrolled jump table or scan.
- For string keys, it selects specialized string hashing algorithms (e.g. ASCII / Span comparisons) that avoid full string hashing.
- For integer keys, it constructs **perfect hash functions** (zero bucket collisions guaranteed).

\`\`\`csharp
public class RouteRegistry
{
    // Created once at Startup:
    private static readonly FrozenDictionary<string, EndpointHandler> Handlers = 
        RegisterRoutes().ToFrozenDictionary(StringComparer.OrdinalIgnoreCase);

    public EndpointHandler? Resolve(string path) => Handlers.GetValueOrDefault(path);
}
\`\`\`

---

#### 2. \`CollectionsMarshal\` for Zero-Copy Hot Paths (\`System.Runtime.InteropServices\`)
In standard dictionary mutation, updating a value requires two lookups (\`dict.ContainsKey\` followed by \`dict[key] = ...\`) or copying struct values.

\`CollectionsMarshal.GetValueRefOrNullRef\` retrieves a \`ref TValue\` directly to the internal array slot:

\`\`\`csharp
public void IncrementCounter(Dictionary<string, RequestStats> dict, string route)
{
    ref var entry = ref CollectionsMarshal.GetValueRefOrNullRef(dict, route);
    
    if (System.Runtime.CompilerServices.Unsafe.IsNullRef(ref entry))
    {
        dict[route] = new RequestStats { HitCount = 1 };
    }
    else
    {
        // Mutates struct in-place without double hash lookup or stack copying!
        entry.HitCount++;
    }
}
\`\`\``,
    answerContent_fa: `### انتخاب دیکشنری مناسب در دات‌نت ۸ و ۹ و بهینه‌سازی با CollectionsMarshal

انتخاب ساختار مناسب دیکشنری تاثیر مستقیم بر نرخ Throughput و میزان مصرف CPU دارد:

#### مقایسه انواع دیکشنری:
۱. **\`Dictionary<K, V>\` استاندارد:** مناسب‌ترین گزینه برای اسکوپ‌های تک‌نخی (مانند درون یک متد یا Request دات‌نت).
۲. **\`ConcurrentDictionary<K, V>\`:** برای سناریوهای چندنخی با خواندن و نوشتن همزمان در سرویس‌های Singleton (استفاده از قفل‌های نواری Striped Locks).
۳. **\`ImmutableDictionary<K, V>\`:** ساختار درختی AVL غیرقابل تغییر؛ مناسب برای ذخیره Snapshot وضعیت‌ها با پیچیدگی \`O(log N)\`.
۴. **\`FrozenDictionary<K, V>\` (جدید در دات‌نت ۸):** فقط‌خواندنی و غیرقابل تغییر؛ کامپایلر با ساخت **تابع هش کامل (Perfect Hash)** سرعتی تا ۳ برابر بالاتر از دیکشنری عادی در جستجوها فراهم می‌کند (ایده‌آل برای جداول ثابت، نگاشت روت‌ها و دسترسی‌ها در زمان استارتاپ).

#### بهینه‌سازی مسیرهای بحرانی با \`CollectionsMarshal\`:
متد \`CollectionsMarshal.GetValueRefOrNullRef\` یک ارجاع مستقیم (\`ref\`) به اسلات داخلی استراکت در آرایه دیکشنری می‌دهد تا از دو بار محاسبه هش کلید و کپی کردن استراکت در رم جلوگیری شود.`,
  },
  {
    id: "dotnet-mid-q223",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-delegates-lambdas-events"],
    questionTitle: "How does the CLR implement MulticastDelegate under the hood, and what happens when an exception is thrown in a multi-handler delegate chain?",
    questionTitle_fa: "معماری داخلی MulticastDelegate در CLR چگونه است و در صورت بروز خطا (Exception) در یکی از متدهای زنجیره چه اتفاقی می‌افتد؟",
    answerContent: `### CLR MulticastDelegate Internal Architecture & Exception Handling

In .NET, all delegate types inherit from \`System.MulticastDelegate\` (which derives from \`System.Delegate\`). A delegate is a reference type allocated on the **Managed Heap** that encapsulates:

\`\`\`csharp
public abstract class Delegate
{
    internal object _target;         // The object instance (null for static methods)
    internal IntPtr _methodPtr;      // Function pointer to the JIT-compiled native code
}

public abstract class MulticastDelegate : Delegate
{
    internal object _invocationList; // Array of Delegate objects when combined via +=
}
\`\`\`

---

#### 1. Single-Cast vs Multicast Mechanics:
- **Single Target:** \`_invocationList\` is \`null\`. The runtime invokes \`_methodPtr\` directly against \`_target\`.
- **Multicast Combination (\`+=\`):** Calling \`Delegate.Combine(a, b)\` creates a **new immutable \`MulticastDelegate\` instance** whose \`_invocationList\` holds an array of delegates (\`Delegate[]\`). Delegates in C# are immutable—subscribing or unsubscribing always produces a new delegate object.

---

#### 2. What Happens When an Exception Is Thrown?
When invoking a multicast delegate (e.g. \`myAction()\`), the CLR iterates through the \`_invocationList\` sequentially in the order handlers were registered.

**The Danger:** If any handler throws an unhandled exception, **the delegate invocation pipeline immediately terminates**. Subsequent subscribers in the invocation chain are **never executed**, leaving application state inconsistent!

\`\`\`csharp
// HAZARDOUS: If handler 1 throws, handler 2 and 3 are skipped!
public void FireNotifications(Action notify)
{
    notify?.Invoke();
}

// PRODUCTION BEST PRACTICE: Safe Invocation Loop
public void FireNotificationsSafely(Action notify)
{
    if (notify == null) return;

    var exceptions = new List<Exception>();

    foreach (var handler in notify.GetInvocationList().Cast<Action>())
    {
        try
        {
            handler();
        }
        catch (Exception ex)
        {
            // Capture exception and continue invoking subsequent subscribers
            exceptions.Add(ex);
            _logger.LogError(ex, "Error in subscriber handler.");
        }
    }

    if (exceptions.Count > 0)
    {
        throw new AggregateException("One or more event handlers failed.", exceptions);
    }
}
\`\`\``,
    answerContent_fa: `### ساختار داخلی MulticastDelegate در CLR و مدیریت خطا در زنجیره فراخوانی

در دات‌نت تمامی دلیگیت‌ها از کلاس \`System.MulticastDelegate\` ارث‌بری می‌کنند که ساختار زیر را روی Managed Heap دارد:

\`\`\`csharp
internal object _target;         // ارجاع به نمونه شیء (null برای متدهای استاتیک)
internal IntPtr _methodPtr;      // اشاره‌گر کد ماشین متد
internal object _invocationList; // آرایه دلیگیت‌ها در حالت Multicast
\`\`\`

#### ۱. ترکیب دلیگیت‌ها (\`+=\`):
دلیگیت‌ها تغییرناپذیر (Immutable) هستند؛ اضافه کردن متد با \`+=\` یا \`Delegate.Combine\` یک شیء دلیگیت جدید ساخته و آرایه \`_invocationList\` را مقداردهی می‌کند.

#### ۲. رفتار در زمان بروز Exception:
اگر دلیگیت چندگانه به صورت مستقیم فراخوانی شود (\`myAction()\`)، متدها به ترتیب اجرا می‌شوند. **در صورتی که یکی از متدها Exception پرتاب کند، اجرای زنجیره بلافاصله متوقف شده و متدهای بعدی اجرا نمی‌شوند!**

#### راهکار پروداکشن:
استفاده از متد \`GetInvocationList()\` و پیمایش دستی تک‌تک هندلرها درون بلوک \`try-catch\` جهت تضمین اجرای تمامی مشترکین و بسته‌بندی خطاها در \`AggregateException\`.`,
  },
  {
    id: "dotnet-mid-q224",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-delegates-lambdas-events"],
    questionTitle: "Explain how Closures work in C#. What is the Roslyn compiler's DisplayClass, and how can capturing variables cause memory allocations and bugs in loops?",
    questionTitle_fa: "سازوکار Closureها در سی‌شارپ چیست؟ کلاس DisplayClass تولیدشده توسط Roslyn چگونه کار می‌کند و Capture کردن متغیرها چه هزینه‌های حافظه‌ای و باگ‌هایی در حلقه‌ها ایجاد می‌کند؟",
    answerContent: `### Closures, Scope Capture, and Roslyn DisplayClass

A **Closure** occurs when a lambda expression or anonymous function references variables declared outside its immediate parameter list (outer local variables, parameters, or the enclosing \`this\` reference).

---

#### 1. What Roslyn Synthesizes Under the Hood
Local variables normally reside on the thread's Stack frame. When captured by a closure, their lifetime must outlive the containing method.

To achieve this, the Roslyn compiler **lifts the captured variables into fields of a hidden heap-allocated class** called the **Display Class** (\`<>c__DisplayClass\`):

\`\`\`csharp
public Func<int, int> CreateAdder(int amount)
{
    return x => x + amount; // 'amount' is captured
}
\`\`\`

#### Conceptual Decompilation:
\`\`\`csharp
[CompilerGenerated]
private sealed class <>c__DisplayClass0_0
{
    public int amount; // Stack variable lifted to a Heap field!

    internal int <CreateAdder>b__0(int x) => x + this.amount;
}

public Func<int, int> CreateAdder(int amount)
{
    var display = new <>c__DisplayClass0_0(); // HEAP ALLOCATION on every call!
    display.amount = amount;
    return new Func<int, int>(display.<CreateAdder>b__0);
}
\`\`\`

---

#### 2. The Classic "Captured Loop Variable" Trap
In standard \`for\` loops, capturing the loop counter variable captures the **same variable reference** across all lambda instances:

\`\`\`csharp
var actions = new List<Action>();
for (int i = 0; i < 5; i++)
{
    actions.Add(() => Console.WriteLine(i)); // TRAP: Captures shared 'i' reference
}

foreach (var act in actions) act(); // Output: 5, 5, 5, 5, 5 (NOT 0, 1, 2, 3, 4)
\`\`\`

**Fix:** Create a local scope copy inside the loop body (\`int copy = i;\`) or use \`foreach\` (which creates per-iteration scope in C# 5+).

---

#### 3. Modern Zero-Allocation Best Practices:
1. **Static Lambdas (C# 9+):** Use \`static (x) => ...\` to enforce at compile time that no outer variables or \`this\` are captured.
2. **State-Passing Overloads:** In high-throughput code, use API overloads that accept an explicit \`TState\` argument:
   \`\`\`csharp
   // ZERO ALLOCATIONS:
   _cache.GetOrAdd(key, static (k, state) => LoadTenantData(k, state), tenantId);
   \`\`\``,
    answerContent_fa: `### نحوه کارکرد Closureها، کلاس DisplayClass در کامپایلر Roslyn و خطرات تخصیص حافظه

**Closure** زمانی تشکیل می‌شود که یک تابع لامبدا به متغیرهای تعریف‌شده در خارج از پارامترهای خود (متغیرهای محلی، پارامترهای ورودی یا \`this\`) دسترسی پیدا کند.

#### ۱. سازوکار داخلی Roslyn (تولید DisplayClass):
متغیرهای محلی معمولاً روی Stack قرار دارند. از آنجا که طول عمر دلیگیت ممکن است بیشتر از متد جاری باشد، کامپایلر Roslyn یک کلاس مخفی روی Managed Heap به نام **DisplayClass** می‌سازد و تمام متغیرهای تسخیرشده را به فیلدهای این کلاس روی Heap تبدیل می‌کند.

#### ۲. تله مشهور متغیر حلقه (Captured Loop Variable):
در حلقه‌های \`for\`، اگر متغیر شمارنده حلقه در لامبدا Capture شود، تمامی دلیگیت‌ها به همان آدرس مشترک ارجاع داده و مقدار نهایی حلقه را چاپ می‌کنند:
\`\`\`csharp
for (int i = 0; i < 5; i++)
{
    int localCopy = i; // راهکار: کپی متغیر در اسکوپ داخلی
    actions.Add(() => Console.WriteLine(localCopy));
}
\`\`\`

#### ۳. راهکارهای بهینه‌سازی و به صفر رساندن Garbage Collection:
- استفاده از **Static Lambdas** (\`static (x) => ...\`) برای جلوگیری قطعی از تسخیر متغیرها.
- استفاده از متدهای با ورودی State (مانند \`ConcurrentDictionary.GetOrAdd\`) به جای ایجاد کلوژر.`,
  },
  {
    id: "dotnet-mid-q225",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-delegates-lambdas-events"],
    questionTitle: "What are the fundamental differences between an 'event' and a public delegate in C# regarding encapsulation, IL generation, and thread safety?",
    questionTitle_fa: "تفاوت‌های بنیادین بین event و یک دلیگیت عمومی (public delegate) در سی‌شارپ از نظر کپسوله‌سازی، کدهای IL تولیدشده و ایمنی چندنخی چیست؟",
    answerContent: `### Events vs. Public Delegates in C#

While both represent callbacks, an \`event\` is a **language modifier and encapsulation construct**, not a distinct data type.

---

| Dimension | Public Delegate Field (\`public Action Handler\`) | Encapsulated Event (\`public event Action Handler\`) |
| :--- | :--- | :--- |
| **External Subscription** | \`obj.Handler += Method;\` | \`obj.Handler += Method;\` |
| **External Unsubscription** | \`obj.Handler -= Method;\` | \`obj.Handler -= Method;\` |
| **External Overwrite** | **Allowed (\`obj.Handler = null;\`)** — Overwrites all other subscribers! | **Prohibited (Compile Error)** |
| **External Invocation** | **Allowed (\`obj.Handler();\`)** — Any caller can trigger the callback! | **Prohibited (Compile Error)** — Can only be invoked from within declaring class |
| **Interface Support** | Cannot declare fields in interfaces | **Supported in interfaces** (\`event Action OnChanged;\`) |
| **Thread Safety** | Must be handled manually | **Compiler-generated atomic subscription** via \`Interlocked.CompareExchange\` |

---

#### IL Code Generation for Events
When declaring \`public event EventHandler<OrderEventArgs>? OrderCreated;\`, the Roslyn compiler synthesizes:
1. A private backing field: \`private EventHandler<OrderEventArgs>? OrderCreated;\`
2. An **\`add_OrderCreated\`** accessor method.
3. A **\`remove_OrderCreated\`** accessor method.

#### Thread-Safe Accessor Synthesis (Conceptual IL):
\`\`\`csharp
public void add_OrderCreated(EventHandler<OrderEventArgs> value)
{
    EventHandler<OrderEventArgs> root = this.OrderCreated;
    EventHandler<OrderEventArgs> current;
    do
    {
        current = root;
        EventHandler<OrderEventArgs> combined = (EventHandler<OrderEventArgs>)Delegate.Combine(current, value);
        root = Interlocked.CompareExchange(ref this.OrderCreated, combined, current);
    }
    while (root != current); // Atomic lock-free CAS loop
}
\`\`\``,
    answerContent_fa: `### تفاوت‌های بنیادین بین event و دلیگیت عمومی (public delegate) در سی‌شارپ

کلمه کلیدی \`event\` یک نوع داده نیست، بلکه یک **پیراینده و لایه کپسوله‌سازی** روی فیلد دلیگیت است:

#### تفاوت‌های کلیدی:
۱. **کپسوله‌سازی و امنیت:** در یک دلیگیت عمومی، هر کلاس خارجی می‌تواند آن را \`null\` کرده یا کل مشترکین را پاک کند (\`obj.Handler = null\`) یا آن را صدا بزند. در \`event\`، کدهای خارجی **صرفاً مجاز به \`+=\` و \`-=\` هستند** و حق فراخوانی یا پاک‌سازی آن را ندارند.
۲. **تعریف در اینترفیس‌ها:** فیلدهای دلیگیت نمی‌توانند در Interface قرار گیرند، اما \`event\` قابلیت تعریف در اینترفیس دارد.
۳. **ایمنی در برابر چندنخی (Thread Safety):** کامپایلر برای متدهای \`add\` و \`remove\` رویداد، یک حلقه Lock-Free با استفاده از \`Interlocked.CompareExchange\` تولید می‌کند تا ثبت همزمان اشتراک‌ها در محیط‌های چندنخی دچار Race Condition نشود.`,
  },
  {
    id: "dotnet-mid-q226",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-delegates-lambdas-events"],
    questionTitle: "What is the Lapsed Listener Problem in .NET event architectures, and how do you prevent severe memory leaks between Singleton publishers and Scoped subscribers?",
    questionTitle_fa: "مشکل Lapsed Listener در معماری رویدادهای دات‌نت چیست و چگونه از نشت حافظه شدید میان ناشران Singleton و مشترکان Scoped جلوگیری کنیم؟",
    answerContent: `### The Lapsed Listener Problem in .NET

The **Lapsed Listener Problem** is one of the most common causes of memory leaks in .NET applications.

---

#### 1. Why the Leak Occurs (GC Mechanics)
When an object subscribes to an event:
\`\`\`csharp
publisher.OrderCompleted += this.OnOrderCompleted;
\`\`\`

Under the hood, \`publisher._invocationList\` stores a \`Delegate\` object where \`_target\` points to **\`this\`** (the subscriber instance).

- **The Problem:** If the publisher has a **Long Lifetime** (e.g. Singleton service, Static class, Application Cache) and the subscriber has a **Short Lifetime** (e.g. Scoped Service, Controller, UI View):
- The Singleton publisher holds a **strong reference** to the Scoped subscriber.
- When the HTTP request finishes, the Garbage Collector scans the root graph. Because the Singleton is still alive, the Scoped subscriber and **every large object graph it references (DbContext, caches, memory buffers) remain rooted and CANNOT be collected!**

---

#### 2. Prevention & Mitigation Strategies:

1. **Explicit Unsubscription in \`Dispose()\`:**
   Implement \`IDisposable\` on the subscriber and unsubscribe:
   \`\`\`csharp
   public class InvoiceHandler : IDisposable
   {
       private readonly GlobalEventBus _bus;
       public InvoiceHandler(GlobalEventBus bus)
       {
           _bus = bus;
           _bus.OrderPlaced += HandleOrder;
       }

       public void Dispose()
       {
           _bus.OrderPlaced -= HandleOrder; // Frees the strong reference!
       }
   }
   \`\`\`

2. **Weak Event Pattern (\`WeakReference<T>\`):**
   Uses weak references so the event subscription does not prevent the GC from reclaiming the subscriber if no other strong references exist.

3. **In-Process Decoupled Event Buses (MediatR):**
   In modern ASP.NET Core Clean Architecture, avoid direct C# \`event\` subscriptions between services. Use **MediatR Notifications** (\`INotification\` / \`INotificationHandler<T>\`) where handlers are resolved from the DI container per scope and automatically collected after dispatch.`,
    answerContent_fa: `### تحلیل چالش Lapsed Listener و رفع نشت حافظه میان Singleton و Scoped

مشکل **Lapsed Listener** زمانی رخ می‌دهد که یک شیء با طول عمر کوتاه به رویداد یک شیء با طول عمر بلند متصل شود:

#### ریشه مشکل در Garbage Collector:
هنگام اتصال رویداد (\`publisher.Event += this.Handler\`)، فیلد \`_target\` دلیگیت یک رفرنس قوی (Strong Reference) به شیء مشترک نگه می‌دارد. اگر ناشر یک شیء **Singleton** باشد، تا زمان خاموش شدن برنامه به شیء مشترک (مانند یک سرویس Scoped یا کانتینر UI) اشاره دارد؛ در نتیجه GC هرگز نمی‌تواند شیء مشترک و اشیای وابسته به آن (مانند DbContext) را از رم آزاد کند که منجر به نشت حافظه فاجعه‌بار می‌شود.

#### راهکارهای رفع:
۱. پیاده‌سازی اینترفیس \`IDisposable\` و لغو صریح اشتراک (\`-=\`).
۲. استفاده از الگوی **Weak Event** جهت نگهداری ارجاع ضعیف (\`WeakReference\`).
۳. جایگزینی رویدادهای سنتی C# با **سیستم‌های پیام‌رسان درون‌برنامه‌ای (مانند MediatR \`INotification\`)** که طول عمر هندلرها را متناسب با اسکوپ DI مدیریت می‌کنند.`,
  },
  {
    id: "dotnet-mid-q227",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-delegates-lambdas-events"],
    questionTitle: "Compare Func<T, bool> and Expression<Func<T, bool>> in .NET. How does Entity Framework Core parse expression trees into SQL queries?",
    questionTitle_fa: "مقایسه دلیگیت Func<T, bool> و درخت عبارت Expression<Func<T, bool>>: انتیتی فریم‌ورک کور چگونه درخت عبارت را به کوئری SQL ترجمه می‌کند؟",
    answerContent: `### Func<T, bool> vs. Expression<Func<T, bool>> in .NET

Understanding the difference between compiled delegates and Expression Trees is essential for mastering LINQ, Entity Framework Core, and high-performance querying.

---

| Dimension | \`Func<T, bool>\` (Delegate) | \`Expression<Func<T, bool>>\` (Expression Tree) |
| :--- | :--- | :--- |
| **Data Nature** | Compiled Intermediate Language (IL) executable code | In-memory **Abstract Syntax Tree (AST)** data structure |
| **Inspection** | Opaque black box (cannot inspect parameters, operators) | Fully inspectable at runtime (Nodes, BinaryExpressions, MemberAccess) |
| **Execution Engine** | Executed directly in CPU/RAM (LINQ to Objects) | Parsed and translated into SQL queries (LINQ to Entities / EF Core) |
| **Memory Cost** | Low (Single delegate instance) | Higher (Allocates multiple expression tree nodes on the Heap) |
| **Compilation** | Pre-compiled at build time | Can be parsed as data, or dynamically compiled at runtime via \`.Compile()\` |

---

#### How Entity Framework Core Translates Expressions to SQL
When you execute:
\`\`\`csharp
dbContext.Users.Where(u => u.Age > 18 && u.IsActive).ToList();
\`\`\`

1. **AST Representation:** The C# compiler creates an \`Expression<Func<User, bool>>\` object graph consisting of \`BinaryExpression\` (AndAlso), \`MemberExpression\` (\`u.Age\`), and \`ConstantExpression\` (\`18\`).
2. **EF Core Query Pipeline (ExpressionVisitor):**
   - EF Core traverses the AST using custom \`ExpressionVisitor\` classes.
   - It maps \`u.Age\` to the SQL column \`[Age]\`.
   - It maps \`>\` to the SQL operator \`>\`.
   - It maps \`&&\` to SQL \`AND\`.
3. **Relational Command Generation:** EF Core produces parameterized SQL:
   \`\`\`sql
   SELECT [u].[Id], [u].[Age], [u].[IsActive]
   FROM [Users] AS [u]
   WHERE [u].[Age] > 18 AND [u].[IsActive] = 1
   \`\`\`

#### The Critical Pitfall:
Passing a compiled \`Func<T, bool>\` into an \`IQueryable<T>\` causes **Client-Side Evaluation**: EF Core pulls ALL rows from the database into RAM and filters them in C#, causing devastating network latency and memory exhaustion!`,
    answerContent_fa: `### مقایسه دلیگیت Func<T, bool> و درخت عبارت Expression<Func<T, bool>>

درک تفاوت این دو ساختار برای تسلط بر LINQ و Entity Framework Core حیاتی است:

#### تفاوت‌های بنیادین:
- **\`Func<T, bool>\`:** یک کد باینری کامپایل‌شده است که مستقیماً در حافظه RAM و توسط CPU روی کالکشن‌های حافظه (LINQ to Objects) اجرا می‌شود و ساختار داخلی کد آن قابل خواندن توسط برنامه‌نویس یا پکیج‌های دیگر نیست.
- **\`Expression<Func<T, bool>>\`:** یک ساختار داده درختی انتزاعی (**Abstract Syntax Tree یا AST**) است که نمایانگر ساختار کد (نودهای مقایسه، متغیرها، مقادیر ثابت) به صورت آبجکت‌های حافظه است.

#### سازوکار ترجمه به SQL در EF Core:
هنگام ارسال Expression به EF Core، کلاسی به نام \`ExpressionVisitor\` درخت عبارت را پیمایش کرده، نام پراپرتی‌ها را به ستون‌های جدول دیتابیس و عملگرهای C# را به دستورات معادل SQL تبدیل کرده و کوئری بهینه به سرور دیتابیس ارسال می‌کند.

#### تله خطرناک:
اگر به جای \`Expression\` از \`Func\` در کوئری‌های EF Core استفاده شود، کل دیتای جدول ابتدا از دیتابیس دانلود شده و سپس در رم C# فیلتر می‌گردد (Client-Side Evaluation) که باعث افت وحشتناک سرعت و پر شدن رم سرور می‌شود.`,
  },
  {
    id: "dotnet-mid-q228",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-exceptions-idisposable"],
    questionTitle: "How does the CLR two-pass exception handling model work under the hood, and why do C# Exception Filters ('when' clause) evaluate without unwinding the stack?",
    questionTitle_fa: "مدل مدیریت استثنای دو فازی (Two-Pass) در CLR چگونه کار می‌کند و چرا فیلترهای استثنا (عبارت when) بدون پشته‌زدایی (Stack Unwinding) اجرا می‌شوند؟",
    answerContent: `### CLR Two-Pass Exception Pipeline & Exception Filters

The .NET CLR implements Structured Exception Handling (SEH) using a **Two-Pass Exception Architecture**:

---

#### 1. Pass 1: The Search Phase (Inspection without Unwinding)
- When an exception is thrown, the CLR walks up the call stack frame by frame looking for an enclosing \`try/catch\` block that handles the exception type.
- If a \`catch\` block specifies an **Exception Filter** (\`catch (Exception ex) when (Condition)\`), the runtime executes the boolean filter expression **immediately on the current stack**.
- **Crucial Architectural Benefit:** During Pass 1, **no stack unwinding occurs**. The call stack frames, CPU registers, local variables, and execution context between the throw site and catch site remain 100% intact.
- If the filter returns \`false\`, the CLR skips the catch block and continues searching higher up the stack.

---

#### 2. Pass 2: The Unwind Phase (Execution & Cleanup)
- Once a matching handler is found (whose filter returned \`true\`), the CLR initiates **Stack Unwinding**.
- It walks back down from the throw point to the target catch block, executing all intervening **\`finally\` blocks** and **\`using\` cleanup blocks** in reverse order of entry.
- Control is finally transferred to the target \`catch\` block body.

---

#### 3. Why Exception Filters (\`when\`) Outperform \`catch + if + throw\`:

\`\`\`csharp
// ANTI-PATTERN: Unwinds the stack BEFORE checking condition!
try
{
    await httpClient.GetAsync(url);
}
catch (HttpRequestException ex)
{
    if (ex.StatusCode == HttpStatusCode.NotFound)
    {
        _logger.LogWarning("Endpoint missing: {Url}", url);
    }
    else
    {
        throw; // The stack was ALREADY unwound and finally blocks executed!
    }
}

// MODERN C# BEST PRACTICE (Exception Filter):
try
{
    await httpClient.GetAsync(url);
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
{
    // Filter evaluated during Pass 1 while entire call stack and crash dump state are preserved!
    _logger.LogWarning("Endpoint missing: {Url}", url);
}
\`\`\`

#### Production Diagnostic Impact:
If an unhandled exception triggers a Windows Minidump or crash dump, an exception filter that returned \`false\` leaves the stack completely pristine at the exact line of failure, rather than unwound to an intermediate logging block.`,
    answerContent_fa: `### مدل دو فازی (Two-Pass) مدیریت استثناها در CLR و فیلترهای استثنا (when)

رانتایم CLR استثناها را در دو فاز کاملاً تفکیک‌شده مدیریت می‌کند:

#### ۱. فاز اول: مرحله جستجو (Search Phase بدون پشته‌زدایی):
- با پرتاب خطا (\`throw\`)، CLR پشته فراخوانی (Call Stack) را برای یافتن بلوک \`catch\` مناسب بررسی می‌کند.
- در صورت وجود **فیلتر استثنا** (\`catch (...) when (...)\`)، شرط فیلتر **دقیقاً در همان لحظه و بدون باز کردن پشته (Stack Unwinding)** ارزیابی می‌شود.
- در این فاز، تمامی متغیرهای محلی و فریم‌های پشته ۱۰۰٪ دست‌نخورده باقی می‌مانند که امکان تحلیل دقیق وضعیت در هنگام وقوع کرش و ثبت Crash Dump را مهیا می‌سازد.

#### ۲. فاز دوم: مرحله پشته‌زدایی (Unwind Phase):
- پس از تایید شرط فیلتر، پشته باز شده و تمام بلوک‌های \`finally\` و \`using\` در طول مسیر به ترتیب معکوس اجرا می‌شوند و در نهایت کنترل به بدنه \`catch\` منتقل می‌شود.

#### مزیت فیلتر \`when\` نسبت به \`catch + if + throw\`:
در روش سنتی، پشته قبل از بررسی شرط باز می‌شد؛ اما با فیلتر \`when\`، اگر شرط برقرار نباشد، برنامه طوری پشته را حفظ می‌کند که گویی خطایی در آن لایه مدیریت نشده و اطلاعات عیب‌یابی برای لایه‌های بالاتر حفظ می‌گردد.`,
  },
  {
    id: "dotnet-mid-q229",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-exceptions-idisposable"],
    questionTitle: "What is the critical difference between 'throw;', 'throw ex;', and 'ExceptionDispatchInfo.Capture(ex).Throw();' in C#, and how do they impact the stack trace?",
    questionTitle_fa: "تفاوت حیاتی میان 'throw;'، 'throw ex;' و 'ExceptionDispatchInfo.Capture(ex).Throw()' در سی‌شارپ چیست و هر کدام چه تاثیری بر Stack Trace دارند؟",
    answerContent: `### Exception Propagation Mechanics in C#

Maintaining accurate stack traces is critical for diagnosing production bugs. How you re-throw exceptions fundamentally alters the stack trace metadata captured by the runtime.

---

\`\`\`csharp
public async Task ExecutePaymentAsync(Order order)
{
    try
    {
        await _gateway.ChargeCreditCardAsync(order);
    }
    catch (PaymentGatewayException ex)
    {
        // Option 1: throw ex;
        // Option 2: throw;
        // Option 3: ExceptionDispatchInfo.Capture(ex).Throw();
    }
}
\`\`\`

---

#### 1. \`throw ex;\` (Catastrophic Anti-Pattern)
- **Behavior:** Resets the exception's origin to the current line where \`throw ex;\` is executed.
- **Consequence:** Completely **erases the entire upstream call stack** (the exact method, file name, and line number where the original error occurred inside \`_gateway.ChargeCreditCardAsync\`).
- **Verdict:** **Strictly prohibited in production code.**

---

#### 2. \`throw;\` (Standard Re-Throw)
- **Behavior:** Instructs the CLR to resume stack propagation of the active exception object without modifying its origin.
- **Consequence:** Preserves 100% of the original call stack trace from the point of origin.
- **Verdict:** The standard best practice inside synchronous catch blocks.

---

#### 3. \`ExceptionDispatchInfo.Capture(ex).Throw();\` (\`System.Runtime.ExceptionServices\`)
- **Behavior:** Captures the exception and its complete stack state at a specific point in time, and re-throws it elsewhere (even on a different thread or asynchronous continuation).
- **Consequence:** Preserves the original stack trace AND inserts a clear runtime delimiter:
  \`\`\`text
  --- End of stack trace from previous location where exception was thrown ---
  \`\`\`
- **Use Cases:**
  - Asynchronous task state machines and \`Task.WhenAll\` aggregations.
  - Polly resilience policies and custom retry interceptors.
  - Cross-thread error marshaling from ThreadPool workers to main threads.`,
    answerContent_fa: `### سازوکار انتشار مجدد استثناها: مقایسه throw، throw ex و ExceptionDispatchInfo

نحوه پرتاب مجدد استثناها تاثیر مستقیمی بر حفظ تاریخچه Call Stack و ریشه‌یابی خطاها در پروداکشن دارد:

#### ۱. عبارت \`throw ex;\` (الگوی ضدکارایی و ممنوع):
- **رفتار:** نقطه شروع استثنا را به همین خط جاری ریست می‌کند.
- **پیامد:** کل تاریخچه پشته قبلی (فایل و خطی که خطای واقعی در آن رخ داده بود) پاک می‌شود. در کدهای پروداکشن هرگز نباید استفاده شود.

#### ۲. عبارت \`throw;\` (استاندارد):
- **رفتار:** همان شیء استثنا را بدون تغییر در پشته به سمت لایه‌های بالاتر هدایت می‌کند.
- **پیامد:** ۱۰۰٪ اطلاعات خط اصلی وقوع خطا و تمام متدهای والد حفظ می‌شود.

#### ۳. متد \`ExceptionDispatchInfo.Capture(ex).Throw()\`:
- **رفتار:** پشته استثنا را در لحظه ثبت کرده و امکان پرتاب مجدد آن را در نخ‌های دیگر یا چرخه‌های بعدی Async فراهم می‌سازد.
- **پیامد:** پشته اصلی را کاملاً حفظ کرده و یک خط جداکننده به لاگ اضافه می‌کند.
- **کاربرد:** موتورهای پردازش ناهمگام، الگوهای Retry در Polly و جابجایی خطا میان Threadها.`,
  },
  {
    id: "dotnet-mid-q230",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-exceptions-idisposable"],
    questionTitle: "How does the CLR Garbage Collector handle finalizable objects (Finalization Queue vs F-Reachable Queue), and why is calling GC.SuppressFinalize mandatory in Dispose()?",
    questionTitle_fa: "موتور Garbage Collector در CLR چگونه اشیای دارای Finalizer را مدیریت می‌کند (صف Finalization در برابر F-Reachable) و چرا فراخوانی GC.SuppressFinalize در متد Dispose الزامی است؟",
    answerContent: `### CLR Finalization Pipeline: Finalization Queue vs. F-Reachable Queue

The .NET Garbage Collector automatically reclaims managed memory, but it cannot know how to release unmanaged resources (file handles, sockets, native memory allocated via \`Marshal.AllocHGlobal\`).

When a class defines a Finalizer (\`~ClassName()\`), the runtime handles its lifecycle through a specialized two-queue mechanism:

---

\`\`\`csharp
public class NativeBuffer : IDisposable
{
    private IntPtr _buffer;

    public NativeBuffer(int size) => _buffer = Marshal.AllocHGlobal(size);

    public void Dispose()
    {
        CleanUpUnmanaged();
        GC.SuppressFinalize(this); // MANDATORY!
    }

    ~NativeBuffer() => CleanUpUnmanaged(); // Fallback finalizer

    private void CleanUpUnmanaged()
    {
        if (_buffer != IntPtr.Zero)
        {
            Marshal.FreeHGlobal(_buffer);
            _buffer = IntPtr.Zero;
        }
    }
}
\`\`\`

---

#### 1. What Happens When \`new NativeBuffer()\` Is Instantiated:
- The CLR allocates the object on the Managed Heap and places an internal pointer into the **Finalization Queue**.

---

#### 2. What Happens During Garbage Collection (If \`Dispose()\` Was NOT Called):
1. **Detection:** When a Gen 0 GC collection occurs, the GC determines that the object is no longer referenced by user code.
2. **Survival & Promotion:** Because the object has a pending finalizer, **the GC CANNOT reclaim its memory yet**. It moves the pointer from the *Finalization Queue* to the **F-Reachable Queue** (Finalization Reachable).
3. **Generational Penalty:** Because the *F-Reachable Queue* now holds a strong root to the object, the object survives Gen 0 and is **promoted to Generation 1 (or Generation 2)**!
4. **Finalizer Thread Execution:** A dedicated low-priority background thread (the *Finalizer Thread*) drains the F-Reachable Queue and executes \`~NativeBuffer()\`.
5. **Delayed Memory Reclamation:** The object's memory is only freed during a *subsequent* Gen 1/Gen 2 GC cycle, significantly increasing application memory footprint and GC pause times!

---

#### 3. Why \`GC.SuppressFinalize(this)\` Is Mandatory in \`Dispose()\`:
When the developer deterministically calls \`Dispose()\`, \`GC.SuppressFinalize(this)\` flips an internal bit on the object's header. It tells the runtime:
*"The unmanaged resources have already been freed. Remove this object from the Finalization Queue."*

**The Result:** When the GC collects Gen 0, the object is reclaimed **immediately in Gen 0 with zero generational promotion penalty and zero Finalizer Thread overhead!**`,
    answerContent_fa: `### سازوکار صف‌های Finalization و F-Reachable در GC و ضرورت GC.SuppressFinalize

موتور Garbage Collector حافظه Managed را مدیریت می‌کند اما از منابع سیستم‌عامل (Unmanaged Resources مانند Handle فایل، کانکشن‌های شبکه و حافظه C++) بی‌خبر است.

کلاس‌هایی که دارای Finalizer (\`~ClassName()\`) هستند، چرخه‌ای پرهزینه در حافظه طی می‌کنند:

#### ۱. صف‌های Finalization Queue و F-Reachable Queue:
- هنگام ساخت شیء، اشاره‌گر آن در **Finalization Queue** ثبت می‌شود.
- در زمان اجرای GC در نسل صفر (Gen 0)، شیء به دلیل داشتن Finalizer **آزاد نمی‌شود**، بلکه به **F-Reachable Queue** منتقل می‌گردد.
- به دلیل ارجاع داشتن از این صف، شیء از جمع‌آوری جان سالم به در برده و به **نسل‌های بالاتر (Gen 1 یا Gen 2)** ترفیع می‌یابد!
- یک نخ پس‌زمینه اختصاصی (Finalizer Thread) متد مخرب شیء را اجرا می‌کند و در نهایت حافظه شیء در چرخه‌های بعدی GC آزاد می‌شود که فشار سنگینی بر رم وارد می‌سازد.

#### ۲. ضرورت حیاتی متد \`GC.SuppressFinalize(this)\`:
هنگامی که متد \`Dispose()\` فراخوانی می‌شود، دستور \`GC.SuppressFinalize(this)\` شیء را بلافاصله از صف Finalization حذف می‌کند تا در همان نسل صفر (Gen 0) به طور کامل آزاد شده و از ارتقای مخرب به Gen 1/2 و فعال شدن Finalizer Thread جلوگیری شود.`,
  },
  {
    id: "dotnet-mid-q231",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-exceptions-idisposable"],
    questionTitle: "How do you implement the complete, thread-safe Dispose Pattern supporting both IDisposable and IAsyncDisposable with ValueTask in .NET?",
    questionTitle_fa: "چگونه الگوی کامل و Thread-Safe آزادسازی منابع (Dispose Pattern) را با پشتیبانی همزمان از IDisposable و IAsyncDisposable و ساختار ValueTask پیاده‌سازی کنیم؟",
    answerContent: `### Implementing the Complete Dispose Pattern (IDisposable + IAsyncDisposable)

Modern .NET backend applications require deterministic cleanup for both synchronous resources (in-memory buffers, timers) and asynchronous resources (network sockets, database transactions, gRPC channels) without thread blocking.

---

\`\`\`csharp
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;

public class ResilientResourceManager : IDisposable, IAsyncDisposable
{
    // Managed disposable resources
    private Stream? _managedStream;

    // Safe unmanaged wrapper
    private SafeHandle? _safeHandle;

    // Raw unmanaged memory (if any)
    private IntPtr _unmanagedBuffer;

    // Thread-safe disposal tracking (0 = Active, 1 = Disposed)
    private int _disposedState;

    public bool IsDisposed => Volatile.Read(ref _disposedState) != 0;

    public ResilientResourceManager(string filePath)
    {
        _managedStream = new FileStream(filePath, FileMode.OpenOrCreate);
        _unmanagedBuffer = Marshal.AllocHGlobal(1024);
        _safeHandle = File.OpenHandle(filePath);
    }

    // ── Synchronous Disposal (IDisposable) ─────────────────────
    public void Dispose()
    {
        Dispose(disposing: true);
        GC.SuppressFinalize(this); // Remove from Finalization Queue
    }

    protected virtual void Dispose(bool disposing)
    {
        // Thread-safe atomic check to prevent double disposal
        if (Interlocked.Exchange(ref _disposedState, 1) != 0)
            return;

        if (disposing)
        {
            // Free MANAGED objects
            _managedStream?.Dispose();
            _managedStream = null;

            _safeHandle?.Dispose();
            _safeHandle = null;
        }

        // Free RAW UNMANAGED memory (always executed, even from finalizer)
        if (_unmanagedBuffer != IntPtr.Zero)
        {
            Marshal.FreeHGlobal(_unmanagedBuffer);
            _unmanagedBuffer = IntPtr.Zero;
        }
    }

    // ── Asynchronous Disposal (IAsyncDisposable - C# 8+) ──────
    public async ValueTask DisposeAsync()
    {
        // 1. Perform async cleanup
        await DisposeAsyncCore().ConfigureAwait(false);

        // 2. Dispose unmanaged resources (passing false to skip managed objects already cleaned)
        Dispose(disposing: false);

        // 3. Suppress finalization
        GC.SuppressFinalize(this);
    }

    protected virtual async ValueTask DisposeAsyncCore()
    {
        if (Interlocked.Exchange(ref _disposedState, 1) != 0)
            return;

        if (_managedStream != null)
        {
            await _managedStream.DisposeAsync().ConfigureAwait(false);
            _managedStream = null;
        }

        if (_safeHandle != null)
        {
            _safeHandle.Dispose();
            _safeHandle = null;
        }
    }

    // ── Finalizer (Fallback only for raw unmanaged pointers) ───
    ~ResilientResourceManager()
    {
        Dispose(disposing: false);
    }
}
\`\`\`

---

#### Key Design Highlights:
1. **Thread-Safe Idempotency:** \`Interlocked.Exchange(ref _disposedState, 1)\` guarantees that calling \`Dispose()\` multiple times concurrently across threads will execute cleanup logic **exactly once**.
2. **ValueTask Efficiency:** \`ValueTask\` returns synchronously without heap allocation if cleanup completes immediately without yielding.
3. **\`ConfigureAwait(false)\`:** Prevents deadlocks in synchronization contexts.`,
    answerContent_fa: `### پیاده‌سازی کامل الگوی Dispose همگام و ناهمگام در سی‌شارپ

در سیستم‌های مدرن دات‌نت، منابع همگام (استریم‌ها و قفل‌ها) و ناهمگام (کانکشن‌های شبکه و دیتابیس) باید بدون بلاک کردن Threadها آزاد شوند:

#### نکات کلیدی پیاده‌سازی:
۱. **ایمنی در برابر چندنخی (Thread-Safe Idempotency):** استفاده از \`Interlocked.Exchange\` جهت تضمین اینکه فراخوانی همزمان یا مکرر متد \`Dispose\` باعث اجرای چندباره کدهای پاکسازی نشود.
۲. **بهینه‌سازی با \`ValueTask\`:** متد \`DisposeAsync\` از نوع \`ValueTask\` استفاده می‌کند تا در صورت آزادسازی فوری، هیچ آبجکتی روی Heap تخصیص نیابد.
۳. **پشتیبانی از ارث‌بری:** متدهای \`protected virtual void Dispose(bool disposing)\` و \`DisposeAsyncCore\` به کلاس‌های فرزند اجازه می‌دهند منابع خود را به درستی پاکسازی کنند.
۴. **تفکیک منابع Managed و Unmanaged:** منابع Managed فقط زمانی آزاد می‌شوند که \`disposing == true\` باشد، در حالی که حافظه Unmanaged حتی توسط Finalizer نیز آزاد می‌گردد.`,
  },
  {
    id: "dotnet-mid-q232",
    stackId: "dotnet",
    categoryId: "csharp-advanced",
    levelId: "mid",
    topicIds: ["topic-dotnet-csharp-exceptions-idisposable"],
    questionTitle: "What is SafeHandle in .NET, why has it completely replaced writing custom Finalizers (~Destructors) in modern C#, and how does it prevent native resource leaks?",
    questionTitle_fa: "کلاس SafeHandle در دات‌نت چیست، چرا در سی‌شارپ مدرن جایگزین کامل نوشتن Finalizer شده است و چگونه مانع نشت منابع سیستم‌عامل در زمان خطاهای بحرانی نخ‌ها می‌شود؟",
    answerContent: `### SafeHandle vs. Custom Finalizers in Modern .NET

In legacy .NET (1.0/1.1), developers wrapped native operating system pointers using raw \`IntPtr\` and wrote custom Finalizers (\`~Destructor\`). This approach was fraught with critical flaws:

1. **Recycle Race Conditions:** An unmanaged handle could be closed while another thread was actively using it, resulting in operating system handle corruption.
2. **Asynchronous Thread Aborts:** If an asynchronous exception (e.g. \`ThreadAbortException\` or \`OutOfMemoryException\`) occurred between acquiring the handle and assigning it to the \`IntPtr\` field, the native handle leaked permanently.

---

#### What is \`SafeHandle\`? (\`System.Runtime.InteropServices\`)
Introduced in .NET 2.0 and expanded in modern .NET, \`SafeHandle\` is an abstract class inheriting from \`CriticalFinalizerObject\` that encapsulates a native operating system resource handle:

\`\`\`csharp
using Microsoft.Win32.SafeHandles;
using System.Runtime.InteropServices;

public class CustomProcessHandle : SafeHandleZeroOrMinusOneIsInvalid
{
    private CustomProcessHandle() : base(ownsHandle: true) { }

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool CloseHandle(IntPtr handle);

    protected override bool ReleaseHandle()
    {
        // Called automatically in a Constrained Execution Region (CER)
        return CloseHandle(handle);
    }
}
\`\`\`

---

#### Why \`SafeHandle\` Eliminates Custom Finalizers:
1. **Critical Finalization:** Inheriting from \`CriticalFinalizerObject\` guarantees that the CLR JIT-compiles all cleanup code upfront and executes \`ReleaseHandle()\` even during catastrophic runtime events (StackOverflow, OutOfMemory, Thread Aborts).
2. **Reference Counting:** \`SafeHandle\` internally maintains an atomic reference count (\`DangerousAddRef\` / \`DangerousRelease\`), preventing premature handle closure while P/Invoke operations are in-flight.
3. **Zero Boilerplate:** When using \`SafeFileHandle\`, \`SafeWaitHandle\`, or \`SafeProcessHandle\`, your wrapping classes **no longer need custom finalizers (\`~Class()\`) or \`GC.SuppressFinalize\`** because \`SafeHandle\` manages its own critical finalization!`,
    answerContent_fa: `### مزایای SafeHandle نسبت به Finalizerهای سنتی در دات‌نت مدرن

در نسخه‌های اولیه C#، برنامه‌نویسان پوینترهای سیستم‌عامل را در متغیر \`IntPtr\` ذخیره کرده و برای آن Finalizer می‌نوشتند. این کار باعث بروز Race Condition در زمان بازیافت Handleها و نشت منابع در زمان خطاهای OutOfMemory می‌شد.

#### کلاس \`SafeHandle\` چیست؟
کلاس انتزاعی \`SafeHandle\` کپسوله‌ساز استاندارد پوینترهای سیستم‌عامل است که از \`CriticalFinalizerObject\` ارث‌بری می‌کند:

#### مزایای کلیدی SafeHandle:
۱. **تضمین ۱۰۰٪ اجرای پاکسازی (Critical Finalization):** رانتایم تضمین می‌کند که کدهای درون \`ReleaseHandle\` حتی در بدترین شرایط (مانند کمبود رم شدید) اجرا شوند.
۲. **مدیریت شمارش ارجاعات (Reference Counting):** مانع بسته شدن Handle در حین اجرای کدهای P/Invoke در نخ‌های دیگر می‌شود.
۳. **حذف نیاز به نوشتن Finalizer دستی:** کلاس‌های شما با استفاده از \`SafeFileHandle\` یا نمونه‌های استاندارد دیگر، دیگر نیازی به نوشتن مخرب (\`~Class\`) یا مدیریت دستی GC ندارند چون SafeHandle این کار را به صورت امن در سطح سیستم‌عامل انجام می‌دهد.`,
  },
  {
    id: "dotnet-mid-q233",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-controllers-minimal-apis-routing"],
    questionTitle: "How do Minimal APIs work internally in ASP.NET Core (.NET 8/9), and how does RequestDelegateFactory eliminate reflection compared to ControllerActionInvoker?",
    questionTitle_fa: "معماری داخلی Minimal APIs در ASP.NET Core (دات‌نت ۸ و ۹) چگونه است و کلاس RequestDelegateFactory چگونه برخلاف ControllerActionInvoker نیاز به Reflection را در زمان اجرا حذف می‌کند؟",
    answerContent: `### Minimal APIs Architecture vs. ControllerActionInvoker

In traditional ASP.NET Core MVC Controllers, handling an incoming HTTP request is mediated through heavy reflection and runtime discovery:

---

#### 1. Controller Pipeline Overhead (\`ControllerActionInvoker\`):
1. **Controller Discovery:** \`ControllerActionEndpointDataSource\` uses runtime reflection over loaded assemblies to discover classes inheriting from \`ControllerBase\`.
2. **Per-Request Allocation:** \`IControllerFactory\` and \`IControllerActivator\` allocate a new controller instance on the Heap for **every single HTTP request**.
3. **Heavy Constructor DI:** All constructor dependencies are resolved from DI per request, even if the specific invoked action only uses one service.
4. **MVC Filter Pipeline:** Traverses 5 stages of filters (Authorization -> Resource -> Action -> Exception -> Result).
5. **Reflection Invocation:** \`IActionInvoker\` uses reflection or compiled expressions to invoke the action method, boxing primitive return types into \`IActionResult\`.

---

#### 2. Minimal APIs Pipeline (.NET 8/9 \`RequestDelegateFactory\`):
When you register \`app.MapGet("/api/users/{id:guid}", (Guid id, IUserService svc) => ...)\`:
1. **Compilation Phase (RequestDelegateFactory):** The runtime analyzes the endpoint delegate and generates a specialized, strongly-typed **\`RequestDelegate\`** (or Roslyn Source Generator in Native AOT mode).
2. **Direct Route Matching:** The route template is compiled into a high-speed radix tree matching table.
3. **Zero Controller Instantiation:** There is no controller class, no constructor activation, and no \`ControllerContext\`.
4. **Direct Service & Parameter Resolution:** Parameters are mapped directly from \`HttpContext.Request.RouteValues\` and \`HttpContext.RequestServices\`.
5. **Direct Output Writing (\`TypedResults\`):** Writes serialized JSON directly to \`HttpResponse.BodyWriter\` (PipeWriter) with zero intermediate \`ObjectResult\` wrapper allocations.

---

#### Performance Metric Comparison:
- **Throughput:** Minimal APIs achieve up to **35% higher requests/second** compared to MVC Controllers.
- **Memory Allocation:** Up to **4x lower Gen 0 heap allocations** per request.
- **Startup Time & Native AOT:** Minimal APIs support **100% Native AOT compilation**, achieving sub-15ms cold startup times and ultra-low memory footprints in containerized Docker environments.`,
    answerContent_fa: `### کالبدشکافی معماری داخلی Minimal APIs و مقایسه RequestDelegateFactory با ControllerActionInvoker

در معماری سنتی کنترلرها، پردازش درخواست‌های HTTP با سربار سنگین Reflection و تخصیص حافظه همراه است:

#### ۱. سربار پایپ‌لاین کنترلرها:
- **ساخت شیء به ازای هر درخواست:** در هر بار دریافت درخواست، نمونه جدیدی از کلاس کنترلر روی Heap ساخته شده و تمام سرویس‌های تعریف‌شده در Constructor از کانتینر DI فراخوانی می‌شوند (حتی اگر آن متد خاص به آنها نیازی نداشته باشد).
- **فیلترهای پنج‌گانه MVC:** عبور اجباری از پایپ‌لاین فیلترهای Authorization، Resource، Action، Exception و Result.
- **فراخوانی با Reflection:** متد اکشن توسط \`IActionInvoker\` با Reflection اجرا می‌شود.

#### ۲. پایپ‌لاین مدرن Minimal APIs در دات‌نت ۸ و ۹:
- **سورس جنریتور \`RequestDelegateFactory\`:** در زمان بیلد، کد کامپایل‌شده مستقیمی برای استخراج پارامترها از Route/DI و اجرای لامبدا تولید می‌شود.
- **حذف شیء کنترلر:** کلاسی ساخته نمی‌شود و نیازی به سازنده و متادیتای کلاس نیست.
- **نوشتن مستقیم در PipeWriter:** نتایج با \`TypedResults\` مستقیماً روی استریم شبکه نوشته می‌شوند.

#### تفاوت عملکردی:
Minimal APIs تا **۳۵٪ Throughput بالاتری** دارند، مصرف رم آنها تا ۴ برابر کمتر است و به طور کامل از **Native AOT** برای استقرار فوق‌سریع در کانتینرهای Docker پشتیبانی می‌کنند.`,
  },
  {
    id: "dotnet-mid-q234",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-controllers-minimal-apis-routing"],
    questionTitle: "Explain Model Binding parameter sources in ASP.NET Core ([FromBody], [FromRoute], [FromQuery], [FromHeader], [FromServices], [AsParameters]), and how do you implement custom BindAsync and TryParse methods?",
    questionTitle_fa: "منابع مختلف Model Binding در ASP.NET Core ([FromBody]، [FromRoute]، [FromQuery]، [FromHeader]، [FromServices] و [AsParameters]) چگونه کار می‌کنند و متدهای سفارشی BindAsync و TryParse را چگونه پیاده‌سازی کنیم؟",
    answerContent: `### Model Binding Sources & Custom Binding in ASP.NET Core

ASP.NET Core binds incoming HTTP request data to strongly-typed C# parameters using explicit binding source attributes:

---

| Binding Attribute | Source Location | Optimal Use Case |
| :--- | :--- | :--- |
| **\`[FromRoute]\`** | URL Path Segment (\`/api/orders/{id}\`) | Unique resource identifiers (\`id:guid\`, \`slug\`) |
| **\`[FromQuery]\`** | URL Query String (\`?page=1&limit=20\`) | Filtering, pagination, sorting, search queries |
| **\`[FromBody]\`** | HTTP Body JSON stream | Complex mutation DTOs in \`POST\`, \`PUT\`, \`PATCH\` |
| **\`[FromHeader]\`** | HTTP Request Header (\`X-Tenant-ID\`) | Authentication tokens, Correlation IDs, API keys |
| **\`[FromServices]\`** | Dependency Injection Container | Request-scoped services, repositories, loggers |
| **\`[AsParameters]\`** | Aggregates multiple sources into a struct | Encapsulating complex query/route filters into a single DTO |

---

#### 1. Custom Binding with \`TryParse\` (Zero-Allocation Query/Route Parsing)
By implementing \`public static bool TryParse(string? value, IFormatProvider? provider, out T result)\` on your struct, ASP.NET Core automatically binds query strings or route segments without custom model binders:

\`\`\`csharp
public readonly record struct DateRange(DateOnly Start, DateOnly End)
{
    // Binds from "?range=2026-01-01_2026-01-31"
    public static bool TryParse(string? value, IFormatProvider? provider, out DateRange result)
    {
        result = default;
        if (string.IsNullOrWhiteSpace(value)) return false;

        var parts = value.Split('_');
        if (parts.Length == 2 && 
            DateOnly.TryParse(parts[0], provider, out var start) && 
            DateOnly.TryParse(parts[1], provider, out var end) && 
            start <= end)
        {
            result = new DateRange(start, end);
            return true;
        }
        return false;
    }
}

// Minimal API Endpoint:
app.MapGet("/reports", (DateRange range) => TypedResults.Ok($"Report from {range.Start} to {range.End}"));
\`\`\`

---

#### 2. Custom Binding with \`BindAsync\` (Full \`HttpContext\` Access)
For complex parameter resolution requiring header inspection, route parsing, and database lookups:

\`\`\`csharp
public readonly record struct TenantContext(string TenantId, string Region)
{
    public static ValueTask<TenantContext?> BindAsync(HttpContext context, ParameterInfo parameter)
    {
        var tenantId = context.Request.Headers["X-Tenant-ID"].FirstOrDefault();
        if (string.IsNullOrEmpty(tenantId))
        {
            return ValueTask.FromResult<TenantContext?>(null); // Missing tenant
        }

        var region = context.Request.Headers["X-Region"].FirstOrDefault() ?? "US";
        return ValueTask.FromResult<TenantContext?>(new TenantContext(tenantId, region));
    }
}
\`\`\``,
    answerContent_fa: `### منابع Model Binding و پیاده‌سازی متدهای سفارشی BindAsync و TryParse

موتور Model Binding در ASP.NET Core ورودی‌های مختلف درخواست HTTP را به پارامترهای سی‌شارپ مپ می‌کند:

#### منابع پیش‌فرض:
- **\`[FromRoute]\`**: استخراج از سگمنت‌های URL (مانند \`/api/orders/{id}\`).
- **\`[FromQuery]\`**: استخراج از پارامترهای رشته کوئری (مانند \`?page=1&limit=20\`).
- **\`[FromBody]\`**: دیسریالایز کردن بدنه JSON درخواست در متدهای POST و PUT.
- **\`[FromHeader]\`**: خواندن مقادیر هدرها (مانند \`X-Tenant-ID\` یا \`Correlation-Id\`).
- **\`[FromServices]\`**: تزریق سرویس‌ها از کانتینر DI بدون نیاز به constructor.
- **\`[AsParameters]\`**: تجمیع چندین منبع در یک استراکت برای تمیز نگه‌داشتن پارامترهای متد.

#### بایندینگ اختصاصی با \`TryParse\` و \`BindAsync\`:
۱. **متد \`TryParse\`**: با پیاده‌سازی متد استاتیک \`TryParse\` روی یک \`record struct\`، دات‌نت به صورت خودکار مقادیر ارسالی در URL یا Query String را به ساختار مورد نظر پارس می‌کند.
۲. **متد \`BindAsync\`**: امکان دسترسی مستقیم به شیء \`HttpContext\` (مانند هدرها و کانتکست درخواست) را جهت استخراج خودکار DTOهای پیچیده (مانند اطلاعات Tenant یا کاربر احرازشده) فراهم می‌سازد.`,
  },
  {
    id: "dotnet-mid-q235",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-controllers-minimal-apis-routing"],
    questionTitle: "What are Endpoint Filters (IEndpointFilter) in ASP.NET Core, how do they differ from MVC Action Filters, and how do you implement cross-cutting validation pipelines using Route Groups (MapGroup)?",
    questionTitle_fa: "فیلترهای اندپوینت (IEndpointFilter) در ASP.NET Core چه هستند، چه تفاوتی با Action Filters در MVC دارند و چگونه می‌توان یک پایپ‌لاین اعتبارسنجی متمرکز با Route Groups (متد MapGroup) پیاده‌سازی کرد؟",
    answerContent: `### Endpoint Filters (\`IEndpointFilter\`) & Route Groups in ASP.NET Core

Introduced in .NET 7 and optimized in .NET 8/9, **\`IEndpointFilter\`** provides a lightweight, composable interception pipeline for Minimal APIs, replacing heavy MVC Action Filters.

---

| Dimension | MVC Action Filters (\`IActionFilter\`) | Endpoint Filters (\`IEndpointFilter\`) |
| :--- | :--- | :--- |
| **Pipeline Position** | Inside MVC infrastructure (after Controller activation) | Directly around the endpoint execution delegate |
| **Reflection Cost** | High (Inspects ActionDescriptor, ControllerContext) | **Zero (Strongly typed \`EndpointFilterInvocationContext\`)** |
| **Scope** | Controller class or Action method | Individual endpoints or **\`RouteGroupBuilder\`** |
| **Argument Mutation** | Read/write via \`ActionExecutingContext.ActionArguments\` | Direct index-based access via \`context.Arguments\` |
| **Native AOT** | Broken by reflection | **100% Native AOT Compatible** |

---

#### Implementing a Centralized FluentValidation Endpoint Filter:

\`\`\`csharp
public class ValidationFilter<TRequest> : IEndpointFilter where TRequest : class
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context, 
        EndpointFilterDelegate next)
    {
        // Resolve validator from DI container
        var validator = context.HttpContext.RequestServices.GetService<IValidator<TRequest>>();
        if (validator is not null)
        {
            var model = context.Arguments.OfType<TRequest>().FirstOrDefault();
            if (model is not null)
            {
                var validationResult = await validator.ValidateAsync(model, context.HttpContext.RequestAborted);
                if (!validationResult.IsValid)
                {
                    // Short-circuit pipeline and return RFC 7807 ValidationProblemDetails!
                    return TypedResults.ValidationProblem(validationResult.ToDictionary());
                }
            }
        }

        // Proceed to subsequent filters and endpoint handler
        return await next(context);
    }
}
\`\`\`

---

#### Centralized Route Grouping with \`MapGroup\`:
\`\`\`csharp
public static class ProductEndpoints
{
    public static RouteGroupBuilder MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/products")
            .RequireAuthorization("ProductsPolicy")
            .WithTags("Products Management")
            .AddEndpointFilter<PerformanceLoggingFilter>(); // Applied to ALL routes in group!

        group.MapGet("/", GetAllProducts);
        group.MapGet("/{id:guid}", GetProductById);
        group.MapPost("/", CreateProduct).AddEndpointFilter<ValidationFilter<CreateProductRequest>>();

        return group;
    }
}
\`\`\``,
    answerContent_fa: `### فیلترهای اندپوینت (IEndpointFilter) و گروه‌بندی مسیرها با MapGroup

اینترفیس **\`IEndpointFilter\`** جایگزین مدرن، سریع و بهینه‌سازی‌شده برای Action Filterهای سنتی در Minimal APIs است.

#### تفاوت‌های کلیدی با Action Filterهای MVC:
۱. **حذف سربار Reflection:** فیلترهای اندپوینت مستقیماً دور متد هندلر قرار گرفته و نیازی به کانتکست‌های سنگین MVC ندارند.
۲. **سازگاری کامل با Native AOT:** بدون وابستگی به Reflection کامپایل می‌شوند.
3. **پشتیبانی از Route Groups:** قابلیت اعمال شدن به کل یک گروه از اندپوینت‌ها با \`MapGroup\`.

#### پیاده‌سازی پایپ‌لاین اعتبارسنجی با FluentValidation:
فیلتر اعتبارسنجی ورودی‌های متد را بررسی کرده و در صورت نامعتبر بودن داده‌ها، قبل از رسیدن به هندلر اصلی، پایپ‌لاین را متوقف (Short-Circuit) کرده و خطای استاندارد \`ValidationProblemDetails\` برمی‌گرداند.`,
  },
  {
    id: "dotnet-mid-q236",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-controllers-minimal-apis-routing"],
    questionTitle: "What is the difference between returning IResult and TypedResults in Minimal APIs, and why is TypedResults essential for unit testing and OpenAPI/Swagger metadata generation?",
    questionTitle_fa: "تفاوت بازگرداندن IResult با ساختار TypedResults در Minimal APIs چیست و چرا TypedResults برای تست‌های واحد و تولید خودکار متادیتای OpenAPI/Swagger ضروری است؟",
    answerContent: `### IResult vs. TypedResults in ASP.NET Core Minimal APIs

In .NET 6, Minimal APIs returned the untyped \`IResult\` interface (via \`Results.Ok()\`, \`Results.NotFound()\`). .NET 7 introduced **\`TypedResults\`**, which revolutionized static typing, OpenAPI metadata, and unit testability.

---

| Dimension | Legacy \`Results\` (\`IResult\`) | Modern \`TypedResults\` (\`Results<T1, T2, ...>\`) |
| :--- | :--- | :--- |
| **Return Type** | Non-generic \`IResult\` (Opaque object) | Strongly-typed generic struct (e.g. \`Ok<UserDto>\`, \`NotFound\`) |
| **OpenAPI / Swagger** | Requires explicit \`.Produces<UserDto>(200)\` attributes | **Automatic schema inference** with zero annotations |
| **Unit Testability** | Hard to test (must mock HttpContext to inspect body) | **Direct strongly-typed property inspection** (\`res.Result.Value\`) |
| **Memory Allocation** | Heap allocates boxed \`IResult\` objects | **Zero allocation / struct optimizations** |
| **Compile-Time Safety** | No compiler validation on returned types | **Strict compiler-enforced return type unions** |

---

#### 1. Real-World Minimal API with \`TypedResults\` Union:
\`\`\`csharp
app.MapGet("/api/users/{id:guid}", async Task<Results<Ok<UserDto>, NotFound>> (
    Guid id, 
    IUserService userService) =>
{
    var user = await userService.GetByIdAsync(id);
    if (user is null)
    {
        return TypedResults.NotFound();
    }

    return TypedResults.Ok(user);
});
\`\`\`

---

#### 2. Why \`TypedResults\` Makes Unit Testing Effortless:
When testing endpoints returning \`TypedResults\`, you do **NOT need a mock \`HttpContext\`** or in-memory test server (\`WebApplicationFactory\`):

\`\`\`csharp
[Fact]
public async Task GetUser_ReturnsOk_WhenUserExists()
{
    // Arrange
    var mockService = new Mock<IUserService>();
    var userId = Guid.NewGuid();
    mockService.Setup(s => s.GetByIdAsync(userId))
               .ReturnsAsync(new UserDto(userId, "Alice"));

    // Act
    var result = await UserEndpoints.GetUserById(userId, mockService.Object);

    // Assert (Direct strongly-typed casting!)
    var okResult = Assert.IsType<Ok<UserDto>>(result.Result);
    Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
    Assert.Equal("Alice", okResult.Value?.Name);
}
\`\`\``,
    answerContent_fa: `### مقایسه بازگرداندن IResult با ساختار TypedResults در Minimal APIs

در نسخه‌های اولیه Minimal APIs، متدها اینترفیس عمومی \`IResult\` (با \`Results.Ok\`) را برمی‌گرداندند. با معرفی **\`TypedResults\`**، بهبودهای شگرفی در تست‌پذیری و OpenAPI ایجاد شد:

#### مزایای کلیدی TypedResults:
۱. **تولید خودکار متادیتای Swagger / OpenAPI:** نیازی به نوشتن اتریبیوت‌های \`[ProducesResponseType]\` نیست؛ کامپایلر دات‌نت نوع پاسخ‌ها و کدهای وضعیت (Status Codes) را به صورت خودکار برای Swagger استخراج می‌کند.
۲. **تست‌پذیری فوق‌العاده ساده (Unit Testing):** برای بررسی خروجی در تست‌های xUnit نیازی به شبیه‌سازی \`HttpContext\` نیست؛ می‌توان مستقیماً مقدار \`okResult.Value\` را کست کرده و داده‌ها را بررسی کرد.
۳. **امنیت نوع داده در زمان کامپایل (Compile-Time Safety):** با استفاده از ساختار \`Results<Ok<T>, NotFound>\`، کامپایلر مانع بازگرداندن مقادیر تعریف‌نشده می‌شود.`,
  },
  {
    id: "dotnet-mid-q237",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-controllers-minimal-apis-routing"],
    questionTitle: "What is the REPR (Request-Endpoint-Response) Pattern in Vertical Slice Architecture, and how does FastEndpoints solve the Fat Controller anti-pattern in enterprise .NET APIs?",
    questionTitle_fa: "الگوی REPR (Request-Endpoint-Response) در معماری برش عمودی (Vertical Slice) چیست و کتابخانه FastEndpoints چگونه مشکل کنترلرهای حجیم (Fat Controllers) را در سیستم‌های سازمانی دات‌نت حل می‌کند؟",
    answerContent: `### The REPR Pattern & FastEndpoints in Modern .NET

In traditional N-Layer / Onion architectures with MVC Controllers, applications suffer from the **Fat Controller Anti-Pattern**: a single \`OrdersController\` aggregates 20+ unrelated endpoints with a bloated constructor holding a dozen injected services.

---

#### 1. What is the REPR (Request-Endpoint-Response) Pattern?
The REPR pattern is the foundation of **Vertical Slice Architecture**. It states that an HTTP API is composed of independent, decoupled slices:
- **Request (DTO):** The strongly-typed input contract.
- **Endpoint (Handler):** The single-responsibility processing class.
- **Response (DTO):** The strongly-typed output contract.

**Core Rule:** **One Class = One Endpoint = Single Responsibility (SRP).**

---

#### 2. How FastEndpoints Implements REPR:
\`\`\`csharp
using FastEndpoints;

public record CreateOrderRequest(Guid CustomerId, List<OrderItemDto> Items);
public record CreateOrderResponse(Guid OrderId, decimal TotalAmount);

public class CreateOrderEndpoint : Endpoint<CreateOrderRequest, CreateOrderResponse>
{
    private readonly IOrderRepository _repository;
    private readonly IPaymentService _payment;

    // Only injects what THIS SPECIFIC ENDPOINT needs!
    public CreateOrderEndpoint(IOrderRepository repository, IPaymentService payment)
    {
        _repository = repository;
        _payment = payment;
    }

    public override void Configure()
    {
        Post("/api/v1/orders");
        AllowAnonymous();
        Description(b => b
            .Produces<CreateOrderResponse>(StatusCodes.Status201Created)
            .ProducesProblemDetails(StatusCodes.Status400BadRequest));
    }

    public override async Task HandleAsync(CreateOrderRequest req, CancellationToken ct)
    {
        var order = new Order(req.CustomerId, req.Items);
        await _repository.SaveAsync(order, ct);

        await SendCreatedAtAsync<GetOrderByIdEndpoint>(
            new { id = order.Id }, 
            new CreateOrderResponse(order.Id, order.TotalAmount), 
            cancellation: ct);
    }
}
\`\`\`

---

#### Why FastEndpoints Outperforms Controllers + MediatR:
1. **Eliminates MediatR Boilerplate:** In Controller + MediatR architectures, developers write a Controller Action -> MediatR Command -> Command Handler -> DTO (4 files!). FastEndpoints collapses this into a single cohesive slice.
2. **Zero Reflection:** FastEndpoints generates source delegates at compile time, achieving performance comparable to raw Minimal APIs while maintaining clean file organization.`,
    answerContent_fa: `### الگوی REPR (Request-Endpoint-Response) و کاربرد FastEndpoints در معماری Vertical Slice

در معماری‌های سنتی، کنترلرها به کلاس‌های حجیم با تزریق‌های پرتعداد وابستگی در Constructor (معروف به Fat Controller Anti-Pattern) تبدیل می‌شوند که نگهداری و تست کدها را دشوار می‌سازد.

#### الگوی REPR چیست؟
الگوی **Request-Endpoint-Response** پایه معماری برش عمودی (Vertical Slice Architecture) است که در آن هر درخواست HTTP به صورت یک برش کاملاً مستقل پیاده‌سازی می‌شود:
- **Request:** مدل ورودی داده‌ها (DTO ورودی).
- **Endpoint:** کلاسی با تنها یک وظیفه جهت پردازش درخواست (Single Responsibility).
- **Response:** مدل خروجی داده‌ها (DTO خروجی).

#### مزایای FastEndpoints:
۱. **حذف کدهای زائد MediatR:** در ترکیب Controller + MediatR برای یک عملیات ساده به ۴ فایل مجزا (کنترلر، کامند، هندلر، پاسخ) نیاز است، در حالی که FastEndpoints تمام این فرآیند را در یک کلاس منسجم کپسوله می‌کند.
۲. **کارایی فوق‌العاده بالا:** بر خلاف کنترلرها از Reflection استفاده نکرده و سرعتی معادل Minimal APIs به همراه ساختاربندی بسیار تمیز در پروژه‌های سازمانی بزرگ فراهم می‌سازد.`,
  },
  {
    id: "dotnet-mid-q238",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-dependency-injection-lifetimes"],
    questionTitle: "Explain the internal mechanics of the three DI lifetimes in ASP.NET Core (Transient, Scoped, Singleton), and how the IoC container manages instantiation, caching, and disposal.",
    questionTitle_fa: "سازوکار داخلی سه طول عمر تزریق وابستگی در ASP.NET Core (شامل Transient، Scoped و Singleton) چگونه است و کانتینر DI چگونه نمونه‌سازی، کشینگ و آزادسازی حافظه آنها را مدیریت می‌کند؟",
    answerContent: `### Internal Mechanics of ASP.NET Core DI Lifetimes

The built-in IoC container (\`Microsoft.Extensions.DependencyInjection\`) manages object lifecycle, caching, and deterministic disposal through three distinct lifetime registrations:

---

#### 1. Transient (\`AddTransient<TService, TImplementation>()\`):
- **Instantiation:** A new instance is created on **every single callsite resolution** (\`sp.GetService<T>()\` or constructor parameter).
- **Caching:** The container **never caches** the instance.
- **Disposal:** If the transient instance implements \`IDisposable\` or \`IAsyncDisposable\`, the enclosing \`IServiceScope\` tracks it in its internal \`_disposables\` list. When that scope is disposed, the container disposes the transient object.
- **Optimal For:** Lightweight, stateless services (formatters, mathematical calculators, command validators).

---

#### 2. Scoped (\`AddScoped<TService, TImplementation>()\`):
- **Instantiation:** Created **once per \`IServiceScope\`** (typically mapped 1-to-1 to an incoming HTTP request).
- **Caching:** Cached in the local scope's \`_resolvedServices\` dictionary. Subsequent requests for the same service within the same HTTP request receive the identical instance.
- **Disposal:** Automatically and deterministically disposed when the HTTP request ends and \`HttpContext.RequestServices\` (the scope) is disposed.
- **Optimal For:** Stateful services tied to a single request lifecycle (e.g., EF Core \`DbContext\`, \`IUnitOfWork\`, \`TenantContext\`, \`ICurrentUser\`).

---

#### 3. Singleton (\`AddSingleton<TService, TImplementation>()\`):
- **Instantiation:** Created **lazily on the first request** (or upfront during \`Program.cs\` startup) in the **Root ServiceProvider**.
- **Caching:** Cached permanently in the Root Provider's thread-safe cache across the entire application runtime.
- **Disposal:** Disposed only when the application host performs a graceful shutdown.
- **Mandatory Requirement:** Singletons **must be strictly thread-safe** because dozens or hundreds of concurrent HTTP requests will access the exact same instance simultaneously.
- **Optimal For:** Heavy stateless engines, shared caches (\`IMemoryCache\`), configuration options, and \`HttpClient\` instances.`,
    answerContent_fa: `### کالبدشکافی سازوکار داخلی طول عمرهای سه‌گانه تزریق وابستگی در دات‌نت

کانتینر توکار دات‌نت مدیریت چرخه حیات، کشینگ و آزادسازی منابع را در سه قالب اصلی کنترل می‌کند:

#### ۱. طول عمر Transient:
- **نحوه ساخت:** با هر بار درخواست یا تزریق در سازنده، یک نمونه کاملاً جدید ساخته می‌شود.
- **کشینگ:** کانتینر هیچ کشی برای آن نگه نمی‌دارد.
- **آزادسازی:** در صورت داشتن \`IDisposable\`، با نابودی اسکوپ فراخواننده آزاد می‌شود.
- **کاربرد:** سرویس‌های سبک و بدون وضعیت (مانند فرمت‌کننده‌ها و ولیدیتورها).

#### ۲. طول عمر Scoped:
- **نحوه ساخت:** در طول یک اسکوپ (مانند یک درخواست وب HTTP) تنها یک‌بار ساخته می‌شود.
- **کشینگ:** درون دیکشنری اسکوپ جاری کش شده و در تمام متدهای همان Request به اشتراک گذاشته می‌شود.
- **آزادسازی:** در انتهای درخواست HTTP به صورت قطعی Dispose می‌شود.
- **کاربرد:** سرویس‌های دارای وضعیت در طول درخواست (مانند \`DbContext\` و \`TenantContext\`).

#### ۳. طول عمر Singleton:
- **نحوه ساخت:** در اولین درخواست در کانتینر ریشه (Root) ساخته شده و تا پایان عمر برنامه زنده می‌ماند.
- **کشینگ:** به صورت دائمی در کانتینر ریشه کش می‌شود.
- **نکته حیاتی:** پیاده‌سازی آن باید کاملاً **Thread-Safe** باشد چون تمام نخ‌های موازی سرور همزمان به آن دسترسی دارند.`,
  },
  {
    id: "dotnet-mid-q239",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-dependency-injection-lifetimes"],
    questionTitle: "What is a Captive Dependency in .NET Dependency Injection, what catastrophic runtime errors does it cause (e.g. DbContext multi-threading crashes & memory leaks), and how do you configure automated scope validation?",
    questionTitle_fa: "خطای وابستگی به دام افتاده (Captive Dependency) در دات‌نت چیست، چه خطاهای فاجعه‌باری در زمان اجرا پدید می‌آورد (مانند کرش‌های چندنخی DbContext و نشت رم) و اعتبارسنجی خودکار اسکوپ‌ها چگونه تنظیم می‌شود؟",
    answerContent: `### Captive Dependencies & Automated Scope Validation in .NET

A **Captive Dependency** occurs when a service with a longer lifetime captures a service with a shorter lifetime as a constructor dependency.

The classic disaster occurs when a **Singleton** captures a **Scoped service** (such as EF Core's \`DbContext\`):

---

\`\`\`csharp
// DANGEROUS ANTI-PATTERN:
public class SingletonAnalyticsEngine
{
    private readonly AppDbContext _db; // Scoped DbContext trapped inside a Singleton!

    public SingletonAnalyticsEngine(AppDbContext db)
    {
        _db = db;
    }

    public async Task ProcessEventAsync(EventDto dto)
    {
        _db.Events.Add(new Event(dto));
        await _db.SaveChangesAsync();
    }
}
\`\`\`

---

#### Catastrophic Production Failures Caused by Captive DbContext:
1. **Multi-Threaded Concurrency Crashes:**
   - EF Core's \`DbContext\` is **NOT thread-safe**.
   - When multiple HTTP requests concurrently invoke \`ProcessEventAsync\`, threads collide on the shared context, crashing with:
     \`\`\`text
     System.InvalidOperationException: A second operation was started on this context instance before a previous operation completed. This is usually caused by different threads concurrently using the same instance of DbContext.
     \`\`\`
2. **Memory Leak via ChangeTracker:**
   - The \`DbContext\` instance is never disposed. Its internal \`ChangeTracker\` accumulates every tracked entity indefinitely, leading to gigabytes of leaked heap RAM.
3. **Stale Data Corruption:**
   - Cached entity snapshots in the first-level cache are never refreshed, serving stale, outdated data to all users.

---

#### Enabling Automated Scope Validation:
By default, ASP.NET Core validates scopes **ONLY in the Development environment**. In Production, Captive Dependencies pass silently unless explicitly enforced:

\`\`\`csharp
var builder = WebApplication.CreateBuilder(args);

builder.Host.UseDefaultServiceProvider((context, options) =>
{
    // Throws InvalidOperationException at startup if a Singleton captures a Scoped service:
    options.ValidateScopes = true;

    // Validates that all registered service dependency trees can be resolved on build:
    options.ValidateOnBuild = true;
});
\`\`\``,
    answerContent_fa: `### خطای وابستگی به دام افتاده (Captive Dependency) و اعتبارسنجی اسکوپ‌ها در دات‌نت

باگ **Captive Dependency** زمانی رخ می‌دهد که یک سرویس با طول عمر طولانی‌تر (مانند Singleton) یک سرویس با طول عمر کوتاه‌تر (مانند Scoped) را در Constructor خود تزریق کند.

#### خطرات فاجعه‌بار تزریق DbContext در Singleton:
۱. **کرش‌های همزمانی چندنخی (Multi-Threaded Crash):** کلاس \`DbContext\` در EF Core ذیل هیچ شرایطی Thread-Safe نیست. با ورود درخواست‌های همزمان، خطای \`InvalidOperationException\` پرتاب شده و درخواست‌ها فیل می‌شوند.
۲. **نشت حافظه RAM:** چون شیء DbContext هیچ‌گاه Dispose نمی‌شود، کش داخلی \`ChangeTracker\` آن تمام انتیتی‌ها را تا ابد در حافظه نگه داشته و باعث بالا رفتن مصرف رم سرور می‌شود.
۳. **داده‌های قدیمی و نامعتبر (Stale Data):** تغییرات دیتابیس در کش محلی منعکس نشده و دیتای بیات به کاربران نمایش داده می‌شود.

#### فعال‌سازی اعتبارسنجی خودکار (ValidateScopes):
قابلیت \`ValidateScopes\` به صورت پیش‌فرض فقط در محیط Development فعال است. برای جلوگیری از بروز باگ در محیط Production، باید با تنظیم \`options.ValidateScopes = true\` در فایل \`Program.cs\` اعتبارسنجی اجباری را فعال کرد.`,
  },
  {
    id: "dotnet-mid-q240",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-dependency-injection-lifetimes"],
    questionTitle: "Why does resolving Transient services that implement IDisposable from the Root ServiceProvider cause a silent memory leak, and how does the container's internal _disposables tracking list work?",
    questionTitle_fa: "چرا فراخوانی سرویس‌های Transient دارای IDisposable از کانتینر ریشه (Root ServiceProvider) باعث نشت حافظه خاموش می‌شود و لیست داخلی _disposables در کانتینر چگونه کار می‌کند؟",
    answerContent: `### The Transient IDisposable Root Memory Leak

In .NET Dependency Injection, the IoC container strictly adheres to the principle: **"Whoever creates a disposable object is responsible for disposing it."**

When the container instantiates any service that implements \`IDisposable\` or \`IAsyncDisposable\`, it retains a strong GC reference to that instance in an internal collection:
\`\`\`csharp
// Conceptual representation inside Microsoft.Extensions.DependencyInjection.ServiceProviderEngineScope:
private readonly List<object> _disposables = new();
\`\`\`

---

#### How the Silent Leak Occurs:
\`\`\`csharp
builder.Services.AddTransient<HeavyDataExporter>(); // Implements IDisposable
var app = builder.Build();

// ANTI-PATTERN: Resolving directly from app.Services (The Root Provider)
app.MapGet("/download", (IServiceProvider rootProvider) =>
{
    // The Root Container instantiates HeavyDataExporter AND adds it to rootProvider._disposables
    using var exporter = rootProvider.GetRequiredService<HeavyDataExporter>();
    exporter.Export();
    
    // Even though 'using' called exporter.Dispose(), the ROOT CONTAINER still holds
    // a strong reference in its _disposables list!
    // The Garbage Collector CANNOT reclaim this memory because RootProvider is alive for the entire app lifetime!
});
\`\`\`

---

#### The Consequence:
If the endpoint receives 100,000 requests per day:
- 100,000 dead instances remain rooted in the Root Provider's \`_disposables\` list.
- Generation 2 Heap memory continuously balloons until the process crashes with \`OutOfMemoryException\`.

---

#### The Solution:
1. **Always resolve within an HTTP Scope:** Minimal API endpoints and Controller actions automatically execute inside a request-scoped \`IServiceScope\`. Injected parameters are tracked in that temporary scope and garbage collected immediately when the request terminates.
2. **Never call \`app.Services.GetRequiredService<T>()\`** for transient disposable services during request handling.`,
    answerContent_fa: `### نشت حافظه ناشی از فراخوانی Transientهای یکبارمصرف (IDisposable) از کانتینر ریشه

کانتینر دات‌نت بر اساس این اصل عمل می‌کند: *"هر کانتینری که یک شیء Disposable را بسازد، موظف است ارجاع آن را تا زمان Dispose خود نگه دارد."*

#### سازوکار نشت حافظه:
- هنگام ساخت یک شیء دارای \`IDisposable\`، کانتینر اشاره‌گر آن را در لیست داخلی \`_disposables\` ثبت می‌کند.
- اگر این شیء مستقیماً از کانتینر ریشه (\`app.Services\`) صدا زده شود، چون کانتینر ریشه تا زمان خاموش شدن کل سرور زنده است، لیست \`_disposables\` آن با هر درخواست وب رشد کرده و مانع جمع‌آوری زباله (Garbage Collection) می‌شود.
- در نتیجه، حتی با فراخوانی دستی \`Dispose()\`، حافظه RAM هرگز آزاد نشده و سرور پس از مدتی با خطای **OutOfMemoryException** کرش می‌کند.

#### راهکار:
سرویس‌های Transient یکبارمصرف را همیشه از طریق تزریق در پارامترهای اندپوینت (که درون اسکوپ موقت همان Request اجرا می‌شوند) فراخوانی کنید و هرگز از \`app.Services\` در طول پردازش درخواست‌ها استفاده نکنید.`,
  },
  {
    id: "dotnet-mid-q241",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-dependency-injection-lifetimes"],
    questionTitle: "How do you consume Scoped services (like EF Core DbContext) safely inside a Singleton BackgroundService or IHostedService using IServiceScopeFactory in modern .NET?",
    questionTitle_fa: "چگونه در یک BackgroundService یا IHostedService که به صورت Singleton ثبت شده است، از سرویس‌های Scoped (مانند DbContext) با استفاده از IServiceScopeFactory به شکلی ایمن استفاده کنیم؟",
    answerContent: `### Consuming Scoped Services Safely in BackgroundService

In ASP.NET Core, \`BackgroundService\` and \`IHostedService\` implementations are registered as **Singletons** by the framework. Injecting a Scoped dependency (such as EF Core \`DbContext\` or \`IUserRepository\`) directly into the constructor throws a scope validation exception or creates a catastrophic captive dependency.

---

#### The Modern Standard Pattern (.NET 8/9 \`CreateAsyncScope\`):

\`\`\`csharp
public class QueueProcessingWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<QueueProcessingWorker> _logger;

    // Inject IServiceScopeFactory into the Singleton constructor:
    public QueueProcessingWorker(
        IServiceScopeFactory scopeFactory,
        ILogger<QueueProcessingWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // 1. Create an explicit asynchronous scope per work unit:
                await using (var scope = _scopeFactory.CreateAsyncScope())
                {
                    // 2. Resolve scoped dependencies inside the scope:
                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    var messageQueue = scope.ServiceProvider.GetRequiredService<IMessageQueueService>();

                    var pendingItem = await messageQueue.DequeueAsync(stoppingToken);
                    if (pendingItem is not null)
                    {
                        dbContext.AuditLogs.Add(new AuditLog(pendingItem));
                        await dbContext.SaveChangesAsync(stoppingToken);
                    }
                } // 3. Scope disposed here: DbContext connection and memory cleanly released!
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred processing queue item");
            }

            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }
}
\`\`\`

---

#### Why \`CreateAsyncScope()\` Outperforms \`CreateScope()\`:
In .NET 8/9, \`CreateAsyncScope()\` returns an \`AsyncServiceScope\` struct. When combined with \`await using\`, it properly awaits asynchronous disposables (\`IAsyncDisposable\`) such as database connections, network sockets, and file streams without blocking the thread pool!`,
    answerContent_fa: `### نحوه استفاده ایمن از سرویس‌های Scoped در BackgroundService با IServiceScopeFactory

سرویس‌های پس‌زمینه (\`BackgroundService\` و \`IHostedService\`) به صورت **Singleton** در دات‌نت اجرا می‌شوند؛ بنابراین نمی‌توان سرویس‌های Scoped مانند \`DbContext\` را مستقیماً در سازنده آنها تزریق کرد.

#### الگوی استاندارد پیاده‌سازی:
۱. **تزریق \`IServiceScopeFactory\` در سازنده:** این کارخانه وظیفه ایجاد اسکوپ‌های مجزا را بر عهده دارد.
۲. **ساخت اسکوپ با \`CreateAsyncScope\`:** در هر چرخه کاری، یک اسکوپ موقت ساخته می‌شود.
۳. **فراخوانی سرویس‌ها از درون اسکوپ:** سرویس \`DbContext\` از \`scope.ServiceProvider\` دریافت شده و پردازش انجام می‌گیرد.
۴. **آزادسازی با \`await using\`:** با پایان یافتن بلاک، اسکوپ و تمام کانکشن‌های دیتابیس به صورت کاملاً غیرمسدودکننده (Non-blocking) آزاد می‌شوند.`,
  },
  {
    id: "dotnet-mid-q242",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-dependency-injection-lifetimes"],
    questionTitle: "What are Keyed Services in .NET 8 and .NET 9, how do you register and inject multiple implementations using [FromKeyedServices], and when should you use IKeyedServiceProvider?",
    questionTitle_fa: "قابلیت Keyed Services در دات‌نت ۸ و ۹ چیست، چگونه چندین پیاده‌سازی از یک اینترفیس را با [FromKeyedServices] تزریق کنیم و در چه مواردی باید از IKeyedServiceProvider استفاده شود؟",
    answerContent: `### Keyed Services in .NET 8 and .NET 9

Prior to .NET 8, registering multiple implementations of the same interface required custom factory delegates or third-party IoC containers like Autofac. 

.NET 8 introduced **Native Keyed Services** directly into \`Microsoft.Extensions.DependencyInjection\`.

---

#### 1. Registering Keyed Services:
You can register keyed services using any lifetime (\`KeyedSingleton\`, \`KeyedScoped\`, \`KeyedTransient\`):

\`\`\`csharp
// Register different storage implementations with unique keys:
builder.Services.AddKeyedSingleton<IStorageService, S3StorageService>("s3");
builder.Services.AddKeyedSingleton<IStorageService, AzureBlobStorageService>("azure");
builder.Services.AddKeyedSingleton<IStorageService, LocalDiskStorageService>("local");
\`\`\`

---

#### 2. Static Constructor & Parameter Injection:
Use the \`[FromKeyedServices(key)]\` attribute on constructor parameters or Minimal API endpoint handlers:

\`\`\`csharp
public class DocumentManager(
    [FromKeyedServices("s3")] IStorageService primaryStorage,
    [FromKeyedServices("local")] IStorageService backupStorage)
{
    public async Task SaveDocumentAsync(byte[] data)
    {
        await primaryStorage.UploadAsync(data);
    }
}

// In Minimal APIs:
app.MapPost("/upload/{provider}", (
    [FromKeyedServices("s3")] IStorageService s3,
    IFormFile file) =>
{
    // ...
});
\`\`\`

---

#### 3. Dynamic Key Resolution with \`IKeyedServiceProvider\`:
When the target implementation depends on runtime user input (e.g. request parameters or dynamic configuration):

\`\`\`csharp
public class StorageFactory(IKeyedServiceProvider serviceProvider)
{
    public IStorageService GetProvider(string providerName)
    {
        return serviceProvider.GetKeyedService<IStorageService>(providerName)
            ?? throw new InvalidOperationException($"Storage provider '{providerName}' is not registered.");
    }
}
\`\`\``,
    answerContent_fa: `### قابلیت Keyed Services در دات‌نت ۸ و ۹

در نسخه‌های قبلی دات‌نت، ثبت و تزریق چندین پیاده‌سازی از یک اینترفیس مستلزم نوشتن Factoryهای دستی یا استفاده از کانتینرهای جانبی مانند Autofac بود. دات‌نت ۸ این قابلیت را به صورت توکار اضافه کرده است.

#### ۱. ثبت سرویس‌ها با کلید:
با متدهایی مانند \`AddKeyedSingleton\`، \`AddKeyedScoped\` و \`AddKeyedTransient\` می‌توان پیاده‌سازی‌های مختلف را با کلیدهای یکتا ثبت کرد.

#### ۲. تزریق ایستا با اتریبیوت \`[FromKeyedServices]\`:
با قرار دادن این اتریبیوت روی پارامترهای سازنده یا اندپوینت‌ها، دات‌نت به طور خودکار نمونه متناظر با آن کلید را تزریق می‌کند.

#### ۳. دریافت پویا با \`IKeyedServiceProvider\`:
در مواردی که انتخاب پیاده‌سازی به پارامترهای ارسالی کاربر در زمان اجرا وابسته است، اینترفیس \`IKeyedServiceProvider\` امکان واکشی داینامیک سرویس بر اساس کلید متنی را با متد \`GetKeyedService<T>(key)\` فراهم می‌سازد.`,
  },
  {
    id: "dotnet-mid-q243",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-middleware-pipeline-filters"],
    questionTitle: "How does the ASP.NET Core Middleware Russian Doll pipeline execute under the hood, and what is the exact order of mandatory middleware (UseExceptionHandler, UseRouting, UseCors, UseAuthentication, UseAuthorization)?",
    questionTitle_fa: "خط لوله میدل‌ویرهای ASP.NET Core بر اساس مدل عروسک روسی (Russian Doll) چگونه در سطح رانتایم اجرا می‌شود و ترتیب دقیق چینش میدل‌ویرهای حیاتی (شامل UseExceptionHandler، UseRouting، UseCors، UseAuthentication و UseAuthorization) چیست؟",
    answerContent: `### Middleware Pipeline Architecture & Critical Ordering

In ASP.NET Core, the HTTP request processing pipeline is constructed as a chain of nested delegates (\`RequestDelegate\`), known as the **Russian Doll (Matryoshka) Model**.

---

#### 1. Bidirectional Execution Mechanics:
- **Inbound Phase (Pre-Processing):** As the request enters, each middleware executes code **before** calling \`await next(context)\`.
- **Terminal Invocation:** The innermost component (the matched Controller action or Minimal API lambda) processes the request and generates the response payload.
- **Outbound Phase (Post-Processing):** Once the inner delegate completes, execution unwinds in **reverse order**, allowing outer middleware to execute cleanup or metrics logic **after** \`await next(context)\`.

---

#### 2. The Mandatory Middleware Ordering in \`Program.cs\`:

\`\`\`csharp
var app = builder.Build();

// 1. GLOBAL EXCEPTION HANDLER (Must be FIRST to catch ALL downstream exceptions)
app.UseExceptionHandler();

// 2. PROTOCOL SECURITY
app.UseHsts();
app.UseHttpsRedirection();

// 3. STATIC FILES (Short-circuits static assets without routing or auth overhead)
app.UseStaticFiles();

// 4. ROUTING (Parses URL and attaches Endpoint metadata to HttpContext)
app.UseRouting();

// 5. CORS (CRITICAL: Must be AFTER UseRouting and BEFORE UseAuthentication/UseAuthorization!)
// Reason: Needs Endpoint metadata to know which CORS policy applies, but must allow
// unauthenticated HTTP OPTIONS preflight requests to succeed!
app.UseCors("AllowFrontendOrigins");

// 6. AUTHENTICATION (Validates token/cookie and creates ClaimsPrincipal)
app.UseAuthentication();

// 7. AUTHORIZATION (Evaluates role/policy permissions against ClaimsPrincipal)
app.UseAuthorization();

// 8. RATE LIMITING
app.UseRateLimiter();

// 9. ENDPOINT EXECUTION
app.MapControllers();
app.MapGroup("/api/v1").MapOrderEndpoints();
\`\`\`

---

#### The #1 Production Mistake: Misplacing \`UseCors\`
- If \`UseCors\` is placed **BEFORE \`UseRouting\`**, it cannot evaluate endpoint-specific CORS policies (\`[EnableCors("SpecificPolicy")]\`).
- If \`UseCors\` is placed **AFTER \`UseAuthorization\`**, browser preflight \`OPTIONS\` requests (which lack authorization headers) will be rejected with HTTP 401 Unauthorized before CORS headers can be attached!`,
    answerContent_fa: `### کالبدشکافی معماری خط لوله میدل‌ویرها و ترتیب حیاتی چینش در دات‌نت

خط لوله پردازش درخواست در ASP.NET Core بر اساس الگوی **عروسک روسی (Russian Doll)** پیاده‌سازی شده است:

#### ۱. سازوکار اجرای دوطرفه:
- **فاز رفت (Inbound):** کدهای قبل از دستور \`await next(context)\` به ترتیب ثبت اجرا می‌شوند.
- **اجرای اندپوینت نهایی:** هندلر اصلی اجرا شده و بدنه پاسخ را تولید می‌کند.
- **فاز برگشت (Outbound):** کدهای پس از دستور \`await next(context)\` به ترتیب معکوس بازگشته و اجرا می‌شوند.

#### ۲. ترتیب الزامی و حیاتی میدل‌ویرها:
۱. **\`UseExceptionHandler\`**: در ابتدای خط لوله جهت به دام انداختن تمامی خطاهای لایه‌های پایین‌دست.
۲. **\`UseHttpsRedirection\` و \`UseHsts\`**: ارتقای پروتکل امنیتی شبکه.
۳. **\`UseStaticFiles\`**: تحویل مستقیم فایل‌های ثابت بدون تحمیل سربار احراز هویت یا روتینگ.
۴. **\`UseRouting\`**: شناسایی اندپوینت و ثبت متادیتای روت در \`HttpContext\`.
۵. **\`UseCors\` (بسیار مهم)**: **حتماً بعد از UseRouting و قبل از UseAuthentication/Authorization** قرار گیرد تا درخواست‌های Preflight (متد OPTIONS) قبل از احراز هویت تایید شده و هدرهای CORS دریافت شوند.
۶. **\`UseAuthentication\`**: استخراج هویت کاربر (\`ClaimsPrincipal\`).
۷. **\`UseAuthorization\`**: ارزیابی دسترسی‌ها و پالیسی‌ها.
۸. **\`MapControllers / MapGroup\`**: اجرای کد نهایی متد.`,
  },
  {
    id: "dotnet-mid-q244",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-middleware-pipeline-filters"],
    questionTitle: "What are the critical architectural differences between Conventional Middleware and Factory-Activated Middleware (IMiddleware), especially regarding DI lifetimes and Scoped service injection?",
    questionTitle_fa: "تفاوت‌های بنیادین معماری میان میدل‌ویرهای مرسوم (Conventional) و Factory-Activated (اینترفیس IMiddleware) به ویژه از نظر طول عمر کانتینر DI و تزریق سرویس‌های Scoped چیست؟",
    answerContent: `### Conventional Middleware vs. Factory-Activated Middleware (\`IMiddleware\`)

ASP.NET Core provides two architectural approaches for creating custom middleware classes:

---

| Feature | Conventional Middleware | Factory-Activated Middleware (\`IMiddleware\`) |
| :--- | :--- | :--- |
| **Interface Requirement** | None (Duck-typing: requires \`InvokeAsync\`) | Implements \`IMiddleware\` |
| **Instantiation Lifetime** | **Singleton** (Created once at application startup) | **Scoped** or **Transient** (Configured in DI) |
| **\`RequestDelegate next\`** | Injected once into the **Constructor** | Passed as an argument to **\`InvokeAsync(context, next)\`** |
| **Scoped Service Injection** | **MUST be passed as parameters to \`InvokeAsync\`** | Can be injected **directly into the Constructor** |
| **DI Registration** | Optional (Registered directly in pipeline via reflection) | **Mandatory** (\`builder.Services.AddScoped<MyMiddleware>()\`) |
| **Performance** | Calls \`InvokeAsync\` via compiled expression | Calls \`IMiddleware.InvokeAsync\` with zero reflection |

---

#### 1. Conventional Middleware (Singleton Lifetime):
\`\`\`csharp
public class RequestPerformanceMiddleware
{
    private readonly RequestDelegate _next; // Stored as Singleton field

    public RequestPerformanceMiddleware(RequestDelegate next) => _next = next;

    // Scoped services (e.g., DbContext) MUST be injected here, NEVER in constructor!
    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        var sw = Stopwatch.StartNew();
        await _next(context);
        sw.Stop();

        dbContext.Metrics.Add(new Metric(context.Request.Path, sw.ElapsedMilliseconds));
        await dbContext.SaveChangesAsync();
    }
}
\`\`\`

---

#### 2. Factory-Activated Middleware (\`IMiddleware\`):
\`\`\`csharp
public class MultiTenantResolutionMiddleware : IMiddleware
{
    private readonly ITenantContext _tenantContext; // Scoped dependency injected into constructor!

    public MultiTenantResolutionMiddleware(ITenantContext tenantContext)
    {
        _tenantContext = tenantContext;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var tenantHeader = context.Request.Headers["X-Tenant-ID"].FirstOrDefault();
        if (string.IsNullOrEmpty(tenantHeader))
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsync("Missing X-Tenant-ID header.");
            return; // Short-circuit
        }

        _tenantContext.Initialize(tenantHeader);
        await next(context); // Proceed
    }
}

// In Program.cs:
builder.Services.AddScoped<MultiTenantResolutionMiddleware>(); // Explicit DI registration
app.UseMiddleware<MultiTenantResolutionMiddleware>();
\`\`\``,
    answerContent_fa: `### مقایسه میدل‌ویرهای مرسوم (Conventional) و Factory-Activated (اینترفیس IMiddleware)

در ASP.NET Core دو رویکرد متفاوت برای ساخت میدل‌ویرهای سفارشی وجود دارد:

#### ۱. میدل‌ویرهای مرسوم (Conventional Middleware):
- **طول عمر Singleton:** در زمان استارتاپ برنامه فقط یک‌بار ساخته می‌شوند.
- **تزریق شیء \`RequestDelegate next\` در Constructor:** به دلیل طول عمر تکین، نباید سرویس‌های Scoped (مانند \`DbContext\`) در Constructor تزریق شوند زیرا خطای Captive Dependency رخ می‌دهد.
- **تزریق سرویس‌های Scoped در متد \`InvokeAsync\`:** وابستگی‌های دارای طول عمر محدود باید به عنوان پارامتر ورودی متد \`InvokeAsync\` تعریف شوند.

#### ۲. میدل‌ویرهای Factory-Activated (اینترفیس \`IMiddleware\`):
- **طول عمر Scoped یا Transient:** در هر درخواست توسط \`IMiddlewareFactory\` به صورت مجزا ساخته می‌شوند.
- **تزریق مستقیم در Constructor:** سرویس‌های Scoped مستقیماً در سازنده تزریق می‌شوند.
- **الزام ثبت در DI:** حتماً باید با دستور \`builder.Services.AddScoped<MyMiddleware>()\` در کانتینر ثبت شوند.
- **کارایی:** بدون نیاز به Reflection و با ایمنی تایپ کامل اجرا می‌شوند.`,
  },
  {
    id: "dotnet-mid-q245",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-middleware-pipeline-filters"],
    questionTitle: "Explain the differences between pipeline branching methods: app.Use, app.Run, app.Map, app.MapWhen, and app.UseWhen, and when does a sub-pipeline rejoin the main pipeline?",
    questionTitle_fa: "تفاوت میان متدهای مختلف شاخه‌بندی خط لوله (شامل app.Use، app.Run، app.Map، app.MapWhen و app.UseWhen) چیست و در کدام متدها جریان پردازش دوباره به خط لوله اصلی بازمی‌گردد؟",
    answerContent: `### Pipeline Branching Primitives in ASP.NET Core

Controlling HTTP request flow through conditional sub-pipelines is essential for building modular architectures:

---

| Method | Execution Behavior | Re-joins Main Pipeline? | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **\`app.Use\`** | In-line execution (calls \`next(context)\` or short-circuits) | **Yes** (via \`next\`) | Request timing, header injection, logging |
| **\`app.Run\`** | Terminal execution (never calls \`next\`) | **No** (Terminates pipeline) | Final fallback handler, health check endpoint |
| **\`app.Map\`** | Path-prefix match branch (\`/admin\`) | **No** (Permanently branches) | Isolated admin panel or webhook listener |
| **\`app.MapWhen\`** | Predicate condition match branch (\`context.Request.Query...\`) | **No** (Permanently branches) | Legacy API version handler, isolated tenant flow |
| **\`app.UseWhen\`** | Conditional branch execution | **YES (Always re-joins main pipeline!)** | Conditional auditing or payload transformation |

---

#### 1. \`app.Map\` vs \`app.UseWhen\` (The Crucial Difference):

\`\`\`csharp
// MAP: Once entered, the request NEVER re-enters the main pipeline!
app.Map("/webhooks", webhookApp =>
{
    webhookApp.UseMiddleware<WebhookSignatureValidationMiddleware>();
    webhookApp.Run(async context =>
    {
        await context.Response.WriteAsync("Webhook Processed");
    });
});

// USEWHEN: Executes specialized middleware, then RETURNS TO THE MAIN PIPELINE!
app.UseWhen(
    context => context.Request.Path.StartsWithSegments("/api/v1/payments"),
    paymentApp =>
    {
        // Executes fraud detection middleware for payment routes only...
        paymentApp.UseMiddleware<FraudDetectionMiddleware>();
        // ...and then execution automatically flows back to Routing -> Auth -> Controller!
    });
\`\`\``,
    answerContent_fa: `### سازوکار و تفاوت متدهای شاخه‌بندی خط لوله (Use, Run, Map, MapWhen, UseWhen)

در ASP.NET Core برای مدیریت شاخه‌های پردازشی از متدهای زیر استفاده می‌شود:

#### مقایسه رفتار متدها:
۱. **\`app.Use\`**: پردازش درون‌خطی و ارسال به مرحله بعد با \`next(context)\`.
۲. **\`app.Run\`**: میدل‌ویر پایانی (Terminal) که پاسخ را ارسال کرده و خط لوله را خاتمه می‌دهد (هیچ‌گاه \`next\` صدا زده نمی‌شود).
۳. **\`app.Map\`**: انشعاب دائمی بر اساس پیشوند URL (مسیر جدا شده و هرگز به پایپ‌لاین اصلی بازنمی‌گردد).
۴. **\`app.MapWhen\`**: انشعاب دائمی بر اساس یک شرط دلخواه روی شیء \`HttpContext\`.
۵. **\`app.UseWhen\` (تفاوت بنیادین)**: میدل‌ویرهای مشخص‌شده را فقط در صورت برقراری شرط اجرا کرده و **سپس جریان درخواست را مجدداً به خط لوله اصلی بازمی‌گرداند** تا به سمت مراحل Routing و Authentication هدایت شود.`,
  },
  {
    id: "dotnet-mid-q246",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-middleware-pipeline-filters"],
    questionTitle: "How do you implement modern global exception handling in ASP.NET Core 8/9 using IExceptionHandler and ProblemDetails (RFC 7807) without custom try/catch middleware?",
    questionTitle_fa: "چگونه در ASP.NET Core 8 و 9 سیستم مدیریت سراسری خطاهای برنامه را با اینترفیس IExceptionHandler و استاندارد ProblemDetails (RFC 7807) بدون نیاز به نوشتن میدل‌ویر try/catch دستی پیاده‌سازی کنیم؟",
    answerContent: `### Global Exception Handling with \`IExceptionHandler\` (.NET 8/9)

In .NET 8 and 9, ASP.NET Core introduced **\`IExceptionHandler\`**, eliminating the need for manual \`try/catch\` middleware while standardizing error formats on **RFC 7807 ProblemDetails**.

---

#### 1. Implementing Domain-Specific and Fallback Handlers:

\`\`\`csharp
// Handler 1: Catches business domain validation failures
public class ValidationExceptionHandler(ILogger<ValidationExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is not DomainValidationException valEx)
        {
            return false; // Return false to pass exception to NEXT handler in chain!
        }

        logger.LogWarning("Validation failed: {Message}", valEx.Message);

        var problemDetails = new HttpValidationProblemDetails(valEx.Errors)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation Error",
            Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
            Instance = httpContext.Request.Path
        };

        httpContext.Response.StatusCode = problemDetails.Status.Value;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true; // Successfully handled!
    }
}

// Handler 2: Catches all remaining unhandled exceptions (Fallback)
public class GlobalFallbackExceptionHandler(ILogger<GlobalFallbackExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        logger.LogError(exception, "Unhandled system error on path: {Path}", httpContext.Request.Path);

        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "An unexpected error occurred",
            Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
            Instance = httpContext.Request.Path,
            Detail = "Please contact support with trace ID: " + httpContext.TraceIdentifier
        };

        httpContext.Response.StatusCode = problemDetails.Status.Value;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true; // Handled
    }
}
\`\`\`

---

#### 2. Service Registration in \`Program.cs\`:
\`\`\`csharp
// Handlers are executed in order of registration:
builder.Services.AddExceptionHandler<ValidationExceptionHandler>();
builder.Services.AddExceptionHandler<GlobalFallbackExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

// Uses the built-in exception handler middleware which coordinates IExceptionHandler instances:
app.UseExceptionHandler();
\`\`\``,
    answerContent_fa: `### پیاده‌سازی مدیریت سراسری خطاها با IExceptionHandler در دات‌نت ۸ و ۹

دات‌نت ۸ با معرفی اینترفیس **\`IExceptionHandler\`**، نیاز به نوشتن میدل‌ویرهای try/catch سنتی را برطرف کرده و ساختاری زنجیره‌ای برای تبدیل خطاها به فرمت استاندارد RFC 7807 (\`ProblemDetails\`) فراهم نموده است.

#### سازوکار زنجیره‌ای (Chained Handlers):
۱. **متد \`TryHandleAsync\`**: هر هندلر بررسی می‌کند که آیا توانایی مدیریت آن نوع استثنای خاص را دارد یا خیر.
۲. **بازگرداندن مقدار \`false\`**: در صورت عدم تطابق، کنترل خطا به هندلر بعدی ثبت‌شده در کانتینر DI منتقل می‌شود.
۳. **بازگرداندن مقدار \`true\`**: در صورت مدیریت موفق، پاسخ استاندارد JSON تولید شده و زنجیره متوقف می‌شود.

#### مزایای نسبت به میدل‌ویر سنتی:
- تفکیک تمیز خطاهای اعتبارسنجی (400)، خطاهای عدم دسترسی (403)، نات‌فوند (404) و خطاهای داخلی سرور (500) در کلاس‌های مستقل.
- پشتیبانی کامل از استاندارد بین‌المللی RFC 7807.`,
  },
  {
    id: "dotnet-mid-q247",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-middleware-pipeline-filters"],
    questionTitle: "Why does modifying HTTP response headers after awaiting next(context) throw an InvalidOperationException ('Headers are read-only, response has already started'), and how does HttpResponse.OnStarting solve this?",
    questionTitle_fa: "چرا تغییر دادن هدرهای پاسخ HTTP پس از اجرای await next(context) منجر به پرتاب خطای InvalidOperationException (پاسخ شروع شده و هدرها فقط‌خواندنی هستند) می‌شود و متد HttpResponse.OnStarting چگونه این مشکل را حل می‌کند؟",
    answerContent: `### HTTP Response Streaming & Header Modification Constraints

In high-performance web servers (Kestrel), HTTP responses are streamed over TCP sockets:

1. **Header Flushing:** When an endpoint action writes the first chunk of data to the response body stream (via \`WriteAsJsonAsync\`, \`FileStream\`, or \`PipeWriter\`), Kestrel immediately serializes the HTTP Status Line and Headers, flushes them across the network socket, and flips the internal boolean:
   \`\`\`csharp
   context.Response.HasStarted = true;
   \`\`\`
2. **Immutability:** Once \`HasStarted == true\`, the HTTP protocol forbids sending additional headers. Attempting to add or modify headers afterwards throws:
   \`\`\`text
   System.InvalidOperationException: Headers are read-only, response has already started.
   \`\`\`

---

#### The Anti-Pattern:
\`\`\`csharp
// FLAWED MIDDLEWARE:
public class BadHeaderMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        await next(context); // Downstream endpoint executes AND FLUSHES BODY!

        // CRASH! Response has already started streaming to client:
        context.Response.Headers["X-Custom-Header"] = "Value";
    }
}
\`\`\`

---

#### The Solution: \`HttpResponse.OnStarting\`

The \`context.Response.OnStarting(callback)\` method registers a delegate that the web server guarantees to execute **immediately before the headers are flushed to the network socket**, even if the downstream action is what triggered the flush:

\`\`\`csharp
public class SafeHeaderMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        // Register callback BEFORE passing control downstream:
        context.Response.OnStarting(() =>
        {
            context.Response.Headers["X-Response-Time-Utc"] = DateTime.UtcNow.ToString("o");
            context.Response.Headers["X-Trace-Id"] = Activity.Current?.Id ?? context.TraceIdentifier;
            return Task.CompletedTask;
        });

        await next(context); // Safe: OnStarting fires right before bytes hit the socket!
    }
}
\`\`\``,
    answerContent_fa: `### محدودیت‌های دستکاری هدرهای HTTP و کاربرد HttpResponse.OnStarting

در وب‌سرورهای پرسرعت مانند Kestrel، ارسال پاسخ به کلاینت به صورت جریانی (Stream) انجام می‌شود:

#### علت وقوع خطای \`InvalidOperationException\`:
- به محض اینکه اندپوینت اولین بایت از داده‌ها را در بدنه پاسخ (\`Response.Body\`) می‌نویسد، وب‌سرور هدرهای HTTP و وضعیت پاسخ را در سوکت شبکه ارسال کرده و متغیر \`context.Response.HasStarted\` برابر \`true\` می‌شود.
- بر اساس پروتکل HTTP، پس از ارسال هدرها نمی‌توان هدر جدیدی اضافه یا ویرایش کرد و تلاش برای این کار خطای پرتاب می‌کند.

#### راهکار ایمن با متد \`OnStarting\`:
متد \`context.Response.OnStarting\` یک کالبک ثبت می‌کند که سرور وب تضمین می‌دهد **دقیقاً در لحظه قبل از ارسال هدرها به شبکه** آن را اجرا نماید، حتی اگر نوشتن داده‌ها توسط عمیق‌ترین لایه اندپوینت آغاز شده باشد.`,
  },
  {
    id: "dotnet-mid-q248",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-configuration-options-secrets"],
    questionTitle: "How does the ASP.NET Core Configuration Provider hierarchy resolve and override settings, and how do Environment Variables map nested JSON objects using double underscores (__)?",
    questionTitle_fa: "سیستم سلسله‌مراتبی ارائه‌دهندگان کانفیگ در ASP.NET Core چگونه مقادیر را اولویت‌بندی و بازنویسی می‌کند و متغیرهای محیطی چگونه با دو علامت Underscore (__) اشیاء تودرتوی JSON را مپ می‌کنند؟",
    answerContent: `### ASP.NET Core Configuration Hierarchy & Environment Variable Mapping

In ASP.NET Core, \`WebApplication.CreateBuilder(args)\` automatically configures a multi-provider configuration pipeline where providers registered later in the chain **override** matching keys from earlier providers:

---

#### 1. The Strict Configuration Precedence Order:
1. **\`appsettings.json\`**: Base default configurations for all environments.
2. **\`appsettings.{Environment}.json\`**: Environment-specific overrides (e.g. \`appsettings.Development.json\`, \`appsettings.Production.json\`).
3. **User Secrets (\`secrets.json\`)**: Local developer secrets (loaded **only** when \`EnvironmentName == "Development"\`).
4. **Environment Variables**: Operating system and container-level variables (Docker, Kubernetes Secrets/ConfigMaps).
5. **Command-Line Arguments**: CLI parameters (e.g. \`--Database:MaxConnections=100\`) which have the **highest precedence**.

---

#### 2. Environment Variable Hierarchy Mapping (\`__\` Double Underscore):
In JSON configuration files, sections are nested hierarchically:
\`\`\`json
{
  "ExternalServices": {
    "PaymentGateway": {
      "ApiKey": "sk_test_123",
      "TimeoutSeconds": 30
    }
  }
}
\`\`\`

In Linux shells, Bash, and Docker/Kubernetes container specs, variable names cannot contain colons (\`:\`). 
ASP.NET Core resolves this by parsing **double underscores (\`__\`)** as configuration section delimiters:

\`\`\`bash
# Linux / Docker Environment Variable:
export ExternalServices__PaymentGateway__ApiKey="sk_live_prod_999"
export ExternalServices__PaymentGateway__TimeoutSeconds="60"
\`\`\`

When the application reads \`IConfiguration["ExternalServices:PaymentGateway:ApiKey"]\`, it seamlessly receives \`"sk_live_prod_999"\`, perfectly overriding the JSON file without modifying code.`,
    answerContent_fa: `### اولویت‌بندی ارائه‌دهندگان کانفیگ و نگاشت متغیرهای محیطی با Double Underscore

در ASP.NET Core، سیستم پیکربندی مقادیر را از چندین منبع مختلف تجمیع کرده و لایه‌های بعدی مقادیر لایه‌های قبلی را **بازنویسی (Override)** می‌کنند:

#### ۱. ترتیب دقیق اولویت‌بندی ارائه‌دهندگان:
۱. **\`appsettings.json\`**: تنظیمات پیش‌فرض پایه.
۲. **\`appsettings.{Environment}.json\`**: تنظیمات اختصاصی محیط (Development، Staging، Production).
۳. **User Secrets**: کلیدهای محلی توسعه‌دهنده (تنها در حالت Development).
۴. **متغیرهای محیطی سیستم (Environment Variables)**: متغیرهای داکر و کوبرنتیز.
۵. **آرگومان‌های خط فرمان (CLI Arguments)**: بالاترین اولویت برای بازنویسی لحظه‌ای.

#### ۲. نگاشت اشیاء تودرتو با علامت \`__\` (Double Underscore):
از آنجا که سیستم‌عامل لینوکس و کانتینرهای داکر استفاده از علامت دو نقطه (\`:\`) را در نام متغیرها مجاز نمی‌دانند، دات‌نت به صورت خودکار دو علامت آندرلاین (\`__\`) را به ساختار درختی JSON مپ می‌کند (مثال: \`ExternalServices__PaymentGateway__ApiKey\` جایگزین کلید \`ExternalServices:PaymentGateway:ApiKey\` می‌شود).`,
  },
  {
    id: "dotnet-mid-q249",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-configuration-options-secrets"],
    questionTitle: "What are the fundamental differences between IOptions<T>, IOptionsSnapshot<T>, and IOptionsMonitor<T> in the Options Pattern, especially regarding DI lifetimes and live runtime reloads?",
    questionTitle_fa: "تفاوت‌های بنیادین میان IOptions<T>، IOptionsSnapshot<T> و IOptionsMonitor<T> در الگوی Options به ویژه از نظر طول عمر کانتینر DI و ریلود شدن خودکار مقادیر چیست؟",
    answerContent: `### The Options Pattern Trio: IOptions vs. IOptionsSnapshot vs. IOptionsMonitor

The .NET Options Pattern binds raw configuration sections to strongly-typed classes. Choosing the correct interface depends on service lifetime and dynamic reload requirements:

---

| Dimension | \`IOptions<T>\` | \`IOptionsSnapshot<T>\` | \`IOptionsMonitor<T>\` |
| :--- | :--- | :--- | :--- |
| **DI Lifetime** | **Singleton** | **Scoped** | **Singleton** |
| **Instantiation Cost** | Evaluated once at first access | Re-evaluated **once per \`IServiceScope\`** | Evaluated once, updated via token source |
| **Runtime Reloading** | ❌ No (Fixed for app lifetime) | ✅ Yes (Refreshes on next HTTP request) | **✅ Yes (Real-time push updates)** |
| **Named Options** | ❌ No | ✅ Yes (\`snapshot.Get("Name")\`) | ✅ Yes (\`monitor.Get("Name")\`) |
| **Change Listener** | ❌ No | ❌ No | **✅ Yes (\`monitor.OnChange(callback)\`)** |
| **Injectable in Singletons?** | ✅ Safe | ❌ **CRASH (Captive Dependency!)** | ✅ **Safe & Recommended** |
| **Primary Use Case** | Fixed immutable settings | Request-scoped services needing fresh config | Long-running BackgroundServices & caches |

---

#### 1. \`IOptions<T>\` (Singleton, Immutable):
- Computed once upon first resolution.
- Highly performant with near-zero allocation overhead.
- Does not reflect changes if \`appsettings.json\` is edited while the app is running.

#### 2. \`IOptionsSnapshot<T>\` (Scoped, Per-Request Recompute):
- Recomputed on every new \`IServiceScope\` (every incoming HTTP request).
- Guarantees **consistent configuration throughout the entire duration of a single HTTP request**, even if the underlying file changes mid-flight.

#### 3. \`IOptionsMonitor<T>\` (Singleton, Real-Time Push Notification):
- Subscribes to \`IConfigurationChangeTokenSource\` to receive instant OS file change notifications.
- Exposes \`monitor.CurrentValue\` for immediate access and \`monitor.OnChange((newOptions, name) => ...)\` to react to configuration changes dynamically without application restarts.`,
    answerContent_fa: `### مقایسه سه‌گانه الگوی Options: تفاوت‌های IOptions، IOptionsSnapshot و IOptionsMonitor

الگوی Options در دات‌نت تنظیمات را به کلاس‌های strongly-typed تبدیل می‌کند:

#### ۱. اینترفیس \`IOptions<T>\` (طول عمر Singleton):
- در اولین فراخوانی یک‌بار مقداردهی شده و تا پایان عمر برنامه ثابت می‌ماند.
- تغییرات فایل \`appsettings.json\` در زمان اجرا روی آن تاثیری ندارد.

#### ۲. اینترفیس \`IOptionsSnapshot<T>\` (طول عمر Scoped):
- به ازای هر درخواست وب (Scope) مجدداً محاسبه می‌شود.
- تضمین می‌کند که در طول پردازش یک درخواست HTTP خاص، مقادیر کانفیگ کاملاً یکدست و بدون تغییر باقی بمانند.
- **تله مهلک:** نباید در سرویس‌های Singleton تزریق شود چون باعث خطای Captive Dependency می‌گردد.

#### ۳. اینترفیس \`IOptionsMonitor<T>\` (طول عمر Singleton):
- تنظیمات را به صورت بلادرنگ و آنی آپدیت می‌کند.
- دارای متد \`monitor.CurrentValue\` و کالبک رویداد \`monitor.OnChange\` است که امکان واکنش به تغییرات کانفیگ بدون ریستارت سرور را برای BackgroundServiceها فراهم می‌سازد.`,
  },
  {
    id: "dotnet-mid-q250",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-configuration-options-secrets"],
    questionTitle: "Why does injecting IOptionsSnapshot<T> into a Singleton service (or BackgroundService) cause a Captive Dependency runtime crash, and what is the proper pattern for consuming dynamic settings in Singletons?",
    questionTitle_fa: "چرا تزریق IOptionsSnapshot<T> در یک سرویس Singleton (یا BackgroundService) باعث خطای زمان اجرای Captive Dependency می‌شود و الگوی استاندارد برای خواندن تنظیمات پویا در سرویس‌های Singleton چیست؟",
    answerContent: `### Captive Dependency with IOptionsSnapshot in Singleton Services

A common architectural trap in ASP.NET Core occurs when developers attempt to inject \`IOptionsSnapshot<T>\` into a **Singleton service** (such as a \`BackgroundService\`, \`IHostedService\`, or memory cache manager).

---

#### Why It Crashes:
1. **Lifetime Incompatibility:** \`IOptionsSnapshot<T>\` is explicitly registered in the DI container as a **Scoped service** because its internal mechanism relies on per-request scope isolation.
2. **Container Scope Validation:** When \`ValidateScopes = true\` is enabled, the DI container detects a Singleton capturing a Scoped service during startup, crashing with:
   \`\`\`text
   System.InvalidOperationException: Cannot consume scoped service 'Microsoft.Extensions.Options.IOptionsSnapshot\`1[AppOptions]' from singleton 'BackgroundWorker'.
   \`\`\`

---

#### The Solution: Use \`IOptionsMonitor<T>\`

\`IOptionsMonitor<T>\` is designed specifically for **Singleton lifecycles**, providing real-time access to updated configuration values without requiring an active \`IServiceScope\`:

\`\`\`csharp
public class OrderSyncWorker : BackgroundService
{
    private readonly IOptionsMonitor<SyncOptions> _optionsMonitor;
    private readonly ILogger<OrderSyncWorker> _logger;

    // Correct: Inject IOptionsMonitor into the Singleton constructor!
    public OrderSyncWorker(
        IOptionsMonitor<SyncOptions> optionsMonitor,
        ILogger<OrderSyncWorker> logger)
    {
        _optionsMonitor = optionsMonitor;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // Always retrieves the freshest runtime settings:
            var batchSize = _optionsMonitor.CurrentValue.BatchSize;
            var pollInterval = _optionsMonitor.CurrentValue.PollIntervalSeconds;

            _logger.LogInformation("Processing batch of {BatchSize} orders...", batchSize);

            await Task.Delay(TimeSpan.FromSeconds(pollInterval), stoppingToken);
        }
    }
}
\`\`\``,
    answerContent_fa: `### خطای Captive Dependency با IOptionsSnapshot در سرویس‌های Singleton

یکی از خطاهای رایج در پروژه‌های دات‌نت، تلاش برای تزریق \`IOptionsSnapshot<T>\` در سرویس‌های دارای طول عمر **Singleton** (مانند \`BackgroundService\`) است.

#### علت پرتاب خطا:
اینترفیس \`IOptionsSnapshot<T>\` ذیل کانتینر DI با طول عمر **Scoped** ثبت شده است؛ زیرا وظیفه آن بازخوانی مقادیر به ازای هر درخواست وب است. تزریق یک سرویس Scoped درون Singleton خطای مستقیم **Captive Dependency** را ایجاد می‌کند و با فعال بودن \`ValidateScopes\` در زمان استارتاپ برنامه متوقف می‌شود.

#### راهکار استاندارد:
در تمام سرویس‌های Singleton و پس‌زمینه، همیشه باید از **\`IOptionsMonitor<T>\`** استفاده شود؛ زیرا این اینترفیس با طول عمر Singleton ثبت شده و از طریق پراپرتی \`CurrentValue\` بدون نیاز به ساخت Scope، آخرین تغییرات کانفیگ را در اختیار سرویس قرار می‌دهد.`,
  },
  {
    id: "dotnet-mid-q251",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-configuration-options-secrets"],
    questionTitle: "How do you implement Fail-Fast startup configuration validation in .NET 8/9 using DataAnnotations, custom validation delegates, and ValidateOnStart()?",
    questionTitle_fa: "چگونه در دات‌نت ۸ و ۹ اعتبارسنجی زودهنگام (Fail-Fast) تنظیمات برنامه را در زمان استارتاپ با اتریبیوت‌های DataAnnotations، شروط سفارشی و متد ValidateOnStart() پیاده‌سازی کنیم؟",
    answerContent: `### Fail-Fast Options Validation with \`ValidateOnStart\` (.NET 8/9)

In legacy systems, invalid or missing configuration values (such as an empty API secret or invalid port number) remained undetected until user requests hit the relevant feature hours or days after deployment.

.NET 8 and 9 provide comprehensive **Fail-Fast Startup Validation**:

---

#### 1. Define Strongly-Typed Options with DataAnnotations:
\`\`\`csharp
using System.ComponentModel.DataAnnotations;

public class DatabaseOptions
{
    public const string SectionName = "Database";

    [Required(ErrorMessage = "ConnectionString cannot be empty")]
    public string ConnectionString { get; init; } = string.Empty;

    [Range(5, 500, ErrorMessage = "MaxPoolSize must be between 5 and 500")]
    public int MaxPoolSize { get; init; } = 100;

    [Url(ErrorMessage = "MetricsEndpoint must be a valid HTTP/HTTPS URL")]
    public string MetricsEndpoint { get; init; } = string.Empty;
}
\`\`\`

---

#### 2. Fluent Registration with \`ValidateOnStart()\`:
\`\`\`csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOptions<DatabaseOptions>()
    .Bind(builder.Configuration.GetSection(DatabaseOptions.SectionName))
    .ValidateDataAnnotations() // Validates [Required], [Range], [Url] attributes
    .Validate(options => 
    {
        // Custom domain logic validation
        return !options.ConnectionString.Contains("TODO_REPLACE");
    }, "ConnectionString contains unconfigured placeholder values!")
    .ValidateOnStart(); // CRITICAL: Runs validation immediately during builder.Build()!

var app = builder.Build(); // Throws OptionsValidationException immediately if invalid!
\`\`\`

---

#### Why \`ValidateOnStart()\` is Essential in CI/CD & Kubernetes:
When deployed to Kubernetes or container clusters, a failing \`ValidateOnStart()\` causes the container's Readiness/Liveness probe to fail immediately, preventing Kubernetes from routing production traffic to a misconfigured pod and triggering an automatic rollback.`,
    answerContent_fa: `### اعتبارسنجی زودهنگام (Fail-Fast) تنظیمات در زمان استارتاپ با ValidateOnStart

در برنامه‌های حرفه‌ای، تنظیمات ناقص یا نامعتبر (مانند خالی بودن پسورد دیتابیس یا آدرس نامعتبر API) نباید در زمان اجرای درخواست‌های کاربران کشف شوند؛ بلکه سرور باید در همان لحظه بالا آمدن متوقف شود (Fail-Fast).

#### پیاده‌سازی در دات‌نت ۸ و ۹:
۱. **استفاده از اتریبیوت‌های DataAnnotations:** قراردادن اتریبیوت‌های \`[Required]\`، \`[Range]\` و \`[Url]\` روی پراپرتی‌های کلاس Options.
۲. **متد \`ValidateDataAnnotations()\`:** اعتبارسنجی خودکار اتریبیوت‌ها.
۳. **متد سفارشی \`Validate\`:** اعمال شروط منطقی پیچیده (مانند عدم وجود عبارات پیش‌فرض تستی در کانکشن‌استرینگ).
۴. **متد حیاتی \`ValidateOnStart()\`:** اجرای تمامی این اعتبارسنجی‌ها در لحظه اجرای \`builder.Build()\` قبل از بالا آمدن وب‌سرور Kestrel.

#### مزیت در کانتینرهای Kubernetes:
در صورت اشتباه بودن تنظیمات محیطی، پاد (Pod) در همان ثانیه اول ریستارت شده و کوبرنتیز از ارسال ترافیک کاربران به سرور معیوب جلوگیری می‌کند.`,
  },
  {
    id: "dotnet-mid-q252",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-aspnet-configuration-options-secrets"],
    questionTitle: "What is the Secret Manager tool (User Secrets) in .NET, how does it securely isolate API keys from Git repositories during development, and where are secrets stored on the local operating system?",
    questionTitle_fa: "ابزار Secret Manager (یا User Secrets) در دات‌نت چیست، چگونه در زمان توسعه مانع کامیت شدن کلیدهای محرمانه در ریپازیتوری Git می‌شود و فایل‌های آن در کجای سیستم‌عامل ذخیره می‌گردند؟",
    answerContent: `### Secret Manager (User Secrets) in ASP.NET Core

During local application development, developers require access to API keys, test database passwords, and client secrets. Accidental commits of these secrets to source control (GitHub/GitLab) are a primary vector for security breaches.

---

#### 1. How User Secrets Operates:
The Secret Manager tool stores sensitive development key-value pairs **completely outside the project directory and source tree**:

1. **Initialize User Secrets:**
   \`\`\`bash
   dotnet user-secrets init
   \`\`\`
   This command adds a unique GUID identifier to your \`.csproj\` file:
   \`\`\`xml
   <PropertyGroup>
     <UserSecretsId>79a3edd0-2092-40a2-a04d-dcb46d5ca9ed</UserSecretsId>
   </PropertyGroup>
   \`\`\`

2. **Set Configuration Values:**
   \`\`\`bash
   dotnet user-secrets set "Stripe:SecretKey" "sk_test_51Mz987654321"
   dotnet user-secrets set "Database:Password" "DevSecretPassword!"
   \`\`\`

---

#### 2. Physical Storage Locations:
The secrets are stored in an unencrypted JSON file in the developer's local OS user profile:
- **Windows:** \`%APPDATA%\\Microsoft\\UserSecrets\\<UserSecretsId>\\secrets.json\`
- **Linux:** \`~/.microsoft/usersecrets/<UserSecretsId>/secrets.json\`
- **macOS:** \`~/.microsoft/usersecrets/<UserSecretsId>/secrets.json\`

---

#### 3. Automatic Environment Isolation:
When running with \`builder.Environment.IsDevelopment()\`, ASP.NET Core automatically loads User Secrets into the \`IConfiguration\` pipeline. In Production environments, User Secrets are completely ignored, and values are supplied via **Environment Variables**, **Azure Key Vault**, or **AWS Secrets Manager**.`,
    answerContent_fa: `### ابزار Secret Manager (User Secrets) در دات‌نت و ایزوله‌سازی امن کلیدها

کامیت شدن اشتباهی کلیدهای محرمانه، رمزهای دیتابیس و توکن‌های پرداخت در ریپازیتوری‌های Git یکی از بزرگ‌ترین مخاطرات امنیتی است.

#### سازوکار User Secrets:
ابزار Secret Manager اطلاعات حساس را **کاملاً خارج از پوشه پروژه و سورس‌کد Git** نگهداری می‌کند:

۱. **دستور مقداردهی:** با اجرای \`dotnet user-secrets init\` یک شناسه GUID در فایل \`.csproj\` ثبت می‌شود.
۲. **ذخیره‌سازی در سیستم‌عامل:** فایل \`secrets.json\` در پوشه پروفایل کاربری سیستم‌عامل ذخیره می‌شود:
   - در ویندوز: \`%APPDATA%\\Microsoft\\UserSecrets\\<ID>\\secrets.json\`
   - در لینوکس و مک: \`~/.microsoft/usersecrets/<ID>/secrets.json\`
۳. **بارگذاری خودکار فقط در محیط Development:** فریم‌ورک دات‌نت این فایل را به صورت خودکار تنها در زمان اجرای لوکال در پایپ‌لاین کانفیگ ادغام می‌کند و در محیط Production این منبع نادیده گرفته شده و تنظیمات از متغیرهای امنیتی سرور یا Azure Key Vault خوانده می‌شوند.`,
  },
  {
    id: "dotnet-mid-q253",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-dbcontext-fluent-api-mappings"],
    questionTitle: "How does the Entity Framework Core ChangeTracker work internally (Snapshots vs DetectChanges), and how are EntityState transitions handled during SaveChangesAsync()?",
    questionTitle_fa: "موتور ردیابی تغییرات (ChangeTracker) در EF Core در سطح داخلی چگونه کار می‌کند (تصاویر لحظه‌ای Snapshot در برابر DetectChanges) و وضعیت‌های EntityState هنگام فراخوانی SaveChangesAsync چگونه مدیریت می‌شوند؟",
    answerContent: `### ChangeTracker Internals & EntityState Transitions in EF Core

Entity Framework Core's **\`ChangeTracker\`** tracks the state and modifications of loaded entities through an internal component called the **\`IStateManager\`**.

---

#### 1. The Snapshot-Based Change Tracking Pipeline:
1. **Materialization & Snapshotting:**
   - When a tracking query executes (\`context.Orders.ToList()\`), EF Core reads raw database tabular rows, instantiates the C# entity objects, and creates a **deep clone snapshot of all scalar and navigation properties** inside an internal \`EntityEntry\` object.
2. **In-Memory Modification:**
   - The developer mutates entity properties directly in C# (e.g. \`order.Status = OrderStatus.Shipped\`). The entity has no built-in notification hooks; it is completely unaware of the tracker.
3. **DetectChanges Execution:**
   - When \`SaveChangesAsync()\` is invoked, EF Core triggers \`ChangeTracker.DetectChanges()\`.
   - It performs an ordinal, property-by-property comparison between the **Current Values** on the live C# object and the **Original Values** stored in the initial snapshot.
4. **State Transition:**
   - If differences are detected, the entity's \`EntityState\` transitions from \`Unchanged\` to \`Modified\`, and specific property entries are marked as \`IsModified = true\`.
5. **SQL Command Generation:**
   - The SQL generator builds parameterized \`UPDATE\` statements that update **ONLY the columns whose properties have \`IsModified == true\`**.

---

#### 2. Summary of EntityState Transitions:

| EntityState | Condition in \`ChangeTracker\` | Resulting SQL Statement in \`SaveChangesAsync()\` |
| :--- | :--- | :--- |
| **\`Added\`** | Added via \`context.Add()\` / foreign key graph | \`INSERT INTO ... VALUES (...);\` |
| **\`Modified\`** | Property mutated, detected by snapshot check | \`UPDATE ... SET [Col] = @val WHERE [Id] = @id;\` |
| **\`Deleted\`** | Marked via \`context.Remove()\` | \`DELETE FROM ... WHERE [Id] = @id;\` |
| **\`Unchanged\`** | Queried from DB, zero properties mutated | No SQL generated (Skipped) |
| **\`Detached\`** | Not tracked by \`DbContext\` (\`AsNoTracking\`) | No SQL generated |

---

#### Performance Optimization:
When querying data purely for display or read-only REST API endpoints, always use **\`.AsNoTracking()\`**. This skips snapshot creation in the \`StateManager\`, reducing memory allocation by ~50% and query execution time by ~30%!`,
    answerContent_fa: `### کالبدشکافی موتور ChangeTracker و چرخه وضعیت‌های EntityState در EF Core

موتور **\`ChangeTracker\`** در EF Core از طریق زیرسیستم داخلی \`IStateManager\` تغییرات اشیاء در حافظه را ردیابی می‌کند:

#### ۱. سازوکار ردیابی مبتنی بر تصویر لحظه‌ای (Snapshot-Based):
۱. **ایجاد اسنپ‌شات (Snapshot):** در زمان کوئری‌گیری معمولی (Tracking)، داده‌ها از دیتابیس خوانده شده و یک کپی عمیق از تمام فیلدهای اولیه شیء در \`StateManager\` ذخیره می‌شود.
۲. **تغییر در حافظه:** برنامه‌نویس فیلدهای انتیتی را در کد تغییر می‌دهد.
۳. **اجرای DetectChanges:** با فراخوانی متد \`SaveChangesAsync\`، موتور ChangeTracker مقادیر فعلی شیء را فیلد به فیلد با مقادیر اسنپ‌شات اولیه مقایسه می‌کند.
۴. **تغییر وضعیت به Modified:** در صورت کشف تغییر، وضعیت شیء به \`Modified\` تغییر یافته و دقیقاً فیلدهای ویرایش‌شده علامت‌گذاری می‌شوند.
۵. **تولید SQL بهینه:** دستور \`UPDATE\` تنها برای ستون‌هایی که تغییر کرده‌اند ساخته می‌شود.

#### ۲. وضعیت‌های پنج‌گانه EntityState:
- **\`Added\`**: دستور \`INSERT\` اجرا می‌شود.
- **\`Modified\`**: دستور \`UPDATE\` فقط برای فیلدهای تغییریافته اجرا می‌شود.
- **\`Deleted\`**: دستور \`DELETE\` اجرا می‌شود.
- **\`Unchanged\`**: هیچ کوئری تولید نمی‌شود.
- **\`Detached\`**: شیء خارج از کانتکست است (مانند حالت \`AsNoTracking\`).

#### بهینه‌سازی:
در کوئری‌های فقط‌خواندنی، حتماً از **\`AsNoTracking()\`** استفاده کنید تا اسنپ‌شات ساخته نشده و مصرف رم سرور تا ۵۰ درصد کاهش یابد.`,
  },
  {
    id: "dotnet-mid-q254",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-dbcontext-fluent-api-mappings"],
    questionTitle: "What is DbContext Pooling (AddDbContextPool) in EF Core, how does it optimize allocation and throughput in high-concurrency APIs, and what architectural constraints does it impose?",
    questionTitle_fa: "قابلیت DbContext Pooling (متد AddDbContextPool) در EF Core چیست، چگونه تخصیص حافظه و توان عملیاتی را در APIهای با ترافیک بالا بهینه می‌کند و چه محدودیت‌های معماری را تحمیل می‌نماید؟",
    answerContent: `### DbContext Pooling (\`AddDbContextPool\`) in EF Core

In traditional ASP.NET Core applications using \`builder.Services.AddDbContext<AppDbContext>()\`, a new \`DbContext\` instance is allocated on the Heap for **every incoming HTTP request** and torn down when the request ends. 

While EF Core caches the compiled metadata model (\`IModel\`), instantiating the context object graph, internal service dependencies, and \`ChangeTracker\` state still imposes noticeable CPU and Gen 0 Garbage Collection overhead.

---

#### 1. How \`AddDbContextPool\` Works:
\`\`\`csharp
// Register pooled DbContext in Program.cs:
builder.Services.AddDbContextPool<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
}, poolSize: 1024);
\`\`\`

- **Instance Reuse:** Instead of creating a new instance with \`new\`, EF Core loans a warm, pre-allocated \`DbContext\` instance from an internal thread-safe pool.
- **\`ResetState()\` Invocation:** When the HTTP request finishes and the scope is disposed, EF Core does **NOT** destroy the instance. Instead, it calls \`ResetState()\`:
  - Evicts all tracked entities from the \`ChangeTracker\`.
  - Resets database connections, transactions, and event listeners.
  - Returns the sanitized instance to the pool for the next request.

---

#### 2. Throughput Benefits:
- Reduces GC Gen 0 allocations by up to **25-30%**.
- Improves API requests-per-second throughput by **15-20%** under heavy concurrent load.

---

#### 3. Architectural Constraints & Anti-Patterns:
1. **No State in Private Fields:** You **cannot store per-request state** (e.g. \`ICurrentUser\` or \`TenantId\`) in private fields or the constructor of a pooled \`DbContext\` because the instance is shared across different user requests.
2. **Context Options Configuration:** DbContext options must be configured entirely in the \`AddDbContextPool\` lambda delegate, not inside \`OnConfiguring\` using dynamic runtime values.`,
    answerContent_fa: `### استخر نمونه‌ها با DbContext Pooling (متد AddDbContextPool) در EF Core

در روش پیش‌فرض (\`AddDbContext\`)، به ازای هر درخواست HTTP یک نمونه جدید از \`DbContext\` روی Heap ساخته شده و در انتهای درخواست توسط Garbage Collector دور ریخته می‌شود که در ترافیک‌های سنگین سربار رم و CPU ایجاد می‌کند.

#### سازوکار AddDbContextPool:
- **استفاده مجدد از اشیاء:** فریم‌ورک نمونه‌های از پیش ساخته‌شده را درون یک Object Pool مدیریت کرده و به درخواست‌های وب قرض می‌دهد.
- **متد \`ResetState()\`:** در پایان هر درخواست، شیء منهدم نمی‌شود؛ بلکه با متد \`ResetState\` تمام انتیتی‌های ردیابی‌شده در ChangeTracker پاکسازی و کانکشن‌ها ریست شده و نمونه تمیز به استخر بازمی‌گردد.

#### مزایای کارایی:
- کاهش ۲۵ تا ۳۰ درصدی تخصیص حافظه در Gen 0.
- افزایش ۱۵ تا ۲۰ درصدی توان پردازش درخواست‌ها (Throughput).

#### محدودیت‌های مهم معماری:
- **عدم ذخیره وضعیت در فیلدهای خصوصی:** نباید اطلاعات اختصاصی یک کاربر (مانند \`TenantId\` یا \`UserId\`) در متغیرهای خصوصی کلاس DbContext ذخیره شود چون این شیء توسط درخواست‌های کاربران دیگر مجدداً استفاده خواهد شد.`,
  },
  {
    id: "dotnet-mid-q255",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-dbcontext-fluent-api-mappings"],
    questionTitle: "Why is IEntityTypeConfiguration<T> preferred over Data Annotations in Clean Architecture / DDD, and how do you configure automatic assembly discovery in OnModelCreating?",
    questionTitle_fa: "چرا استفاده از IEntityTypeConfiguration<T> در معماری تمیز و DDD نسبت به Data Annotations ارجحیت دارد و چگونه می‌توان کشف خودکار تمامی کانفیگ‌ها را در OnModelCreating پیاده‌سازی کرد؟",
    answerContent: `### IEntityTypeConfiguration<T> vs. Data Annotations in Clean Architecture

In Clean Architecture and Domain-Driven Design (DDD), the **Domain Layer** must remain independent of external frameworks, databases, and UI components.

---

#### 1. Why Data Annotations Fail in Enterprise Architectures:
- **Pollutes Pure Domain Entities:** Placing \`[Table("Orders")]\`, \`[Column("order_num")]\`, \`[Key]\`, or \`[ForeignKey]\` on domain classes couples business entities directly to the EF Core persistence mechanism.
- **Limited Technical Expressiveness:** Data Annotations cannot define:
  - Composite primary keys (\`HasKey(x => new { x.OrderId, x.ProductId })\`).
  - Filtered / Partial indexes (\`HasIndex().HasFilter("[IsDeleted] = 0")\`).
  - Value converters for Strongly-Typed IDs (\`HasConversion\`).
  - JSON columns (\`ToJson()\`).
  - Shadow properties and Global Query Filters.

---

#### 2. The Solution: \`IEntityTypeConfiguration<T>\`

Separate entity configuration into dedicated classes located in the **Infrastructure / Persistence Layer**:

\`\`\`csharp
public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers", "crm");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Email)
            .IsRequired()
            .HasMaxLength(256)
            .IsUnicode(false);

        builder.HasIndex(c => c.Email)
            .IsUnique();
    }
}
\`\`\`

---

#### 3. Automatic Assembly Discovery in \`OnModelCreating\`:
Rather than registering every configuration class manually line-by-line, use assembly scanning:

\`\`\`csharp
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Discovers and executes all IEntityTypeConfiguration classes in the current assembly:
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
\`\`\``,
    answerContent_fa: `### برتری IEntityTypeConfiguration<T> نسبت به Data Annotations در معماری تمیز (Clean Architecture)

در معماری‌های تمیز و مبتنی بر DDD، لایه دامنه (Domain) باید کاملاً مستقل از جزئیات پایگاه داده و پکیج‌های خارجی باشد:

#### معایب Data Annotations:
۱. **آلودگی انتیتی‌های بیزینسی:** قرار دادن اتریبیوت‌های پایگاه داده روی کلاس‌های تجاری، اصول معماری تمیز و POCO بودن دامنه را نقض می‌کند.
۲. **ناتوانی در پشتیبانی از سناریوهای پیچیده:** امکان تعریف ایندکس‌های شرطی (Filtered Index)، کلیدهای ترکیبی، نگاشت ستون‌های JSON و کانورترهای اختصاصی با Data Annotations وجود ندارد.

#### مزایای \`IEntityTypeConfiguration<T>\`:
- نگهداری تنظیمات دیتابیس در لایه Infrastructure در فایل‌های مجزا به ازای هر موجودیت.
- پشتیبانی کامل از تمام قابلیت‌های پیشرفته EF Core.

#### اسکن خودکار در متد \`OnModelCreating\`:
با دستور \`modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly)\`، تمامی کلاس‌های پیکربندی موجود در اسمبلی به صورت خودکار بدون نیاز به کدنویسی دستی شناسایی و اعمال می‌شوند.`,
  },
  {
    id: "dotnet-mid-q256",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-dbcontext-fluent-api-mappings"],
    questionTitle: "How do you map Strongly-Typed IDs and complex value types in EF Core using ValueConverter<TModel, TProvider>, and why are Value Comparers sometimes required?",
    questionTitle_fa: "چگونه شناسه‌های با تایپ قوی (Strongly-Typed IDs) و انواع مقداری سفارشی را با ValueConverter در EF Core نگاشت کنیم و در چه مواردی تعریف Value Comparer الزامی است؟",
    answerContent: `### Value Converters & Value Comparers in EF Core

**Primitive Obsession** (using raw \`Guid\` or \`long\` for all entity IDs) is a major source of bugs in enterprise codebases (e.g. passing a \`CustomerId\` where an \`OrderId\` was expected).

---

#### 1. Defining and Mapping Strongly-Typed IDs:

\`\`\`csharp
// 1. Strongly-Typed ID record struct
public readonly record struct OrderId(Guid Value)
{
    public static OrderId New() => new(Guid.NewGuid());
    public static OrderId Empty => new(Guid.Empty);
}

// 2. Custom ValueConverter class
public class OrderIdValueConverter : ValueConverter<OrderId, Guid>
{
    public OrderIdValueConverter() : base(
        id => id.Value,              // Model -> Provider (To Database Guid)
        guid => new OrderId(guid)    // Provider -> Model (From Database Guid)
    ) {}
}

// 3. Applying in Entity Configuration:
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);
        
        builder.Property(o => o.Id)
            .HasConversion<OrderIdValueConverter>();
    }
}
\`\`\`

---

#### 2. Why Are Value Comparers Required for Mutable Types?
When you use a \`ValueConverter\` on a **mutable type** (e.g. \`List<string>\` mapped to a JSON string or comma-separated column):
- EF Core's \`ChangeTracker\` takes a reference snapshot of the object.
- Because the object reference does not change when internal items are mutated (\`list.Add("item")\`), standard reference equality (\`ReferenceEquals\`) will **fail to detect the mutation**!

#### The Solution: \`ValueComparer<T>\`:
\`\`\`csharp
var stringListComparer = new ValueComparer<List<string>>(
    (c1, c2) => c1!.SequenceEqual(c2!),
    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
    c => c.ToList() // Creates a deep clone snapshot!
);

builder.Property(e => e.Tags)
    .HasConversion(
        tags => string.Join(',', tags),
        str => str.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList())
    .Metadata.SetValueComparer(stringListComparer);
\`\`\``,
    answerContent_fa: `### نگاشت Strongly-Typed IDs و انواع مقداری با ValueConverter و ضرورت ValueComparer

برای جلوگیری از خطای Primitive Obsession (ارسال اشتباه شناسه یک موجودیت به جای موجودیتی دیگر)، از شناسه‌های با تایپ قوی استفاده می‌شود:

#### ۱. پیاده‌سازی Strongly-Typed ID با ValueConverter:
یک \`record struct\` اختصاصی برای شناسه تعریف شده و با کلاس \`ValueConverter<OrderId, Guid>\` تبدیل دوطرفه آن به \`Guid\` دیتابیس تنظیم می‌شود.

#### ۲. ضرورت تعریف Value Comparer برای انواع Mutable:
هنگامی که یک نوع داده تغییرپذیر (مانند \`List<string>\`) را با ValueConverter به یک ستون متنی در دات‌نت تبدیل می‌کنید:
- موتور ChangeTracker یک کپی از آدرس اشاره‌گر شیء ذخیره می‌کند.
- با تغییر محتویات لیست، آدرس اشاره‌گر تغییر نمی‌کند؛ بنابراین مقایسه پیش‌فرض رانتایم متوجه تغییرات نشده و کوئری \`UPDATE\` در متد \`SaveChangesAsync\` ساخته نمی‌شود!

با تعریف یک **\`ValueComparer<List<string>>\`**، نحوه مقایسه عمیق آیتم‌ها و ایجاد کپی مستقل (Deep Clone) برای ChangeTracker مشخص شده و تغییرات به درستی ردیابی می‌شوند.`,
  },
  {
    id: "dotnet-mid-q257",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-dbcontext-fluent-api-mappings"],
    questionTitle: "What are Shadow Properties and Global Query Filters in EF Core, and how are they used together to implement automated Soft Deletes and Multi-Tenancy?",
    questionTitle_fa: "ویژگی‌های سایه (Shadow Properties) و فیلترهای سراسری کوئری (Global Query Filters) در EF Core چیستند و چگونه در کنار یکدیگر برای پیاده‌سازی حذف منطقی (Soft Delete) و Multi-Tenancy استفاده می‌شوند؟",
    answerContent: `### Shadow Properties & Global Query Filters in EF Core

Modern enterprise architectures require cross-cutting data concerns (such as audit trails, soft deletes, and multi-tenant isolation) without polluting domain entity models with infrastructure properties.

---

#### 1. Shadow Properties:
Shadow properties are properties that exist in the database table schema and EF Core metadata model, but are **not declared as C# properties on the domain entity class**:

\`\`\`csharp
// 1. Defining shadow properties via Fluent API:
builder.Entity<Order>(b =>
{
    b.Property<bool>("IsDeleted").HasDefaultValue(false);
    b.Property<string>("TenantId").IsRequired().HasMaxLength(64);
    b.Property<DateTime>("CreatedAt").IsRequired();
});

// 2. Reading shadow properties in LINQ using EF.Property<T>:
var tenantOrders = await context.Orders
    .Where(o => EF.Property<string>(o, "TenantId") == "tenant_corp_1")
    .ToListAsync();

// 3. Setting shadow properties during SaveChanges:
context.Entry(order).Property("IsDeleted").CurrentValue = true;
\`\`\`

---

#### 2. Global Query Filters:
A Global Query Filter is a LINQ expression applied to the entity type configuration that EF Core automatically injects into the \`WHERE\` clause of **all queries generated against that table**:

\`\`\`csharp
public class AppDbContext : DbContext
{
    private readonly ITenantProvider _tenantProvider;

    public AppDbContext(DbContextOptions<AppDbContext> options, ITenantProvider tenantProvider) 
        : base(options)
    {
        _tenantProvider = tenantProvider;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Combined Soft Delete & Multi-Tenant Global Filter:
        modelBuilder.Entity<Order>().HasQueryFilter(o => 
            !EF.Property<bool>(o, "IsDeleted") && 
            EF.Property<string>(o, "TenantId") == _tenantProvider.CurrentTenantId);
    }
}
\`\`\`

---

#### 3. Bypassing Filters with \`IgnoreQueryFilters()\`:
When an administrative task, data migration, or tenant-agnostic audit report requires querying all records:

\`\`\`csharp
// Bypasses both Soft-Delete and Multi-Tenant filters:
var allHistoricalRecords = await context.Orders
    .IgnoreQueryFilters()
    .ToListAsync();
\`\`\``,
    answerContent_fa: `### ویژگی‌های سایه (Shadow Properties) و فیلترهای سراسری کوئری در EF Core

برای پیاده‌سازی قابلیت‌های زیرساختی (مانند حذف نرم و تفکیک داده‌های مشتریان در سیستم‌های Multi-Tenant) بدون دستکاری فیلدهای دامنه‌ای از این دو قابلیت استفاده می‌شود:

#### ۱. ویژگی‌های سایه (Shadow Properties):
فیلدهایی هستند که در جدول دیتابیس وجود دارند اما در کلاس C# انتیتی تعریف نشده‌اند تا دامنه پاکیزه بماند:
- تعریف با \`builder.Property<bool>("IsDeleted")\`.
- کوئری‌گیری در LINQ با متد \`EF.Property<T>(entity, "PropertyName")\`.
- مقداردهی با \`context.Entry(entity).Property("IsDeleted").CurrentValue = true\`.

#### ۲. فیلترهای سراسری کوئری (Global Query Filters):
شروطی در متد \`OnModelCreating\` هستند که EF Core به صورت خودکار آنها را به عبارت \`WHERE\` در تمام کوئری‌های SQL ارسالی به دیتابیس الصاق می‌کند:
\`\`\`csharp
modelBuilder.Entity<Order>().HasQueryFilter(o => 
    !EF.Property<bool>(o, "IsDeleted") && 
    EF.Property<string>(o, "TenantId") == currentTenantId);
\`\`\`

#### ۳. دور زدن فیلتر با \`IgnoreQueryFilters()\`:
در سناریوهای گزارش‌گیری مدیریتی یا بازیابی رکوردهای حذف‌شده، با فراخوانی متد \`IgnoreQueryFilters()\` می‌توان فیلترهای سراسری را غیرفعال کرد.`,
  },
  {
    id: "dotnet-mid-q258",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-querying-relationships-loading"],
    questionTitle: "What is the N+1 Query Problem in Entity Framework Core, why does it severely degrade performance, and how do you prevent it using Eager Loading (Include/ThenInclude) and Select Projections?",
    questionTitle_fa: "خطای ویرانگر N+1 Query در EF Core چیست، چرا باعث افت شدید کارایی سیستم می‌شود و چگونه با استفاده از Eager Loading و Select Projectionها از وقوع آن جلوگیری کنیم؟",
    answerContent: `### The N+1 Query Problem in Entity Framework Core

The **N+1 Query Problem** is one of the most common and destructive performance anti-patterns in data-driven backend applications.

---

#### 1. How the Bug Occurs:
The application sends **1 initial SQL query** to fetch $N$ parent records (e.g. 500 customers). Then, inside a loop or during JSON serialization, the code triggers a separate SQL query for each customer to retrieve their related child records (e.g. orders).

\`\`\`csharp
// DISASTROUS ANTI-PATTERN:
var customers = await context.Customers.ToListAsync(); // 1 Query: Fetches 500 rows

foreach (var customer in customers)
{
    // Executes 1 separate query per customer:
    // Total Database Roundtrips = 1 + 500 = 501 SQL queries!
    var orders = await context.Orders.Where(o => o.CustomerId == customer.Id).ToListAsync();
}
\`\`\`

#### Impact:
- Hundreds of redundant network roundtrips to the database server.
- Extreme latency (increasing response times from 15ms to several seconds).
- Connection pool exhaustion under concurrent user traffic.

---

#### 2. Prevention Strategy A: Eager Loading with \`Include\` / \`ThenInclude\`
Eager loading instructs EF Core to join and retrieve the child entities upfront in the **initial database roundtrip**:

\`\`\`csharp
var customersWithOrders = await context.Customers
    .AsNoTracking()
    .Include(c => c.Orders)
        .ThenInclude(o => o.OrderItems)
    .ToListAsync(); // Exactly 1 SQL query with LEFT JOINs!
\`\`\`

---

#### 3. Prevention Strategy B: Direct Select Projections (The Best Practice)
When returning read-only DTOs, project directly to the destination model using LINQ \`.Select()\`:

\`\`\`csharp
var customerSummaries = await context.Customers
    .AsNoTracking()
    .Where(c => c.IsActive)
    .Select(c => new CustomerSummaryDto(
        c.Id,
        c.FullName,
        c.Orders.Count,
        c.Orders.Select(o => o.TotalAmount).Sum()
    ))
    .ToListAsync();
\`\`\`
- Generates a single, highly optimized SQL query containing subqueries/aggregations without allocating entity snapshots in memory.`,
    answerContent_fa: `### خطای ویرانگر N+1 Query در EF Core و راهکارهای مهار آن

خطای **N+1 Query** زمانی رخ می‌دهد که برنامه برای واکشی اطلاعات والد و فرزند، به جای دریافت یکپارچه، تعداد زیادی درخواست مجزا به پایگاه داده ارسال کند:

#### ۱. سازوکار بروز خطا:
- برنامه ابتدا **۱ کوئری** برای واکشی ۵۰۰ مشتری ارسال می‌کند.
- سپس در یک حلقه \`foreach\`، به ازای هر مشتری **۱ کوئری جداگانه** برای دریافت سفارش‌های او می‌فرستد.
- **نتیجه:** مجموعاً $1 + 500 = 501$ رفت‌وبرگشت به دیتابیس انجام شده که باعث قفل شدن Connection Pool و کندی شدید سرور می‌گردد.

#### ۲. راهکار اول: بارگذاری حریصانه (Eager Loading با Include):
با متدهای \`Include\` و \`ThenInclude\`، فریم‌ورک تمام داده‌های والد و فرزند را در قالب **یک کوئری واحد** با دستورات \`LEFT JOIN\` از دیتابیس واکشی می‌کند.

#### ۳. راهکار دوم: پروجکشن مستقیم به DTO با متد Select (بهترین روش):
با استفاده از متد \`Select\`، دقیقاً ستون‌ها و محاسبات آماری مورد نیاز به DTO مپ می‌شوند؛ این کار علاوه بر واکشی در یک کوئری، سربار ساخت انتیتی‌ها در رم را نیز کاملاً حذف می‌کند.`,
  },
  {
    id: "dotnet-mid-q259",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-querying-relationships-loading"],
    questionTitle: "What is Cartesian Explosion when eager-loading multiple child collections, and how does AsSplitQuery() resolve it compared to AsSingleQuery()?",
    questionTitle_fa: "پدیده انفجار دکارتی (Cartesian Explosion) هنگام بارگذاری همزمان چندین کالکشن فرزند با Include چیست و متد AsSplitQuery() چگونه در مقایسه با AsSingleQuery() آن را مهار می‌کند؟",
    answerContent: `### Cartesian Explosion & Split Queries (\`AsSplitQuery\`) in EF Core

When an EF Core query uses \`Include()\` across **multiple collection navigations**, the database execution strategy can dramatically impact network payload and server memory.

---

#### 1. What is Cartesian Explosion?
SQL \`JOIN\` operations produce flat tabular result sets. When joining multiple 1-to-Many collections against a single parent (e.g. \`Blog\` -> \`Posts\` (10) and \`Blog\` -> \`Tags\` (5) and \`Blog\` -> \`Contributors\` (2)):

$$\text{Rows Generated per Parent} = 10 \times 5 \times 2 = 100 \text{ rows!}$$

- For 1,000 blogs, the database returns **100,000 rows** over the network.
- The parent Blog columns (Title, Description, HeaderImage) are duplicated 100 times redundantly.
- EF Core must allocate massive memory buffers to de-duplicate and assemble the object graph.

---

#### 2. The Solution: \`AsSplitQuery()\`
\`AsSplitQuery()\` splits the single monolithic join query into multiple independent, focused SQL queries executed within the same context:

\`\`\`csharp
var blogs = await context.Blogs
    .Include(b => b.Posts)
    .Include(b => b.Tags)
    .AsSplitQuery() // Emits separate SQL queries for Blogs, Posts, and Tags!
    .ToListAsync();
\`\`\`

#### Generated SQL with Split Queries:
1. \`SELECT [b].[Id], [b].[Title] FROM [Blogs] AS [b]\`
2. \`SELECT [p].[Id], [p].[BlogId], [p].[Content] FROM [Posts] AS [p] INNER JOIN [Blogs] AS [b] ON [p].[BlogId] = [b].[Id]\`
3. \`SELECT [t].[Id], [t].[BlogId], [t].[Name] FROM [Tags] AS [t] INNER JOIN [Blogs] AS [b] ON [t].[BlogId] = [b].[Id]\`

Total rows returned across the network: $1 + 10 + 5 = 16 \text{ rows}$ (an **84% reduction** in network payload!).

---

#### 3. Trade-offs: Single Query vs. Split Query

| Dimension | Single Query (\`AsSingleQuery\`) | Split Query (\`AsSplitQuery\`) |
| :--- | :--- | :--- |
| **Network Payload** | High (Cartesian duplication) | **Minimal (Exact rows only)** |
| **Roundtrips** | **1 Roundtrip** | Multiple Roundtrips ($1 + N$) |
| **Snapshot Consistency** | **100% Guaranteed** | Potential skew if data changes mid-flight |
| **Optimal Use Case** | Reference navigations / 1 collection | **Multiple included collections** |`,
    answerContent_fa: `### انفجار دکارتی (Cartesian Explosion) و کوئری‌های تفکیک‌شده (AsSplitQuery)

هنگامی که در EF Core چندین کالکشن فرزند به طور همزمان با \`Include\` واکشی می‌شوند:

#### ۱. علت وقوع انفجار دکارتی:
به دلیل ساختار مسطح جداول در زبان SQL، استفاده از چند \`JOIN\` باعث **ضرب دکارتی** تعداد رکوردهای فرزندان در یکدیگر می‌شود (مثال: ۱۰ پست $\times$ ۵ برچسب $\times$ ۲ نویسنده = ۱۰۰ ردیف بازگشتی به ازای هر وبلاگ!). این حجم عظیم از داده‌های تکراری باعث اشغال پهنای باند شبکه و مصرف شدید حافظه رم سرور برای فیلتر کردن موارد تکراری می‌گردد.

#### ۲. راهکار متد \`AsSplitQuery()\`:
این متد به جای ۱ کوئری غول‌پیکر با JOINهای متقاطع، چند کوئری مجزا و هدفمند به دیتابیس می‌فرستد و داده‌ها را در حافظه به هم متصل می‌کند. در نتیجه تعداد ردیف‌های منتقل‌شده در شبکه از ۱۰۰ به ۱۶ ردیف کاهش می‌یابد.

#### ۳. مقایسه و انتخاب:
- **\`AsSingleQuery\`**: برای روابط یک‌به‌یک یا نهایتاً یک کالکشن فرزند (دارای تضمین یکپارچگی تراکنش).
- **\`AsSplitQuery\`**: برای سناریوهایی که همزمان ۲ یا چند کالکشن فرزند واکشی می‌شوند.`,
  },
  {
    id: "dotnet-mid-q260",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-querying-relationships-loading"],
    questionTitle: "What is the difference between AsNoTracking() and AsNoTrackingWithIdentityResolution() in EF Core, and in what scenarios is Identity Resolution necessary for read queries?",
    questionTitle_fa: "تفاوت میان AsNoTracking() و AsNoTrackingWithIdentityResolution() در EF Core چیست و در چه سناریوهایی فعال‌سازی Identity Resolution در کوئری‌های فقط‌خواندنی الزامی است؟",
    answerContent: `### AsNoTracking vs. AsNoTrackingWithIdentityResolution in EF Core

Both methods bypass EF Core's \`ChangeTracker\` to maximize query performance for read-only scenarios, but they differ fundamentally in how they handle **entity identity in memory**.

---

#### 1. \`AsNoTracking()\`:
- Completely disables change tracking and skips the internal identity map lookup table.
- **Performance:** Fastest execution speed and lowest allocation overhead for flat, non-relational queries.
- **The Duplicate Instance Problem:** If a query returns multiple rows referencing the **same parent entity**, EF Core instantiates a **new, duplicate C# object in memory for every single row**:

\`\`\`csharp
// Querying 100 orders that belong to 2 distinct customers:
var orders = await context.Orders
    .AsNoTracking()
    .Include(o => o.Customer)
    .ToListAsync();

// Result: 100 separate Customer instances are created on the Heap!
// ReferenceEquals(orders[0].Customer, orders[1].Customer) == false (Even if CustomerId is identical!)
\`\`\`

---

#### 2. \`AsNoTrackingWithIdentityResolution()\`:
- Disables change tracking snapshots, but maintains a **lightweight lookup dictionary of entity keys** during query materialization.
- **Result:** If multiple orders belong to Customer #101, all order objects reference the **exact same single \`Customer\` instance** in memory.
- **Reference Equality:** \`ReferenceEquals(orders[0].Customer, orders[1].Customer) == true\`.

---

#### 3. When to Use Which:
- **Use \`AsNoTracking()\`:** For simple flat queries, DTO projections, or when entities have no shared related graphs.
- **Use \`AsNoTrackingWithIdentityResolution()\`:** When eager-loading complex entity graphs with \`Include()\` where child entities are shared across multiple parents, preventing duplicate memory allocations and object graph inconsistencies.`,
    answerContent_fa: `### مقایسه AsNoTracking با AsNoTrackingWithIdentityResolution در EF Core

هر دو متد برای کوئری‌های فقط‌خواندنی (Read-Only) جهت غیرفعال‌سازی ChangeTracker و افزایش چشمگیر سرعت استفاده می‌شوند، اما در مدیریت یکتایی اشیاء در حافظه متفاوتند:

#### ۱. متد \`AsNoTracking()\`:
- بالاترین سرعت و کمترین مصرف رم برای کوئری‌های ساده.
- **مشکل ساخت نمونه‌های تکراری:** اگر ۱۰۰ سفارش واکشی شوند که همگی متعلق به ۱ مشتری خاص باشند، در حافظه رم **۱۰۰ شیء مستقل از کلاس Customer** با مقادیر یکسان ساخته می‌شود (\`ReferenceEquals\` مقدار \`false\` برمی‌گرداند).

#### ۲. متد \`AsNoTrackingWithIdentityResolution()\`:
- ردیابی تغییرات را غیرفعال نگه می‌دارد اما یک جدول سبک از کلیدهای اصلی در حافظه ایجاد می‌کند.
- هر ۱۰۰ سفارش به **دقیقاً یک نمونه واحد از کلاس Customer** در حافظه متصل می‌شوند.

#### جمع‌بندی کاربرد:
- در کوئری‌های فاقد Include یا پروجکشن‌های مستقیم از **\`AsNoTracking\`** استفاده کنید.
- در کوئری‌های رابطه‌ای با \`Include\` که رکوردهای فرزند مشترک دارند، از **\`AsNoTrackingWithIdentityResolution\`** جهت جلوگیری از تکثیر اشیاء در رم استفاده نمایید.`,
  },
  {
    id: "dotnet-mid-q261",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-querying-relationships-loading"],
    questionTitle: "Why is Lazy Loading considered an anti-pattern in modern REST Web APIs, and what runtime exceptions and performance bottlenecks does it introduce?",
    questionTitle_fa: "چرا بارگذاری تنبل (Lazy Loading) در وب‌سرویس‌های مدرن REST یک ضدالگو (Anti-Pattern) محسوب می‌شود و چه استثناها و گلوگاه‌های کارایی در زمان اجرا ایجاد می‌کند؟",
    answerContent: `### Why Lazy Loading is an Anti-Pattern in Modern REST Web APIs

Lazy Loading automatically fetches related data from the database the moment a navigation property is accessed in C# code. While convenient in legacy desktop UI applications (WPF/WinForms), it is considered a **dangerous anti-pattern in modern ASP.NET Core Web APIs**.

---

#### 1. The Accidental N+1 Disaster During JSON Serialization:
When an API controller returns an entity directly, the ASP.NET Core JSON serializer (\`System.Text.Json\` or \`Newtonsoft.Json\`) inspects and reads every public property getter via reflection:
- Accessing \`order.Customer\` triggers a SQL query.
- Accessing \`order.Items\` triggers another SQL query.
- Accessing \`item.Product\` triggers $N$ additional SQL queries!
- A single API response can silently execute **thousands of unexpected database queries**, exhausting connection pools and crashing the database under production load.

---

#### 2. The \`ObjectDisposedException\` Runtime Crash:
In ASP.NET Core, \`DbContext\` is registered with a **Scoped lifetime** and is disposed as soon as the HTTP request handler finishes.
- If an entity is passed to a background service, an asynchronous task, or accessed outside the controller scope, accessing a lazy-loaded property throws:
  \`\`\`text
  System.ObjectDisposedException: Cannot access a disposed context instance.
  \`\`\`

---

#### 3. Sync-Over-Async & Thread Starvation:
Lazy loading properties are accessed via standard C# property getters (e.g. \`order.Customer\`), which **cannot be asynchronous** (\`await\` is not allowed in property getters).
- The framework is forced to execute **synchronous, blocking database I/O** on the .NET Thread Pool, leading to **Thread Starvation** under high concurrent traffic.

---

#### Enterprise Solution:
Disable lazy loading entirely. Use **Eager Loading (\`Include\`)** for write scenarios and **LINQ Select Projections into DTOs** for all read endpoints.`,
    answerContent_fa: `### دلایل ضدالگو بودن Lazy Loading در وب‌سرویس‌های REST

بارگذاری تنبل (Lazy Loading) اطلاعات وابسته را در زمان دسترسی به فیلد ناوبری به صورت خودکار لود می‌کند. این روش در Web APIها شدیداً مخرب است:

#### ۱. بروز فاجعه N+1 در زمان Serialize به JSON:
موتور تبدیل به JSON برای تولید خروجی، تمامی پراپرتی‌های عمومی انتیتی را می‌خواند؛ این کار باعث فراخوانی ناخواسته صدها کوئری همزمان و اشباع فوری دیتابیس می‌شود.

#### ۲. خطای پرتاب استثنای ObjectDisposedException:
طول عمر \`DbContext\` در وب به ازای هر درخواست (Scoped) است. در صورت دسترسی به پراپرتی‌ها پس از اتمام اسکوپ یا در سرویس‌های پس‌زمینه، خطای دسترسی به کانتکست نابودشده پرتاب می‌شود.

#### ۳. پدیده قفل شدن تردها (Thread Starvation):
از آنجا که دسترسی به فیلدهای کلاس (Getterها) نمی‌تواند \`async\` باشد، فریم‌ورک ناچار است ارتباط با دیتابیس را به صورت **همگام و مسدودکننده (Blocking Sync)** اجرا کند که در ترافیک بالا نخ‌های پردازشی سرور را قفل می‌کند.

#### راهکار:
حذف کامل Lazy Loading و استفاده از **Select Projection** برای واکشی مستقیم به DTOها.`,
  },
  {
    id: "dotnet-mid-q262",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-querying-relationships-loading"],
    questionTitle: "How do ExecuteUpdateAsync and ExecuteDeleteAsync in .NET 8/9 optimize bulk data modifications compared to the traditional 'Load-Mutate-Save' pattern?",
    questionTitle_fa: "دستورات ExecuteUpdateAsync و ExecuteDeleteAsync در دات‌نت ۸ و ۹ چگونه عملیات ویرایش و حذف گروهی داده‌ها را در مقایسه با الگوی سنتی 'خواندن-تغییر-ذخیره' بهینه می‌کنند؟",
    answerContent: `### High-Performance Set Operations: ExecuteUpdateAsync & ExecuteDeleteAsync

Prior to .NET 7/8/9, modifying or deleting multiple database rows required the highly inefficient **"Load-Mutate-Save"** pattern.

---

#### 1. The Legacy Anti-Pattern (Load-Mutate-Save):
\`\`\`csharp
// ANTI-PATTERN: Heavy, slow, and memory-intensive!
var expiredTokens = await context.RefreshTokens
    .Where(t => t.ExpiresAtUtc < DateTime.UtcNow)
    .ToListAsync(); // 1. Pulls 50,000 records across the network into RAM!

foreach (var token in expiredTokens)
{
    token.IsRevoked = true; // 2. ChangeTracker tracks 50,000 entity snapshots!
}

await context.SaveChangesAsync(); // 3. Sends 50,000 individual UPDATE statements (or large batches)!
\`\`\`

---

#### 2. Modern Set-Based Operations in .NET 8 & 9:
\`ExecuteUpdateAsync\` and \`ExecuteDeleteAsync\` translate directly into a **single, set-based SQL command executed entirely on the database engine**:

\`\`\`csharp
// 1. Direct Bulk Update (Executes 1 single SQL UPDATE statement):
int updatedCount = await context.RefreshTokens
    .Where(t => t.ExpiresAtUtc < DateTime.UtcNow && !t.IsRevoked)
    .ExecuteUpdateAsync(setters => setters
        .SetProperty(t => t.IsRevoked, true)
        .SetProperty(t => t.RevokedAtUtc, DateTime.UtcNow));

// 2. Direct Bulk Delete (Executes 1 single SQL DELETE statement):
int deletedCount = await context.AuditLogs
    .Where(log => log.CreatedAtUtc < retentionLimit)
    .ExecuteDeleteAsync();
\`\`\`

---

#### 3. Core Architectural Advantages:
1. **300x-500x Faster Performance:** Zero latency from transferring rows across the network.
2. **Zero In-Memory Allocation:** Skips entity materialization, constructor execution, and \`ChangeTracker\` snapshotting.
3. **Respects Global Query Filters:** Soft-delete and multi-tenancy filters defined in \`OnModelCreating\` are automatically injected into the SQL \`WHERE\` clause.

---

#### Important Caveats:
- Because entities are not loaded into C# memory, entity-level validation logic, C# property setters, and EF Core \`SaveChanges\` interceptors do **not** trigger.`,
    answerContent_fa: `### بهینه‌سازی عملیات گروهی با ExecuteUpdateAsync و ExecuteDeleteAsync در دات‌نت ۸ و ۹

در نسخه‌های سنتی، ویرایش یا حذف گروهی داده‌ها با الگوی پرهزینه "واکشی در رم ➔ ویرایش فیلدها ➔ ثبت با SaveChanges" انجام می‌شد که باعث اشغال گیگابایت‌ها رم و تولید هزاران کوئری مجزا می‌گردید.

#### سازوکار دستورات مستقیم دیتابیسی (Set-Based):
متدهای \`ExecuteUpdateAsync\` و \`ExecuteDeleteAsync\` عملیات را مستقیماً به یک دستور واحد SQL در سمت سرور دیتابیس ترجمه می‌کنند:

\`\`\`csharp
// ویرایش گروهی مستقیم در دیتابیس بدون لود در رم:
int updated = await context.RefreshTokens
    .Where(t => t.ExpiresAtUtc < DateTime.UtcNow && !t.IsRevoked)
    .ExecuteUpdateAsync(s => s
        .SetProperty(t => t.IsRevoked, true)
        .SetProperty(t => t.RevokedAtUtc, DateTime.UtcNow));
\`\`\`

#### مزایای کلیدی:
۱. **سرعت ۳۰۰ تا ۵۰۰ برابری**: بدون نیاز به انتقال داده‌ها در شبکه.
۲. **مصرف رم صفر**: بدون ساخت اشیاء در حافظه C# و بدون درگیر شدن ChangeTracker.
۳. **پشتیبانی از Global Query Filters**: شروط حذف نرم و Multi-Tenancy به صورت خودکار در عبارت WHERE کوئری اعمال می‌شوند.`,
  },
  {
    id: "dotnet-mid-q263",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-migrations-seeding-transactions"],
    questionTitle: "How does the EF Core Migrations engine work internally (ModelSnapshot vs IMigrationsModelDiffer), and how does the __EFMigrationsHistory table track applied schema versions?",
    questionTitle_fa: "موتور مایگریشن در EF Core در سطح داخلی چگونه کار می‌کند (مقایسه ModelSnapshot با IMigrationsModelDiffer) و جدول __EFMigrationsHistory چگونه نسخه‌های اعمال‌شده شمای دیتابیس را ردیابی می‌کند؟",
    answerContent: `### Internal Architecture of EF Core Migrations

When you run \`dotnet ef migrations add <Name>\`, EF Core uses a deterministic diffing engine to generate C# migration operations.

---

#### 1. The Core Internal Components:
1. **\`AppDbContextModelSnapshot.cs\` (Model Snapshot):**
   - Represents the complete state of the C# metadata model as of the **most recent migration**. It is updated every time a new migration is scaffolded.
2. **\`IMigrationsModelDiffer\` (The Diffing Engine):**
   - Compares the entity metadata in your current \`DbContext\` against \`AppDbContextModelSnapshot\`.
   - Computes the AST delta (e.g. Added Tables, Renamed Columns, Changed Foreign Keys, Altered Precision).
3. **\`{Timestamp}_{Name}.cs\` & \`{Timestamp}_{Name}.Designer.cs\`:**
   - Generates the \`Up(MigrationBuilder)\` and \`Down(MigrationBuilder)\` operations representing the exact delta.

---

#### 2. The \`__EFMigrationsHistory\` Tracking Engine:
When migrations are applied to the target database (via bundle or script), EF Core maintains an internal tracking table:

\`\`\`sql
CREATE TABLE [__EFMigrationsHistory] (
    [MigrationId] nvarchar(150) NOT NULL PRIMARY KEY,
    [ProductVersion] nvarchar(32) NOT NULL
);
\`\`\`

- **Execution Flow:** Before running any DDL scripts, EF Core queries \`SELECT [MigrationId] FROM [__EFMigrationsHistory]\`.
- It calculates the difference between migrations existing in your compiled code and rows present in \`__EFMigrationsHistory\`.
- Only pending migrations are executed in strict chronological order, each writing an audit row upon successful transaction commit.`,
    answerContent_fa: `### کالبدشکافی معماری داخلی موتور Migrations در EF Core

هنگام اجرای دستور ساخت مایگریشن، EF Core از یک موتور محاسبه تفاوت (Diffing Engine) برای تولید دستورات C# استفاده می‌کند:

#### ۱. مؤلفه‌های کلیدی داخلی:
۱. **فایل \`AppDbContextModelSnapshot.cs\`**: نمایانگر تصویر کامل آخرین وضعیت مدل دیتابیس تا قبل از تغییرات جدید.
۲. **موتور \`IMigrationsModelDiffer\`**: مقایسه کد فعلی C# با اسنپ‌شات قبلی و استخراج دقیق تفاوت‌ها (ستون‌های جدید، تغییر تایپ، کلیدهای خارجی).
۳. **فایل مایگریشن (\`{Timestamp}_{Name}.cs\`)**: شامل متدهای \`Up\` (اعمال رو به جلو) و \`Down\` (بازگشت به عقب).

#### ۲. سازوکار جدول \`__EFMigrationsHistory\`:
فریم‌ورک در دیتابیس جدولی به نام \`__EFMigrationsHistory\` می‌سازد. قبل از اعمال تغییرات، لیست شناسه‌های موجود در این جدول را خوانده و فقط مایگریشن‌هایی که هنوز در این جدول ثبت نشده‌اند را به ترتیب تاریخ اعمال و نام آن‌ها را ذخیره می‌نماید.`,
  },
  {
    id: "dotnet-mid-q264",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-migrations-seeding-transactions"],
    questionTitle: "Why is executing Database.Migrate() at application startup considered a dangerous anti-pattern in multi-instance production environments, and how do Migration Bundles resolve this?",
    questionTitle_fa: "چرا اجرای Database.Migrate() در استارتاپ برنامه در محیط‌های پروداکشن چندنسخه‌ای یک ضدالگو (Anti-Pattern) خطرناک محسوب می‌شود و Migration Bundles چگونه این چالش را حل می‌کند؟",
    answerContent: `### Why Database.Migrate() is an Anti-Pattern in Production

Invoking \`context.Database.Migrate()\` or \`MigrateAsync()\` inside \`Program.cs\` during application startup is popular in development, but introduces catastrophic risks in containerized production environments (Kubernetes, AWS ECS, Docker Swarm).

---

#### 1. Production Hazards of Startup Migrations:
1. **Multi-Replica Race Conditions & Deadlocks:** When 10 application pods scale up simultaneously, all 10 attempt to run DDL schema alterations concurrently against the same database, causing schema locking deadlocks or partial state corruption.
2. **Violation of Least Privilege Security:** For \`Database.Migrate()\` to succeed, the Web API connection string requires **DDL permissions** (\`CREATE TABLE\`, \`ALTER TABLE\`, \`DROP TABLE\`). In secure architectures, the Web API should only hold **DML permissions** (\`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`).
3. **Pod Health-Check & Liveness Timeouts:** A heavy schema migration (e.g. creating indexes on 10M rows) takes minutes. Kubernetes will mark the pod as unresponsive and kill it mid-migration!

---

#### 2. The Solution: Migration Bundles (\`dotnet ef migrations bundle\`)
Migration Bundles produce a self-contained, standalone executable containing all migration logic:

\`\`\`bash
# 1. CI Pipeline: Build standalone bundle executable
dotnet ef migrations bundle --project Infrastructure --startup-project WebApi --output ./migrate.exe

# 2. CD Release Pipeline: Execute using dedicated elevated DBA service account BEFORE web pods deploy!
./migrate.exe --connection "Server=prod-db;Database=ProductionDb;User Id=dba_deployer;Password=***;"
\`\`\`

#### Benefits of Migration Bundles:
- Runs as an **isolated, single-instance pipeline step** before any new application code is deployed.
- Requires zero .NET SDK installation on deployment agents.
- Enforces strict security boundary separation between runtime API credentials and deployment DBA credentials.`,
    answerContent_fa: `### خطرات اجرای Database.Migrate() در پروداکشن و مزایای Migration Bundles

فراخوانی \`context.Database.Migrate()\` در زمان استارتاپ برنامه در محیط‌های پروداکشن و کانتینری یک **ضدالگو (Anti-Pattern)** بزرگ است:

#### ۱. دلایل ممنوعیت در پروداکشن:
۱. **پدیده Race Condition در کلاسترهای ابری:** با بالا آمدن همزمان چند پاد (Pod) در کوبرنتیز، تمامی نمونه‌ها همزمان تلاش به تغییر ساختار جداول می‌کنند که منجر به Deadlock و خطاهای سیستمی می‌شود.
۲. **نقض امنیت و اصل Least Privilege:** وب‌سرویس برای اجرای مایگریشن نیازمند دسترسی‌های سطح بالای DDL (مانند ساخت و حذف جدول) می‌شود؛ در حالی که وب‌اپلیکیشن در پروداکشن فقط باید مجوزهای DML (خواندن/نوشتن) داشته باشد.
۳. **تایم‌اوت پراب‌های سلامت کوبرنتیز:** طولانی شدن مایگریشن باعث ریستارت مداوم کانتینر توسط کوبرنتیز و ناقص ماندن تغییرات دیتابیس می‌شود.

#### ۲. راهکار استاندارد با Migration Bundles:
دستور \`dotnet ef migrations bundle\` یک فایل اجرایی مستقل (\`migrate.exe\`) می‌سازد که در پایپ‌لاین CI/CD **قبل از استقرار وب‌سرویس** و با اکانت اختصاصی DBA به صورت تک‌نسخه‌ای و کاملاً امن اجرا می‌شود.`,
  },
  {
    id: "dotnet-mid-q265",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-migrations-seeding-transactions"],
    questionTitle: "What is the difference between HasData() seeding in OnModelCreating and runtime async data seeders, and what restrictions apply to HasData()?",
    questionTitle_fa: "تفاوت میان سیدینگ داده با متد HasData() در OnModelCreating و سرویس‌های سیدر ناهمگام در زمان اجرا چیست و چه محدودیت‌هایی برای HasData() وجود دارد؟",
    answerContent: `### Data Seeding: ModelBuilder \`HasData()\` vs. Runtime Seeders

EF Core provides two primary mechanisms for seeding initial application data, each tailored to distinct data lifecycles.

---

#### 1. ModelBuilder \`HasData()\` (Static Lookup Tables):
\`HasData()\` embeds data directly into the EF Core metadata model and migration files as \`INSERT DATA\` statements:

\`\`\`csharp
public class OrderStatusConfiguration : IEntityTypeConfiguration<OrderStatus>
{
    public void Configure(EntityTypeBuilder<OrderStatus> builder)
    {
        builder.HasData(
            new OrderStatus { Id = 1, Code = "PENDING", DisplayName = "Pending Payment" },
            new OrderStatus { Id = 2, Code = "PROCESSING", DisplayName = "In Processing" },
            new OrderStatus { Id = 3, Code = "COMPLETED", DisplayName = "Completed" }
        );
    }
}
\`\`\`

#### Critical Restrictions of \`HasData()\`:
- **Explicit Primary Keys Required:** Primary key values must be hardcoded explicitly; database autoincrement identity generation is bypassed.
- **Strictly Deterministic Values Only:** Never use \`DateTime.UtcNow\` or \`Guid.NewGuid()\`! Because EF Core detects diffs on every \`migrations add\`, non-deterministic values cause EF Core to generate duplicate \`UPDATE\` scripts on every single migration.

---

#### 2. Runtime Async Data Seeders (\`IDataSeeder\`):
Custom C# classes executed during application initialization outside the migrations engine:

\`\`\`csharp
public class DefaultAdminSeeder(AppDbContext context, IPasswordHasher<User> hasher)
{
    public async Task SeedAsync()
    {
        if (!await context.Users.AnyAsync(u => u.Email == "admin@domain.com"))
        {
            var admin = new User { Id = Guid.NewGuid(), Email = "admin@domain.com" };
            admin.PasswordHash = hasher.HashPassword(admin, "SecureP@ss123");
            context.Users.Add(admin);
            await context.SaveChangesAsync();
        }
    }
}
\`\`\`
- Best for: Dynamic data, hashed credentials, test/demo environments, or fetching seed data from external APIs.`,
    answerContent_fa: `### مقایسه روش‌های Seed کردن داده‌ها: متد HasData در برابر Seederهای زمان اجرا

#### ۱. متد \`HasData()\` در Fluent API (داده‌های ثابت سیستمی):
- داده‌ها مستقیماً در متد \`OnModelCreating\` تعریف شده و در قالب دستورات \`INSERT\` وارد فایل‌های مایگریشن می‌شوند.
- **محدودیت‌های مهم:**
  - کلید اصلی (ID) باید حتماً به صورت صریح مقداردهی شود.
  - نباید از توابع غیرقطعی مانند \`DateTime.UtcNow\` یا \`Guid.NewGuid()\` استفاده شود؛ زیرا در هر بار ساخت مایگریشن، فریم‌ورک آن را به عنوان یک تغییر شناسایی کرده و دستورات \`UPDATE\` تکراری می‌سازد.

#### ۲. سرویس‌های ناهمگام Seeder در زمان اجرا (داده‌های پویا):
- یک سرویس اختصاصی که در زمان راه‌اندازی اولیه برنامه، پس از بررسی عدم وجود رکورد (\`AnyAsync\`)، داده‌ها را ایجاد می‌کند.
- **کاربرد:** ایجاد کاربر پیش‌فرض با رمز عبور هش‌شده، داده‌های تستی محیط Development و بارگذاری داده از فایل‌های خارجی.`,
  },
  {
    id: "dotnet-mid-q266",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-migrations-seeding-transactions"],
    questionTitle: "What are Database Savepoints in EF Core, and how do they enable partial rollback within an explicit transaction?",
    questionTitle_fa: "نقاط ذخیره موقت (Savepoints) در EF Core چیستند و چگونه امکان بازگردانی جزئی (Partial Rollback) را در یک تراکنش صریح فراهم می‌کنند؟",
    answerContent: `### Database Savepoints in Entity Framework Core

A **Savepoint** is a bookmark created within an active database transaction that allows the application to **roll back a portion of the transaction** without aborting and discarding the entire transaction.

---

#### 1. Why Savepoints Are Essential:
In complex business workflows (e.g. e-commerce checkout), you may want the primary entity (the Order) to be committed even if an optional secondary operation (e.g. awarding bonus loyalty points or sending a notification log) fails.

---

#### 2. Implementation with \`CreateSavepointAsync\` & \`RollbackToSavepointAsync\`:

\`\`\`csharp
await using var transaction = await context.Database.BeginTransactionAsync();

try
{
    // Step 1: Create Core Order (Must succeed)
    var order = new Order { CustomerId = customerId, TotalAmount = 500 };
    context.Orders.Add(order);
    await context.SaveChangesAsync();

    // Step 2: Create Savepoint Bookmark
    await transaction.CreateSavepointAsync("OrderPersistedSavepoint");

    try
    {
        // Step 3: Attempt optional loyalty point deduction
        var points = new LoyaltyTransaction { CustomerId = customerId, PointsUsed = 50 };
        context.LoyaltyTransactions.Add(points);
        await context.SaveChangesAsync();
    }
    catch (LoyaltyServiceException)
    {
        // Step 4: Rollback ONLY loyalty deduction, preserving the Order!
        await transaction.RollbackToSavepointAsync("OrderPersistedSavepoint");
    }

    // Step 5: Commit the transaction (Order is saved!)
    await transaction.CommitAsync();
}
catch (Exception)
{
    // Fatal failure: Abort the entire transaction
    await transaction.RollbackAsync();
    throw;
}
\`\`\``,
    answerContent_fa: `### نقاط ذخیره موقت (Savepoints) در EF Core و بازگردانی جزئی تراکنش‌ها

یک **Savepoint** نشانه‌ای درون یک تراکنش فعال است که به برنامه اجازه می‌دهد در صورت بروز خطا در یک بخش فرعی، **تنها همان بخش را Rollback کند** بدون اینکه کل تراکنش اصلی لغو شود.

#### نمونه کاربرد در سناریوهای واقعی:
در فرآیند ثبت سفارش، ثبت فاکتور اصلی اجباری است اما کسر امتیاز وفاداری یا ثبت لاگ فرعی اختیاری است:
۱. سفارش ثبت شده و متد \`SaveChangesAsync\` فراخوانی می‌شود.
۲. با متد \`transaction.CreateSavepointAsync("OrderSaved")\` یک نقطه ذخیره موقت ایجاد می‌شود.
۳. عملیات کسر امتیاز اجرا می‌گردد؛ در صورت بروز خطا، با متد \`RollbackToSavepointAsync("OrderSaved")\` تنها عملیات امتیاز بازگردانده شده و سفارش اصلی با متد \`CommitAsync\` با موفقیت در دیتابیس ذخیره می‌شود.`,
  },
  {
    id: "dotnet-mid-q267",
    stackId: "dotnet",
    categoryId: "ef-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-efcore-migrations-seeding-transactions"],
    questionTitle: "Why do manual transactions throw an InvalidOperationException when EnableRetryOnFailure is enabled, and how does CreateExecutionStrategy().ExecuteAsync() solve it?",
    questionTitle_fa: "چرا تراکنش‌های دستی در زمان فعال بودن EnableRetryOnFailure خطای InvalidOperationException پرتاب می‌کنند و متد CreateExecutionStrategy().ExecuteAsync() چگونه آن را برطرف می‌سازد؟",
    answerContent: `### Resilient Transactions with ExecutionStrategy in EF Core

When connecting to cloud databases (Azure SQL, AWS Aurora, PostgreSQL), transient network faults occur. EF Core provides **Connection Resiliency** via \`EnableRetryOnFailure()\`.

---

#### 1. Why Manual \`BeginTransactionAsync()\` Throws an Exception:
\`\`\`csharp
// Program.cs:
options.UseSqlServer(connectionString, sqlOptions => sqlOptions.EnableRetryOnFailure());

// Service Layer:
await using var transaction = await context.Database.BeginTransactionAsync(); // CRASH!
\`\`\`

**The Reason:** If a transient network glitch occurs after statement #1 executes, EF Core cannot automatically re-execute statement #2 without risking re-executing the entire transaction and duplicating side-effects. EF Core prevents this by throwing:
\`\`\`text
System.InvalidOperationException: The configured execution strategy 'SqlServerRetryingExecutionStrategy' does not support user-initiated transactions.
\`\`\`

---

#### 2. The Solution: Wrapping in \`CreateExecutionStrategy()\`
The entire transaction block must be wrapped inside the execution strategy delegate, allowing EF Core to safely retry the **complete unit of work** from scratch if a transient connection failure drops the connection:

\`\`\`csharp
var strategy = context.Database.CreateExecutionStrategy();

await strategy.ExecuteAsync(async () =>
{
    // The execution strategy manages retrying the entire block if a transient error occurs:
    await using var transaction = await context.Database.BeginTransactionAsync();

    context.Orders.Add(order);
    await context.SaveChangesAsync();

    context.Invoices.Add(new Invoice { OrderId = order.Id, Total = order.TotalAmount });
    await context.SaveChangesAsync();

    await transaction.CommitAsync();
});
\`\`\``,
    answerContent_fa: `### تراکنش‌های تاب‌آور با ExecutionStrategy در زمان فعال بودن تلاش مجدد خودکار

هنگام اتصال به دیتابیس‌های ابری، قابلیت \`EnableRetryOnFailure\` تلاش مجدد خودکار در صورت قطع موقت شبکه را فعال می‌کند.

#### علت پرتاب خطای InvalidOperationException:
اگر یک تراکنش دستی با \`BeginTransactionAsync\` باز شود و در میانه کار ارتباط قطع گردد، EF Core نمی‌تواند حدس بزند کدام دستورات اعمال شده‌اند؛ بنابراین برای جلوگیری از تکرار ناخواسته تراکنش‌ها، خطای عدم پشتیبانی از تراکنش دستی را پرتاب می‌کند.

#### راهکار با متد \`CreateExecutionStrategy\`:
کل بلاک باز کردن تراکنش، تغییرات و Commit باید درون کالبک متد \`strategy.ExecuteAsync\` قرار گیرد تا در صورت قطعی شبکه، کل تراکنش از ابتدا به صورت خودکار و اتمیک مجدداً تلاش شود:

\`\`\`csharp
var strategy = context.Database.CreateExecutionStrategy();
await strategy.ExecuteAsync(async () =>
{
    await using var transaction = await context.Database.BeginTransactionAsync();
    context.Orders.Add(order);
    await context.SaveChangesAsync();
    await transaction.CommitAsync();
});
\`\`\``,
  },
  {
    id: "dotnet-mid-q268",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-jwt-bearer-claims-identity"],
    questionTitle: "What is the structural anatomy of a JSON Web Token (Header, Payload, Signature), and what is the difference between Symmetric (HS256) and Asymmetric (RS256) signing in microservice architectures?",
    questionTitle_fa: "ساختار سه‌گانه یک توکن JWT (شامل Header، Payload و Signature) چگونه تشکیل می‌شود و تفاوت الگوریتم‌های امضای متقارن (HS256) و نامتقارن (RS256) در معماری‌های میکروسرویسی چیست؟",
    answerContent: `### Structure of JSON Web Tokens & Signing Cryptography

A **JSON Web Token (JWT / RFC 7519)** is a compact, URL-safe representation of claims transferred between client and server.

---

#### 1. The Three Segments of a JWT:
A token consists of three Base64Url-encoded strings separated by periods (\`.\`):

\`\`\`text
[Base64Url(Header)].[Base64Url(Payload)].[Base64Url(Signature)]
\`\`\`

1. **Header:** Contains token metadata and cryptographic algorithm:
   \`\`\`json
   { "alg": "HS256", "typ": "JWT" }
   \`\`\`
2. **Payload (Claims):** Contains the identity statements:
   - **Registered Claims:** \`sub\` (User ID), \`iss\` (Issuer), \`aud\` (Audience), \`exp\` (Expiration), \`nbf\` (Not Before), \`jti\` (JWT Unique ID).
   - **Custom Claims:** \`email\`, \`roles\`, \`tenant_id\`.
3. **Signature:** Verifies that the sender is authentic and the message was not tampered with:
   $$\text{Signature} = \text{HMACSHA256}(\text{Base64Url(Header)} + "." + \text{Base64Url(Payload)}, \text{SecretKey})$$

---

#### 2. Symmetric (HS256) vs. Asymmetric (RS256 / ES256) Signing:

| Feature | Symmetric (\`HS256\`) | Asymmetric (\`RS256\` / \`ES256\`) |
| :--- | :--- | :--- |
| **Key Architecture** | Single Shared Secret Key | Public / Private Key Pair |
| **Token Signing** | Identity Server signs with Secret Key | Identity Server signs with **Private Key** |
| **Token Validation** | Every Resource API needs the **Same Secret Key** | Resource APIs validate with **Public Key (JWKS)** |
| **Blast Radius** | If 1 microservice leaks the secret, all are compromised | Zero signing risk; public key cannot forge tokens |
| **Best Architecture** | Monoliths / Small Private Microservices | **Distributed Microservices, OAuth2 / OIDC** |`,
    answerContent_fa: `### ساختار سه‌گانه توکن JWT و مقایسه امضای متقارن با نامتقارن

یک توکن **JSON Web Token (JWT)** شامل سه بخش کدگذاری‌شده با الگوریتم Base64Url است:

#### ۱. بخش‌های سه‌گانه:
۱. **بخش Header**: مشخص‌کننده الگوریتم رمزنگاری (\`alg\`) و نوع توکن (\`typ\`).
۲. **بخش Payload**: حامل کلیم‌ها و اطلاعات هویتی کاربر (شامل کلیم‌های استاندارد \`sub\`، \`iss\`، \`aud\`، \`exp\`، \`jti\` و کلیم‌های سفارشی مانند نقش‌ها).
۳. **بخش Signature**: امضای دیجیتال که از ترکیب هدر، پی‌لود و کلید رمزنگاری تولید می‌شود تا از عدم دستکاری محتوا اطمینان حاصل شود.

#### ۲. مقایسه امضای متقارن (HS256) با نامتقارن (RS256):
- **متقارن (HS256)**: هر دو سرور احراز هویت و وب‌سرویس‌های مقصد از یک کلید مشترک (Secret Key) استفاده می‌کنند. در صورت لو رفتن کلید در یکی از میکروسرویس‌ها، امنیت کل سامانه به خطر می‌افتد.
- **نامتقارن (RS256)**: سرور احراز هویت تنها با **کلید خصوصی (Private Key)** توکن را امضا کرده و تمامی میکروسرویس‌ها تنها با داشتن **کلید عمومی (Public Key)** صحت توکن را بررسی می‌کنند؛ بنابراین خطر جعل توکن به صفر می‌رسد.`,
  },
  {
    id: "dotnet-mid-q269",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-jwt-bearer-claims-identity"],
    questionTitle: "What are the essential TokenValidationParameters when configuring AddJwtBearer in ASP.NET Core, and why must ClockSkew be explicitly minimized?",
    questionTitle_fa: "پارامترهای اساسی TokenValidationParameters در زمان تنظیم AddJwtBearer در ASP.NET Core چیستند و چرا کاهش پارامتر ClockSkew یک ضرورت امنیتی است؟",
    answerContent: `### TokenValidationParameters Configuration & The ClockSkew Security Trap

When configuring \`AddJwtBearer\` in ASP.NET Core, the **\`TokenValidationParameters\`** class governs which cryptographic and identity assertions are enforced.

---

#### 1. Core Configuration in \`Program.cs\`:
\`\`\`csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)),

            ValidateLifetime = true,

            // CRITICAL FIX: Eliminate the dangerous default 5-minute leeway!
            ClockSkew = TimeSpan.Zero,

            NameClaimType = "name",
            RoleClaimType = "roles"
        };
    });
\`\`\`

---

#### 2. The Dangerous \`ClockSkew\` Trap:
By default, Microsoft's JWT handler applies a **5-minute default \`ClockSkew\`** to tolerate clock drift across distributed physical servers.

#### The Security Threat:
If your security policy specifies that Access Tokens expire in **15 minutes** (\`exp = Now + 15m\`), the default \`ClockSkew\` keeps the token **valid for 20 minutes** on the server!
- If an access token is stolen, the attacker has a 33% longer window to exploit the compromised token.
- **Rule of Thumb:** Always set \`ClockSkew = TimeSpan.Zero\` (or \`TimeSpan.FromSeconds(30)\` if slight clock drift exists) to enforce strict, predictable expiration windows.`,
    answerContent_fa: `### تنظیمات اساسی TokenValidationParameters و تله امنیتی ClockSkew

هنگام پیکربندی احراز هویت با \`AddJwtBearer\`، اعتبارسنجی توکن‌ها بر عهده شیء \`TokenValidationParameters\` است:

#### ۱. پارامترهای حیاتی:
- **\`ValidateIssuer\` / \`ValidIssuer\`**: اطمینان از اینکه توکن توسط سرور معتبر صادر شده است.
- **\`ValidateAudience\` / \`ValidAudience\`**: اطمینان از اینکه توکن برای مصرف همین API مشخص صادر شده است.
- **\`ValidateIssuerSigningKey\`**: اعتبارسنجی امضای دیجیتال توکن با کلید مخفی یا کلید عمومی.
- **\`ValidateLifetime\`**: بررسی نگذشتن از زمان انقضا (\`exp\`).

#### ۲. تله امنیتی ClockSkew:
فریم‌ورک دات‌نت به طور پیش‌فرض یک زمان ارفاق **۵ دقیقه‌ای (ClockSkew)** برای پوشش اختلاف ساعت سرورها در نظر می‌گیرد. اگر طول عمر توکن شما ۱۵ دقیقه تنظیم شده باشد، سرور تا **۲۰ دقیقه** توکن را معتبر می‌شناسد! برای جلوگیری از سوءاستفاده مهاجمان، مقدار \`ClockSkew\` باید به \`TimeSpan.Zero\` یا حداکثر چند ثانیه محدود شود.`,
  },
  {
    id: "dotnet-mid-q270",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-jwt-bearer-claims-identity"],
    questionTitle: "How does the ClaimsPrincipal and ClaimsIdentity model work in ASP.NET Core, and how do you safely extract user claims from HttpContext.User?",
    questionTitle_fa: "مدل سلسله‌مراتبی ClaimsPrincipal و ClaimsIdentity در ASP.NET Core چگونه کار می‌کند و چگونه کلیم‌های کاربر را به صورت ایمن از HttpContext.User استخراج کنیم؟",
    answerContent: `### ClaimsPrincipal & ClaimsIdentity Architecture in ASP.NET Core

In .NET, user identity is represented through a hierarchical, identity-agnostic security model.

---

#### 1. The Security Hierarchy:
\`\`\`text
┌────────────────────────────────────────────────────────┐
│                   ClaimsPrincipal                      │ (Represents the User / HttpContext.User)
│  ┌──────────────────────────────────────────────────┐  │
│  │                  ClaimsIdentity                  │  │ (e.g. JWT Bearer Identity, Cookie Identity)
│  │  ┌───────────────┐ ┌───────────────┐ ┌────────┐  │  │
│  │  │ Claim: sub    │ │ Claim: email  │ │ Claim: │  │  │ (Individual statements of truth)
│  │  │ "usr_1029"    │ │ "dev@corp.com"│ │ "roles"│  │  │
│  │  └───────────────┘ └───────────────┘ └────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
\`\`\`

- **\`Claim\`**: A single key-value statement of fact (e.g. \`Type: "email", Value: "user@domain.com"\`).
- **\`ClaimsIdentity\`**: A collection of claims bundled under a specific authentication scheme (e.g. \`"Bearer"\`).
- **\`ClaimsPrincipal\`**: A wrapper that can hold multiple identities (e.g. a user authenticated via both a JWT bearer and a client certificate).

---

#### 2. Writing Safe Extension Methods for Identity Extraction:

\`\`\`csharp
public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var idClaim = principal.FindFirst("sub")?.Value 
            ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new UnauthorizedAccessException("Missing subject (sub) claim.");

        return Guid.Parse(idClaim);
    }

    public static string GetUserEmail(this ClaimsPrincipal principal) =>
        principal.FindFirst("email")?.Value 
        ?? principal.FindFirst(ClaimTypes.Email)?.Value 
        ?? string.Empty;

    public static bool HasRole(this ClaimsPrincipal principal, string role) =>
        principal.IsInRole(role) || principal.HasClaim("roles", role);
}
\`\`\``,
    answerContent_fa: `### ساختار سلسله‌مراتبی ClaimsPrincipal و ClaimsIdentity در دات‌نت

در ASP.NET Core، اطلاعات هویتی کاربر در قالب یک ساختار چندلایه نگهداری می‌شود:

#### ۱. سلسله‌مراتب هویتی:
- **\`Claim\`**: کوچک‌ترین واحد اطلاعاتی شامل یک کلید و مقدار (مثال: \`email: "user@domain.com"\`).
- **\`ClaimsIdentity\`**: مجموعه‌ای از کلیم‌ها که تحت یک پروتکل احراز هویت خاص (مانند Bearer) قرار دارند.
- **\`ClaimsPrincipal\`**: شیء اصلی که کانتکست کاربر (\`HttpContext.User\`) را نمایندگی می‌کند و می‌تواند یک یا چند هویت مختلف داشته باشد.

#### ۲. متدهای توسعه‌یافته جهت خواندن ایمن اطلاعات:
با نوشتن متدهای Extension روی شیء \`ClaimsPrincipal\`، دسترسی به شناسه کاربر (\`sub\`) و ایمیل بدون نیاز به تکرار رشته‌های متنی (Magic Strings) در کنترلرها و اندپوینت‌ها فراهم می‌شود.`,
  },
  {
    id: "dotnet-mid-q271",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-jwt-bearer-claims-identity"],
    questionTitle: "How do you implement the Refresh Token Rotation (RTR) pattern with automatic Reuse Detection (Family Revocation) to secure stateless JWT sessions?",
    questionTitle_fa: "الگوی چرخش Refresh Token (RTR) به همراه شناسایی استفاده مجدد (Reuse Detection و ابطال خانوادگی توکن‌ها) برای ایمن‌سازی نشست‌های JWT چگونه پیاده‌سازی می‌شود؟",
    answerContent: `### Refresh Token Rotation (RTR) & Breach Reuse Detection

Because JWT access tokens are stateless, they must remain short-lived (10-15 minutes). To maintain a smooth user experience, **Refresh Token Rotation (RTR)** allows clients to obtain new access tokens while mitigating token theft.

---

#### 1. Refresh Token Rotation (RTR) Mechanics:
Every time a client requests a new access token using a refresh token:
1. The submitted refresh token is immediately marked as **\`IsUsed = true\`**.
2. The server generates and returns a **NEW Access Token** and a **NEW Refresh Token**.
3. A single refresh token can **never be used twice**.

---

#### 2. Automatic Reuse Detection (Family Revocation):
If an attacker intercepts a refresh token and uses it *after* the legitimate client has already rotated it:

\`\`\`csharp
public async Task<TokenResult> RefreshAsync(string rawRefreshToken)
{
    var tokenHash = Hash(rawRefreshToken);
    var token = await context.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

    if (token == null)
        throw new SecurityTokenException("Token does not exist.");

    // BREACH DETECTION: If a previously used token is submitted again,
    // an attacker has stolen the token family!
    if (token.IsUsed)
    {
        // REVOKE ALL REFRESH TOKENS FOR THIS USER IMMEDIATELY!
        await context.RefreshTokens
            .Where(t => t.UserId == token.UserId)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.IsRevoked, true));

        throw new SecurityTokenException("Security alert: Token reuse detected. All active sessions terminated.");
    }

    // Standard rotation
    token.IsUsed = true;
    var newPair = GenerateTokenPair(token.UserId);
    context.RefreshTokens.Add(newPair.RefreshTokenEntity);
    await context.SaveChangesAsync();

    return newPair;
}
\`\`\``,
    answerContent_fa: `### الگوی چرخش Refresh Token (RTR) و شناسایی نشت امنیتی (Reuse Detection)

از آنجا که توکن‌های دسترسی JWT کوتاه عمر هستند (۱۰ تا ۱۵ دقیقه)، الگوی **Refresh Token Rotation (RTR)** برای تمدید امن نشست‌ها به کار می‌رود:

#### ۱. سازوکار چرخش توکن (RTR):
به ازای هر بار درخواست تمدید، توکن رفرش مصرف‌شده بلافاصله در دیتابیس علامت \`IsUsed = true\` خورده و یک جفت توکن جدید (Access Token جدید + Refresh Token جدید) به کلاینت تحویل داده می‌شود؛ بنابراین هر توکن رفرش فقط و فقط یکبار قابل استفاده است.

#### ۲. شناسایی استفاده مجدد (Reuse Detection) و ابطال گروهی:
اگر یک توکن رفرش که قبلاً مصرف شده مجدداً به سرور ارسال شود، نشانه قطعی این است که توکن توسط یک مهاجم سرقت شده است. سرور بلافاصله وضعیت خطر اعلام کرده و **تمامی توکن‌های رفرش فعال آن کاربر را در دیتابیس باطل (Revoke) می‌کند** تا نشست مهاجم و کاربر هر دو قطع شده و کاربر مجبور به لاگین مجدد شود.`,
  },
  {
    id: "dotnet-mid-q272",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-jwt-bearer-claims-identity"],
    questionTitle: "Where should Refresh Tokens and Access Tokens be stored on the client side, and why are HttpOnly, Secure, SameSite=Strict cookies superior to localStorage?",
    questionTitle_fa: "توکن‌های دسترسی و Refresh Tokenها در سمت کلاینت باید در کجا ذخیره شوند و چرا استفاده از کوکی‌های HttpOnly، Secure و SameSite=Strict نسبت به localStorage برتری امنیتی قطعی دارد؟",
    answerContent: `### Client-Side Token Storage Security: Cookies vs. LocalStorage

The location where client applications store authentication tokens dictates their susceptibility to **Cross-Site Scripting (XSS)** and **Cross-Site Request Forgery (CSRF)** attacks.

---

#### 1. Why \`localStorage\` is Vulnerable:
- Any JavaScript code running on the domain (including third-party npm packages, analytics scripts, or injected XSS payloads) has unrestricted read access to \`localStorage\`.
- If an XSS vulnerability exists, an attacker can execute \`localStorage.getItem('token')\` and instantly exfiltrate the user's credentials to an external server.

---

#### 2. The Superiority of \`HttpOnly\`, \`Secure\`, \`SameSite=Strict\` Cookies:

\`\`\`csharp
Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
{
    HttpOnly = true,                  // 1. Immune to XSS: JavaScript CANNOT read this cookie!
    Secure = true,                    // 2. Transmitted ONLY over encrypted HTTPS connections.
    SameSite = SameSiteMode.Strict,   // 3. Immune to CSRF: Browser will NEVER send on third-party links.
    Expires = DateTimeOffset.UtcNow.AddDays(7),
    Path = "/api/auth/refresh"        // 4. Restricted scope: Sent ONLY to the refresh endpoint!
});
\`\`\`

---

#### 3. Best Practice Architecture:
- **Access Token:** Stored in **C# / JavaScript in-memory variables** (destroyed on page reload or tab close).
- **Refresh Token:** Stored in an **\`HttpOnly\`, \`Secure\`, \`SameSite=Strict\` Cookie** scoped strictly to the refresh endpoint path (\`/api/auth/refresh\`).`,
    answerContent_fa: `### مقایسه امنیت ذخیره‌سازی توکن‌ها در سمت کلاینت: کوکی‌های امن در برابر localStorage

محل نگهداری توکن‌ها در مرورگر، میزان آسیب‌پذیری سیستم در برابر حملات **XSS** و **CSRF** را تعیین می‌کند:

#### ۱. خطرات \`localStorage\`:
تمامی اسکریپت‌های جاوااسکریپت موجود در صفحه به \`localStorage\` دسترسی دارند. در صورت وجود کوچک‌ترین حفره XSS، مهاجم می‌تواند با یک خط کد تمام توکن‌ها را به سرور خود ارسال و نشست کاربر را بدزدد.

#### ۲. مزایای امنیتی کوکی‌های \`HttpOnly\`:
- **\`HttpOnly = true\`**: کدهای جاوااسکریپت تحت هیچ شرایطی به کوکی دسترسی ندارند (خنثی‌سازی کامل حملات XSS).
- **\`Secure = true\`**: کوکی فقط روی پروتکل امن HTTPS جابجا می‌شود.
- **\`SameSite = SameSiteMode.Strict\`**: جلوگیری کامل از حملات جعل درخواست میان‌سایتی (CSRF).

#### بهترین الگوی معماری:
- **Access Token**: در حافظه موقت (Memory) کلاینت نگهداری شود.
- **Refresh Token**: در یک **کوکی HttpOnly با فلگ‌های Secure و SameSite=Strict** که مسیر آن به اندپوینت \`/api/auth/refresh\` محدود شده ذخیره گردد.`,
  },
  {
    id: "dotnet-mid-q273",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-role-policy-authorization"],
    questionTitle: "How does Policy-Based Authorization differ from Role-Based Access Control (RBAC) in ASP.NET Core, and how do you decouple business rules into IAuthorizationRequirement and AuthorizationHandler<T>?",
    questionTitle_fa: "مجوزدهی مبتنی بر پالیسی (Policy-Based) چه تفاوتی با کنترل دسترسی مبتنی بر نقش (RBAC) در ASP.NET Core دارد و چگونه منطق تجاری دسترسی را در قالب IAuthorizationRequirement و AuthorizationHandler پیاده‌سازی کنیم؟",
    answerContent: `### Policy-Based Authorization vs. RBAC in ASP.NET Core

Role-Based Access Control (\`[Authorize(Roles = "Admin,Manager")]\`) is simple but leads to **Role Explosion** and brittle code as enterprise business rules expand.

---

#### 1. Why Policy-Based Authorization (ABAC) is Superior:
- **Decoupled Business Rules:** Controllers declare intent (\`[Authorize(Policy = "CanApproveRefund")]\`) while the actual evaluation logic resides in dedicated handlers in the Infrastructure/Security layer.
- **Multi-Factor Logic:** Policies can evaluate combinations of roles, user claims, time-of-day, IP subnet ranges, and dynamic requirements.

---

#### 2. The 3-Part Architecture:
1. **The Requirement (\`IAuthorizationRequirement\`):** A pure data contract holding rule parameters:
   \`\`\`csharp
   public record MinimumSeniorityRequirement(int MinimumYears) : IAuthorizationRequirement;
   \`\`\`

2. **The Handler (\`AuthorizationHandler<T>\`):** The engine evaluating the requirement:
   \`\`\`csharp
   public class MinimumSeniorityHandler : AuthorizationHandler<MinimumSeniorityRequirement>
   {
       protected override Task HandleRequirementAsync(
           AuthorizationHandlerContext context,
           MinimumSeniorityRequirement requirement)
       {
           var joinedClaim = context.User.FindFirst("joined_date")?.Value;
           if (DateTime.TryParse(joinedClaim, out var joinedDate))
           {
               var years = (DateTime.UtcNow - joinedDate).TotalDays / 365.25;
               if (years >= requirement.MinimumYears)
               {
                   context.Succeed(requirement); // Requirement satisfied!
               }
           }

           return Task.CompletedTask;
       }
   }
   \`\`\`

3. **Policy Registration in \`Program.cs\`:**
   \`\`\`csharp
   builder.Services.AddSingleton<IAuthorizationHandler, MinimumSeniorityHandler>();
   builder.Services.AddAuthorization(options =>
   {
       options.AddPolicy("SeniorEngineerOnly", policy =>
           policy.Requirements.Add(new MinimumSeniorityRequirement(5)));
   });
   \`\`\``,
    answerContent_fa: `### مقایسه مجوزدهی پالیسی‌محور با RBAC در ASP.NET Core

روش سنتی RBAC (\`[Authorize(Roles = "Admin")]\`) با گسترش منطق برنامه باعث افزایش سرسام‌آور نقش‌ها (Role Explosion) و شکنندگی کدها می‌شود.

#### مزایای مجوزدهی مبتنی بر پالیسی (Policy-Based):
- **تفکیک کامل دغدغه‌ها:** کنترلرها صرفاً نام پالیسی را اعلام می‌کنند (\`[Authorize(Policy = "CanApprove")]\`) و منطق بررسی در هندلرهای اختصاصی پیاده‌سازی می‌شود.
- **پشتیبانی از شروط چندگانه:** ترکیب نقش‌ها، کلیم‌ها، سوابق کاری و محاسبات پویا.

#### ساختار سه‌بخشی پیاده‌سازی:
۱. **شرط (\`IAuthorizationRequirement\`)**: کلاسی حامل متغیرهای شرط.
۲. **هندلر (\`AuthorizationHandler<T>\`)**: کلاس ارزیابی‌کننده که با متد \`context.Succeed(requirement)\` برقراری شرط را تایید می‌کند.
۳. **ثبت پالیسی در \`Program.cs\`**: ثبت هندلر در کانتینر DI و تعریف نام پالیسی.`,
  },
  {
    id: "dotnet-mid-q274",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-role-policy-authorization"],
    questionTitle: "What is the execution lifecycle of AuthorizationHandlerContext (Succeed vs Fail vs Abstain), and why does context.Fail() enforce a strict Fail-Closed security behavior?",
    questionTitle_fa: "چرخه حیات متدها در شیء AuthorizationHandlerContext (تفاوت Succeed و Fail و ممتنع بودن) چگونه است و چرا متد context.Fail() رفتار امنیتی غیرقابل بازگشت Fail-Closed را اعمال می‌کند؟",
    answerContent: `### AuthorizationHandlerContext Lifecycle: Succeed, Fail, and Abstain

When ASP.NET Core evaluates an authorization requirement, it passes an \`AuthorizationHandlerContext\` to all registered handlers for that requirement.

---

#### 1. The Three Handler Actions:

1. **\`context.Succeed(IAuthorizationRequirement requirement)\`**:
   - Explicitly marks that this specific requirement has been satisfied by the current user.
   - If a policy contains multiple requirements, **all requirements must be succeeded** for the overall policy check to pass (unless custom requirement evaluation logic is used).

2. **\`context.Fail()\` (Fail-Closed Security):**
   - Explicitly records an **irreversible failure**.
   - **Crucial Security Behavior:** Once \`context.Fail()\` is invoked, **the overall authorization check is GUARANTEED to fail**, even if 10 other handlers call \`context.Succeed()\` for the same requirement!
   - Use Case: Blacklisted users, revoked API keys, or security breach indicators that must immediately terminate access regardless of other valid claims.

3. **Returning without Calling Succeed or Fail (Abstain):**
   - The handler simply returns \`Task.CompletedTask\` without invoking \`Succeed()\` or \`Fail()\`.
   - Allows ASP.NET Core to evaluate **other handlers** registered for the same requirement. If no handler calls \`Succeed()\`, authorization naturally fails.

---

#### Summary Decision Table:

| Handler Action | Effect on Requirement | Overridable by Other Handlers? |
| :--- | :--- | :--- |
| **\`context.Succeed(req)\`** | Marks requirement as satisfied | Yes (if another handler calls \`Fail()\`) |
| **\`context.Fail()\`** | **Permanently marks authorization as failed** | ❌ **NO (Irreversible Failure)** |
| **Return Task (Abstain)** | No change | Yes (Other handlers are evaluated) |`,
    answerContent_fa: `### چرخه حیات متدها در AuthorizationHandlerContext: تفاوت Succeed، Fail و Abstain

هنگام بررسی یک پالیسی، دات‌نت شیء \`AuthorizationHandlerContext\` را به تمامی هندلرهای ثبت‌شده ارسال می‌کند:

#### حالت‌های سه‌گانه تصمیم‌گیری هندلر:
۱. **متد \`context.Succeed(requirement)\`**: اعلام می‌کند که شرط دسترسی برای این کاربر برقرار شده است.
۲. **متد \`context.Fail()\` (اصل Fail-Closed)**: شکست قطعی و غیرقابل بازگشت! اگر حتی ۱۰ هندلر دیگر متد Succeed را فراخوانی کرده باشند، فراخوانی متد Fail فوراً و به صورت دائمی کل مجوزدهی را رد می‌کند (مناسب کاربران مسدودشده یا توکن‌های بلک‌لیست).
۳. **عدم فراخوانی متدها (ممتنع بودن)**: هندلر بدون هیچ عملی بازمی‌گردد تا سایر هندلرهای ثبت‌شده فرصت بررسی شرط را داشته باشند. در صورت عدم تایید توسط هیچ‌یک از هندلرها، دسترسی مسدود می‌شود.`,
  },
  {
    id: "dotnet-mid-q275",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-role-policy-authorization"],
    questionTitle: "What is Resource-Based Authorization in ASP.NET Core, why can't declarative [Authorize] attributes handle it, and how is it executed imperatively via IAuthorizationService?",
    questionTitle_fa: "مجوزدهی منبع‌محور (Resource-Based Authorization) در ASP.NET Core چیست، چرا اتریبیوت‌های اعلامی [Authorize] قادر به حل آن نیستند و چگونه با IAuthorizationService به صورت امری اجرا می‌شود؟",
    answerContent: `### Resource-Based Authorization in ASP.NET Core

Declarative attributes like \`[Authorize(Policy = "...")]\` execute in the MVC/Routing pipeline **before the action method executes**. 

At that early stage, the application only knows the user's identity and the HTTP route parameters—it **has not fetched the database entity yet**.

---

#### 1. The Core Problem:
Consider the business rule: *"A user can only edit an Invoice if they are the original author of that specific invoice, or if they are a Global Admin."*

Because the \`AuthorId\` is stored inside the database row, authorization cannot occur until the record is loaded into memory.

---

#### 2. Implementation with \`AuthorizationHandler<TRequirement, TResource>\`:

\`\`\`csharp
public record InvoiceEditRequirement : IAuthorizationRequirement;

public class InvoiceAuthorizationHandler : AuthorizationHandler<InvoiceEditRequirement, Invoice>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        InvoiceEditRequirement requirement,
        Invoice invoice)
    {
        var currentUserId = context.User.FindFirst("sub")?.Value;

        if (invoice.AuthorId.ToString() == currentUserId || context.User.IsInRole("Admin"))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
\`\`\`

---

#### 3. Imperative Execution in Minimal APIs / Controllers:

\`\`\`csharp
app.MapPut("/api/invoices/{id:guid}", async (
    Guid id,
    UpdateInvoiceDto dto,
    AppDbContext db,
    IAuthorizationService authService,
    ClaimsPrincipal user) =>
{
    // Step 1: Fetch resource from DB
    var invoice = await db.Invoices.FindAsync(id);
    if (invoice == null) return Results.NotFound();

    // Step 2: Imperatively evaluate resource authorization
    var result = await authService.AuthorizeAsync(user, invoice, new InvoiceEditRequirement());

    if (!result.Succeeded)
    {
        return Results.Forbid(); // Returns HTTP 403 Forbidden!
    }

    // Step 3: Perform business operation
    invoice.Update(dto.Amount, dto.Notes);
    await db.SaveChangesAsync();

    return Results.Ok(invoice);
}).RequireAuthorization();
\`\`\``,
    answerContent_fa: `### مجوزدهی منبع‌محور (Resource-Based Authorization) در ASP.NET Core

اتریبیوت‌های اعلامی \`[Authorize]\` قبل از ورود به متد اجرا می‌شوند؛ بنابراین به رکورد دیتابیسی دسترسی ندارند.

#### صورت مسئله:
قانون: *"کاربر فقط در صورتی مجاز به ویرایش فاکتور است که خود سازنده آن فاکتور باشد."*
از آنجا که شناسه سازنده (\`AuthorId\`) در سطر دیتابیس قرار دارد، ابتدا باید رکورد واکشی شده و سپس مجوز کاربر نسبت به آن رکورد سنجیده شود.

#### پیاده‌سازی امری با \`IAuthorizationService\`:
۱. ساخت هندلر با ارث‌بری از \`AuthorizationHandler<TRequirement, TResource>\`.
۲. واکشی رکورد از دیتابیس در متد کنترلر یا Minimal API.
۳. فراخوانی متد \`authService.AuthorizeAsync(User, invoice, requirement)\`.
۴. در صورت شکست اعتبارسنجی، بازگرداندن پاسخ **\`403 Forbidden\`**.`,
  },
  {
    id: "dotnet-mid-q276",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-role-policy-authorization"],
    questionTitle: "How do you implement dynamic permission-based authorization with a custom IAuthorizationPolicyProvider to avoid manually registering hundreds of policies in Program.cs?",
    questionTitle_fa: "چگونه با پیاده‌سازی اینترفیس سفارشی IAuthorizationPolicyProvider، مجوزدهی مبتنی بر سطوح دسترسی داینامیک را پیاده‌سازی کنیم تا از ثبت دستی صدها پالیسی در Program.cs جلوگیری شود؟",
    answerContent: `### Dynamic Permission Policies with IAuthorizationPolicyProvider

In enterprise systems with 500+ granular permissions (e.g. \`Permissions.Users.Read\`, \`Permissions.Orders.Export\`), manually declaring 500 \`options.AddPolicy()\` calls in \`Program.cs\` is unmaintainable.

---

#### 1. Custom Attribute for Clean Syntax:
\`\`\`csharp
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
public class HasPermissionAttribute(string permission) 
    : AuthorizeAttribute(policy: $"Permission:{permission}");
\`\`\`

---

#### 2. The Dynamic \`IAuthorizationPolicyProvider\` Engine:
The policy provider intercepts authorization requests and constructs policies dynamically at runtime:

\`\`\`csharp
public class PermissionPolicyProvider(IOptions<AuthorizationOptions> options) : IAuthorizationPolicyProvider
{
    private readonly DefaultAuthorizationPolicyProvider _fallbackProvider = new(options);

    public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        if (policyName.StartsWith("Permission:", StringComparison.OrdinalIgnoreCase))
        {
            var permissionName = policyName["Permission:".Length..];

            // Build dynamic policy on the fly:
            var policy = new AuthorizationPolicyBuilder()
                .AddRequirements(new PermissionRequirement(permissionName))
                .Build();

            return Task.FromResult<AuthorizationPolicy?>(policy);
        }

        // Fallback to standard static policies registered in Program.cs
        return _fallbackProvider.GetPolicyAsync(policyName);
    }

    public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => _fallbackProvider.GetDefaultPolicyAsync();
    public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() => _fallbackProvider.GetFallbackPolicyAsync();
}
\`\`\`

---

#### 3. Usage on API Endpoints:
\`\`\`csharp
[HttpGet("export")]
[HasPermission("Invoices.ExportExcel")]
public IActionResult Export() => Ok();
\`\`\``,
    answerContent_fa: `### مجوزدهی سطوح دسترسی داینامیک با IAuthorizationPolicyProvider

در سیستم‌های بزرگ سازمانی با صدها سطح دسترسی ریزدانه (مانند \`Users.Create\` یا \`Invoices.Export\`)، تعریف دستی صدها پالیسی در فایل \`Program.cs\` غیرممکن است.

#### پیاده‌سازی با \`IAuthorizationPolicyProvider\`:
۱. **ساخت اتریبیوت سفارشی**: کلاسی مانند \`[HasPermission("Orders.Read")]\` که پیشوند \`Permission:\` را به نام پالیسی اضافه می‌کند.
۲. **پیاده‌سازی Provider سفارشی**: این کلاس درخواست‌های مجوزدهی را رهگیری کرده و در صورتی که نام پالیسی با \`Permission:\` شروع شود، در همان لحظه شیء \`AuthorizationPolicy\` متناظر را تولید می‌کند.
۳. **ارجاع به پیش‌فرض (Fallback)**: برای پالیسی‌های معمولی از \`DefaultAuthorizationPolicyProvider\` استفاده می‌شود.`,
  },
  {
    id: "dotnet-mid-q277",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-role-policy-authorization"],
    questionTitle: "What is the difference between DefaultPolicy and FallbackPolicy in ASP.NET Core AuthorizationOptions, and how does FallbackPolicy prevent unsecured endpoints?",
    questionTitle_fa: "تفاوت میان DefaultPolicy و FallbackPolicy در تنظیمات AuthorizationOptions چیست و چگونه FallbackPolicy از فراموش شدن امنیت روی اندپوینت‌های جدید جلوگیری می‌کند؟",
    answerContent: `### DefaultPolicy vs. FallbackPolicy in ASP.NET Core

ASP.NET Core provides two global policy configurations under \`AuthorizationOptions\` that serve distinct operational roles in application security.

---

| Policy Type | When It Applies | Primary Purpose |
| :--- | :--- | :--- |
| **\`DefaultPolicy\`** | Applied when \`[Authorize]\` or \`.RequireAuthorization()\` is present **without a specific policy name**. | Dictates standard authenticated user requirements for secured endpoints. |
| **\`FallbackPolicy\`** | Applied to **EVERY endpoint across the entire application** that has NO authorization attributes or metadata. | Enforces a **"Secure-by-Default"** zero-trust baseline across the entire API. |

---

#### 1. The Threat FallbackPolicy Solves:
In large engineering teams, a developer might add a new controller or route (\`/api/payments/export\`) and **accidentally forget** to add \`[Authorize]\`. Without a fallback policy, the endpoint is completely open to the public internet!

---

#### 2. Configuring FallbackPolicy for Zero-Trust API Security:

\`\`\`csharp
builder.Services.AddAuthorization(options =>
{
    // 1. DefaultPolicy: Used when [Authorize] has no parameters
    options.DefaultPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();

    // 2. FallbackPolicy: Locks down ALL routes by default!
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .RequireClaim("tenant_id")
        .Build();
});
\`\`\`

#### Opting-Out for Public Endpoints:
With \`FallbackPolicy\` enabled, public endpoints (e.g. Login, Swagger, Health checks) must **explicitly opt-out** using \`[AllowAnonymous]\` or \`.AllowAnonymous()\`.`,
    answerContent_fa: `### تفاوت DefaultPolicy و FallbackPolicy در AuthorizationOptions

دات‌نت دو تنظیم سراسری برای پالیسی‌ها فراهم می‌کند:

#### ۱. مفهوم \`DefaultPolicy\`:
زمانی اعمال می‌شود که برنامه‌نویس اتریبیوت \`[Authorize]\` را بدون ذکر نام پالیسی روی اندپوینت قرار دهد.

#### ۲. مفهوم \`FallbackPolicy\` (امنیت پیش‌فرض در کل برنامه):
این پالیسی روی **تمامی اندپوینت‌های برنامه که هیچ اتریبیوتی ندارند** اعمال می‌شود.

#### چرایی ضرورت FallbackPolicy:
اگر یک برنامه‌نویس اندپوینت جدیدی بسازد و فراموش کند اتریبیوت \`[Authorize]\` را قرار دهد، آن اندپوینت در حالت عادی برای عموم باز خواهد بود. با فعال کردن \`FallbackPolicy\`، کل سامانه به صورت پیش‌فرض قفل می‌شود و فقط اندپوینت‌هایی که صراحتاً متد \`AllowAnonymous()\` یا اتریبیوت \`[AllowAnonymous]\` دارند بدون لاگین در دسترس خواهند بود.`,
  },
  {
    id: "dotnet-mid-q278",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-api-protection-rate-limiting-cors"],
    questionTitle: "What are the four built-in Rate Limiting algorithms in .NET 7/8/9 (Fixed Window, Sliding Window, Token Bucket, Concurrency), and how do they differ in handling traffic bursts?",
    questionTitle_fa: "چهار الگوریتم توکار Rate Limiting در دات‌نت ۷، ۸ و ۹ (Fixed Window، Sliding Window، Token Bucket و Concurrency) چه تفاوت‌هایی در نحوه مدیریت جهش‌های ترافیکی (Bursts) دارند؟",
    answerContent: `### Built-in Rate Limiting Algorithms in .NET 7/8/9

The \`Microsoft.AspNetCore.RateLimiting\` namespace provides four distinct rate limiting algorithms tailored to diverse traffic patterns:

---

| Algorithm | Traffic Handling Strategy | Burst Allowance | Optimal Production Scenario |
| :--- | :--- | :--- | :--- |
| **Fixed Window** | Resets counter strictly at static time intervals (e.g. 100 req/min). | ❌ **Vulnerable to 2x boundary spikes** | Public documentation, static content routes |
| **Sliding Window** | Divides window into rolling sub-segments; calculates moving average. | **Smooth rolling limit (No boundary spikes)** | Standard REST Web API endpoints |
| **Token Bucket** | Sinks tokens into a bucket; refills at constant rate (\`TokensPerPeriod\`). | **✅ Controlled Burst Allowance** | Payment gateways, e-commerce checkouts |
| **Concurrency** | Limits simultaneous active requests executing at the exact same moment. | ❌ Queues or rejects excess threads | Heavy PDF generation, ML inference, DB reports |

---

#### 1. Fixed Window Flaw (The Boundary Burst Trap):
If the limit is 100 requests per minute, a client can send 100 requests at 11:59:59 AM, and another 100 requests at 12:00:01 PM.
- **The Problem:** The server receives **200 requests in 2 seconds**, potentially overwhelming backend resources while technically never breaching the static 1-minute window limit!

#### 2. How Sliding Window Solves Boundary Spikes:
Sliding Window divides a 1-minute window into smaller segments (e.g. 6 segments of 10 seconds each). When evaluating requests, it slides the window forward, preventing boundary traffic spikes.

#### 3. Why Token Bucket is Preferred for APIs:
Token Bucket allows clients to exhaust a full "bucket" of accumulated tokens for sudden bursts (e.g. initial page load making 15 parallel API calls), then throttles sustained continuous traffic to the replenishment rate.`,
    answerContent_fa: `### الگوریتم‌های چهارگانه Rate Limiting در دات‌نت ۷، ۸ و ۹

دات‌نت به صورت توکار چهار الگوریتم برای کنترل ترافیک و مهار حملات DoS ارائه می‌دهد:

#### ۱. الگوریتم Fixed Window (پنجره ثابت):
- در بازه‌های زمانی مشخص (مانند ۱۰۰ درخواست در دقیقه) شمارنده را ریست می‌کند.
- **تله ترافیکی در مرز پنجره:** اگر کاربر در ثانیه ۵۹ دقیقه اول ۱۰۰ درخواست و در ثانیه اول دقیقه دوم ۱۰۰ درخواست دیگر بفرستد، در عرض ۲ ثانیه ۲۰۰ درخواست به سرور می‌رسد که می‌تواند باعث قفل شدن دیتابیس شود.

#### ۲. الگوریتم Sliding Window (پنجره لغزان):
- بازه زمانی را به چند بخش کوچک‌تر تقسیم کرده و میانگین متحرک می‌گیرد؛ در نتیجه شوک ترافیکی مرز پنجره‌ها کاملاً مهار می‌شود.

#### ۳. الگوریتم Token Bucket (سطل توکن):
- توکن‌ها با نرخ مشخصی درون یک سطل شارژ می‌شوند.
- **بهترین گزینه برای APIها:** به کاربر اجازه می‌دهد برای چند ثانیه جهش ترافیکی (Burst) داشته باشد (مثلاً دانلود موازی چند فایل در زمان لود صفحه)، اما ترافیک مداوم را بر اساس سرعت پر شدن سطل کنترل می‌کند.

#### ۴. الگوریتم Concurrency:
- تعداد درخواست‌های همزمان در حال پردازش را محدود می‌کند (مناسب اندپوینت‌های سنگین مانند تولید گزارشات PDF).`,
  },
  {
    id: "dotnet-mid-q279",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-api-protection-rate-limiting-cors"],
    questionTitle: "How do you implement Partitioned Rate Limiting by Client IP Address or Authenticated User ID using PartitionedRateLimiter.Create and customize the 429 Retry-After response?",
    questionTitle_fa: "چگونه با متد PartitionedRateLimiter.Create محدودسازی نرخ درخواست را بر اساس آدرس IP یا شناسه کاربر پارتیشن‌بندی کرده و پاسخ خطای ۴۲۹ همراه با هدر Retry-After را سفارشی‌سازی کنیم؟",
    answerContent: `### Partitioned Rate Limiting & Custom 429 Retry-After Handling

In enterprise APIs, a single global rate limit allows one abusive client to starve all other users. **Partitioning** isolates limits per IP address or user account.

---

#### 1. Configuring Partitioned Rate Limiting:
\`\`\`csharp
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Partition by User ID (if authenticated) or Client IP Address (if anonymous):
    options.AddPolicy("CustomUserIpPolicy", httpContext =>
    {
        var userId = httpContext.User.FindFirst("sub")?.Value;
        var partitionKey = !string.IsNullOrEmpty(userId) 
            ? $"user_{userId}" 
            : $"ip_{httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown"}";

        return RateLimitPartition.GetTokenBucketLimiter(partitionKey, _ => new TokenBucketRateLimiterOptions
        {
            TokenLimit = 60,
            ReplenishmentPeriod = TimeSpan.FromSeconds(10),
            TokensPerPeriod = 10,
            QueueLimit = 0
        });
    });

    // Custom 429 Response with Retry-After Header:
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;

        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
            context.HttpContext.Response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();
        }

        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            Status = 429,
            Title = "Too Many Requests",
            Detail = "You have exceeded your rate limit quota. Please wait before retrying."
        }, cancellationToken: token);
    };
});
\`\`\`

---

#### 2. Pipeline Placement:
\`\`\`csharp
app.UseRouting();
app.UseRateLimiter(); // MUST be placed AFTER UseRouting and BEFORE endpoints!
app.UseAuthentication();
app.UseAuthorization();
\`\`\``,
    answerContent_fa: `### پارتیشن‌بندی نرخ درخواست با PartitionedRateLimiter و ارسال هدر Retry-After

برای جلوگیری از مسدود شدن کل سرویس توسط یک کاربر مخرب، از پارتیشن‌بندی ترافیک بر اساس آدرس IP یا شناسه کاربر استفاده می‌شود:

#### پیاده‌سازی در دات‌نت:
۱. **تفکیک با کلید پارتیشن (PartitionKey)**: اگر کاربر لاگین کرده باشد از شناسه \`sub\` و در غیر این صورت از آدرس \`RemoteIpAddress\` برای ساخت سطل اختصاصی استفاده می‌شود.
۲. **کالبک \`OnRejected\`**: استخراج زمان باقی‌مانده از \`MetadataName.RetryAfter\` و تنظیم هدر استاندارد \`Retry-After\` در پاسخ HTTP 429.
۳. **ترتیب میدل‌ویر**: متد \`app.UseRateLimiter\` باید حتماً بعد از \`UseRouting\` قرار گیرد تا مسیرها و اطلاعات کانتکست در دسترس باشند.`,
  },
  {
    id: "dotnet-mid-q280",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-api-protection-rate-limiting-cors"],
    questionTitle: "What are CORS Preflight OPTIONS requests, what security hazard is introduced by combining AllowAnyOrigin() with AllowCredentials(), and where must UseCors be placed in the middleware pipeline?",
    questionTitle_fa: "درخواست‌های Preflight OPTIONS در CORS چیستند، ترکیب AllowAnyOrigin() با AllowCredentials() چه حفره امنیتی ایجاد می‌کند و میدل‌ویر UseCors دقیقاً در کجای خط لوله باید قرار گیرد؟",
    answerContent: `### CORS Preflight Requests & The AllowAnyOrigin Security Hazard

**Cross-Origin Resource Sharing (CORS)** is a browser security standard allowing servers to selectively relax the browser's Same-Origin Policy (SOP).

---

#### 1. What is a Preflight \`OPTIONS\` Request?
When a browser makes a "non-simple" cross-origin HTTP request (e.g. using custom headers like \`Authorization\` or HTTP verbs like \`PUT\`, \`DELETE\`, \`PATCH\`), the browser **automatically sends an HTTP \`OPTIONS\` request first** to query the server's permission matrix before sending the actual payload.

---

#### 2. The Dangerous \`AllowAnyOrigin()\` + \`AllowCredentials()\` Flaw:
\`\`\`csharp
// FATAL SECURITY VULNERABILITY:
builder.Services.AddCors(options => {
    options.AddPolicy("BadPolicy", p => p.AllowAnyOrigin().AllowCredentials()); // Blocked by browsers!
});
\`\`\`

#### Why It Is Dangerous:
- If a server allows credentials (cookies, authorization headers) from ANY origin (\`*\`), any malicious website a user visits could silently execute authenticated API calls (e.g. transfer money or delete records) in the background!
- Modern browsers explicitly **reject responses** that return \`Access-Control-Allow-Origin: *\` alongside \`Access-Control-Allow-Credentials: true\`.

---

#### 3. Strict Middleware Pipeline Placement:
\`\`\`csharp
app.UseRouting();
app.UseCors("ProductionSpaPolicy"); // MUST be placed AFTER UseRouting and BEFORE Authentication!
app.UseAuthentication();
app.UseAuthorization();
\`\`\`
- **Why?** \`UseCors\` must be after \`UseRouting\` so CORS endpoint policies can be evaluated, and before \`UseAuthentication\` so unauthenticated preflight \`OPTIONS\` requests succeed without being challenged for JWT tokens!`,
    answerContent_fa: `### درخواست‌های Preflight در CORS، خطای AllowAnyOrigin و ترتیب در پایپ‌لاین

#### ۱. درخواست‌های Preflight (متد OPTIONS):
هنگامی که فرانت‌اند یک درخواست دارای هدر سفارشی (مانند \`Authorization\`) یا متدهای \`PUT\` و \`DELETE\` ارسال می‌کند، مرورگر ابتدا یک درخواست خودکار با متد **\`OPTIONS\`** می‌فرستد تا از مجاز بودن دامنه و هدرها توسط سرور مطمئن شود.

#### ۲. حفره امنیتی ترکیب \`AllowAnyOrigin\` با \`AllowCredentials\`:
اگر سرور اجازه ارسال کوکی‌ها و توکن‌ها را برای تمامی دامنه‌های اینترنت (\`*\`) صادر کند، هر سایت مخربی می‌تواند از طریق مرورگر کاربر درخواست‌های احراز هویت شده بفرستد. به همین دلیل مرورگرهای مدرن این ترکیب را مسدود می‌کنند. دامنه‌های معتبر فرانت‌اند باید صراحتاً با \`WithOrigins\` تعریف شوند.

#### ۳. محل قرارگیری میدل‌ویر UseCors:
میدل‌ویر \`UseCors\` باید حتماً **بعد از \`UseRouting\`** و **قبل از \`UseAuthentication\`** قرار گیرد تا درخواست‌های \`OPTIONS\` بدون نیاز به توکن JWT پاسخ داده شوند.`,
  },
  {
    id: "dotnet-mid-q281",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-api-protection-rate-limiting-cors"],
    questionTitle: "How does the ASP.NET Core Data Protection API (IDataProtector) provide tamper-proof encryption with Purpose Strings, and how do you persist cryptographic key rings across distributed multi-node clusters?",
    questionTitle_fa: "سیستم ASP.NET Core Data Protection (اینترفیس IDataProtector) چگونه با Purpose Stringها رمزنگاری ضد دستکاری ایجاد می‌کند و ذخیره‌سازی کلیدهای رمزنگاری در کلاسترهای توزیع‌شده چگونه پیکربندی می‌شود؟",
    answerContent: `### ASP.NET Core Data Protection API & Distributed Key Ring Management

The **Data Protection API** (\`IDataProtector\`) provides cryptographic confidentiality and authenticity for temporary application tokens, anti-tamper state, and sensitive payloads.

---

#### 1. Purpose Strings (Cryptographic Isolation):
A **Purpose String** acts as a cryptographic namespace. A ciphertext produced with purpose string \`"PasswordReset.v1"\` **CANNOT** be decrypted by an \`IDataProtector\` initialized with purpose string \`"EmailVerification.v1"\`, even if both share the exact same master cryptographic key!

\`\`\`csharp
var protector = dataProtectionProvider.CreateProtector("Identity.PasswordReset.v1");

string token = protector.Protect("user-id-12345");
string userId = protector.Unprotect(token); // Throws CryptographicException if tampered or wrong purpose!
\`\`\`

---

#### 2. The Distributed Multi-Node Cluster Trap:
By default, Data Protection stores encryption keys in the local server's file system (\`%APPDATA%\\ASP.NET\\DataProtection-Keys\`).
- In Kubernetes or load-balanced clusters with 5 replica pods, Pod A will fail to decrypt a token encrypted by Pod B!

#### The Enterprise Solution: Shared Redis / Blob Key Storage
\`\`\`csharp
builder.Services.AddDataProtection()
    .SetApplicationName("EnterpriseSharedApp")
    .PersistKeysToStackExchangeRedis(redisMultiplexer, "DataProtection-MasterKeys")
    .ProtectKeysWithCertificate(x509Certificate); // Encrypts master keys at rest!
\`\`\``,
    answerContent_fa: `### سیستم Data Protection API در دات‌نت و مدیریت کلیدها در کلاسترهای توزیع‌شده

اینترفیس **\`IDataProtector\`** برای رمزنگاری متقارن و ضد دستکاری کردن داده‌های موقت (مانند لینک‌های تایید ایمیل و توکن‌های بازیابی پسورد) استفاده می‌شود:

#### ۱. مفهوم Purpose Strings (ایزولاسیون کلیدها):
رشته Purpose به عنوان یک تفکیک‌کننده رمزنگاری عمل می‌کند. متنی که با عنوان \`"PasswordReset.v1"\` رمزنگاری شده است، تحت هیچ شرایطی توسط Protector دیگری با عنوان \`"EmailConfirm.v1"\` رمزگشایی نخواهد شد حتی اگر از یک کلید اصلی مشترک استفاده کنند.

#### ۲. چالش کلاسترهای چند سروری (Multi-Node):
در حالت پیش‌فرض، کلیدهای رمزنگاری روی هارددیسک همان سرور ذخیره می‌شوند؛ بنابراین در کلاسترهای داکر/کوبرنتیز، سرور شماره ۲ نمی‌تواند توکن‌های سرور شماره ۱ را رمزگشایی کند.

#### راهکار سازمانی:
با متد \`PersistKeysToStackExchangeRedis\`، کلیدهای اصلی درون **Redis** ذخیره شده و با یک سرتیفیکیت دیجیتال رمزنگاری می‌شوند تا تمام پادها به کلیدهای یکسان دسترسی داشته باشند.`,
  },
  {
    id: "dotnet-mid-q282",
    stackId: "dotnet",
    categoryId: "aspnet-core",
    levelId: "mid",
    topicIds: ["topic-dotnet-security-api-protection-rate-limiting-cors"],
    questionTitle: "Why are fast cryptographic hashing algorithms (MD5, SHA-256) dangerous for password storage, and how do adaptive Key Derivation Functions like PBKDF2 and Argon2id prevent GPU/ASIC attacks?",
    questionTitle_fa: "چرا الگوریتم‌های سریع رمزنگاری (مانند MD5 و SHA-256) برای نگهداری پسوردها ناامن هستند و توابع مشتق‌سازی کلید تطبیقی مانند PBKDF2 و Argon2id چگونه حملات سخت‌افزاری GPU و ASIC را مهار می‌کنند؟",
    answerContent: `### Cryptographic Password Hashing: Why Fast Hashes Fail & Adaptive KDFs Excel

A common security misconception is that hashing a password with **SHA-256** or **SHA-512** is secure.

---

#### 1. Why Fast Cryptographic Hashes Are Fatal for Passwords:
- SHA-256 was designed for high-throughput data integrity verification (calculating gigabytes of data in milliseconds).
- Because they are fast, a modern consumer GPU (e.g. RTX 4090) can calculate **over 100 billion SHA-256 hashes per second**!
- Using precomputed **Rainbow Tables** or dictionary brute-force tools (Hashcat), an attacker with a leaked database dump can crack standard 8-10 character passwords in seconds.

---

#### 2. Adaptive Key Derivation Functions (KDFs):
Secure password hashing requires algorithms that are **intentionally slow, compute-intensive, and memory-hard**:

1. **PBKDF2-HMAC-SHA512 (ASP.NET Core Default \`PasswordHasher<T>\`):**
   - Applies a cryptographically random per-user salt (128-bit) to eliminate Rainbow Tables.
   - Runs a configurable work factor of **100,000+ hash iterations**, making brute-force 100,000x more expensive for attackers.

2. **Argon2id (Winner of Password Hashing Competition):**
   - Incorporates **Memory-Hardness**: Requires substantial megabytes of RAM memory per hash calculation.
   - Because GPUs and ASICs have high compute cores but limited fast memory per thread, Argon2id renders hardware-accelerated parallel brute-force attacks mathematically infeasible.`,
    answerContent_fa: `### چرایی ناامنی هش‌های سریع (SHA-256) و برتری الگوریتم‌های تطبیقی PBKDF2 و Argon2id

#### ۱. علت خطرناک بودن الگوریتم‌های سریع (SHA-256 و MD5):
الگوریتم‌های خانواده SHA برای اعتبارسنجی سریع فایل‌ها در کسری از میلی‌ثانیه طراحی شده‌اند. کارت‌های گرافیک مدرن قادر به محاسبه بیش از **۱۰۰ میلیارد هش SHA-256 در هر ثانیه** هستند؛ بنابراین در صورت سرقت دیتابیس، مهاجمان با نرم‌افزارهایی مانند Hashcat پسوردهای کاربران را در چند ثانیه کرک می‌کنند.

#### ۲. توابع مشتق‌سازی کلید تطبیقی (Adaptive KDFs):
این الگوریتم‌ها به صورت عمدی **کُند و پرهزینه** طراحی شده‌اند:
- **الگوریتم PBKDF2 (پیش‌فرض دات‌نت در \`PasswordHasher\`):** استفاده از Salt اختصاصی برای هر کاربر و اجرای بیش از **۱۰۰,۰۰۰ بار حلقه تکرار (Iteration)** جهت بالا بردن زمان محاسبه برای مهاجم.
- **الگوریتم Argon2id:** الزام به اشغال حافظه رم در زمان محاسبه هش (Memory-Hard)، که باعث فلج شدن پردازش موازی در کارت‌های گرافیک و تراشه‌های ASIC می‌شود.`,
  },
];














