import { RoadmapTopic } from "../../../models";

export const aspnetMiddlewarePipelineFiltersTopic: RoadmapTopic = {
  id: "topic-dotnet-aspnet-middleware-pipeline-filters",
  stepId: "step-mid-aspnet-webapi",
  slug: "aspnet-middleware-pipeline-filters",
  order: 3,
  title: "Middleware Pipeline, Exception Handler & Action Filters",
  title_fa: "خط لوله میدل‌ویرها، مدیریت یکپارچه خطاها و فیلترهای اکشن",
  summary:
    "Master the Russian Doll middleware pipeline execution model, critical ordering rules, custom Conventional vs Factory-Activated (IMiddleware) development, branching with Map/MapWhen/UseWhen, and .NET 8/9 IExceptionHandler.",
  summary_fa:
    "تسلط عمیق بر مدل اجرای عروسک روسی در میدل‌ویرها، ترتیب حیاتی چینش خط لوله، ساخت میدل‌ویرهای مرسوم در برابر Factory-Activated با اینترفیس IMiddleware، شاخه‌بندی با Map/MapWhen/UseWhen، و مدیریت سراسری خطاها با IExceptionHandler در دات‌نت ۸ و ۹.",
  readingTimeMinutes: 30,
  difficulty: "mid",
  content: `## 1. Evolution: From Legacy HttpModules to the Lightweight Request Pipeline

In legacy ASP.NET (System.Web / IIS), handling HTTP requests relied on heavy **HttpModules** and **HttpHandlers**:

\`\`\`csharp
// Legacy ASP.NET (IIS Monolith Era - 2002 to 2015)
public class CustomSecurityModule : IHttpModule
{
    public void Init(HttpApplication context)
    {
        // Tightly coupled to IIS native pipeline events
        context.BeginRequest += OnBeginRequest;
        context.EndRequest += OnEndRequest;
    }
}
\`\`\`

### Architectural Flaws of Legacy HttpModules:
1. **Tight IIS Coupling**: Tightly bound to \`System.Web.dll\` and the Windows IIS pipeline, preventing cross-platform hosting on Linux/Docker.
2. **Heavy Overhead**: Every request passed through dozens of mandatory IIS pipeline stages, allocating hundreds of kilobytes of memory.
3. **Disjointed Control Flow**: Event-driven hooks (\`BeginRequest\`, \`AuthenticateRequest\`, \`EndRequest\`) scattered request and response logic across disparate event handlers.

ASP.NET Core replaced this with a streamlined, bidirectional **Middleware Pipeline** centered around the **\`RequestDelegate\`** function signature:

\`\`\`csharp
public delegate Task RequestDelegate(HttpContext context);
\`\`\`

---

## 2. The Russian Doll Execution Model & Critical Pipeline Ordering

In ASP.NET Core, the middleware pipeline functions like nested **Russian Dolls (Matryoshka)**. An incoming HTTP request travels down through each middleware layer (the **Inbound Phase**), reaches the terminal endpoint handler, and then travels back up through each layer in reverse order (the **Outbound Phase**):

\`\`\`text
[HTTP Request]
     │
     ▼
┌──────────────────────────────────────────────┐
│ 1. Exception Handling (Catches Downstream)    │
│    ┌─────────────────────────────────────────┐│
│    │ 2. HTTPS Redirection & HSTS             ││
│    │    ┌────────────────────────────────────┐││
│    │    │ 3. Routing (Matches Endpoint)       │││
│    │    │    ┌───────────────────────────────┐│││
│    │    │    │ 4. CORS (Inspects Endpoint)   ││││
│    │    │    │    ┌──────────────────────────┐││││
│    │    │    │    │ 5. Authentication         │││││
│    │    │    │    │    ┌─────────────────────┐│││││
│    │    │    │    │    │ 6. Authorization    ││││││
│    │    │    │    │    │    ┌────────────────┐││││││
│    │    │    │    │    │    │ 7. Endpoint    ││││││
│    │    │    │    │    │    │    Execution   ││││││
│    │    │    │    │    │    └────────────────┘││││││
│    │    │    │    │    └─────────────────────┘│││││
│    │    │    │    └──────────────────────────┘││││
│    │    │    └───────────────────────────────┘│││
│    │    └────────────────────────────────────┘││
│    └─────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
     │
     ▼
[HTTP Response]
\`\`\`

---

### The Mandatory Middleware Order (Failure to Follow Causes Critical Bugs):

1. **\`UseExceptionHandler\` / \`UseDeveloperExceptionPage\`**: Must be the **first** middleware so it can catch any unhandled exceptions thrown by all downstream components.
2. **\`UseHsts\` & \`UseHttpsRedirection\`**: Forces secure transport before processing payload data.
3. **\`UseStaticFiles\`**: Placed before routing/auth so requests for static assets (\`.js\`, \`.css\`, \`.png\`) short-circuit immediately without authentication or routing overhead.
4. **\`UseRouting\`**: Parses the URL and selects the matched \`Endpoint\` metadata on \`HttpContext\`.
5. **\`UseCors\`**: **CRITICAL RULE:** Must be placed **AFTER \`UseRouting\`** (so CORS can read endpoint-specific CORS policies) and **BEFORE \`UseAuthentication\` & \`UseAuthorization\`** (so HTTP preflight \`OPTIONS\` requests succeed without requiring user credentials).
6. **\`UseAuthentication\`**: Identifies the user and populates \`HttpContext.User\` (\`ClaimsPrincipal\`).
7. **\`UseAuthorization\`**: Validates endpoint permissions and policies against \`HttpContext.User\`.
8. **\`UseRateLimiter\`**: Limits request rates based on IP, user identity, or endpoint policy.
9. **\`MapControllers\` / \`MapGroup\` / \`UseEndpoints\`**: Executes the target endpoint action.

---

## 3. Pipeline Branching Patterns: \`Use\` vs \`Run\` vs \`Map\` vs \`MapWhen\` vs \`UseWhen\`

ASP.NET Core provides five distinct primitives to control pipeline flow:

### 1. \`app.Use\` (In-Line Middleware)
Executes logic before and after calling the next delegate in the pipeline:
\`\`\`csharp
app.Use(async (context, next) =>
{
    // Inbound processing
    context.Response.Headers.Append("X-Server-Time", DateTime.UtcNow.ToString("o"));

    await next(context); // Call next middleware

    // Outbound processing
});
\`\`\`

### 2. \`app.Run\` (Terminal Middleware)
Short-circuits the pipeline immediately; it **never calls \`next()\`**:
\`\`\`csharp
app.Run(async context =>
{
    await context.Response.WriteAsync("Terminal fallback: Endpoint not found.");
});
\`\`\`

### 3. \`app.Map\` (Path-Based Branching)
Diverges the pipeline permanently based on a URL path prefix. Requests matching the prefix **never re-join the main pipeline**:
\`\`\`csharp
app.Map("/health", healthApp =>
{
    healthApp.Run(async context =>
    {
        await context.Response.WriteAsync("Healthy (Isolated Branch)");
    });
});
\`\`\`

### 4. \`app.MapWhen\` (Predicate-Based Permanent Branching)
Branches based on a custom \`HttpContext\` boolean predicate. Does not re-join:
\`\`\`csharp
app.MapWhen(context => context.Request.Query.ContainsKey("branch"), branchApp =>
{
    branchApp.Use(async (context, next) =>
    {
        // Executes only for '?branch=true', terminates here
        await context.Response.WriteAsync("Handled by dynamic branch!");
    });
});
\`\`\`

### 5. \`app.UseWhen\` (Conditional Execution with Pipeline Re-Joining)
Executes a sub-pipeline if a condition is met, and then **seamlessly re-joins the main pipeline**:
\`\`\`csharp
app.UseWhen(
    context => context.Request.Path.StartsWithSegments("/api/v1/payments"),
    paymentApp =>
    {
        // Executes specialized payment auditing, then passes control BACK to the main pipeline!
        paymentApp.UseMiddleware<PaymentAuditMiddleware>();
    });
\`\`\`

---

## 4. Conventional Middleware vs. Factory-Activated Middleware (\`IMiddleware\`)

ASP.NET Core supports two fundamentally different ways to implement custom middleware:

\`\`\`csharp
// ── 1. CONVENTIONAL MIDDLEWARE (Singleton Lifetime) ───────────
public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;

    // RequestDelegate is injected into constructor ONCE at startup (Singleton)
    public RequestTimingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    // Scoped services (e.g. AppDbContext) MUST be injected into InvokeAsync, NOT constructor!
    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        var sw = Stopwatch.StartNew();
        await _next(context);
        sw.Stop();

        dbContext.RequestLogs.Add(new RequestLog(context.Request.Path, sw.ElapsedMilliseconds));
        await dbContext.SaveChangesAsync();
    }
}
\`\`\`

\`\`\`csharp
// ── 2. FACTORY-ACTIVATED MIDDLEWARE (IMiddleware - Scoped/Transient) ──
public class TenantResolutionMiddleware : IMiddleware
{
    private readonly ITenantService _tenantService; // Injected directly into constructor!

    // Constructor resolved per-request by IMiddlewareFactory from the DI container!
    public TenantResolutionMiddleware(ITenantService tenantService)
    {
        _tenantService = tenantService;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var tenantId = context.Request.Headers["X-Tenant-ID"].FirstOrDefault();
        if (string.IsNullOrEmpty(tenantId))
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsync("Missing X-Tenant-ID header.");
            return; // Short-circuit!
        }

        await _tenantService.SetTenantAsync(tenantId);
        await next(context); // Proceed
    }
}

// In Program.cs:
// MUST be explicitly registered in DI container!
builder.Services.AddScoped<TenantResolutionMiddleware>();
app.UseMiddleware<TenantResolutionMiddleware>();
\`\`\`

---

## 5. Modern Global Exception Handling with \`IExceptionHandler\` (.NET 8/9)

In previous versions, developers wrote custom \`try/catch\` middleware. .NET 8 introduced **\`IExceptionHandler\`** for unified, composable, zero-boilerplate exception handling:

\`\`\`csharp
public class ValidationExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, 
        Exception exception, 
        CancellationToken cancellationToken)
    {
        if (exception is not ValidationException validationEx)
        {
            return false; // Did not handle; pass to next registered IExceptionHandler in chain!
        }

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        var problemDetails = new HttpValidationProblemDetails(validationEx.Errors)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation Failed",
            Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1"
        };

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true; // Successfully handled!
    }
}

// In Program.cs:
builder.Services.AddExceptionHandler<ValidationExceptionHandler>();
builder.Services.AddExceptionHandler<GlobalFallbackExceptionHandler>();
builder.Services.AddProblemDetails(); // RFC 7807 support

var app = builder.Build();
app.UseExceptionHandler(); // Built-in exception middleware coordinates all IExceptionHandler instances!
\`\`\`

---

## 6. Critical Response Modification Rules & Buffer Traps

### Pitfall 1: Modifying Headers After the Response Has Started
Once the downstream endpoint starts streaming response bytes to the client, HTTP response headers are locked as read-only. Modifying headers afterwards throws:
\`\`\`text
System.InvalidOperationException: Headers are read-only, response has already started.
\`\`\`

### Safe Header Modification with \`OnStarting\`:
\`\`\`csharp
public class SafeHeaderMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        // Registers a callback that fires RIGHT BEFORE headers are flushed to the network socket:
        context.Response.OnStarting(() =>
        {
            context.Response.Headers.Append("X-Custom-Trace-ID", Activity.Current?.Id ?? context.TraceIdentifier);
            return Task.CompletedTask;
        });

        await next(context);
    }
}
\`\`\`

---

## 7. Master Decision Matrix: Pipeline Interception Mechanisms

| Interception Mechanism | Pipeline Level | Scope / Lifetime | Access to Action Metadata | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Conventional Middleware** | Raw HTTP / Network | Singleton | No (Pre-routing) | Low-level security headers, compression, static files |
| **\`IMiddleware\` (Factory)** | Raw HTTP / Network | Scoped or Transient | No (Pre-routing) | Multi-tenant header validation, auth token parsing |
| **\`IEndpointFilter\`** | Minimal API Endpoint | Per-invocation | Yes (Endpoint parameters) | Minimal API parameter validation, endpoint metrics |
| **Action Filters (MVC)** | Controller Action | Per-request | Yes (\`ActionExecutingContext\`) | Controller model state validation, MVC result alteration |
| **\`DelegatingHandler\`** | Outgoing \`HttpClient\` | Transient/Scoped | No (External HTTP) | Outgoing API retries (Polly), auth token attachment |`,
  content_fa: `## ۱. سیر تکامل: از ماژول‌های سنگین IIS به خط لوله سبک و سریع میدل‌ویرها

در دات‌نت‌های قدیمی (System.Web)، مدیریت درخواست‌های HTTP بر عهده **HttpModuleها** بود که وابستگی شدیدی به سرور IIS داشتند:

\`\`\`csharp
// معماری قدیمی دات‌نت و وابستگی به رخدادهای IIS
public class CustomSecurityModule : IHttpModule
{
    public void Init(HttpApplication context)
    {
        context.BeginRequest += OnBeginRequest;
    }
}
\`\`\`

### معایب ماژول‌های قدیمی:
۱. **وابستگی کامل به ویندوز و IIS**: امکان اجرا در کانتینرهای لینوکس و معماری ابری وجود نداشت.
۲. **سربار حافظه**: هر درخواست از ده‌ها مرحله پیش‌فرض IIS عبور می‌کرد و حافظه زیادی هدر می‌رفت.
۳. **پراکندگی منطق**: کدهای مربوط به پردازش ورودی و خروجی در رویدادهای مختلف پخش شده بودند.

فریم‌ورک ASP.NET Core این ساختار را با یک خط لوله دوطرفه ساده بر پایه دلیگیت **\`RequestDelegate\`** جایگزین کرد:
\`\`\`csharp
public delegate Task RequestDelegate(HttpContext context);
\`\`\`

---

## ۲. مدل عروسک روسی (Russian Doll) و ترتیب حیاتی چینش میدل‌ویرها

میدل‌ویرها به صورت تو در تو اجرا می‌شوند؛ درخواست از لایه بیرونی به سمت داخل نفوذ کرده (فاز Inbound) و پس از اجرای اندپوینت نهایی، پاسخ مجدداً به صورت معکوس از میان همان میدل‌ویرها به سمت کلاینت بازمی‌گردد (فاز Outbound):

### ترتیب الزامی چینش میدل‌ویرها در فایل Program.cs:
۱. **\`UseExceptionHandler\`**: باید **اولین** میدل‌ویر باشد تا بتواند تمام خطاهای پرتاب‌شده در لایه‌های بعدی را شکار کند.
۲. **\`UseHttpsRedirection\` و \`UseHsts\`**: تبدیل امن پروتکل HTTP به HTTPS.
۳. **\`UseStaticFiles\`**: فایل‌های استاتیک بدون ورود به لایه‌های احراز هویت یا مسیریابی مستقیماً تحویل داده می‌شوند.
۴. **\`UseRouting\`**: آدرس URL را تجزیه کرده و اندپوینت متناظر را شناسایی می‌کند.
۵. **\`UseCors\` (قاعده حیاتی)**: **حتماً بعد از UseRouting و قبل از UseAuthentication** قرار گیرد تا درخواست‌های Preflight (متد OPTIONS) بدون نیاز به احراز هویت تایید شوند.
۶. **\`UseAuthentication\`**: هویت کاربر را از روی توکن یا کوکی تشخیص می‌دهد.
۷. **\`UseAuthorization\`**: دسترسی کاربر به اندپوینت را بررسی می‌کند.
۸. **\`UseRateLimiter\`**: اعمال محدودیت نرخ درخواست.
۹. **\`MapControllers\` یا \`MapGroup\`**: اجرای کد اصلی اندپوینت.

---

## ۳. الگوهای شاخه‌بندی خط لوله: Use در برابر Run، Map، MapWhen و UseWhen

۱. **\`app.Use\`**: پردازش درون‌خطی و ارسال درخواست به میدل‌ویر بعدی با فراخوانی \`next(context)\`.
۲. **\`app.Run\`**: میدل‌ویر پایانی (Terminal) که هیچ‌گاه متد بعدی را صدا نمی‌زند و پایپ‌لاین را متوقف می‌سازد.
۳. **\`app.Map\`**: انشعاب دائمی مسیر بر اساس پیشوند آدرس URL (درخواست‌ها دیگر به خط لوله اصلی بازنمی‌گردند).
۴. **\`app.MapWhen\`**: انشعاب دائمی بر اساس یک شرط دلخواه روی شیء \`HttpContext\`.
۵. **\`app.UseWhen\` (قابلیت ویژه)**: اجرای یک زیرپایپ‌لاین در صورت برقراری شرط، و سپس **بازگشت خودکار به خط لوله اصلی برنامه**!

---

## ۴. مقایسه میدل‌ویرهای مرسوم (Conventional) با Factory-Activated (اینترفیس IMiddleware)

### ۱. میدل‌ویر مرسوم (Conventional Middleware):
- دارای طول عمر **Singleton** است.
- شیء \`RequestDelegate next\` در سازنده تزریق می‌شود.
- وابستگی‌های Scoped (مانند \`DbContext\`) **نباید در سازنده تزریق شوند** (چون منجر به Captive Dependency می‌شود) و باید به عنوان پارامتر ورودی متد \`InvokeAsync\` دریافت گردند.

### ۲. میدل‌ویر Factory-Activated (اینترفیس IMiddleware):
- اینترفیس \`IMiddleware\` را پیاده‌سازی می‌کند.
- می‌تواند با طول عمر **Scoped** در کانتینر DI ثبت شود.
- تمام سرویس‌های Scoped مستقیماً در سازنده آن تزریق می‌شوند و در هر درخواست توسط \`IMiddlewareFactory\` به صورت Type-Safe و بدون نیاز به Reflection ساخته می‌شود.

---

## ۵. مدیریت سراسری خطاها با IExceptionHandler در دات‌نت ۸ و ۹

در دات‌نت‌های مدرن، نوشتن کلاس‌های سنتی try/catch با اینترفیس استاندارد **\`IExceptionHandler\`** جایگزین شده است:

\`\`\`csharp
public class ValidationExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, 
        Exception exception, 
        CancellationToken cancellationToken)
    {
        if (exception is not ValidationException validationEx)
            return false; // عدم تطابق؛ انتقال به Handler بعدی در زنجیره

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        await httpContext.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = 400,
            Title = "Validation Error",
            Detail = validationEx.Message
        }, cancellationToken);

        return true; // خطا با موفقیت مدیریت شد
    }
}
\`\`\`

---

## ۶. ماتریس مقایسه جامع مکانیزم‌های رهگیری درخواست (Interception Matrix)

| مکانیزم رهگیری | لایه اجرایی | طول عمر | دسترسی به متادیتای اکشن | بهترین سناریوی کاربردی |
| :--- | :--- | :--- | :--- | :--- |
| **Conventional Middleware** | لایه اولیه HTTP و شبکه | Singleton | خیر (قبل از Routing) | هدرهای امنیتی، فشرده‌سازی، لاگ‌های پایه |
| **\`IMiddleware\` (Factory)** | لایه اولیه HTTP و شبکه | Scoped / Transient | خیر (قبل از Routing) | اعتبارسنجی Multi-Tenant، احراز هویت سفارشی |
| **\`IEndpointFilter\`** | اندپوینت Minimal API | به ازای هر فراخوانی | بله (پارامترهای اندپوینت) | ولیدیشن ورودی‌ها و متریک‌های Minimal API |
| **Action Filters (MVC)** | اکشن کنترلر MVC | به ازای هر درخواست | بله (\`ActionExecutingContext\`) | اعتبارسنجی ModelState و اصلاح خروجی Controller |
| **\`DelegatingHandler\`** | کلاینت خروجی \`HttpClient\` | Transient / Scoped | خیر (درخواست بیرونی) | الگوهای Retry در Polly، افزودن توکن Bearer |`,
};
