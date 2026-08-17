import { Roadmap } from "../../models";

// Step 1 Topics: C# Language, CLR & Memory Engineering
import { spanMemoryTopic } from "./topics/span-memory-topic";
import { asyncStateMachineTopic } from "./topics/async-state-machine-topic";
import { clrGcInternalsTopic } from "./topics/clr-gc-internals-topic";
import { expressionTreesTopic } from "./topics/expression-trees-topic";

// Step 2 Topics: High-Performance Data Access, EF Core 8/9 & Dapper
import { efcoreInternalsOptimizationTopic } from "./topics/efcore-internals-optimization-topic";
import { acidIsolationTopic } from "./topics/acid-isolation-topic";
import { dbIndexesTopic } from "./topics/db-indexes-topic";
import { dapperBulkDataTopic } from "./topics/dapper-bulk-data-topic";

// Step 3 Topics: ASP.NET Core Internals, Kestrel & Modern Protocols
import { kestrelPipelineTopic } from "./topics/kestrel-pipeline-topic";
import { grpcGraphqlRestTopic } from "./topics/grpc-graphql-rest-topic";
import { fastendpointsMinimalApisTopic } from "./topics/fastendpoints-minimal-apis-topic";

// Step 4 Topics: Distributed Caching & In-Process Channels
import { redisInternalsTopic } from "./topics/redis-internals-topic";
import { cachingHybridcacheStampedeTopic } from "./topics/caching-hybridcache-stampede-topic";
import { concurrencyChannelsMemoryTopic } from "./topics/concurrency-channels-memory-topic";

// Step 5 Topics: Distributed Messaging & Event-Driven Architecture
import { rabbitmqAdvancedTopic } from "./topics/rabbitmq-advanced-topic";
import { kafkaEventStreamingTopic } from "./topics/kafka-event-streaming-topic";
import { outboxDlqTopic } from "./topics/outbox-dlq-topic";

// Step 6 Topics: Enterprise Architecture & Design Patterns
import { gofPatternsTopic } from "./topics/gof-patterns-topic";
import { specificationPatternTopic } from "./topics/specification-pattern-topic";
import { chainOfResponsibilityTopic } from "./topics/chain-of-responsibility-topic";
import { cleanArchModularMonolithTopic } from "./topics/clean-arch-modular-monolith-topic";

// Step 7 Topics: Backend Security, Cryptography & Identity
import { oauth2OidcJwtRevocationTopic } from "./topics/oauth2-oidc-jwt-revocation-topic";
import { authorizationRbacAbacTopic } from "./topics/authorization-rbac-abac-topic";
import { dataProtectionCryptoTopic } from "./topics/data-protection-crypto-topic";

// Step 8 Topics: Cloud-Native .NET, Observability & Resilience
import { opentelemetryMetricsTopic } from "./topics/opentelemetry-metrics-topic";
import { pollyResilienceTopic } from "./topics/polly-resilience-topic";
import { dotnetAspireK8sKedaTopic } from "./topics/dotnet-aspire-k8s-keda-topic";

