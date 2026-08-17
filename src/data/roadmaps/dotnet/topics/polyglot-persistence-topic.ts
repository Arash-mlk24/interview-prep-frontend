import { RoadmapTopic } from "../../../models";

export const polyglotPersistenceTopic: RoadmapTopic = {
  id: "topic-dotnet-polyglot-persistence",
  stepId: "step-distributed-data-scaling",
  slug: "polyglot-persistence-strategy",
  order: 3,
  title: "Polyglot Persistence: Choosing Relational, Document, Columnar & Graph",
  title_fa: "معماری چندگانگی پایگاه‌داده (Polyglot Persistence) و معیارهای انتخاب",
  summary: "Architecting polyglot storage systems matching relational, document, columnar, and graph engines to distinct domain requirements.",
  summary_fa: "معماری ذخیره‌سازی داده با تطبیق دیتابیس‌های رابطه‌ای، سندمحور، ستونی و گرافی با نیازمندی‌های اختصاصی هر بخش از میکروسرویس‌ها.",
  readingTimeMinutes: 18,
  difficulty: "senior",
  content: `### 1. The Polyglot Persistence Strategy

In modern distributed microservices architectures, **one database does NOT fit all use cases**.

| Database Engine | Recommended Technology | Strengths | Ideal Enterprise Use Case |
| :--- | :--- | :--- | :--- |
| **Relational (RDBMS)** | PostgreSQL / SQL Server | Strict ACID transactions, foreign keys | Financial accounts, billing ledgers, orders |
| **Document (NoSQL)** | MongoDB / Cosmos DB | Flexible JSON schema, fast write ingestion | Catalogs, unstructured logs, user profile data |
| **In-Memory Key-Value**| Redis / DragonFly | Sub-millisecond latency, in-memory structures | Session tokens, distributed locks, rate limiters |
| **Columnar (OLAP)** | ClickHouse / DuckDB | Real-time analytical aggregations | Analytics reporting on billions of transactions |
| **Search Engine** | Elasticsearch / OpenSearch | Full-text fuzzy search, inverted indexing | E-commerce product search, centralized log index |
| **Graph** | Neo4j / Amazon Neptune | Fast relationship traversals without joins | Social graphs, fraud rings detection in banking |`,
  content_fa: `### ۱. استراتژی Polyglot Persistence در میکروسرویس‌ها

انتخاب پایگاه‌های داده مختلف بر اساس ماهیت داده‌ها:
- **دیتابیس رابطه‌ای (PostgreSQL / SQL Server):** تراکنش‌های مالی و حسابداری با سازگاری قطعی ACID.
- **دیتابیس سندمحور (MongoDB):** داده‌های متغیر و کاتالوگ محصولات.
- **ردیس (Redis):** کشینگ پرسرعت و قفل‌های توزیع‌شده.
- **دیتابیس ستونی (ClickHouse):** گزارش‌گیری و تحلیل میلیاردها سطر لاگ یا تراکنش.
- **دیتابیس گرافی (Neo4j):** کشف شبکه‌های کلاهبرداری در سیستم‌های پرداخت بانکی.`,
};
