import { RoadmapTopic } from "../../../models";

export const redisInternalsTopic: RoadmapTopic = {
  id: "topic-dotnet-redis-internals",
  stepId: "step-messaging-caching-events",
  slug: "redis-persistence-lua-streams",
  order: 2,
  title: "Redis Deep Dive: Persistence (RDB/AOF), Lua Scripting & Redis Streams",
  title_fa: "بررسی عمیق Redis: ماندگاری (RDB و AOF)، اسکریپت‌نویسی اتمیک Lua و ردیس استریمز",
  summary: "Analyze Redis persistence trade-offs, fsync modes, atomic multi-step execution with Lua scripts, and stream processing with consumer groups.",
  summary_fa: "تحلیل مقایسه‌ای ماندگاری داده در Redis، تنظیمات fsync، اجرای کاملاً اتمیک عملیات پیچیده با Lua و پردازش داده‌ها در Redis Streams.",
  readingTimeMinutes: 20,
  difficulty: "senior",
  content: `### 1. Redis Persistence: RDB vs. AOF

| Dimension | RDB (Point-in-Time Snapshots) | AOF (Append-Only File) |
| :--- | :--- | :--- |
| **Mechanism** | Binary memory dump via background \`BGSAVE\` | Append-only text log of every write command |
| **Data Loss Risk** | Loses data between snapshot intervals ($5-15\\text{ min}$) | Max 1 second (with \`appendfsync everysec\`) or $0\\text{s}$ (\`always\`) |
| **Recovery Speed** | Extremely fast binary reload | Slower (replays all log commands) |
| **Production Recommendation**| Hybrid persistence: RDB base dump + AOF incremental log (\`BGREWRITEAOF\`). |

---

### 2. Atomic Operations via Lua Scripting (\`EVAL\`)

#### Why MULTI/EXEC Fails to Roll Back:
Redis transactions queue commands, but if a command fails during execution (e.g. data type mismatch), subsequent commands **continue executing without rollback**.

#### The Lua Solution:
Lua scripts execute **single-threaded and atomically** inside Redis. No other command or script can run while a Lua script is active, providing 100% race-condition-free Check-and-Set operations!

\`\`\`lua
-- Atomic Token Bucket / Sliding Window Rate Limiter
local current = redis.call('INCR', KEYS[1])
if tonumber(current) == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
end
if tonumber(current) > tonumber(ARGV[2]) then
    return 0 -- Rejected
else
    return 1 -- Allowed
end
\`\`\`

---

### 3. Redis Streams vs. Redis Pub/Sub

- **Redis Pub/Sub:** Fire-and-forget; if a subscriber is offline, messages are permanently lost.
- **Redis Streams (\`XADD\`, \`XREADGROUP\`, \`XACK\`):** Append-only, Radix-tree log. Persists messages on disk, supports **Consumer Groups**, tracks unacknowledged messages via Pending Entries List (PEL), and allows dead consumer message recovery via \`XAUTOCLAIM\`.`,
  content_fa: `### ۱. ماندگاری داده در Redis (RDB در برابر AOF)

- **مکانیزم RDB:** اسنپ‌شات لحظه‌ای از کل رم، بازیابی سریع اما امکان از دست رفتن داده‌های بین دو اسنپ‌شات.
- **مکانیزم AOF:** لاگ تمام دستورات نوشتن با تنظیم \`appendfsync everysec\` برای تعادل عالی بین سرعت و امنیت داده.

---

### ۲. اجرای اتمیک با اسکریپت‌های Lua

چون \`MULTI/EXEC\` رول‌بک ندارد، برای پیاده‌سازی عملیات حساس (مانند Rate Limiter، کسر موجودی و قفل توزیع‌شده) از اسکریپت‌های Lua استفاده می‌شود که به صورت کاملاً اتمیک در هسته تک‌نخی Redis اجرا می‌شوند.

---

### ۳. ردیس استریمز (Redis Streams)

بر خلاف Pub/Sub که داده‌ها را ذخیره نمی‌کند، **Redis Streams** پیام‌ها را روی دیسک ذخیره کرده، گروه‌های مصرف‌کننده (Consumer Groups) را مدیریت می‌کند و پیام‌های تاییدنشده را پیگیری می‌نماید.`,
};
