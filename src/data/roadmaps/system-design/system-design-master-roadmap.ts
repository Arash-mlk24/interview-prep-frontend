import { Roadmap } from "../../models";
import { consistentHashingLoadBalancingTopic } from "./topics/consistent-hashing-load-balancing-topic";
import { distributedRateLimitingTopic } from "./topics/distributed-rate-limiting-topic";
import { cachingStrategiesTopic } from "./topics/caching-strategies-topic";
import { databaseReplicationTopic } from "./topics/database-replication-topic";
import { databaseShardingStrategiesTopic } from "./topics/database-sharding-strategies-topic";
import { polyglotPersistenceChoiceTopic } from "./topics/polyglot-persistence-choice-topic";
import { capPacelcProductionTopic } from "./topics/cap-pacelc-production-topic";
import { raftPaxosConsensusTopic } from "./topics/raft-paxos-consensus-topic";
import { distributedTransactionsSagaTopic } from "./topics/distributed-transactions-saga-topic";
import { kafkaRabbitmqInternalsTopic } from "./topics/kafka-rabbitmq-internals-topic";
import { idempotencyDeduplicationTopic } from "./topics/idempotency-deduplication-topic";
import { eventSourcingCqrsScaleTopic } from "./topics/event-sourcing-cqrs-scale-topic";
import { caseStudyUrlShortenerTopic } from "./topics/case-study-url-shortener-topic";
import { caseStudyApiGatewayTopic } from "./topics/case-study-api-gateway-topic";
import { caseStudyRealtimeChatTopic } from "./topics/case-study-realtime-chat-topic";
import { caseStudyVideoStreamingTopic } from "./topics/case-study-video-streaming-topic";
import { caseStudyPaymentLedgerTopic } from "./topics/case-study-payment-ledger-topic";
import { caseStudyDistributedTracingTopic } from "./topics/case-study-distributed-tracing-topic";

