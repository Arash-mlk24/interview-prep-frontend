import { RoadmapTopic } from "../../../models";

export const cachingStrategiesTopic: RoadmapTopic = {
  id: "topic-sys-caching-strategies",
  stepId: "step-sys-scalability-traffic",
  slug: "distributed-caching-patterns-resilience",
  order: 3,
  title: "Caching Strategies (Cache-Aside, Write-Through, Write-Behind) & Mitigating Cache Stampede",
  title_fa: "الگوهای کشینگ توزیع‌شده (Cache-Aside، Write-Through، Write-Behind) و مقابله با فروپاشی کش",
  summary: "Master read/write caching topologies, cache invalidation strategies, multi-tier CDN caching, and solutions for Cache Penetration, Breakdown, and Avalanche.",
  summary_fa: "تسلط بر الگوهای خواندن و نوشتن در کش، استراتژی‌های باطل‌سازی داده‌ها (Invalidation)، کش چندسطحی CDN و راهکارهای جلوگیری از نفوذ (Penetration)، شکست (Breakdown) و بهمن کش (Avalanche).",
  readingTimeMinutes: 19,
  difficulty: "senior",
  content: `### 1. Read & Write Caching Topologies

| Pattern | Write Flow | Read Flow | Trade-offs |
| :--- | :--- | :--- | :--- |
| **Cache-Aside (Lazy Loading)** | Application writes to DB, invalidates/updates Cache | App checks cache; on miss, reads DB and populates cache | Simple, handles cache failures gracefully; risk of stale reads |
| **Write-Through** | App writes to Cache; Cache writes to DB synchronously | App reads from Cache exclusively | Strict consistency, higher write latency |
| **Write-Behind (Write-Back)** | App writes to Cache immediately; Cache queues async DB write | App reads from Cache exclusively | Ultra-fast writes, risk of data loss if cache node crashes before DB flush |
| **Refresh-Ahead** | Normal write flow | Cache automatically refreshes items before expiration based on access frequency | Reduces read latency for hot keys, complex prediction logic |

---

### 2. The Three Classic Distributed Caching Pitfalls

#### 1. Cache Avalanche (بهمن کش)
- **Cause:** A massive number of cached keys share the exact same TTL and expire simultaneously, flooding the underlying database.
- **Solution:** Add **random jitter** to expiration times: \`TTL = baseTTL + randomJitter(0, 300s)\`.

#### 2. Cache Breakdown (شکست کلید داغ)
- **Cause:** A single ultra-hot key expires, causing thousands of concurrent requests to query the DB in parallel.
- **Solution:** Use **Mutex / Singleflight locking** so only one worker queries the DB while others wait, or use logical soft-expiration with asynchronous background renewal.

#### 3. Cache Penetration (نفوذ به کش)
- **Cause:** Malicious requests query non-existent keys repeatedly, bypassing the cache every time.
- **Solution:**
  - Cache \`null\` values with short TTL.
  - Place a **Bloom Filter** in front of the cache to reject non-existent IDs with $O(1)$ memory efficiency.`,
  content_fa: `### ۱. الگوهای اصلی ذخیره‌سازی در کش

- **Cache-Aside:** برنامه ابتدا کش را چک می‌کند؛ در صورت عدم وجود (Miss)، داده را از دیتابیس خوانده و کش را پر می‌کند.
- **Write-Through:** تغییرات ابتدا در کش نوشته شده و سپس کش به صورت همگام دیتابیس را آپدیت می‌کند (امن و همواره سازگار).
- **Write-Behind (Write-Back):** تغییرات فقط در کش ثبت شده و به صورت ناهمگام (Async Batch) به دیتابیس ریخته می‌شود (سرعت فوق‌العاده بالا، خطر کم از دست رفتن داده در کرش).

---

### ۲. سه چالش بزرگ در معماری‌های کشینگ

۱. **Cache Avalanche (بهمن کش):** منقضی شدن همزمان هزاران کلید و فشار ناگهانی به دیتابیس. راهکار: افزودن مقدار تصادفی (Jitter) به زمان انقضا.
۲. **Cache Breakdown (شکست کلید پرمخاطب):** منقضی شدن یک کلید بسیار داغ و هجوم هزاران ریکوئست همزمان به دیتابیس. راهکار: استفاده از قفل توزیع‌شده موقت یا Singleflight.
۳. **Cache Penetration (نفوذ به دیتابیس):** ارسال مکرر شناسه اطلاعات ناموجود به قصد دور زدن کش. راهکار: کش کردن مقادیر null یا استفاده از **Bloom Filter**.`,
};
