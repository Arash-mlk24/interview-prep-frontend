import { RoadmapTopic } from "../../../models";

export const distributedRateLimitingTopic: RoadmapTopic = {
  id: "topic-sys-rate-limiting",
  stepId: "step-sys-scalability-traffic",
  slug: "distributed-rate-limiting-algorithms",
  order: 2,
  title: "Distributed Rate Limiting Algorithms & API Gateway Throttling",
  title_fa: "الگوریتم‌های کنترل نرخ درخواست (Rate Limiting) در مقیاس توزیع‌شده",
  summary: "Deep dive into Token Bucket, Leaky Bucket, Sliding Window Counter, and low-latency atomic Redis Lua implementations for multi-region API Gateways.",
  summary_fa: "تحلیل دقیق الگوریتم‌های سطل توکن (Token Bucket)، سطل دارای نشتی (Leaky Bucket)، پنجره لغزان (Sliding Window) و پیاده‌سازی اتمیک با اسکریپت‌های Lua در ردیس برای درگاه‌های API.",
  readingTimeMinutes: 18,
  difficulty: "senior",
  content: `### 1. The Core Rate Limiting Algorithms

\`\`\`
1. Token Bucket: Allows bursts, refills tokens continuously.
2. Leaky Bucket: Smooths traffic into a steady, constant output rate.
3. Fixed Window Counter: Simple, but vulnerable to 2x burst at window edges.
4. Sliding Window Counter: Combines fixed window efficiency with sub-window smoothing.
\`\`\`

---

### 2. High-Throughput Sliding Window Counter Formula

$$\\text{Estimated Requests} = \\text{Current Window Count} + \\left( \\text{Previous Window Count} \\times \\left(1 - \\frac{\\text{Time Passed in Current Window}}{\\text{Window Size}}\\right) \\right)$$

---

### 3. Distributed Implementation: Atomic Redis Lua Script

To eliminate **Race Conditions** across multiple API Gateway instances without heavy distributed locks:

\`\`\`lua
-- Key: rate_limit:{user_id}:{endpoint}
-- ARGV[1]: Current Timestamp (Unix Seconds)
-- ARGV[2]: Window Size in Seconds
-- ARGV[3]: Max Allowed Requests

local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local clearBefore = now - window

-- 1. Remove expired timestamps
redis.call('ZREMRANGEBYSCORE', key, '-inf', clearBefore)

-- 2. Count requests in current active sliding window
local currentRequests = redis.call('ZCARD', key)

if currentRequests < limit then
    -- Add current request timestamp
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, window)
    return 1 -- Request Allowed (HTTP 200)
else
    return 0 -- Rate Limit Exceeded (HTTP 429 Too Many Requests)
end
\`\`\``,
  content_fa: `### ۱. مقایسه الگوریتم‌های Rate Limiting

- **Token Bucket (سطل توکن):** توکن‌ها با نرخ ثابت اضافه می‌شوند. اجازه ایجاد جهش‌های کوتاه‌مدت ترافیکی (Traffic Burst) را می‌دهد.
- **Leaky Bucket (سطل دارای نشتی):** ترافیک ورودی را در یک صف نگهداری کرده و خروجی را با سرعت کاملاً ثابت و هموار پردازش می‌کند.
- **Sliding Window Counter (شمارنده پنجره لغزان):** دقیق‌ترین روش برای جلوگیری از ارسال دوبرابری درخواست‌ها در مرز بازه‌های زمانی.

---

### ۲. پیاده‌سازی توزیع‌شده با Redis و Lua Script

در سیستم‌های توزیع‌شده با چند سرور Gateway، اجرای دستورات درون یک اسکریپت Lua در ردیس به صورت **کاملاً اتمیک (Single-threaded & Atomic)** انجام می‌شود و نیازی به قفل‌های کند توزیع‌شده ندارد.`,
};