export const dotnetBackendRoadmap: Roadmap = {
  id: "roadmap-dotnet-backend",
  stackId: "dotnet",
  slug: "backend-developer",
  title: "Enterprise .NET Backend Engineering & Architecture",
  title_fa: "نقشه راه توسعه پیشرفته بک‌اند در دات‌نت (از صفر تا معمار ارشد)",
  description:
    "End-to-end curriculum for Senior .NET Engineers: C# low-allocation memory, CLR garbage collection, EF Core 8/9 optimization, Kestrel sockets, distributed messaging with MassTransit/Kafka, security, and .NET Aspire.",
  description_fa:
    "نقشه راه جامع و استانداردهای مهندسی بک‌اند با دات‌نت: مدیریت حافظه CLR و Span، بهینه‌سازی پیشرفته EF Core، سوکت‌های Kestrel، استریم داده با Kafka و MassTransit، امنیت و پلتفرم ابری .NET Aspire.",
  icon: "IntegrationInstructions",
  order: 2,
  targetLevel: "Mid to Senior / Lead Architect",
  targetLevel_fa: "سطح میدلول تا سینیور / لید و معمار سیستم",
  estimatedHours: 110,
  steps: [
    {
      id: "step-csharp-memory-concurrency",
      roadmapId: "roadmap-dotnet-backend",
      slug: "csharp-memory-concurrency-clr",
      order: 1,
      title: "1. Advanced C# Language, CLR & Memory Engineering",
      title_fa: "۱. سی‌شارپ پیشرفته، مدیریت حافظه CLR و ساختارهای صفر-تخصیص",
      description:
        "Span/Memory ref structs, async state machine mechanics, CLR generational GC internals, and Expression Tree metaprogramming.",
      description_fa:
        "ساختارهای Span و Memory بدون آلیکیشن، کالبدشکافی متدهای ناهمگام، نحوه کارکرد Garbage Collector و متادیتا با درخت عبارات.",
      topics: [
        spanMemoryTopic,
        asyncStateMachineTopic,
        clrGcInternalsTopic,
        expressionTreesTopic,
      ],
    },
    {
      id: "step-db-efcore-concurrency",
      roadmapId: "roadmap-dotnet-backend",
      slug: "db-efcore-concurrency-dapper",
      order: 2,
      title: "2. High-Performance Data Access, EF Core 8/9 & Dapper",
      title_fa: "۲. دسترسی به داده با کارایی بالا، معماری داخلی EF Core و Dapper",
      description:
        "EF Core change tracking optimization, ACID transaction isolation levels, B+ Tree indexing, and high-speed Dapper batching.",
      description_fa:
        "بهینه‌سازی Change Tracker در EF Core، سطوح ایزولاسیون تراکنش‌ها، معماری ایندکس‌های B+ Tree و عملیات سریع با Dapper.",
      topics: [
        efcoreInternalsOptimizationTopic,
        acidIsolationTopic,
        dbIndexesTopic,
        dapperBulkDataTopic,
      ],
    },
    {
      id: "step-aspnet-internals-http",
      roadmapId: "roadmap-dotnet-backend",
      slug: "aspnet-internals-kestrel-protocols",
      order: 3,
      title: "3. ASP.NET Core Internals, Kestrel & Modern Protocols",
      title_fa: "۳. معماری داخلی ASP.NET Core، موتور Kestrel و مهندسی پروتکل‌ها",
      description:
        "Kestrel Socket Transport, middleware pipeline, gRPC binary streaming, HTTP/3, and FastEndpoints vs Minimal APIs.",
      description_fa:
        "پردازش سوکت در موتور Kestrel، خط لوله میدل‌ویرها، استریم باینری gRPC و پروتکل‌های مدرن با FastEndpoints.",
      topics: [
        kestrelPipelineTopic,
        grpcGraphqlRestTopic,
        fastendpointsMinimalApisTopic,
      ],
    },
    {
      id: "step-caching-high-throughput",
      roadmapId: "roadmap-dotnet-backend",
      slug: "caching-redis-hybridcache-channels",
      order: 4,
      title: "4. Distributed Caching, Redis & High-Throughput Ingestion",
      title_fa: "۴. کشینگ توزیع‌شده، ردیس و موتورهای پردازش همزمان",
      description:
        "Redis data structures and clustering, .NET 9 HybridCache with Stampede prevention, and System.Threading.Channels batching.",
      description_fa:
        "ساختار داده‌ها و کلاسترینگ ردیس، کشینگ هیبریدی در دات‌نت ۹ با جلوگیری از Cache Stampede، و صف‌های بدون قفل Channels.",
      topics: [
        redisInternalsTopic,
        cachingHybridcacheStampedeTopic,
        concurrencyChannelsMemoryTopic,
      ],
    },
    {
      id: "step-messaging-distributed-events",
      roadmapId: "roadmap-dotnet-backend",
      slug: "messaging-masstransit-kafka-outbox",
      order: 5,
      title: "5. Distributed Messaging, MassTransit & Event Streaming",
      title_fa: "۵. سیستم‌های پیام‌رسانی، MassTransit و استریم داده با Kafka",
      description:
        "RabbitMQ Quorum Queues, Apache Kafka partition streaming, and the Transactional Outbox pattern with MassTransit.",
      description_fa:
        "صف‌های مدرن Quorum در RabbitMQ، استریم رویدادها با Apache Kafka و الگوی Transactional Outbox با MassTransit.",
      topics: [
        rabbitmqAdvancedTopic,
        kafkaEventStreamingTopic,
        outboxDlqTopic,
      ],
    },
    {
      id: "step-patterns-clean-arch",
      roadmapId: "roadmap-dotnet-backend",
      slug: "enterprise-architecture-patterns",
      order: 6,
      title: "6. Enterprise Architecture, Design Patterns & Slices",
      title_fa: "۶. معماری‌های سازمانی، الگوهای طراحی و برش‌های عمودی",
      description:
        "GoF patterns in .NET, Specification pattern with Expression Trees, MediatR pipeline behaviors, and Clean Architecture vs Vertical Slices.",
      description_fa:
        "الگوهای طراحی سازمانی GoF، الگوی Specification با درخت عبارات، پایپ‌لاین‌های MediatR و مقایسه معماری تمیز با Vertical Slice.",
      topics: [
        gofPatternsTopic,
        specificationPatternTopic,
        chainOfResponsibilityTopic,
        cleanArchModularMonolithTopic,
      ],
    },
    {
      id: "step-security-identity-crypto",
      roadmapId: "roadmap-dotnet-backend",
      slug: "backend-security-identity-cryptography",
      order: 7,
      title: "7. Backend Security, Cryptography & Identity Management",
      title_fa: "۷. امنیت بک‌اند، رمزنگاری و مدیریت هویت و مجوزها",
      description:
        "OAuth 2.1 & OIDC token architectures, Policy-based RBAC/ABAC authorization, and ASP.NET Core Data Protection with mTLS.",
      description_fa:
        "معماری احراز هویت با OAuth 2.1 و OIDC، احراز مجوز پیشرفته مبتنی بر پالیسی (RBAC/ABAC) و رمزنگاری با Data Protection و mTLS.",
      topics: [
        oauth2OidcJwtRevocationTopic,
        authorizationRbacAbacTopic,
        dataProtectionCryptoTopic,
      ],
    },
    {
      id: "step-observability-resilience-aspire",
      roadmapId: "roadmap-dotnet-backend",
      slug: "observability-resilience-dotnet-aspire",
      order: 8,
      title: "8. Cloud-Native .NET, Observability & Resilience Engineering",
      title_fa: "۸. دات‌نت ابری، پایشگری با OpenTelemetry و تاب‌آوری با Polly",
      description:
        "OpenTelemetry distributed tracing, Polly v8 resilience pipelines, and .NET Aspire cloud-native orchestration.",
      description_fa:
        "ردگیری توزیع‌شده با OpenTelemetry، خطوط تاب‌آوری با Polly v8، و ارکستریشن توزیع‌شده با پلتفرم مدرن .NET Aspire.",
      topics: [
        opentelemetryMetricsTopic,
        pollyResilienceTopic,
        dotnetAspireK8sKedaTopic,
      ],
    },
  ],
};
