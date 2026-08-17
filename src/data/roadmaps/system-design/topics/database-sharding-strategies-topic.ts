import { RoadmapTopic } from "../../../models";

export const databaseShardingStrategiesTopic: RoadmapTopic = {
  id: "topic-sys-db-sharding",
  stepId: "step-sys-databases-storage",
  slug: "database-sharding-partitioning-hotspots",
  order: 2,
  title: "Database Sharding Architectures, Partition Keys & Mitigating Hotspots",
  title_fa: "معماری شاردینگ دیتابیس، کلیدهای پارتیشن و مقابله با نودهای داغ (Hotspots)",
  summary: "Master horizontal sharding, range vs hash partitioning, directory-based routing, distributed cross-shard joins, and the Celebrity Problem.",
  summary_fa: "تسلط بر تقسیم افقی دیتابیس (Horizontal Sharding)، مقایسه پارتیشن‌بندی بر اساس بازه و هش، روترهای دایرکتوری، جوین‌های میان شاردی و حل معضل سلبریتی (Celebrity Problem).",
  readingTimeMinutes: 21,
  difficulty: "senior",
  content: `### 1. Vertical Partitioning vs. Horizontal Sharding

- **Vertical Partitioning:** Splits tables by domain or column usage (e.g., separating wide \`UserBio\` and \`ProfileImages\` from core \`UserAuth\` credentials).
- **Horizontal Sharding:** Splits rows of the same table across independent database servers using a **Shard Key / Partition Key**.

---

### 2. Sharding Strategies & Routing Mechanisms

#### A. Range-Based Sharding (e.g., by Timestamp or Alphabetical)
- *Advantage:* Range queries (\`WHERE created_at BETWEEN X AND Y\`) hit a single shard.
- *Downside:* Massive **Write Hotspots** on the latest shard for time-series data.

#### B. Hash-Based Sharding (e.g., \`hash(user_id) % num_shards\`)
- *Advantage:* Uniform write and read distribution across all storage nodes.
- *Downside:* Range queries must broadcast to **all shards (Scatter-Gather)**.

#### C. Directory-Based (Lookup Service) Sharding
- Uses a central configuration service (e.g., ZooKeeper/Consul/CockroachDB) to maintain dynamic \`Key -> ShardId\` mappings. Supports flexible re-sharding with zero key re-computation.

---

### 3. The Celebrity (Hotspot) Problem & Solutions

When an ultra-popular entity (e.g., a celebrity with 50M followers) receives millions of likes or reads per second:
1. **Compound Shard Key:** Append a random salt or bucket integer: \`shard_key = user_id + "_" + random(0, 10)\`.
2. **Dedicated Read Caching / In-Memory Tier:** Shift celebrity timeline reads to Redis Cluster / CDN caches.
3. **Write De-duplication & Batching:** Aggregate likes or views in local memory buffers before flushing periodically.`,
  content_fa: `### ۱. تفاوت پارتیشن‌بندی عمودی و افقی (Sharding)

- **عمودی (Vertical):** تفکیک جدول‌ها بر اساس ستون‌ها یا دامین‌های مجزا.
- **افقی (Horizontal / Sharding):** تکه‌تکه کردن رکوردهای یک جدول در چندین سرور دیتابیس مجزا بر اساس یک فیلد مشخص به نام **Shard Key**.

---

### ۲. استراتژی‌های انتخاب کلید شاردینگ

۱. **بر اساس بازه (Range-based):** اجرای سریع کوئری‌های بازه‌ای، اما خطر ایجاد بار شدید روی آخرین شارد در داده‌های زمانی.
۲. **بر اساس تابع هش (Hash-based):** پخش کاملاً یکنواخت داده‌ها و حذف نابرابری بار، اما نیاز به ارسال کوئری به تمام شاردها (Scatter-Gather) در جستجوهای بازه‌ای.
۳. **سرویس دایرکتوری (Lookup Routing):** نگهداری نقشه شاردها در یک رجیستری مرکزی جهت جابجایی آسان شاردها.

---

### ۳. معضل افراد پرمخاطب (Celebrity Problem)

برای اکانت‌های بسیار پربازدید، نوشتن تمام داده‌ها روی یک شارد مشخص باعث کرش کردن سرور می‌شود.
راهکار: افزودن یک عدد رندوم (Salt) به انتهای شناسه شارد (\`userId_0\` تا \`userId_9\`) و جمع‌آوری دسته‌ای آمار در حافظه.`,
};
