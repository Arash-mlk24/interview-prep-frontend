import { RoadmapTopic } from "../../../models";

export const cachingHybridcacheStampedeTopic: RoadmapTopic = {
  id: "topic-dotnet-caching-hybridcache-stampede",
  stepId: "step-distributed-data-caching",
  slug: "high-performance-caching-hybridcache-stampede",
  order: 3,
  title: "High-Performance Caching: HybridCache (.NET 9), Redis & Stampede Mitigation",
  title_fa: "کشینگ پیشرفته در دات‌نت: HybridCache در دات‌نت ۹، کلاسترهای Redis و جلوگیری از معضل هجوم به کش (Cache Stampede)",
  summary: "Implement two-tier L1/L2 caching with .NET 9 HybridCache / FusionCache, distributed cache invalidation, and thundering herd protection.",
  summary_fa: "پیاده‌سازی کش دو لایه‌ای (L1 در حافظه سریع + L2 در ردیس) با قابلیت جدید HybridCache در دات‌نت ۹ و کتابخانه FusionCache همراه با قفل‌گذاری هوشمند بر روی کلیدها.",
  readingTimeMinutes: 24,
  difficulty: "senior",
  content: `### Architectural Overview & Outline

- **Multi-Tier Caching Architectures (L1/L2)**:
  - In-process L1 (low latency, zero serialization overhead) + Distributed L2 (shared across pods).
- **The Cache Stampede (Dogpiling / Thundering Herd) Problem**:
  - What happens when a hot cache key expires under 50,000 req/sec load.
  - Probabilistic early expiration (XFetch) and distributed mutex/locking per key.
- **Modern .NET Caching Tools**:
  - \`HybridCache\` (.NET 9 built-in standard) & \`FusionCache\` (Fail-Safe, Soft/Hard timeouts, Backplane invalidation).

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **معماری کش چند لایه (L1 و L2)**:
  - ترکیب کش فوق‌سریع در حافظه رم محلی هر پاد (L1) با کش مشترک ردیس (L2).
- **معضل هجوم به کش (Cache Stampede / Thundering Herd)**:
  - سناریوی انقضای کلید پربازدید در ترافیک‌های بالا و زیر بار رفتن ناگهانی دیتابیس.
  - حل مسئله با قفل‌های هوشمند (Key-level Locking) و الگوریتم‌های انقضای احتمالی پیش‌دستانه (Probabilistic Expiration).
- **ابزارهای مدرن در دات‌نت**:
  - سرویس رسمی \`HybridCache\` در دات‌نت ۹ و امکانات کتابخانه پیشرو \`FusionCache\` (قابلیت Fail-Safe، سیستم همگام‌سازی بک‌پلی برای ابطال همزمان کش تمام پادها).

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
