import { RoadmapTopic } from "../../../models";

export const architectureCqrsMediatrPipelineTopic: RoadmapTopic = {
  id: "topic-dotnet-architecture-cqrs-mediatr-pipeline",
  stepId: "step-mid-architecture-cqrs",
  slug: "architecture-cqrs-mediatr-pipeline",
  order: 2,
  title: "CQRS with MediatR & Pipeline Behaviors",
  title_fa: "الگوی CQRS با MediatR و رفتارهای میانجی (Pipeline Behaviors)",
  summary:
    "Master Command Query Responsibility Segregation (CQRS), MediatR request/handler lifecycle, cross-cutting pipeline behaviors (validation, logging, transactions).",
  summary_fa:
    "تسلط بر جداسازی دستورات و کوئری‌ها (CQRS)، چرخه اجرای هندلرها در MediatR و رفتارهای میانجی (Pipeline Behaviors) برای اعتبارسنجی خودکار و لاگینگ.",
  readingTimeMinutes: 22,
  difficulty: "mid",
  content: `## 1. CQRS (Command Query Responsibility Segregation)

- **Command**: Changes application state (Create, Update, Delete). Returns void or ID/result status.
- **Query**: Reads application state (Read-only). Never mutates data.

\`\`\`csharp
// Command Definition
public record CreateProductCommand(string Name, decimal Price, int Stock) : IRequest<Guid>;

// Command Handler
public class CreateProductCommandHandler(AppDbContext db) : IRequestHandler<CreateProductCommand, Guid>
{
    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken ct)
    {
        var product = new Product(request.Name, request.Price, request.Stock);
        db.Products.Add(product);
        await db.SaveChangesAsync(ct);
        return product.Id;
    }
}
\`\`\`

---

## 2. MediatR Pipeline Behaviors (Cross-Cutting Concerns)

Pipeline behaviors act like middleware inside the MediatR request pipeline:

\`\`\`csharp
public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);
        var validationResults = await Task.WhenAll(
            validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .ToList();

        if (failures.Count != 0)
        {
            throw new ValidationException(failures);
        }

        return await next();
    }
}
\`\`\``,
  content_fa: `## ۱. مفهوم CQRS در دات‌نت

- **دستورات (Commands)**: عملیاتی که وضعیت داده‌ها را تغییر می‌دهند (ایجاد، ویرایش، حذف).
- **کوئری‌ها (Queries)**: عملیات خواندن داده که هیچ تغییری در دیتابیس ایجاد نمی‌کنند.

---

## ۲. رفتارهای میانجی (MediatR Pipeline Behaviors)

رفتارهای میانجی مانند میدل‌ویر برای دستورات عمل می‌کنند و امکان اجرای کارهای مشترک (Cross-Cutting Concerns) مانند اعتبارسنجی خودکار با FluentValidation، لاگینگ و شروع تراکنش را فراهم می‌سازند.`,
};
