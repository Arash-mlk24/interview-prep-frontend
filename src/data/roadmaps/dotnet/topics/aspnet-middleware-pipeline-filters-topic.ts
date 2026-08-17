import { RoadmapTopic } from "../../../models";

export const aspnetMiddlewarePipelineFiltersTopic: RoadmapTopic = {
  id: "topic-dotnet-aspnet-middleware-pipeline-filters",
  stepId: "step-mid-aspnet-webapi",
  slug: "aspnet-middleware-pipeline-filters",
  order: 3,
  title: "Middleware Pipeline, Exception Handler & Action Filters",
  title_fa: "خط لوله میدل‌ویرها، مدیریت یکپارچه خطاها و Action Filters",
  summary:
    "Understand the Russian Doll execution model of ASP.NET Core middleware, custom middleware development, global exception handling with IExceptionHandler, and action filter pipelines.",
  summary_fa:
    "درک مدل اجرای خط لوله میدل‌ویرها، ساخت Custom Middleware، مدیریت سراسری خطاها با IExceptionHandler در دات‌نت ۸، و تفاوت میدل‌ویر با Filterها.",
  readingTimeMinutes: 20,
  difficulty: "mid",
  content: `## 1. The Middleware Pipeline (Russian Doll Model)

In ASP.NET Core, HTTP requests pass through a sequence of delegates called middleware:

\`\`\`csharp
public class PerformanceMonitoringMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<PerformanceMonitoringMiddleware> _logger;

    public PerformanceMonitoringMiddleware(RequestDelegate next, ILogger<PerformanceMonitoringMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            await _next(context); // Pass execution to next middleware
        }
        finally
        {
            sw.Stop();
            _logger.LogInformation("HTTP {Method} {Path} responded in {Elapsed}ms",
                context.Request.Method, context.Request.Path, sw.ElapsedMilliseconds);
        }
    }
}
\`\`\`

---

## 2. Global Exception Handling (.NET 8 IExceptionHandler)

\`\`\`csharp
public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        logger.LogError(exception, "Unhandled exception occurred: {Message}", exception.Message);

        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Internal Server Error",
            Detail = "An unexpected error occurred processing your request."
        };

        httpContext.Response.StatusCode = problemDetails.Status.Value;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true; // Error handled
    }
}
\`\`\`

---

## 3. Middleware vs Action Filters

- **Middleware**: Operates at the raw \`HttpContext\` level for every incoming request (Authentication, CORS, Routing, Static Files).
- **Filters**: Run within the ASP.NET Core MVC/Endpoint pipeline with access to \`ActionContext\`, model state, and action parameters (Validation, Custom Model Modification).`,
  content_fa: `## ۱. خط لوله میدل‌ویرها (مدل عروسک روسی)

در ASP.NET Core، هر درخواست HTTP از زنجیره‌ای از میدل‌ویرها عبور می‌کند که می‌توانند قبل و بعد از پردازش اندپوینت عملیاتی را اجرا کنند:

\`\`\`csharp
public class PerformanceMonitoringMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<PerformanceMonitoringMiddleware> _logger;

    public PerformanceMonitoringMiddleware(RequestDelegate next, ILogger<PerformanceMonitoringMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            await _next(context); // انتقال به میدل‌ویر بعدی
        }
        finally
        {
            sw.Stop();
            _logger.LogInformation("HTTP {Method} {Path} responded in {Elapsed}ms",
                context.Request.Method, context.Request.Path, sw.ElapsedMilliseconds);
        }
    }
}
\`\`\`

---

## ۲. مدیریت خطای سراسری با IExceptionHandler در دات‌نت ۸

دات‌نت ۸ رویکرد مدرن و استانداردی با \`IExceptionHandler\` ارائه می‌دهد که خطاهای برنامه را به پاسخ‌های استاندارد RFC 7807 (ProblemDetails) تبدیل می‌کند.

---

## ۳. تفاوت میدل‌ویر و اکشن فیلتر

- **میدل‌ویرها**: روی تمامی درخواست‌های HTTP و در سطح اولیه شبکه و \`HttpContext\` اجرا می‌شوند.
- **فیلترها**: تنها پس از انتخاب اندپوینت و با دسترسی کامل به پارامترهای اکشن و وضعیت مدل اجرا می‌گردند.`,
};
