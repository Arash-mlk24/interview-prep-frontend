import { RoadmapTopic } from "../../../models";

export const idempotencyDeduplicationTopic: RoadmapTopic = {
  id: "topic-sys-idempotency",
  stepId: "step-sys-messaging-events",
  slug: "idempotency-deduplication-distributed-systems",
  order: 2,
  title: "Idempotent Processing, Deduplication Keys & Distributed Locking (Redlock)",
  title_fa: "پردازش بدون تکرار (Idempotency)، کلیدهای یکتایی و قفل‌های توزیع‌شده (Redlock)",
  summary: "Design robust At-Least-Once consumer pipelines with Idempotency Keys, Redis distributed locks with TTL leases, and database unique constraints.",
  summary_fa: "طراحی پایپ‌لاین‌های مصرف پیام بدون اثر جانبی تکراری، پیاده‌سازی Idempotency Key در پرداخت و ثبت سفارش، و الگوهای قفل توزیع‌شده با Redlock و Fencing Tokens.",
  readingTimeMinutes: 20,
  difficulty: "senior",
  content: `### 1. Delivery Guarantees in Distributed Systems

- **At-Most-Once:** Messages are never duplicated, but may be lost on network failure.
- **At-Least-Once (Standard in Kafka/RabbitMQ):** Messages are never lost, but may be delivered multiple times due to retry policies.
- **Effectively-Once (Idempotency):** \`At-Least-Once\` delivery combined with an **Idempotent Consumer**.

---

### 2. The Idempotency Key Pattern for Payments & Orders

\`\`\`
Client -> (Generates UUID v4 "Idempotency-Key: idemp_abc123")
       -> API Gateway / Service:
          1. Atomically insert into \`ProcessedRequests\` table / Redis:
             SET "idemp_abc123" "IN_PROGRESS" NX EX 120
          2. If key exists: Return previous cached response (HTTP 200).
          3. If key was newly set: Execute business logic, commit DB transaction.
          4. Update key with final response payload in Redis.
\`\`\`

---

### 3. Distributed Locking with Redlock & Fencing Tokens

To coordinate mutual exclusion across multiple nodes without race conditions:
1. **Lease Time (TTL):** Locks must have an expiration to prevent deadlocks if a worker crashes.
2. **Fencing Tokens (Martin Kleppmann):**
   - *Problem:* A GC pause delays Worker 1 until after its lock expires. Worker 2 gets the lock. Worker 1 wakes up and writes stale data.
   - *Solution:* Every acquired lock returns a monotonically increasing **Fencing Token (101, 102...)**. Storage rejects writes if token $<$ highest seen token.`,
  content_fa: `### ۱. تضمین‌های تحویل پیام در شبکه‌های توزیع‌شده

در اکثر سیستم‌ها پیام‌ها با استاندارد **At-Least-Once** ارسال می‌شوند؛ یعنی هیچ پیامی گم نمی‌شود اما ممکن است به دلیل تلاش مجدد شبکه، یک پیام چند بار برسد. راهکار تضمین سلامت سیستم، **Idempotent بودن پردازش‌ها** است.

---

### ۲. الگوی Idempotency Key در پرداخت و تراکنش‌ها

با تولید یک کلید یکتا (UUID) توسط کلاینت و بررسی اتمیک آن در جدول پایگاه داده یا ردیس، اجرای مجدد همان درخواست دقیقاً همان نتیجه پاسخ قبلی را برمی‌گرداند بدون اینکه پردازش مالی دوبار تکرار شود.

---

### ۳. قفل‌های توزیع‌شده و توکن‌های Fencing

برای جلوگیری از نوشتن متغیر توسط پردازشی که قفل آن به دلیل وقفه موقت منقضی شده است، از **توکن‌های افزایشی Fencing** در دیتابیس استفاده می‌شود تا درخواست‌های با توکن قدیمی رد شوند.`,
};
