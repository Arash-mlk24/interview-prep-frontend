import { RoadmapTopic } from "../../../models";

export const outboxInboxIdempotencyTopic: RoadmapTopic = {
  id: "topic-dotnet-outbox-inbox-idempotency",
  stepId: "step-event-driven-sagas",
  slug: "reliable-messaging-outbox-inbox-idempotency",
  order: 2,
  title: "Reliable Event Delivery: Transactional Outbox, Inbox Pattern & Idempotency",
  title_fa: "تضمین ارسال و پردازش بدون خطای رویدادها: الگوهای Transactional Outbox، Inbox و تکرارپذیری امن (Idempotency)",
  summary: "Solve the Dual-Write problem using EF Core Transactional Outbox, Change Data Capture (CDC / Debezium), and idempotent consumers.",
  summary_fa: "حل قطعی معضل نوشتن دوگانه (Dual-Write Problem) با استفاده از جدول Outbox و تراکنش‌های محلی EF Core، پردازش بدون تکرار (Idempotent) و تکنیک‌های CDC.",
  readingTimeMinutes: 26,
  difficulty: "senior",
  content: `### Architectural Overview & Outline

- **The Dual-Write Problem**: Why writing to a database and publishing to a message broker in two separate steps inevitably fails.
- **Transactional Outbox Pattern**:
  - Writing business entities and Outbox messages in a single atomic database transaction.
  - Background publisher polling vs. Change Data Capture (Debezium / PostgreSQL WAL).
- **Transactional Inbox Pattern & Idempotent Consumer**:
  - Handling duplicate message delivery (\`at-least-once\` delivery guarantees).
  - Idempotency Keys and deduplication tables.

*(Comprehensive in-depth tutorial, deep-dive code samples, and interview questions will be added in upcoming modules.)*`,
  content_fa: `### سرفصل‌ها و نقشه مفهومی

- **مسئله نوشتن دوگانه (Dual-Write Problem)**: دلایل شکست تضمین‌های تراکنشی هنگام ذخیره در دیتابیس و ارسال همزمان پیام به بروکر.
- **الگوی Transactional Outbox**:
  - ثبت همزمان تغییرات بیزینسی و پیام‌های خروجی در یک تراکنش واحد دیتابیس با EF Core.
  - ارسال پیام‌ها با جاب‌های پس‌زمینه در برابر ابزارهای شنود لاگ‌های تراکنشی دیتابیس (Change Data Capture با Debezium).
- **الگوی Transactional Inbox و مصرف‌کننده‌های تکرارپذیر (Idempotent)**:
  - مدیریت پیام‌های تکراری حاصل از تضمین تحویل حداقل یک‌بار (At-Least-Once Delivery).
  - پیاده‌سازی کلیدهای Idempotency Key در دات‌نت.

*(آموزش جامع متنی، نمونه کدهای معماری و سوالات مصاحبه در جلسات بعدی تکمیل خواهد شد.)*`,
};