export const systemDesignMasterRoadmap: Roadmap = {
  id: "roadmap-system-design-master",
  stackId: "system-design",
  slug: "distributed-systems-architecture",
  title: "High-Scale Distributed Systems & System Design Master Track",
  title_fa: "نقشه راه جامع طراحی سیستم‌های مقیاس‌بزرگ و معماری سیستم‌های توزیع‌شده",
  description:
    "End-to-end curriculum for Senior & Lead engineers: scalability fundamentals, consensus algorithms, database partitioning, event-driven pipelines, and real-world platform case studies.",
  description_fa:
    "مسیریاب جامع و استاندارد برای مهندسان ارشد و لید: مبانی مقیاس‌پذیری، الگوریتم‌های اجماع، شاردینگ و پایگاه‌های داده، سیستم‌های رویدادمحور و بررسی عمیق معماری سرویس‌های پروداکشن.",
  targetLevel: "Senior / Lead / Principal Architect",
  targetLevel_fa: "مهندس ارشد / لید / معمار سیستم",
  order: 1,
  estimatedHours: 90,
  steps: [
    {
      id: "step-sys-scalability-traffic",
      roadmapId: "roadmap-system-design-master",
      slug: "scalability-load-balancing-traffic",
      title: "1. Scalability, Load Balancing & Traffic Management",
      title_fa: "۱. مقیاس‌پذیری، لودبالانسرها و کنترل ترافیک شبکه",
      description: "Consistent hashing, L4/L7 load routing, token bucket rate limiters, and multi-tier caching resilience.",
      description_fa: "هشینگ پایدار، مسیریابی ترافیک در لایه‌های انتقال و اپلیکیشن، کنترل نرخ درخواست و الگوهای کشینگ پایدار.",
      order: 1,
      topics: [
        consistentHashingLoadBalancingTopic,
        distributedRateLimitingTopic,
        cachingStrategiesTopic,
      ],
    },
    {
      id: "step-sys-databases-storage",
      roadmapId: "roadmap-system-design-master",
      slug: "distributed-storage-replication-sharding",
      title: "2. Distributed Storage, Replication & Sharding",
      title_fa: "۲. ذخیره‌سازی توزیع‌شده، رپلیکیشن و شاردینگ دیتابیس",
      description: "Single/multi-leader replication, quorum reads, range vs hash sharding, hotspot mitigation, and polyglot persistence matrix.",
      description_fa: "الگوهای رپلیکیشن، محاسبات کواوروم، استراتژی‌های شاردینگ افقی، رفع معضل سلبریتی و ماتریس انتخاب پایگاه داده.",
      order: 2,
      topics: [
        databaseReplicationTopic,
        databaseShardingStrategiesTopic,
        polyglotPersistenceChoiceTopic,
      ],
    },
    {
      id: "step-sys-consensus-transactions",
      roadmapId: "roadmap-system-design-master",
      slug: "distributed-consensus-transactions",
      title: "3. Distributed Consensus & Distributed Transactions",
      title_fa: "۳. الگوریتم‌های اجماع توزیع‌شده و تراکنش‌های توزیع‌شده",
      description: "CAP and PACELC trade-offs, Raft/Paxos leader election, 2PC bottlenecks, and Saga orchestrators.",
      description_fa: "تحلیل قضیه‌های CAP و PACELC، انتخاب لیدر در Raft و Paxos، و پیاده‌سازی الگوهای ساگا و Outbox.",
      order: 3,
      topics: [
        capPacelcProductionTopic,
        raftPaxosConsensusTopic,
        distributedTransactionsSagaTopic,
      ],
    },
    {
      id: "step-sys-messaging-events",
      roadmapId: "roadmap-system-design-master",
      slug: "messaging-event-driven-architecture",
      title: "4. Asynchronous & Event-Driven Architecture",
      title_fa: "۴. معماری ناهمگام، استریم‌های داده و سیستم‌های رویدادمحور",
      description: "RabbitMQ vs Kafka commit logs, consumer groups, idempotency key patterns, and CQRS / Event Sourcing at scale.",
      description_fa: "مقایسه بروکرها و استریم لاگ‌ها، گروه‌های مصرف‌کننده، پردازش‌های بدون تکرار (Idempotent) و الگوهای CQRS.",
      order: 4,
      topics: [
        kafkaRabbitmqInternalsTopic,
        idempotencyDeduplicationTopic,
        eventSourcingCqrsScaleTopic,
      ],
    },
    {
      id: "step-sys-case-studies-core",
      roadmapId: "roadmap-system-design-master",
      slug: "case-studies-core-services",
      title: "5. Real-World Case Studies (Part 1: Core Services)",
      title_fa: "۵. کیس‌استادی‌های واقعی (بخش اول: سرویس‌های پایه)",
      description: "Architecture breakdown of TinyURL, high-throughput API Gateways, and real-time chat platforms.",
      description_fa: "طراحی گام به گام سیستم‌های کوتاه‌کننده لینک، درگاه API و سیستم‌های پیام‌رسان بلادرنگ.",
      order: 5,
      topics: [
        caseStudyUrlShortenerTopic,
        caseStudyApiGatewayTopic,
        caseStudyRealtimeChatTopic,
      ],
    },
    {
      id: "step-sys-case-studies-complex",
      roadmapId: "roadmap-system-design-master",
      slug: "case-studies-complex-platforms",
      title: "6. Real-World Case Studies (Part 2: Complex Platforms)",
      title_fa: "۶. کیس‌استادی‌های واقعی (بخش دوم: پلتفرم‌های پیچیده)",
      description: "Designing YouTube video pipelines, FinTech double-entry payment ledgers, and telemetry tracing at scale.",
      description_fa: "معماری پلتفرم‌های استریم ویدیو، سیستم‌های مالی و والت دوبل، و پایپ‌لاین‌های رهگیری توزیع‌شده مانیتورینگ.",
      order: 6,
      topics: [
        caseStudyVideoStreamingTopic,
        caseStudyPaymentLedgerTopic,
        caseStudyDistributedTracingTopic,
      ],
    },
  ],
};
