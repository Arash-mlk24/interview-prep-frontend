import { Roadmap } from "../../models";
import { spanMemoryTopic } from "./topics/span-memory-topic";
import { expressionTreesTopic } from "./topics/expression-trees-topic";
import { asyncStateMachineTopic } from "./topics/async-state-machine-topic";
import { acidIsolationTopic } from "./topics/acid-isolation-topic";
import { dbIndexesTopic } from "./topics/db-indexes-topic";
import { dbConcurrencyLocksTopic } from "./topics/db-concurrency-locks-topic";
import { rabbitmqAdvancedTopic } from "./topics/rabbitmq-advanced-topic";
import { redisInternalsTopic } from "./topics/redis-internals-topic";
import { outboxDlqTopic } from "./topics/outbox-dlq-topic";
import { gofPatternsTopic } from "./topics/gof-patterns-topic";
import { specificationPatternTopic } from "./topics/specification-pattern-topic";
import { chainOfResponsibilityTopic } from "./topics/chain-of-responsibility-topic";
import { kestrelPipelineTopic } from "./topics/kestrel-pipeline-topic";
import { grpcGraphqlRestTopic } from "./topics/grpc-graphql-rest-topic";
import { opentelemetryMetricsTopic } from "./topics/opentelemetry-metrics-topic";
import { pollyResilienceTopic } from "./topics/polly-resilience-topic";

export const dotnetBackendRoadmap: Roadmap = {
  id: "roadmap-dotnet-backend",
  stackId: "dotnet",
  slug: "backend-developer",
  title: "Enterprise .NET Backend Engineering",
  title_fa: "نقشه راه توسعه پیشرفته بک‌اند در دات‌نت",
  description: "Master modern C#, CLR memory management, database concurrency, distributed messaging, ASP.NET Core internals, and enterprise resilience.",
  description_fa: "تسلط بر سی‌شارپ پیشرفته، مدیریت حافظه CLR، همزمانی دیتابیس، معماری Kestrel، پروتکل‌های مدرن gRPC و تاب‌آوری سازمانی با Polly.",
  icon: "IntegrationInstructions",
  order: 1,
  targetLevel: "Mid to Senior / Lead",
  targetLevel_fa: "سطح میدلول تا سینیور / لید",
  estimatedHours: 80,
  steps: [
    {
      id: "step-csharp-memory-concurrency",
      roadmapId: "roadmap-dotnet-backend",
      slug: "csharp-memory-concurrency",
      order: 1,
      title: "C# Advanced, Memory Internals & Concurrency",
      title_fa: "سی‌شارپ پیشرفته، مدیریت حافظه و همروندی",
      description: "Low-level memory primitives, ref struct invariants, Expression Trees, and the async state machine.",
      description_fa: "ساختارهای پایه بدون آلیکیشن حافظه، محدودیت‌های ref struct، درخت عبارات و کالبدشکافی متدهای ناهمگام.",
      topics: [spanMemoryTopic, expressionTreesTopic, asyncStateMachineTopic],
    },
    {
      id: "step-db-efcore-concurrency",
      roadmapId: "roadmap-dotnet-backend",
      slug: "db-efcore-concurrency",
      order: 2,
      title: "Databases, EF Core & Advanced Concurrency",
      title_fa: "پایگاه داده، EF Core و کنترل همزمانی پیشرفته",
      description: "ACID transaction isolation levels, B+ Tree indexing internals, and optimistic/pessimistic locking.",
      description_fa: "سطوح ایزولاسیون تراکنش‌های دیتابیس، معماری ایندکس B+ Tree و استراتژی‌های قفل‌گذاری و حذف بن‌بست.",
      topics: [acidIsolationTopic, dbIndexesTopic, dbConcurrencyLocksTopic],
    },
    {
      id: "step-messaging-caching-events",
      roadmapId: "roadmap-dotnet-backend",
      slug: "messaging-caching-events",
      order: 3,
      title: "Distributed Messaging, Caching & Event-Driven Systems",
      title_fa: "صف‌های پیام، کشینگ توزیع‌شده و سیستم‌های رویدادمحور",
      description: "RabbitMQ Quorum Queues, Redis persistence and Lua scripts, and Transactional Outbox pattern with MassTransit.",
      description_fa: "صف‌های مدرن Quorum در RabbitMQ، اسکریپت‌های اتمیک ردیس و الگوی Transactional Outbox با MassTransit.",
      topics: [rabbitmqAdvancedTopic, redisInternalsTopic, outboxDlqTopic],
    },
    {
      id: "step-patterns-clean-arch",
      roadmapId: "roadmap-dotnet-backend",
      slug: "patterns-clean-arch",
      order: 4,
      title: "Design Patterns & Clean Architecture",
      title_fa: "الگوهای طراحی سازمانی و معماری تمیز",
      description: "GoF structural & behavioral patterns, Specification pattern with Expression Trees, and MediatR pipelines.",
      description_fa: "الگوهای GoF، الگوی Specification با درخت عبارات و پیاده‌سازی Chain of Responsibility در خطوط لوله دات‌نت.",
      topics: [gofPatternsTopic, specificationPatternTopic, chainOfResponsibilityTopic],
    },
    {
      id: "step-aspnet-internals-http",
      roadmapId: "roadmap-dotnet-backend",
      slug: "aspnet-internals-http",
      order: 5,
      title: "ASP.NET Core Internals, Kestrel & Modern Protocols",
      title_fa: "معماری داخلی ASP.NET Core، موتور Kestrel و پروتکل‌های مدرن",
      description: "Kestrel Socket Transport, middleware pipelines, connection pooling with SocketsHttpHandler, and gRPC vs GraphQL.",
      description_fa: "پردازش سوکت در Kestrel، زنجیره میدل‌ویرها، مدیریت سوکت با SocketsHttpHandler و ارتباطات باینری gRPC.",
      topics: [kestrelPipelineTopic, grpcGraphqlRestTopic],
    },
    {
      id: "step-observability-resilience",
      roadmapId: "roadmap-dotnet-backend",
      slug: "observability-resilience",
      order: 6,
      title: "Observability, Distributed Tracing & Polly Resilience",
      title_fa: "پایشگری توزیع‌شده، OpenTelemetry و تاب‌آوری با Polly",
      description: "ActivitySource distributed tracing, Prometheus metrics, Serilog structured logs, and Polly v8 resilience pipelines.",
      description_fa: "رهگیری توزیع‌شده با ActivitySource، متریک‌های Prometheus، لاگ‌های ساخت‌یافته Serilog و قطع‌کننده مدار با Polly v8.",
      topics: [opentelemetryMetricsTopic, pollyResilienceTopic],
    },
  ],
};
