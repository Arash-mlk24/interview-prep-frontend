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
];




