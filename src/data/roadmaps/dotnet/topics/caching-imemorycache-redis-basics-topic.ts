import { RoadmapTopic } from "../../../models";

export const cachingImemorycacheRedisBasicsTopic: RoadmapTopic = {
  id: "topic-dotnet-caching-imemorycache-redis-basics",
  stepId: "step-mid-async-caching-jobs",
  slug: "caching-imemorycache-redis-basics",
  order: 2,
  title: "In-Memory & Distributed Caching with Redis",
  title_fa: "کشینگ درون‌حافظه‌ای (IMemoryCache) و توزیع‌شده با Redis",
  summary:
    "Master Cache-Aside pattern, Absolute vs Sliding expiration, IMemoryCache thread safety, and IDistributedCache with StackExchange.Redis.",
  summary_fa:
    "تسلط بر الگوی Cache-Aside، تفاوت زمان انقضای Absolute و Sliding، کشینگ درون‌حافظه‌ای و اتصال به کلاستر Redis با IDistributedCache.",
  readingTimeMinutes: 20,
  difficulty: "mid",
  content: `## 1. The Cache-Aside Pattern

The most common caching pattern in backend systems:

\`\`\`csharp
public async Task<ProductDto?> GetProductAsync(Guid id, CancellationToken ct)
{
    string cacheKey = $"product:{id}";

    // 1. Try get from cache
    if (memoryCache.TryGetValue(cacheKey, out ProductDto? cachedProduct))
    {
        return cachedProduct;
    }

    // 2. Fetch from Database on cache miss
    var product = await dbContext.Products.FindAsync(new object[] { id }, ct);
    if (product is null) return null;

    var dto = product.ToDto();

    // 3. Store in cache with expiration
    var cacheOptions = new MemoryCacheEntryOptions()
        .SetAbsoluteExpiration(TimeSpan.FromHours(1))
        .SetSlidingExpiration(TimeSpan.FromMinutes(15));

    memoryCache.Set(cacheKey, dto, cacheOptions);
    return dto;
}
\`\`\`

---

## 2. In-Memory (\`IMemoryCache\`) vs Distributed Cache (\`IDistributedCache\`)

- **IMemoryCache**: Fastest access (RAM of the current process). Not shared across multiple server instances (risk of stale data in load-balanced environments).
- **IDistributedCache (Redis)**: Shared external cache server. Accessible by all backend instances, survives application restarts.

\`\`\`csharp
// Redis Distributed Cache Setup
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "CatalogService_";
});
\`\`\``,
  content_fa: `## ۱. الگوی Cache-Aside

پرکاربردترین الگوی کشینگ که ابتدا داده را از کش خوانده و در صورت عدم وجود (Cache Miss)، از دیتابیس واکشی و در کش ذخیره می‌کند.

---

## ۲. تفاوت زمان انقضای Absolute با Sliding

- **Absolute Expiration**: زمان انقضای قطعی بدون توجه به تعداد درخواست‌ها (مثلاً دقیقاً پس از ۱ ساعت).
- **Sliding Expiration**: تمدید زمان انقضا با هر بار دسترسی به کلید (مثلاً انقضا در صورت عدم درخواست به مدت ۱۵ دقیقه).

---

## ۳. مقایسه IMemoryCache و IDistributedCache با ردیس

- **کش درون‌حافظه‌ای**: بسیار سریع اما محدود به همان پراسس سرور.
- **کش توزیع‌شده ردیس**: مشترک میان تمامی نمونه‌های سرور در پشت Load Balancer و ماندگار در زمان ریستارت برنامه.`,
};
