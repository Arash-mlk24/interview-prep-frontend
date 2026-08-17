import { RoadmapTopic } from "../../../models";

export const architectureLayeredCleanArchitectureTopic: RoadmapTopic = {
  id: "topic-dotnet-architecture-layered-clean-architecture",
  stepId: "step-mid-architecture-cqrs",
  slug: "architecture-layered-clean-architecture",
  order: 1,
  title: "Layered Architecture vs Clean Architecture Principles",
  title_fa: "معماری چندلایه (Layered Architecture) و اصول معماری تمیز (Clean Architecture)",
  summary:
    "Understand the Dependency Inversion Principle, separation of Domain, Application, Infrastructure, and Presentation layers, and avoiding business logic leaks.",
  summary_fa:
    "درک اصل معکوس‌سازی وابستگی‌ها (DIP)، تفکیک لایه‌های دامنه (Domain)، کاربرد (Application)، زیرساخت (Infrastructure) و ارائه (Presentation) و جلوگیری از نشت منطق تجاری.",
  readingTimeMinutes: 24,
  difficulty: "mid",
  content: `## 1. Traditional Layered vs Clean Architecture

In traditional N-tier architectures, dependencies flow downwards:
\`Presentation -> Business Logic -> Data Access -> Database\`

In **Clean Architecture (Hexagonal / Onion)**, dependencies point strictly inwards toward the core domain:
\`Presentation & Infrastructure -> Application Layer -> Domain Core\`

---

## 2. Layer Responsibilities

1. **Domain Layer**: Enterprise business rules, Entities, Enums, Value Objects, Domain Events. Zero third-party dependencies (no EF Core, no ASP.NET Core).
2. **Application Layer**: Use cases, CQRS Commands & Queries, DTOs, Interfaces (\`IEmailSender\`, \`IOrderRepository\`), Pipeline Behaviors.
3. **Infrastructure Layer**: Concrete implementations of external systems (\`AppDbContext\`, Stripe payment gateway, Redis caching, RabbitMQ publisher).
4. **Presentation / Web API Layer**: Controllers, Minimal API endpoints, Middleware, Swagger, Authentication setup.

---

## 3. The Dependency Inversion Principle in Action

The Application layer defines the interface contract, while the Infrastructure layer provides the implementation:

\`\`\`csharp
// Application Layer (Contract)
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(User user, CancellationToken ct = default);
}

// Infrastructure Layer (Implementation)
public class EfUserRepository(AppDbContext context) : IUserRepository
{
    public Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => context.Users.FindAsync(new object[] { id }, ct).AsTask();

    public async Task AddAsync(User user, CancellationToken ct = default)
        => await context.Users.AddAsync(user, ct);
}
\`\`\``,
  content_fa: `## ۱. مقایسه معماری چندلایه سنتی با Clean Architecture

در معماری سنتی لایه‌ای، لایه تجاری مستقیماً به لایه دیتابیس وابسته است. اما در **Clean Architecture**، طبق اصل معکوس‌سازی وابستگی (Dependency Inversion Principle)، تمامی لایه‌ها به سمت هسته دامنه (Domain) جهت‌گیری دارند.

---

## ۲. وظایف هر لایه در Clean Architecture

۱. **لایه دامنه (Domain)**: موجودیت‌ها، منطق خالص کسب‌وکار و قوانین اصلی سیستم، کاملاً مستقل از کتابخانه‌ها و دیتابیس.
۲. **لایه کاربرد (Application)**: سناریوهای سیستم (Use Cases)، دستورات و کوئری‌ها، اینترفیس‌ها و DTOها.
۳. **لایه زیرساخت (Infrastructure)**: پیاده‌سازی اتصالات دیتابیس، درگاه‌های پرداخت، صف‌های پیام و سرویس‌های خارجی.
۴. **لایه ارائه (Presentation)**: کنترلرها، اندپوینت‌های وب و میدل‌ویرها.

---

## ۳. اصل معکوس‌سازی وابستگی (DIP) در عمل

لایه کاربرد تنها با اینترفیس‌ها کار می‌کند و لایه زیرساخت پیاده‌سازی واقعی را ارائه می‌دهد تا سیستم کاملاً تست‌پذیر و ماژولار باقی بماند.`,
};
