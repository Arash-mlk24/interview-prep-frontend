import { Roadmap } from "../../models";

// Step 1 Topics
import { concurrencyChannelsMemoryTopic } from "./topics/concurrency-channels-memory-topic";
import { cleanArchModularMonolithTopic } from "./topics/clean-arch-modular-monolith-topic";
import { dddAggregatesBoundedContextsTopic } from "./topics/ddd-aggregates-bounded-contexts-topic";

// Step 2 Topics
import { capPacelcTopic } from "./topics/cap-pacelc-topic";
import { protocolsGrpcSignalrHttp3Topic } from "./topics/protocols-grpc-signalr-http3-topic";
import { yarpApiGatewaysRateLimitingTopic } from "./topics/yarp-api-gateways-rate-limiting-topic";

// Step 3 Topics
import { dbShardingReplicasTopic } from "./topics/db-sharding-replicas-topic";
import { polyglotPersistenceTopic } from "./topics/polyglot-persistence-topic";
import { cachingHybridcacheStampedeTopic } from "./topics/caching-hybridcache-stampede-topic";
import { eventSourcingCqrsTopic } from "./topics/event-sourcing-cqrs-topic";

// Step 4 Topics
import { rabbitmqKafkaMessagingTopic } from "./topics/rabbitmq-kafka-messaging-topic";
import { outboxInboxIdempotencyTopic } from "./topics/outbox-inbox-idempotency-topic";
import { sagaStatemachineTopic } from "./topics/saga-statemachine-topic";
import { distributedLocksIdempotencyTopic } from "./topics/distributed-locks-idempotency-topic";

// Step 5 Topics
import { pollyV8ResiliencePipelinesTopic } from "./topics/polly-v8-resilience-pipelines-topic";
import { orleansDaprVirtualActorsTopic } from "./topics/orleans-dapr-virtual-actors-topic";
import { hangfireTemporalWorkflowsTopic } from "./topics/hangfire-temporal-workflows-topic";

// Step 6 Topics
import { oauth2OidcJwtRevocationTopic } from "./topics/oauth2-oidc-jwt-revocation-topic";
import { mtlsSecretsManagementTopic } from "./topics/mtls-secrets-management-topic";

// Step 7 Topics
import { opentelemetryTracingMetricsTopic } from "./topics/opentelemetry-tracing-metrics-topic";
import { dotnetAspireK8sKedaTopic } from "./topics/dotnet-aspire-k8s-keda-topic";

// Step 8 Topics
import { caseStudyTinyurlDotnetTopic } from "./topics/case-study-tinyurl-dotnet-topic";
import { caseStudyFlashSaleInventoryTopic } from "./topics/case-study-flash-sale-inventory-topic";
import { caseStudyRealtimeChatKafkaTopic } from "./topics/case-study-realtime-chat-kafka-topic";
import { caseStudyPaymentLedgerFintechTopic } from "./topics/case-study-payment-ledger-fintech-topic";
import { caseStudyVideoTranscodingPipelineTopic } from "./topics/case-study-video-transcoding-pipeline-topic";

