import { Roadmap } from "../../models";

// Step 1 Topics: C# OOP & Modern Language Fundamentals
import { csharpOopRecordsPatternMatchingTopic } from "./topics/csharp-oop-records-pattern-matching-topic";
import { csharpGenericsCollectionsLinqTopic } from "./topics/csharp-generics-collections-linq-topic";
import { csharpDelegatesLambdasEventsTopic } from "./topics/csharp-delegates-lambdas-events-topic";
import { csharpExceptionsIdisposableTopic } from "./topics/csharp-exceptions-idisposable-topic";

// Step 2 Topics: ASP.NET Core Web API & Application Pipeline
import { aspnetControllersMinimalApisRoutingTopic } from "./topics/aspnet-controllers-minimal-apis-routing-topic";
import { aspnetDependencyInjectionLifetimesTopic } from "./topics/aspnet-dependency-injection-lifetimes-topic";
import { aspnetMiddlewarePipelineFiltersTopic } from "./topics/aspnet-middleware-pipeline-filters-topic";
import { aspnetConfigurationOptionsSecretsTopic } from "./topics/aspnet-configuration-options-secrets-topic";

// Step 3 Topics: Relational Persistence with Entity Framework Core
import { efcoreDbContextFluentApiMappingsTopic } from "./topics/efcore-dbcontext-fluent-api-mappings-topic";
import { efcoreQueryingRelationshipsLoadingTopic } from "./topics/efcore-querying-relationships-loading-topic";
import { efcoreMigrationsSeedingTransactionsTopic } from "./topics/efcore-migrations-seeding-transactions-topic";

// Step 4 Topics: Authentication, Authorization & Security Best Practices
import { securityJwtBearerClaimsIdentityTopic } from "./topics/security-jwt-bearer-claims-identity-topic";
import { securityRolePolicyAuthorizationTopic } from "./topics/security-role-policy-authorization-topic";
import { securityApiProtectionRateLimitingCorsTopic } from "./topics/security-api-protection-rate-limiting-cors-topic";

// Step 5 Topics: Application Architecture, Clean Architecture & CQRS
import { architectureLayeredCleanArchitectureTopic } from "./topics/architecture-layered-clean-architecture-topic";
import { architectureCqrsMediatrPipelineTopic } from "./topics/architecture-cqrs-mediatr-pipeline-topic";
import { architectureRepositoryPatternAutomapperTopic } from "./topics/architecture-repository-pattern-automapper-topic";

// Step 6 Topics: Asynchronous Programming, Caching & Background Jobs
import { asyncAwaitCancellationTokensTopic } from "./topics/async-await-cancellation-tokens-topic";
import { cachingImemorycacheRedisBasicsTopic } from "./topics/caching-imemorycache-redis-basics-topic";
import { backgroundTasksHostedServicesTopic } from "./topics/background-tasks-hosted-services-topic";

// Step 7 Topics: Automated Testing & Test-Driven Development
import { testingUnitXunitMoqTopic } from "./topics/testing-unit-xunit-moq-topic";
import { testingIntegrationWebapplicationfactoryTopic } from "./topics/testing-integration-webapplicationfactory-topic";

// Step 8 Topics: Logging, Diagnostics & Containerization
import { diagnosticsStructuredLoggingSerilogTopic } from "./topics/diagnostics-structured-logging-serilog-topic";
import { diagnosticsHealthChecksProbesTopic } from "./topics/diagnostics-health-checks-probes-topic";
import { devopsDockerContainersDotnetTopic } from "./topics/devops-docker-containers-dotnet-topic";

