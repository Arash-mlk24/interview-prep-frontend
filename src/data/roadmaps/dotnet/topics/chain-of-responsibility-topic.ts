import { RoadmapTopic } from "../../../models";

export const chainOfResponsibilityTopic: RoadmapTopic = {
  id: "topic-dotnet-chain-of-responsibility",
  stepId: "step-patterns-clean-arch",
  slug: "chain-of-responsibility-middleware-mediatr",
  order: 3,
  title: "Chain of Responsibility in ASP.NET Core Middleware & MediatR Pipeline",
  title_fa: "الگوی زنجیره مسئولیت در Middleware دات‌نت و Pipeline Behaviors کتابخانه MediatR",
  summary: "Implement decoupled processing pipelines for validation, logging, performance telemetry, and transactional boundaries.",
  summary_fa: "پیاده‌سازی خطوط لوله پردازشی مستقل برای اعتبارسنجی ورودی، لاگ‌گیری، مدیریت تراکنش‌ها و مانیتورینگ عملکرد با الگوی Chain of Responsibility.",
  readingTimeMinutes: 16,
  difficulty: "mid",
  content: `### 1. The Chain of Responsibility Pattern

The **Chain of Responsibility** passes a request along a sequence of handlers. Each handler decides whether to process the request or pass it to the next handler in the pipeline.

---

### 2. ASP.NET Core Middleware Pipeline

\`\`\`csharp
public class PerformanceMonitoringMiddleware {
    private readonly RequestDelegate _next;
    private readonly ILogger<PerformanceMonitoringMiddleware> _logger;

    public PerformanceMonitoringMiddleware(RequestDelegate next, ILogger<PerformanceMonitoringMiddleware> logger) {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context) {
        var sw = Stopwatch.StartNew();
        await _next(context); // Pass request along chain
        sw.Stop();

        if (sw.ElapsedMilliseconds > 500) {
            _logger.LogWarning("Slow request detected: {Path} took {Elapsed}ms", context.Request.Path, sw.ElapsedMilliseconds);
        }
    }
}
\`\`\`

---

### 3. MediatR Pipeline Behaviors

\`\`\`csharp
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> 
    where TRequest : notnull {
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators) => _validators = validators;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct) {
        var context = new ValidationContext<TRequest>(request);
        var failures = _validators.Select(v => v.Validate(context)).SelectMany(r => r.Errors).Where(f => f != null).ToList();
        if (failures.Count != 0) throw new ValidationException(failures);

        return await next(); // Forward to domain handler
    }
}
\`\`\``,
  content_fa: `### ۱. الگوی زنجیره مسئولیت (Chain of Responsibility)

این الگو درخواست را از میان زنجیره‌ای از پردازنده‌ها عبور می‌دهد؛ هر پردازنده کارهای جانبی (مانند اعتبارسنجی، لاگینگ یا مدیریت خطا) را انجام داده و با فراخوانی \`next()\` درخواست را به مرحله بعد منتقل می‌کند.

---

### ۲. پیاده‌سازی در خط لوله Middleware و MediatR

- **Middleware در ASP.NET Core:** کنترل جریان درخواست HTTP و اندازه‌گیری زمان پاسخ‌دهی.
- **MediatR Pipeline Behaviors:** اعتبارسنجی خودکار ورودی‌ها با FluentValidation و مدیریت ترنزکشن‌های دیتابیس بدون کثیف کردن کدهای اصلی بیزینس.`,
};
