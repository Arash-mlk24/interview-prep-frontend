import { RoadmapTopic } from "../../../models";

export const cleanArchModularMonolithTopic: RoadmapTopic = {
  id: "topic-dotnet-clean-arch-modular-monolith",
  stepId: "step-lld-clean-ddd",
  slug: "clean-architecture-vertical-slice-modular-monolith",
  order: 2,
  title: "Architectural Styles: Clean Architecture vs Vertical Slices & Modular Monoliths",
  title_fa: "سبک‌های معماری: مقایسه Clean Architecture با Vertical Slice و مونوپروژه‌های ماژولار (Modular Monolith)",
  summary:
    "Evaluate trade-offs between layer-centric Clean Architecture, feature-centric Vertical Slice Architecture, and scalable Modular Monoliths. Learn automated architecture enforcement with NetArchTest and in-process event-driven communication.",
  summary_fa:
    "بررسی مقایسه‌ای و تحلیل تریدآف‌های معماری تمیز لایه‌ای، معماری برش عمودی (Vertical Slice) و مونوپروژه‌های ماژولار. نحوه اعتبارسنجی خودکار مرزهای معماری با NetArchTest و ارتباطات رویدادمحور درون‌پروسسی.",
  readingTimeMinutes: 35,
  difficulty: "senior",
  content: `## 1. The Evolution of Backend Software Architectures

Software architecture in the enterprise .NET ecosystem has evolved through distinct paradigms to balance **business complexity**, **maintainability**, and **developer velocity**:

\`\`\`
[1. Traditional N-Tier]          [2. Clean / Onion Architecture]       [3. Vertical Slice Architecture]
UI / API                         Presentation                          ┌───────────────────────────┐
  │                                    │                               │ Feature: CreateOrder      │
  ▼                                    ▼                               │  Endpoint -> Handler -> DB│
Business Logic (BLL)             Infrastructure ──► Application        └───────────────────────────┘
  │                                                    │               ┌───────────────────────────┐
  ▼                                                    ▼               │ Feature: GetOrderById     │
Data Access (DAL) ──► DB                        Domain (Pure C#)       │  Endpoint -> Dapper Query │
(Coupled to SQL Database)              (Dependency Inversion Rule)     └───────────────────────────┘
\`\`\`

### 1.1 The Failure of Traditional N-Tier Architecture
In traditional N-Tier architecture, the Database is placed at the foundation. The Data Access Layer (DAL) models the database tables, the Business Logic Layer (BLL) depends directly on the DAL, and Controllers depend on the BLL.
- **The Core Flaw:** Business logic becomes tightly coupled to database storage concerns, making unit testing painful (requiring live databases) and making ORM/schema changes risky.

### 1.2 The Dependency Inversion Principle (DIP)
Modern architectures invert this relationship: **the Core Business Domain sits at the center**, and databases, message brokers, and web frameworks become outer *Infrastructure details* that depend on domain abstractions.

---

## 2. Clean Architecture & Hexagonal (Ports & Adapters)

Clean Architecture (also known as Onion or Hexagonal Architecture) structures applications into concentric layers governed by the **Dependency Rule**: *dependencies must only point inward toward the core domain*.

\`\`\`mermaid
flowchart TD
    subgraph Outer["Outer Layer: Infrastructure & Presentation"]
        P[Web API / Controllers / FastEndpoints]
        I[Infrastructure: EF Core DbContext, Redis, RabbitMQ, SendGrid]
    end

    subgraph Middle["Application Layer (Use Cases)"]
        A[CQRS Commands & Queries, DTOs, FluentValidation, Interfaces]
    end

    subgraph Core["Domain Layer (Enterprise Core)"]
        D[Entities, Value Objects, Domain Events, Enums, Business Invariants]
    end

    P -->|Depends On| A
    I -->|Implements Ports / Interfaces| A
    A -->|Depends On| D
    I -.->|Prohibited Direct Access| D
\`\`\`

### 2.1 The Four Concentric Layers in .NET

1. **Domain Layer (Core):**
   - Contains Enterprise Entities, Value Objects, Domain Events, and Custom Domain Exceptions.
   - **Zero external dependencies:** Must not reference EF Core, ASP.NET Core, or third-party NuGet packages (with rare exceptions like MediatR.Contracts).
2. **Application Layer (Use Cases):**
   - Orchestrates domain logic to execute business use cases via CQRS Commands and Queries.
   - Defines **Ports / Interfaces** for outer infrastructure (e.g. \`IEmailService\`, \`IOrderRepository\`, \`IUnitOfWork\`).
3. **Infrastructure Layer (Adapters):**
   - Implements the Application interfaces using concrete technologies: EF Core \`DbContext\`, Dapper, Redis caching, RabbitMQ MassTransit producers, AWS S3 clients.
4. **Presentation Layer (Entry Points):**
   - Web APIs, Minimal APIs, Controllers, Authentication Middleware, and Swagger definitions.

---

### 2.2 Clean Architecture Anti-Patterns & Pitfalls

While Clean Architecture provides exceptional structure for complex enterprise domains, it often suffers from severe real-world anti-patterns:

#### 1. The "Generic Repository" & Unit of Work Anti-Pattern:
\`\`\`csharp
// ❌ ANTI-PATTERN: Wrapping EF Core (which is already a Repository & UoW)
public interface IRepository<T> where T : class
{
    Task<T> GetByIdAsync(int id);
    Task AddAsync(T entity);
}
\`\`\`
- **Why it hurts:** Generic repositories strip away EF Core's powerful features (\`Include\`, \`AsSplitQuery\`, \`AsNoTracking\`, projection via \`Select\`, \`ExecuteUpdateAsync\`) and force developers to either write leaky expression trees or load entire aggregate graphs into memory.
- **Senior Recommendation:** Use specific queries via Dapper/EF Core projections for Reads, and use specialized, behavior-driven Repositories (or direct \`DbContext\`) for Complex Aggregate Writes.

#### 2. "Mapping Fatigue" & Over-Abstraction:
In a strict 4-layer project, a simple field addition requires modifying:
1. Database Migration & Entity
2. Repository Interface & Implementation
3. Domain Entity & Factory Method
4. Application Command & DTO
5. AutoMapper Profile
6. Presentation ViewModel & Controller

For simple CRUD operations, this excessive ceremony slows developer velocity without providing any architectural benefit.

---

## 3. Vertical Slice Architecture (VSA)

Pioneered by Jimmy Bogard, **Vertical Slice Architecture (VSA)** abandons horizontal technical layers (Controllers vs. Services vs. Repositories) in favor of organizing code by **Business Features / Transactions**.

\`\`\`
[Clean Architecture: Horizontal Slices]      [Vertical Slice Architecture: Feature Folders]
src/                                         src/Features/
├── Domain/Entities/Order.cs                 ├── Orders/
├── Application/Orders/CreateOrder.cs        │   ├── CreateOrder/
├── Infrastructure/Data/OrderRepository.cs   │   │   ├── CreateOrderEndpoint.cs
└── Presentation/Controllers/OrderCtrl.cs    │   │   ├── CreateOrderCommand.cs
                                             │   │   ├── CreateOrderValidator.cs
                                             │   │   └── CreateOrderHandler.cs
                                             │   ├── GetOrderById/
                                             │   │   ├── GetOrderByIdEndpoint.cs
                                             │   │   └── GetOrderByIdQuery.cs (Uses raw Dapper SQL)
                                             │   └── CancelOrder/
\`\`\`

### 3.1 Core Principles of Vertical Slice Architecture
1. **High Cohesion per Feature:** Everything required to fulfill a specific request (Request DTO, FluentValidation rules, Handler, SQL query/EF Core logic, Response DTO) lives in the same namespace or folder.
2. **Freedom of Technology per Slice:**
   - **Complex Write Slice (\`CreateOrder\`):** Uses rich Domain Entities, Aggregate Roots, and EF Core change tracking.
   - **High-Throughput Read Slice (\`GetOrderSummary\`):** Uses raw Dapper with hand-tuned SQL or Redis cache, completely bypassing domain entities and mapping layers.
3. **Zero Artificial Coupling:** Modifying the \`CreateOrder\` feature has zero impact on \`CancelOrder\` or \`GetOrderById\`.

---

### 3.2 High-Performance Vertical Slices with \`FastEndpoints\`

While MediatR is commonly used for CQRS dispatching, **FastEndpoints** provides a native Vertical Slice framework built on ASP.NET Core Minimal APIs that eliminates MVC Controller overhead and Reflection dispatching:

\`\`\`csharp
using FastEndpoints;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

// 1. Request & Response Contracts
public record CreateProductRequest(string Name, decimal Price, string Sku);
public record CreateProductResponse(Guid Id, string Name, decimal Price);

// 2. Strongly-Typed FluentValidation Validator
public class CreateProductValidator : Validator<CreateProductRequest>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Sku).NotEmpty().Matches("^[A-Z]{3}-[0-9]{4}$");
    }
}

// 3. Self-Contained Endpoint & Handler in a single file
public class CreateProductEndpoint : Endpoint<CreateProductRequest, CreateProductResponse>
{
    private readonly AppDbContext _db;

    public CreateProductEndpoint(AppDbContext db) => _db = db;

    public override void Configure()
    {
        Post("/api/products");
        AllowAnonymous();
        Summary(s => {
            s.Summary = "Creates a new catalog product";
            s.Description = "Validates SKU format and stores product in database.";
        });
    }

    public override async Task HandleAsync(CreateProductRequest req, CancellationToken ct)
    {
        var product = new Product(req.Name, req.Price, req.Sku);
        _db.Products.Add(product);
        await _db.SaveChangesAsync(ct);

        await SendCreatedAtAsync<GetProductByIdEndpoint>(
            new { id = product.Id },
            new CreateProductResponse(product.Id, product.Name, product.Price),
            cancellation: ct
        );
    }
}
\`\`\`

---

## 4. The Modular Monolith (The Enterprise Sweet Spot)

Many organizations mistakenly adopt microservices prematurely, ending up with a **Distributed Monolith**: an architecture with all the operational complexity of distributed systems (network latency, distributed transaction failures, deployment coordination) and none of the benefits.

\`\`\`mermaid
flowchart TD
    subgraph ModularMonolith["Single Deployable Unit (.NET Process)"]
        subgraph UsersModule["Users Module (Schema: users)"]
            U_API[Public Facade / API]
            U_Core[Domain &amp; DbContext]
        end

        subgraph OrdersModule["Orders Module (Schema: orders)"]
            O_API[Public Facade / API]
            O_Core[Domain &amp; DbContext]
        end

        subgraph BillingModule["Billing Module (Schema: billing)"]
            B_API[Public Facade / API]
            B_Core[Domain &amp; DbContext]
        end

        EventBus["In-Process Event Bus / MediatR Publisher"]
    end

    OrdersModule -->|1. Emits OrderCreatedEvent| EventBus
    EventBus -->|2. Asynchronously Dispatches| BillingModule
    EventBus -->|3. Asynchronously Dispatches| UsersModule
\`\`\`

### 4.1 What is a Modular Monolith?
A **Modular Monolith** is a software design approach where a single deployable application is partitioned into strictly encapsulated, loosely coupled **business modules** (matching DDD Bounded Contexts).

### 4.2 Module Boundaries & Encapsulation Rules

| Rule | Description | Why It Matters |
| :--- | :--- | :--- |
| **C# \`internal\` by Default** | All domain entities, handlers, and repositories are marked \`internal\`. | Prevents other modules from directly instantiating or coupling to internal logic. |
| **Explicit Public API / Contracts** | Each module exposes an \`I[Module]Api\` or public Integration Events. | Defines a clear contract for inter-module queries and commands. |
| **Database Schema Isolation** | Each module owns its dedicated schema (e.g. \`orders.\`, \`users.\`). | Prohibits cross-module SQL joins and foreign keys. |
| **Separate \`DbContext\` per Module** | Each module maintains its own \`DbContext\` mapped to its schema. | Guarantees transactional and bounded context independence. |

---

## 5. Inter-Module Communication Patterns

Modules within a Modular Monolith must communicate without creating circular project references or violating bounded contexts.

### 5.1 Synchronous Communication: Public Module Facades
When Module A needs data from Module B synchronously:

\`\`\`csharp
// In Modules.Users.Contracts (Referenced by Orders module)
public interface IUsersModuleApi
{
    Task<UserSummaryDto?> GetUserSummaryAsync(Guid userId, CancellationToken ct = default);
}

// In Modules.Orders: Consuming the contract without knowing Users internals
public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, Result<Guid>>
{
    private readonly IUsersModuleApi _usersApi;

    public CreateOrderHandler(IUsersModuleApi usersApi) => _usersApi = usersApi;

    public async Task<Result<Guid>> Handle(CreateOrderCommand request, CancellationToken ct)
    {
        UserSummaryDto? user = await _usersApi.GetUserSummaryAsync(request.UserId, ct);
        if (user == null || !user.IsActive)
        {
            return Result.Failure<Guid>(OrderErrors.UserNotFoundOrInactive);
        }

        // Proceed with order creation
        return Result.Success(Guid.NewGuid());
    }
}
\`\`\`

---

### 5.2 Asynchronous Communication: In-Process Event Bus
When a state change occurs in one module that triggers side effects in other modules, use **Integration Events** dispatched over an in-process bus (or MediatR notifications):

\`\`\`csharp
// Shared Contract
public record OrderPlacedIntegrationEvent(Guid OrderId, Guid CustomerId, decimal TotalAmount) : INotification;

// In Modules.Billing: Reacts to event asynchronously
public class OrderPlacedBillingHandler : INotificationHandler<OrderPlacedIntegrationEvent>
{
    private readonly BillingDbContext _db;
    private readonly ILogger<OrderPlacedBillingHandler> _logger;

    public OrderPlacedBillingHandler(BillingDbContext db, ILogger<OrderPlacedBillingHandler> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task Handle(OrderPlacedIntegrationEvent notification, CancellationToken ct)
    {
        _logger.LogInformation("Creating invoice for order {OrderId}", notification.OrderId);
        var invoice = new Invoice(notification.OrderId, notification.CustomerId, notification.TotalAmount);
        _db.Invoices.Add(invoice);
        await _db.SaveChangesAsync(ct);
    }
}
\`\`\`

---

## 6. Automated Architecture Enforcement with NetArchTest

Relying on code reviews to maintain clean boundaries always fails over time. Senior engineers automate architecture rules using **\`NetArchTest.Rules\`** or **\`ArchUnitNET\`** in standard unit test suites:

\`\`\`csharp
using NetArchTest.Rules;
using Xunit;

public class ArchitectureTests
{
    private const string DomainNamespace = "MyApp.Domain";
    private const string ApplicationNamespace = "MyApp.Application";
    private const string InfrastructureNamespace = "MyApp.Infrastructure";
    private const string PresentationNamespace = "MyApp.Presentation";

    [Fact]
    public void Domain_Should_Not_Have_Dependency_On_Outer_Layers()
    {
        // Arrange
        var domainAssembly = typeof(MyApp.Domain.AssemblyReference).Assembly;

        // Act
        TestResult result = Types.InAssembly(domainAssembly)
            .ShouldNot()
            .HaveDependencyOnAny(ApplicationNamespace, InfrastructureNamespace, PresentationNamespace)
            .GetResult();

        // Assert
        Assert.True(result.IsSuccessful, "Domain layer must have zero dependencies on outer layers!");
    }

    [Fact]
    public void Orders_Module_Should_Not_Access_Users_Module_Internal_Namespace()
    {
        // Arrange
        var ordersAssembly = typeof(MyApp.Modules.Orders.AssemblyReference).Assembly;

        // Act: Orders module may only reference MyApp.Modules.Users.Contracts
        TestResult result = Types.InAssembly(ordersAssembly)
            .ShouldNot()
            .HaveDependencyOn("MyApp.Modules.Users.Infrastructure")
            .And()
            .HaveDependencyOn("MyApp.Modules.Users.Domain")
            .GetResult();

        // Assert
        Assert.True(result.IsSuccessful, "Orders module illegally referenced Users module internals!");
    }

    [Fact]
    public void Handlers_Should_Be_Internal_And_EndWith_Handler()
    {
        var applicationAssembly = typeof(MyApp.Application.AssemblyReference).Assembly;

        TestResult result = Types.InAssembly(applicationAssembly)
            .That()
            .ImplementInterface(typeof(MediatR.IRequestHandler<,>))
            .Should()
            .HaveNameEndingWith("Handler")
            .And()
            .NotBePublic()
            .GetResult();

        Assert.True(result.IsSuccessful, "All CQRS handlers must be internal and end with 'Handler'.");
    }
}
\`\`\`

---

## 7. Master Comparison Matrix

| Architectural Dimension | Clean Architecture | Vertical Slice Architecture | Modular Monolith | Microservices |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Organization** | Technical Layers (Domain, App, Infra) | Business Features / Endpoints | Bounded Modules (Single Process) | Independent Network Services |
| **Coupling Type** | Inward layer coupling | Zero cross-feature coupling | Loose coupling via public contracts | Network coupling via HTTP/Queues |
| **CRUD Overhead** | ⚠️ High (Ceremonial layers) | ⚡ Lowest (Direct query/command) | 🟢 Moderate | 🔴 Highest (Distributed setups) |
| **Complex Domain Fit** | 🌟 Excellent (Rich DDD) | 🌟 Excellent (Mixed styles) | 🌟 Superb (Clean Contexts) | 🌟 Great (If domains are mature) |
| **Deployment Complexity**| 🟢 Single Unit | 🟢 Single Unit | 🟢 Single Unit | 🔴 High (K8s, Gateways, CI/CD) |
| **Refactoring to Microservices** | ⚠️ Hard (Coupled layers) | 🟢 Easy (Move feature folder) | ⚡ Easiest (Extract whole module) | N/A (Already distributed) |`,
  content_fa: `## ۱. سیر تکاملی معماری‌های نرم‌افزاری در بک‌اند دات‌نت

معماری نرم‌افزار در اکوسیستم مدرن دات‌نت در طول سال‌ها برای ایجاد تعادل میان **پیچیدگی کسب‌وکار (Business Complexity)**، **قابلیت نگهداری (Maintainability)** و **سرعت توسعه تیم (Velocity)** تکامل یافته است:

\`\`\`
[۱. معماری لایه‌ای سنتی N-Tier]   [۲. معماری تمیز Clean / Onion]       [۳. معماری برش عمودی Vertical Slice]
لایه کاربری UI / API               لایه Presentation                    ┌───────────────────────────┐
       │                                  │                             │ قابلیت: ثبت سفارش         │
       ▼                                  ▼                             │  Endpoint -> Handler -> DB│
لایه بیزینس (BLL)                  لایه Infrastructure ──► Application  └───────────────────────────┘
       │                                                    │           ┌───────────────────────────┐
       ▼                                                    ▼           │ قابلیت: مشاهده جزئیات     │
لایه داده (DAL) ──► DB                           Domain (سی‌شارپ خالص)  │  Endpoint -> کوئری Dapper │
(وابستگی مستقیم به دیتابیس)              (قانون وارونگی وابستگی‌ها - DIP) └───────────────────────────┘
\`\`\`

### ۱.۱ معایب معماری سنتی N-Tier
در معماری سنتی لایه‌ای، پایگاه داده در مرکز و زیربنای همه چیز قرار دارد. لایه دسترسی به داده (DAL) ساختار جداول دیتابیس را مدل می‌کند، لایه بیزینس (BLL) مستقیماً به DAL وابسته است و کنترلرها به BLL وابسته‌اند.
- **اشکال بنیادین:** منطق بیزینس به شدت به پایگاه داده گره می‌خورد و امکان تست واحد مستقل را از بین می‌برد.

### ۱.۲ اصل وارونگی وابستگی‌ها (DIP - Dependency Inversion Principle)
معماری‌های مدرن این رابطه را معکوس می‌کنند: **هسته دامنه بیزینس در مرکز قرار می‌گیرد** و دیتابیس، فریم‌ورک‌های وب و بروکرهای پیام به عنوان جزئیات پیاده‌سازی بیرونی به اینترفیس‌های لایه هسته وابسته می‌شوند.

---

## ۲. معماری تمیز (Clean Architecture) و معماری پیازی (Onion)

معماری تمیز بر اساس **قانون وابستگی (Dependency Rule)** سازماندهی می‌شود: *جهت تمام وابستگی‌ها باید همواره از لایه‌های بیرونی به سمت لایه درونی (Domain) باشد*.

\`\`\`mermaid
flowchart TD
    subgraph Outer["لایه بیرونی: Infrastructure و Presentation"]
        P[کنترلرها، Minimal APIs و FastEndpoints]
        I[پیاده‌سازی EF Core، کلاینت ردیس، ربیت‌ام‌کیو و ایمیل]
    end

    subgraph Middle["لایه کاربرد (Application Layer)"]
        A[دستورات و کوئری‌های CQRS، اینترفیس‌ها، اعتبارسنجی‌ها]
    end

    subgraph Core["لایه هسته دامنه (Domain Layer)"]
        D[انتیتی‌ها، Value Objects، رویدادهای دامنه، قوانین بیزینس]
    end

    P -->|وابسته به| A
    I -->|پیاده‌سازی اینترفیس‌های| A
    A -->|وابسته به| D
    I -.->|ممنوعیت وابستگی مستقیم به| D
\`\`\`

### ۲.۱ وظایف ۴ لایه اصلی در Clean Architecture
1. **لایه دامنه (Domain Layer):**
   - شامل موجودیت‌ها (Entities)، اشیای مقداری (Value Objects)، رویدادهای دامنه (Domain Events) و خطاهای تجاری.
   - **بدون هیچ‌گونه وابستگی خارجی:** به هیچ پکیج دیتابیسی یا فریم‌ورک وبی وابسته نیست.
2. **لایه کاربرد (Application Layer):**
   - سناریوهای بیزینسی را در قالب الگوهای CQRS با دستورات (Commands) و کوئری‌ها (Queries) پیاده‌سازی می‌کند.
   - اینترفیس‌های مورد نیاز برای ابزارهای خارجی (مانند \`IOrderRepository\` یا \`IEmailService\`) را تعریف می‌کند.
3. **لایه زیرساخت (Infrastructure Layer):**
   - اینترفیس‌های لایه Application را با ابزارهای واقعی مانند EF Core DbContext، Dapper، کلاینت Redis و MassTransit پیاده‌سازی می‌کند.
4. **لایه ارائه (Presentation Layer):**
   - کنترلرها، اندپوینت‌های وب API، میدل‌ویرهای احراز هویت و پیکربندی Swagger.

---

### ۲.۲ چالش‌ها و ضدالگوهای رایج Clean Architecture

گرچه Clean Architecture برای دامنه‌های بسیار پیچیده عالی است، اما در پروژه‌های روزمره اغلب دچار این ضدالگوها می‌شود:

#### ۱. ضدالگوی مخرب Generic Repository:
\`\`\`csharp
// ❌ ضدالگو: ایجاد لایه انتزاعی اضافی روی EF Core که خود یک Repository کامل است
public interface IRepository<T> where T : class
{
    Task<T> GetByIdAsync(int id);
    Task AddAsync(T entity);
}
\`\`\`
- **دلیل اشکال:** این الگو قابلیت‌های قدرتمند EF Core (مانند \`AsNoTracking\`، \`Include\`، \`Select\` و \`ExecuteUpdateAsync\`) را محدود کرده و توسعه‌دهنده را مجبور به لود کل آبجکت در رم می‌کند.
- **توصیه معمارانه:** برای خواندن از کوئری‌های مستقیم Dapper/EF Core استفاده کنید و برای نوشتن دامنه‌های پیچیده، ریپازیتوری‌های اختصاصی مبتنی بر Aggregate Root بسازید.

#### ۲. خستگی ناشی از نگاشت لایه‌ها (Mapping Fatigue):
برای اضافه کردن یک فیلد ساده به دیتابیس، توسعه‌دهنده باید ۶ فایل مجزا در لایه‌های مختلف را تغییر دهد که سرعت توسعه قابلیت‌های جدید را به شدت کاهش می‌دهد.

---

## ۳. معماری برش عمودی (Vertical Slice Architecture)

معماری **Vertical Slice (VSA)** که توسط جیمی بوگارد معرفی شد، سازماندهی بر اساس لایه‌های افقی را کنار گذاشته و کد را بر اساس **قابلیت‌ها و تراکنش‌های بیزینسی (Features)** گروه‌بندی می‌کند.

\`\`\`
[معماری تمیز: لایه‌های افقی]                 [معماری برش عمودی: فولدر قابلیت‌ها]
src/                                         src/Features/
├── Domain/Entities/Order.cs                 ├── Orders/
├── Application/Orders/CreateOrder.cs        │   ├── CreateOrder/
├── Infrastructure/Data/OrderRepository.cs   │   │   ├── CreateOrderEndpoint.cs
└── Presentation/Controllers/OrderCtrl.cs    │   │   ├── CreateOrderCommand.cs
                                             │   │   ├── CreateOrderValidator.cs
                                             │   │   └── CreateOrderHandler.cs
                                             │   ├── GetOrderById/
                                             │   │   ├── GetOrderByIdEndpoint.cs
                                             │   │   └── GetOrderByIdQuery.cs (کوئری مستقیم Dapper)
\`\`\`

### ۳.۱ اصول کلیدی در Vertical Slice
1. **انسجام بالا در هر ویژگی (High Cohesion):** تمام کدهای مربوط به یک قابلیت (درخواست، اعتبارسنجی FluentValidation، هندلر، کوئری SQL و پاسخ) درون یک پوشه قرار می‌گیرند.
2. **آزادی در انتخاب تکنولوژی برای هر اسلایس:**
   - اسلایس ثبت سفارش پیچیده از انتیتی‌های غنی DDD و EF Core استفاده می‌کند.
   - اسلایس خواندن لیست سفارشات از Dapper با سرعت بالا و بدون لایه‌های اضافی استفاده می‌کند.
3. **عدم وابستگی اسلایس‌ها به یکدیگر:** تغییر در اسلایس \`CreateOrder\` هیچ خطری برای عملکرد اسلایس \`CancelOrder\` ایجاد نمی‌کند.

---

### ۳.۲ پیاده‌سازی سریع و سبک با \`FastEndpoints\`

کتابخانه **FastEndpoints** جایگزینی مدرن برای کنترلرهای سنگین MVC است که بر بستر Minimal APIs دات‌نت ساخته شده و معماری Vertical Slice را به بهترین شکل پیاده می‌کند:

\`\`\`csharp
using FastEndpoints;
using FluentValidation;

public record CreateProductRequest(string Name, decimal Price, string Sku);
public record CreateProductResponse(Guid Id, string Name, decimal Price);

public class CreateProductValidator : Validator<CreateProductRequest>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Sku).NotEmpty().Matches("^[A-Z]{3}-[0-9]{4}$");
    }
}

public class CreateProductEndpoint : Endpoint<CreateProductRequest, CreateProductResponse>
{
    private readonly AppDbContext _db;

    public CreateProductEndpoint(AppDbContext db) => _db = db;

    public override void Configure()
    {
        Post("/api/products");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CreateProductRequest req, CancellationToken ct)
    {
        var product = new Product(req.Name, req.Price, req.Sku);
        _db.Products.Add(product);
        await _db.SaveChangesAsync(ct);

        await SendCreatedAtAsync<GetProductByIdEndpoint>(
            new { id = product.Id },
            new CreateProductResponse(product.Id, product.Name, product.Price),
            cancellation: ct
        );
    }
}
\`\`\`

---

## ۴. معماری ماژولار یکپارچه (Modular Monolith)

بسیاری از تیم‌ها بدون ارزیابی دقیق به سمت میکروسرویس حرکت می‌کنند و در نهایت به یک **Distributed Monolith** می‌رسند که معایب هر دو را به همراه دارد (تأخیر شبکه، پیچیدگی دیپلوی، تراکنش‌های ناقص و لاگ‌های پراکنده).

\`\`\`mermaid
flowchart TD
    subgraph ModularMonolith["یک پروسس واحد دات‌نت (Single Process)"]
        subgraph UsersModule["ماژول کاربران (اسکیما: users)"]
            U_API[فاساد عمومی / Public API]
            U_Core[Domain و DbContext اختصاصی]
        end

        subgraph OrdersModule["ماژول سفارشات (اسکیما: orders)"]
            O_API[فاساد عمومی / Public API]
            O_Core[Domain و DbContext اختصاصی]
        end

        subgraph BillingModule["ماژول مالی (اسکیما: billing)"]
            B_API[فاساد عمومی / Public API]
            B_Core[Domain و DbContext اختصاصی]
        end

        EventBus["Event Bus درون‌پروسسی / اعلان‌های MediatR"]
    end

    OrdersModule -->|۱. انتشار رویداد OrderCreated| EventBus
    EventBus -->|۲. ارسال ناهمگام به| BillingModule
    EventBus -->|۳. ارسال ناهمگام به| UsersModule
\`\`\`

### ۴.۱ مونوپروژه ماژولار چیست؟
رویکردی که در آن کل سیستم به عنوان **یک واحد قابل استقرار (Single Deployable Unit)** اجرا می‌شود، اما کدهای آن به ماژول‌های کاملاً ایزوله، خودمختار و مستقل (منطبق با Bounded Contextهای DDD) تفکیک شده‌اند.

### ۴.۲ اصول ایزوله‌سازی ماژول‌ها:
1. **کلمات کلیدی \`internal\` به صورت پیش‌فرض:** تمام انتیتی‌ها و هندلرهای داخلی هر ماژول با \`internal\` تعریف می‌شوند تا هیچ ماژول دیگری نتواند مستقیماً به کدهای داخلی دسترسی داشته باشد.
2. **تفکیک اسکیماهای دیتابیس:** ماژول سفارشات از اسکیمای \`orders\` و ماژول کاربران از اسکیمای \`users\` در دیتابیس استفاده می‌کند. هیچ دستور Join یا کلید خارجی (Foreign Key) بین اسکیماهای دو ماژول مجاز نیست.
3. **\`DbContext\` مجزا برای هر ماژول:** هر ماژول مایگریشن‌ها و مدل‌های داده‌ای اختصاصی خود را مدیریت می‌کند.

---

## ۵. ارتباطات بین ماژول‌ها (Inter-Module Communication)

### ۵.۱ ارتباط همگام با فاسادهای عمومی (Public Facades):
ماژول مبدأ فقط اینترفیس پابلیک ماژول مقصد را صدا می‌زند:

\`\`\`csharp
public interface IUsersModuleApi
{
    Task<UserSummaryDto?> GetUserSummaryAsync(Guid userId, CancellationToken ct = default);
}
\`\`\`

### ۵.۲ ارتباط ناهمگام با Event Bus درون‌حافظه‌ای:
وقتی سفارشی ثبت می‌شود، رویداد آن در صف درون‌پروسسی منتشر شده و ماژول فاکتورزنی بدون وابستگی مستقیم آن را دریافت می‌کند:

\`\`\`csharp
public record OrderPlacedIntegrationEvent(Guid OrderId, Guid CustomerId, decimal Amount) : INotification;

public class OrderPlacedBillingHandler : INotificationHandler<OrderPlacedIntegrationEvent>
{
    private readonly BillingDbContext _db;

    public OrderPlacedBillingHandler(BillingDbContext db) => _db = db;

    public async Task Handle(OrderPlacedIntegrationEvent notification, CancellationToken ct)
    {
        var invoice = new Invoice(notification.OrderId, notification.CustomerId, notification.Amount);
        _db.Invoices.Add(invoice);
        await _db.SaveChangesAsync(ct);
    }
}
\`\`\`

---

## ۶. اعتبارسنجی خودکار معماری با NetArchTest

برای اینکه مطمئن شویم اعضای تیم مرزهای معماری را نقض نمی‌کنند، تست‌های معماری را با **\`NetArchTest.Rules\`** در پایپ‌لاین CI/CD اجرا می‌کنیم:

\`\`\`csharp
using NetArchTest.Rules;
using Xunit;

public class ArchitectureTests
{
    [Fact]
    public void Domain_Should_Not_Have_Dependency_On_Outer_Layers()
    {
        var domainAssembly = typeof(MyApp.Domain.AssemblyReference).Assembly;

        TestResult result = Types.InAssembly(domainAssembly)
            .ShouldNot()
            .HaveDependencyOnAny("MyApp.Application", "MyApp.Infrastructure", "MyApp.Presentation")
            .GetResult();

        Assert.True(result.IsSuccessful, "لایه Domain نباید هیچ وابستگی به لایه‌های بیرونی داشته باشد!");
    }

    [Fact]
    public void Orders_Module_Should_Not_Access_Users_Module_Internals()
    {
        var ordersAssembly = typeof(MyApp.Modules.Orders.AssemblyReference).Assembly;

        TestResult result = Types.InAssembly(ordersAssembly)
            .ShouldNot()
            .HaveDependencyOn("MyApp.Modules.Users.Infrastructure")
            .And()
            .HaveDependencyOn("MyApp.Modules.Users.Domain")
            .GetResult();

        Assert.True(result.IsSuccessful, "ماژول سفارشات نباید کدهای داخلی ماژول کاربران را صدا بزند!");
    }
}
\`\`\`

---

## ۷. جدول مقایسه جامع سبک‌های معماری

| بعد معماری | Clean Architecture | Vertical Slice Architecture | Modular Monolith | Microservices |
| :--- | :--- | :--- | :--- | :--- |
| **ساختاردهی اصلی** | لایه‌های فنی (Domain, App, Infra) | قابلیت‌های بیزینسی (Features) | ماژول‌های بیزینسی مجزا | سرویس‌های مستقل روی شبکه |
| **سربار عملیات CRUD** | ⚠️ بالا (لایه‌بندی‌های زیاد) | ⚡ کمترین (کوئری مستقیم) | 🟢 متوسط | 🔴 بیشترین پیچیدگی |
| **مناسب برای دامین‌های پیچیده**| 🌟 عالی | 🌟 عالی | 🌟 ایده‌آل | 🌟 عالی (در تیم‌های بزرگ) |
| **پیچیدگی استقرار و دیپلوی**| 🟢 یک پکیج واحد | 🟢 یک پکیج واحد | 🟢 یک پکیج واحد | 🔴 بالا (K8s، گیت‌وی‌ها) |
| **سهولت جداسازی به میکروسرویس**| ⚠️ دشوار | 🟢 آسان | ⚡ بسیار آسان | از قبل مستقل است |`,
};