export const dotnetMidlevelBackendRoadmap: Roadmap = {
  id: "roadmap-dotnet-midlevel-backend",
  stackId: "dotnet",
  slug: "midlevel-backend-developer",
  title: "Mid-Level .NET Backend Developer Roadmap",
  title_fa: "نقشه راه توسعه میدلول بک‌اند در دات‌نت (از جونیور تا میدلول و آماده ورود به سینیور)",
  description:
    "Comprehensive professional roadmap for Mid-Level .NET Engineers: Modern C# language features, ASP.NET Core Web APIs, Entity Framework Core, JWT security, Clean Architecture, MediatR, caching, xUnit testing, and Docker deployment.",
  description_fa:
    "نقشه راه جامع و کاربردی برای توسعه‌دهندگان میدلول دات‌نت: امکانات سی‌شارپ مدرن، وب سرویس‌های ASP.NET Core، دیتابیس با EF Core، امنیت و JWT، معماری تمیز و MediatR، کشینگ و پس‌زمینه، تست با xUnit و استقرار با داکر.",
  icon: "Code",
  order: 1,
  targetLevel: "Junior to Mid-Level / Pre-Senior",
  targetLevel_fa: "سطح جونیور تا میدلول و پیش‌نیاز سینیور",
  estimatedHours: 85,
  steps: [
    {
      id: "step-mid-csharp-fundamentals",
      roadmapId: "roadmap-dotnet-midlevel-backend",
      slug: "csharp-oop-modern-features",
      order: 1,
      title: "1. C# Object-Oriented & Modern Language Fundamentals",
      title_fa: "۱. مبانی پیشرفته شی‌گرایی، ساختارهای نوین سی‌شارپ و مدیریت منابع",
      description:
        "Master C# OOP principles, Struct vs Class memory allocation, immutable Records, Pattern Matching, Generics, LINQ execution, and IDisposable patterns.",
      description_fa:
        "تسلط بر اصول شی‌گرایی، تفاوت تخصیص حافظه Struct و Class، رکوردهای غیرقابل تغییر، تطبیق الگو، کالکشن‌ها، موتور اجرای LINQ و آزادسازی منابع.",
      topics: [
        csharpOopRecordsPatternMatchingTopic,
        csharpGenericsCollectionsLinqTopic,
        csharpDelegatesLambdasEventsTopic,
        csharpExceptionsIdisposableTopic,
      ],
    },
    {
      id: "step-mid-aspnet-webapi",
      roadmapId: "roadmap-dotnet-midlevel-backend",
      slug: "aspnet-webapi-pipeline",
      order: 2,
      title: "2. ASP.NET Core Web API & Application Pipeline",
      title_fa: "۲. ساخت وب‌سرویس‌های ASP.NET Core، تزریق وابستگی و خط لوله میدل‌ویر",
      description:
        "Build modern RESTful Web APIs with Controllers and Minimal APIs, master Dependency Injection lifetimes, custom Middleware, and the Options pattern.",
      description_fa:
        "پیاده‌سازی APIهای مدرن با Controllers و Minimal APIs، تسلط عمیق بر طول عمرهای DI، ساخت میدل‌ویرهای سفارشی، مدیریت یکپارچه خطاها و سیستم پیکربندی.",
      topics: [
        aspnetControllersMinimalApisRoutingTopic,
        aspnetDependencyInjectionLifetimesTopic,
        aspnetMiddlewarePipelineFiltersTopic,
        aspnetConfigurationOptionsSecretsTopic,
      ],
    },
    {
      id: "step-mid-efcore-data",
      roadmapId: "roadmap-dotnet-midlevel-backend",
      slug: "efcore-relational-data-access",
      order: 3,
      title: "3. Relational Data Persistence with Entity Framework Core",
      title_fa: "۳. دسترسی و مدیریت پایگاه داده با Entity Framework Core",
      description:
        "Configure complex data models using Fluent API, avoid N+1 query traps with Eager Loading and Projections, manage Migrations, and execute safe transactions.",
      description_fa:
        "پیکربندی موجودیت‌ها با Fluent API، پیشگیری از خطای N+1 با Eager Loading و AsNoTracking، مدیریت حرفه‌ای Migrationها و تراکنش‌های امن دیتابیسی.",
      topics: [
        efcoreDbContextFluentApiMappingsTopic,
        efcoreQueryingRelationshipsLoadingTopic,
        efcoreMigrationsSeedingTransactionsTopic,
      ],
    },
    {
      id: "step-mid-security-auth",
      roadmapId: "roadmap-dotnet-midlevel-backend",
      slug: "security-authentication-authorization",
      order: 4,
      title: "4. Authentication, Authorization & Security Best Practices",
      title_fa: "۴. احراز هویت، مجوزدهی و استانداردهای امنیت وب‌سرویس‌ها",
      description:
        "Implement stateless JWT authentication with refresh tokens, Role/Policy-based authorization, built-in Rate Limiting, CORS policies, and password hashing.",
      description_fa:
        "احراز هویت استاندارد با JWT و Refresh Token، مجوزدهی مبتنی بر نقش و پالیسی با AuthorizationHandler، محدودسازی نرخ درخواست (Rate Limiting) و امنیت CORS.",
      topics: [
        securityJwtBearerClaimsIdentityTopic,
        securityRolePolicyAuthorizationTopic,
        securityApiProtectionRateLimitingCorsTopic,
      ],
    },
    {
      id: "step-mid-architecture-cqrs",
      roadmapId: "roadmap-dotnet-midlevel-backend",
      slug: "architecture-clean-cqrs-mediatr",
      order: 5,
      title: "5. Application Architecture, Clean Architecture & CQRS",
      title_fa: "۵. معماری تمیز (Clean Architecture)، الگوی CQRS و تفکیک لایه‌ها",
      description:
        "Structure backend applications with Clean Architecture layers, implement Command Query Responsibility Segregation (CQRS) with MediatR, and evaluate Repository patterns.",
      description_fa:
        "ساختاردهی اصولی پروژه‌ها با لایه‌های Clean Architecture، تفکیک دستورات و کوئری‌ها با MediatR Pipeline Behaviors، و مپینگ بهینه DTOها.",
      topics: [
        architectureLayeredCleanArchitectureTopic,
        architectureCqrsMediatrPipelineTopic,
        architectureRepositoryPatternAutomapperTopic,
      ],
    },
    {
      id: "step-mid-async-caching-jobs",
      roadmapId: "roadmap-dotnet-midlevel-backend",
      slug: "async-caching-background-tasks",
      order: 6,
      title: "6. Asynchronous Programming, Caching & Background Jobs",
      title_fa: "۶. برنامه‌نویسی همزمان، استراتژی‌های کشینگ و سرویس‌های پس‌زمینه",
      description:
        "Master async/await patterns, CancellationToken propagation, Cache-Aside pattern with IMemoryCache and Redis, and long-running workers with BackgroundService.",
      description_fa:
        "اصول async/await و انتشار توکن کنسلی، الگوی Cache-Aside با IMemoryCache و Redis، و اجرای پردازش‌های پس‌زمینه با BackgroundService و PeriodicTimer.",
      topics: [
        asyncAwaitCancellationTokensTopic,
        cachingImemorycacheRedisBasicsTopic,
        backgroundTasksHostedServicesTopic,
      ],
    },
    {
      id: "step-mid-testing-quality",
      roadmapId: "roadmap-dotnet-midlevel-backend",
      slug: "automated-testing-xunit-integration",
      order: 7,
      title: "7. Automated Testing & Test-Driven Development",
      title_fa: "۷. تست‌های خودکار نرم‌افزار، تست واحد و تست یکپارچگی API",
      description:
        "Write isolated unit tests using xUnit, FluentAssertions, and Moq, and execute full HTTP integration tests using WebApplicationFactory and Testcontainers.",
      description_fa:
        "نگارش تست‌های واحد ایزوله با xUnit و Moq بر اساس الگوی AAA، و انجام تست‌های یکپارچگی اندپوینت‌ها با WebApplicationFactory و دیتابیس واقعی در Docker.",
      topics: [
        testingUnitXunitMoqTopic,
        testingIntegrationWebapplicationfactoryTopic,
      ],
    },
    {
      id: "step-mid-diagnostics-docker",
      roadmapId: "roadmap-dotnet-midlevel-backend",
      slug: "diagnostics-logging-docker-deployment",
      order: 8,
      title: "8. Logging, Diagnostics & Containerization",
      title_fa: "۸. لاگینگ ساخت‌یافته با Serilog، پایش سلامت و استقرار با Docker",
      description:
        "Implement structured logging with Serilog, configure Kubernetes liveness/readiness health check probes, and author optimized multi-stage Dockerfiles.",
      description_fa:
        "ثبت ساخت‌یافته لاگ‌ها با Serilog و Message Templates، تنظیم اندپوینت‌های Health Check برای پروب‌های کوبرنتیز، و کانتینری‌سازی بهینه با Docker Multi-Stage.",
      topics: [
        diagnosticsStructuredLoggingSerilogTopic,
        diagnosticsHealthChecksProbesTopic,
        devopsDockerContainersDotnetTopic,
      ],
    },
  ],
};
