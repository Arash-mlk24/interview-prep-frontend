import { RoadmapTopic } from "../../../models";

export const polyglotPersistenceChoiceTopic: RoadmapTopic = {
  id: "topic-sys-polyglot-persistence",
  stepId: "step-sys-databases-storage",
  slug: "polyglot-persistence-engine-selection",
  order: 3,
  title: "Polyglot Persistence: Choosing Between RDBMS, Document, Key-Value, Wide-Column, Graph & Time-Series",
  title_fa: "تنوع پایگاه‌های داده (Polyglot Persistence): معیارهای انتخاب RDBMS، اسنادی، ستونی، گرافی و سری‌زمانی",
  summary: "Comprehensive architectural framework for matching storage engines (PostgreSQL, MongoDB, Redis, Cassandra, Neo4j, TimescaleDB, Elasticsearch) to specialized domain workloads.",
  summary_fa: "چارچوب جامع تصمیم‌گیری معماری برای انتخاب تخصصی‌ترین دیتابیس متناسب با نیازهای تجاری، روابط داده‌ها، سرعت خواندن و نوشتن و مدل‌های ایندکس‌گذاری.",
  readingTimeMinutes: 20,
  difficulty: "senior",
  content: `### 1. The Polyglot Persistence Decision Matrix

| Storage Category | Canonical Engines | Primary Strengths | Ideal Production Use Cases |
| :--- | :--- | :--- | :--- |
| **Relational (RDBMS)** | PostgreSQL, MySQL, SQL Server | ACID transactions, complex multi-table JOINs, strong consistency | Core financial ledger, banking, user accounts, orders & invoices |
| **Key-Value Store** | Redis, AWS DynamoDB, Memcached | Ultra-low sub-millisecond latency, simple $O(1)$ lookups, TTL | User sessions, auth tokens, distributed locks, leaderboard scoring |
| **Document Store** | MongoDB, Couchbase | Schema flexibility, JSON nesting, polymorphic documents | E-commerce product catalogs, user-generated content, metadata |
| **Wide-Column Store** | Apache Cassandra, ScyllaDB, HBase | Linear write scaling, massive write throughput, multi-master | IoT sensor telemetry, clickstream logs, messaging history |
| **Search Engine** | Elasticsearch, OpenSearch, Meilisearch | Inverted indexes, fuzzy text matching, scoring, tokenization | Full-text product search, log analytics (ELK stack) |
| **Graph Database** | Neo4j, Amazon Neptune | $O(1)$ relationship traversal, deep graph queries (Cypher) | Fraud detection rings, social network friend graphs, recommendation engines |
| **Time-Series (TSDB)** | TimescaleDB, InfluxDB, Prometheus | Compression algorithms (Gorilla), downsampling, time bucketing | Server CPU/Memory metrics, financial stock tick data |

---

### 2. Architectural Trade-offs in Real-World Systems

Rather than forcing a single database to handle everything, modern distributed architectures apply **Specialized Storage by Sub-Domain**:
- **Write Path:** Order transactions commit to an ACID-compliant PostgreSQL database.
- **CDC (Change Data Capture):** Debezium streams WAL events to Kafka.
- **Read Path (Search):** ElasticSearch sink consumes Kafka events to update full-text indexes.
- **Read Path (Hot Dashboard):** Redis caches compiled user summaries.`,
  content_fa: `### ۱. ماتریس تصمیم‌گیری انتخاب پایگاه داده (Polyglot Persistence)

- **رابطه‌ای (PostgreSQL / MySQL):** تراکنش‌های مالی، سیستم سفارشات، و انطباق کامل با ACID.
- **کلید-مقدار (Redis):** سشن‌های کاربری، توکن‌های احراز هویت، قفل‌های توزیع‌شده با تاخیر زیر ۱ میلی‌ثانیه.
- **اسنادی (MongoDB):** کاتالوگ محصولات با ساختارهای متغیر و اسناد تودرتوی JSON.
- **ستون‌گسترده (Cassandra / ScyllaDB):** لاگ‌های ترافیکی، چت‌های بسیار حجیم، با توانایی مقیاس‌پذیری خطی در نوشتن.
- **موتور جستجو (Elasticsearch):** جستجوی متنی پیشرفته، ایندکس معکوس (Inverted Index) و تحلیل لاگ‌ها.
- **گرافی (Neo4j):** تشخیص تقلب‌های زنجیره‌ای، روابط دوستان در شبکه‌های اجتماعی و گراف دانش.
- **سری زمانی (TimescaleDB / InfluxDB):** مانیتورینگ متریک‌های سرور، داده‌های سهام و سنسورهای IoT.`,
};
