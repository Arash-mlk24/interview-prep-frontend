import { RoadmapTopic } from "../../../models";

export const outboxDlqTopic: RoadmapTopic = {
  id: "topic-dotnet-outbox-dlq",
  stepId: "step-messaging-caching-events",
  slug: "transactional-outbox-dlq",
  order: 3,
  title: "Transactional Outbox & Dead Letter Queues with MassTransit",
  title_fa: "الگوی Transactional Outbox و مدیریت پیام‌های معیوب (DLQ) با MassTransit",
  summary: "Solve the Dual-Write Problem with the Outbox pattern, configure exponential retry policies, and quarantine poison messages safely.",
  summary_fa: "حل مشکل نوشتن دوگانه با الگوی Transactional Outbox، تنظیم سیاست‌های Retry تصاعدی و قرنطینه پیام‌های معیوب در صف Dead Letter.",
  readingTimeMinutes: 17,
  difficulty: "senior",
  content: `### 1. The Dual-Write Problem in Microservices

When writing state to a database and publishing domain events to a message broker (RabbitMQ/Kafka):
\`\`\`
1. Save Order to Database -> (SUCCESS)
2. Publish OrderCreated to RabbitMQ -> (NETWORK CRASH / BROKER DOWN)
Result: Inconsistency! Database changed, but downstream microservices are never notified.
\`\`\`

---

### 2. Transactional Outbox Pattern Architecture

1. Inside a single local ACID database transaction, insert the domain entity AND save an event record into an **\`OutboxMessages\`** table.
2. A background worker (MassTransit Outbox / Change Data Capture via Debezium) reads unpublished outbox rows and dispatches them to RabbitMQ.
3. Upon broker acknowledgment, the outbox record is marked as sent.

\`\`\`csharp
// MassTransit Outbox Registration:
services.AddMassTransit(x => {
    x.AddEntityFrameworkOutbox<AppDbContext>(o => {
        o.UseSqlServer();
        o.UseBusOutbox();
    });
});
\`\`\`

---

### 3. Dead Letter Queues (DLQ) & Poison Pill Quarantine

- **Dead Letter Exchange (DLX):** When a message exceeds maximum retry attempts or throws a non-transient exception (e.g. deserialization failure), it is rejected with \`requeue: false\` and forwarded to a DLQ.
- **Benefits:** Prevents unprocessable messages from blocking the primary consumer queue while keeping full telemetry for developer inspection.`,
  content_fa: `### ۱. مشکل نوشتن دوگانه (Dual-Write Problem)

ذخیره در دیتابیس و ارسال به صف دو عملیات جداگانه هستند. در صورت قطعی شبکه پس از ثبت دیتابیس، پیام به صف نرسیده و سایر میکروسرویس‌ها باخبر نمی‌شوند.

---

### ۲. راهکار الگوی Transactional Outbox

پیام و انتیتی در **یک تراکنش مشترک دیتابیس** درون جدول \`OutboxMessages\` ذخیره می‌شوند. سپس سرویس پس‌زمینه پیام‌ها را خوانده و با تضمین تحویل حداقل یک‌بار (At-least-once) به RabbitMQ ارسال می‌کند.

---

### ۳. صف خطای Dead Letter (DLQ)

پیام‌های دارای خطای ساختاری پس از اتمام تلاش‌های مجدد به صف Dead Letter منتقل می‌شوند تا بدون مسدود کردن صف اصلی، توسط تیم فنی بررسی شوند.`,
};