export const dotnetSystemDesignRoadmap: Roadmap = {
  id: "roadmap-dotnet-system-design",
  stackId: "dotnet",
  slug: "system-design-architecture",
  title: "High-Scale .NET System Design & Enterprise Architecture",
  title_fa: "طراحی سیستم و معماری سیستم‌های توزیع‌شده با دات‌نت (از مبتدی تا پیشرفته)",
  description:
    "End-to-end .NET system design curriculum: Clean architecture, DDD, traffic management, distributed data & caching, event-driven pipelines, resilient workflows, and production case studies.",
  description_fa:
    "نقشه راه جامع و کاربردی طراحی سیستم بر پایه دات‌نت: معماری تمیز و DDD، مدیریت ترافیک، داده‌های توزیع‌شده و کشینگ، الگوهای رویدادمحور و ساگا، تاب‌آوری با Polly و بررسی سیستم‌های واقعی.",
  icon: "AccountTree",
  order: 2,
  targetLevel: "Mid to Senior / Lead Architect",
  targetLevel_fa: "میدلول تا سینیور / لید و معمار سیستم",
  estimatedHours: 120,
  steps: [
    {
      id: "step-lld-clean-ddd",
      roadmapId: "roadmap-dotnet-system-design",
      slug: "lld-clean-architecture-ddd",
      order: 1,
      title: "1. Low-Level Design (LLD), Clean Architecture & DDD",
      title_fa: "۱. طراحی سطح پایین (LLD)، معماری تمیز و طراحی دامنه-محور",
      description:
        "C# low-allocation concurrency, Channels, Modular Monolith boundaries, and Tactical/Strategic Domain-Driven Design.",
      description_fa:
        "همروندی با کارایی بالا در سی‌شارپ، مرزهای ماژولار مونولیت، و الگوهای تاکتیکی و استراتژیک DDD.",
      topics: [
        concurrencyChannelsMemoryTopic,
        cleanArchModularMonolithTopic,
        dddAggregatesBoundedContextsTopic,
      ],
    },
    {
      id: "step-traffic-gateways-protocols",
      roadmapId: "roadmap-dotnet-system-design",
      slug: "traffic-gateways-networking-protocols",
      order: 2,
      title: "2. Distributed Foundations, Gateways & Modern Protocols",
      title_fa: "۲. الفبای سیستم‌های توزیع‌شده، مدیریت ترافیک و پروتکل‌ها",
      description:
        "CAP/PACELC trade-offs, high-performance gRPC / HTTP/3 / SignalR, and Microsoft YARP API Gateway with rate limiting.",
      description_fa:
        "تئوری‌های توزیع‌شده CAP/PACELC، پروتکل‌های مدرن gRPC و SignalR، و درگاه‌های API با مایکروسافت YARP.",
      topics: [
        capPacelcTopic,
        protocolsGrpcSignalrHttp3Topic,
        yarpApiGatewaysRateLimitingTopic,
      ],
    },
    {
      id: "step-distributed-data-caching",
      roadmapId: "roadmap-dotnet-system-design",
      slug: "distributed-data-sharding-caching",
      order: 3,
      title: "3. Distributed Storage, Database Scaling & Multi-Tier Caching",
      title_fa: "۳. ذخیره‌سازی توزیع‌شده، شاردینگ دیتابیس و کشینگ چندلایه",
      description:
        "Horizontal database sharding, polyglot persistence matrix, .NET 9 HybridCache / FusionCache stampede protection, and CQRS / Event Sourcing.",
      description_fa:
        "شاردینگ افقی، ماتریس انتخاب دیتابیس، کش چندلایه HybridCache در دات‌نت ۹ و الگوهای CQRS / Event Sourcing.",
      topics: [
        dbShardingReplicasTopic,
        polyglotPersistenceTopic,
        cachingHybridcacheStampedeTopic,
        eventSourcingCqrsTopic,
      ],
    },
    {
      id: "step-event-driven-sagas",
      roadmapId: "roadmap-dotnet-system-design",
      slug: "event-driven-messaging-distributed-transactions",
      order: 4,
      title: "4. Event-Driven Architecture, MassTransit & Sagas",
      title_fa: "۴. معماری رویداد-محور، پیام‌رسانی با MassTransit و تراکنش‌های ساگا",
      description:
        "RabbitMQ vs Kafka internals, Transactional Outbox/Inbox patterns, MassTransit state machine Sagas, and distributed locking.",
      description_fa:
        "کالبدشکافی RabbitMQ و Kafka، تضمین انتشار با Outbox، تراکنش‌های جبرانی Saga و قفل‌های توزیع‌شده RedLock.",
      topics: [
        rabbitmqKafkaMessagingTopic,
        outboxInboxIdempotencyTopic,
        sagaStatemachineTopic,
        distributedLocksIdempotencyTopic,
      ],
    },
    {
      id: "step-resilience-actors-workflows",
      roadmapId: "roadmap-dotnet-system-design",
      slug: "resilience-virtual-actors-distributed-jobs",
      order: 5,
      title: "5. Resilience Pipelines, Virtual Actors & Workflows",
      title_fa: "۵. تاب‌آوری سیستم، مدل‌های Virtual Actor و گردش‌کارهای توزیع‌شده",
      description:
        "Polly v8 resilience pipelines, Microsoft Orleans virtual actors, Dapr building blocks, and Hangfire / Temporal durable execution.",
      description_fa:
        "خطوط لوله تاب‌آوری با Polly v8، اکترهای مایکروسافت Orleans، ران‌تایم Dapr و ورک‌فلوهای ماندگار با Temporal و Hangfire.",
      topics: [
        pollyV8ResiliencePipelinesTopic,
        orleansDaprVirtualActorsTopic,
        hangfireTemporalWorkflowsTopic,
      ],
    },
    {
      id: "step-security-auth-zerotrust",
      roadmapId: "roadmap-dotnet-system-design",
      slug: "scalable-identity-zerotrust-security",
      order: 6,
      title: "6. High-Scale Identity & Zero-Trust Security",
      title_fa: "۶. مدیریت هویت در مقیاس بالا و معماری Zero-Trust",
      description:
        "OAuth 2.0 / OIDC with Keycloak, stateless JWT revocation patterns, mutual TLS (mTLS), and centralized secret vaults.",
      description_fa:
        "پروتکل‌های هویت با Keycloak، استراتژی‌های ابطال توکن، رمزنگاری دوطرفه mTLS و مدیریت اسرار با Vault.",
      topics: [
        oauth2OidcJwtRevocationTopic,
        mtlsSecretsManagementTopic,
      ],
    },
    {
      id: "step-observability-cloud-native",
      roadmapId: "roadmap-dotnet-system-design",
      slug: "distributed-observability-cloud-native-dotnet",
      order: 7,
      title: "7. Distributed Observability & Cloud-Native .NET",
      title_fa: "۷. پایشگری توزیع‌شده (Observability) و استقرار کلودنیتیو",
      description:
        "OpenTelemetry distributed tracing, Prometheus & Serilog, .NET Aspire dashboard, Chiseled Docker images, and Kubernetes KEDA scaling.",
      description_fa:
        "ردیابی بلادرنگ با OpenTelemetry، ارکستراسیون میکروسرویس‌ها با .NET Aspire، کانتینرهای امن Chiseled و اتواسکیلینگ با KEDA.",
      topics: [
        opentelemetryTracingMetricsTopic,
        dotnetAspireK8sKedaTopic,
      ],
    },
    {
      id: "step-dotnet-case-studies",
      roadmapId: "roadmap-dotnet-system-design",
      slug: "dotnet-real-world-case-studies",
      order: 8,
      title: "8. Real-World System Design Case Studies with .NET",
      title_fa: "۸. کیس‌استادی‌های معماری واقعی سیستم‌ها با دات‌نت",
      description:
        "Step-by-step architecture for TinyURL, high-concurrency Flash Sales, SignalR/Kafka Real-Time Chat, FinTech Double-Entry Ledgers, and Video Transcoding.",
      description_fa:
        "طراحی کامل و گام‌به‌گام سامانه‌های کوتاه‌کننده لینک، حراج آنی و رزرو کالا، پلتفرم چت میلیونی، والت مالی دوبل، و پایپ‌لاین پردازش ویدیو.",
      topics: [
        caseStudyTinyurlDotnetTopic,
        caseStudyFlashSaleInventoryTopic,
        caseStudyRealtimeChatKafkaTopic,
        caseStudyPaymentLedgerFintechTopic,
        caseStudyVideoTranscodingPipelineTopic,
      ],
    },
  ],
};
