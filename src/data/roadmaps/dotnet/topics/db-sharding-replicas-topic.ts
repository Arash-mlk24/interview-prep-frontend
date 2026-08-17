import { RoadmapTopic } from "../../../models";

export const dbShardingReplicasTopic: RoadmapTopic = {
  id: "topic-dotnet-db-sharding-replicas",
  stepId: "step-distributed-data-scaling",
  slug: "database-partitioning-sharding-replicas",
  order: 1,
  title: "Database Partitioning, Horizontal Sharding & Read Replicas",
  title_fa: "توسعه لایه داده: پارتیشن‌بندی جداول، شاردینگ افقی و کلاسترهای Read Replica",
  summary: "Scale relational databases to terabytes using table partitioning, partition elimination, shard key routing, and replication lag management.",
  summary_fa: "مقیاس‌پذیری پایگاه‌های داده رابطه‌ای تا مقیاس ترابایتی با پارتیشن‌بندی جداول، حذف پارتیشن در کوئری، روتینگ شاردینگ و مدیریت تاخیر Replicas.",
  readingTimeMinutes: 22,
  difficulty: "lead",
  content: `### 1. Architectural Strategies for Scaling Relational Databases

\`\`\`
                    [ API Gateway / Load Balancer ]
                       /                      \\
           (Writes: Primary DB)         (Reads: Read Cluster)
                   |                          /           \\
           (Log Replication)           [ Replica 1 ]  [ Replica 2 ]
                   |
     [ Shard 0 ] [ Shard 1 ] [ Shard 2 ] (Horizontal Sharding via ShardKey)
\`\`\`

---

### 2. Table Partitioning (Single-Server Scaling)

- Splits a single physical table across multiple disk filegroups based on a **Partition Key** (e.g. \`OrderDate\`).
- **Partition Elimination:** The query optimizer scans only relevant date ranges, skipping $90\\%$ of physical storage pages.
- Enables instant zero-downtime data archiving via **Partition Switching** (\`ALTER TABLE ... SWITCH PARTITION\`).

---

### 3. Horizontal Sharding (Multi-Server Distributed Scaling)

- Distributes rows across $N$ physically separate database servers based on a **Shard Key** (\`TenantId\` or \`UserId % N\`).
- **Challenges:** Cross-shard joins are impossible or slow; resharding requires consistent hashing algorithms.

---

### 4. Read Replicas (CQRS Database Level) & Replication Lag

- Write operations route to the Primary Master node; read queries route to Read Replicas synced via asynchronous replication.
- **Handling Replication Lag in FinTech:** For immediate post-write reads (e.g. user viewing a newly created transfer), read directly from the Primary instance or verify replication watermark tokens.`,
  content_fa: `### ۱. راهکارهای مقیاس‌پذیری دیتابیس‌های رابطه‌ای

- **پارتیشن‌بندی جداول (Table Partitioning):** تقسیم فیزیکی داده‌های یک جدول روی دیسک بر اساس تاریخ یا بازه مشخص جهت افزایش سرعت با **Partition Elimination**.
- **کلاسترهای Read Replica:** هدایت درخواست‌های خواندن و گزارش‌گیری سنگین به نودهای Replicas جهت کاهش بار سرور اصلی.
- **شاردینگ افقی (Horizontal Sharding):** توزیع داده‌ها روی چندین سرور دیتابیس مجزا بر اساس Shard Key جهت عبور از محدودیت سخت‌افزاری یک سرور.`,
};
