import { RoadmapTopic } from "../../../models";

export const eventSourcingCqrsScaleTopic: RoadmapTopic = {
  id: "topic-sys-event-sourcing-cqrs",
  stepId: "step-sys-messaging-events",
  slug: "event-sourcing-cqrs-projections",
  order: 3,
  title: "Event Sourcing & CQRS at Scale: Snapshots, Projections & Event Store",
  title_fa: "الگوهای Event Sourcing و CQRS در مقیاس بالا: اسنپ‌شات‌ها، پروجکشن‌ها و Event Store",
  summary: "Master state reconstruction from immutable event logs, optimistic concurrency on aggregate versions, projection rebuilding, and separate read/write scaling.",
  summary_fa: "تسلط بر بازسازی وضعیت موجودیت‌ها از روی لاگ رویدادهای غیرقابل تغییر، همزمانی آپتیمیستیک با نسخه Aggregate، ساخت مدل‌های خواندن اختصاصی و اسنپ‌شات‌ها.",
  readingTimeMinutes: 22,
  difficulty: "lead",
  content: `### 1. Traditional CRUD vs. Event Sourcing

| Dimension | Traditional State-Based Storage (CRUD) | Event Sourcing |
| :--- | :--- | :--- |
| **State Storage** | Overwrites current state with \`UPDATE\` | Appends past domain events to an immutable log |
| **Audit Trail** | Requires auxiliary audit log tables | Native $100\\%$ audit trail by definition |
| **Time Travel** | Difficult/impossible | Can reconstruct entity state at any point in historical time |
| **Read Complexity** | Fast direct row lookups | Requires projection to a read-model |

---

### 2. CQRS (Command Query Responsibility Segregation)

\`\`\`
[Write Path / Command]
Client -> Command Handler -> Aggregate Root -> [Event Store (Append Event v5)]
                                                      |
                                                      v (Async Event Bus)
[Read Path / Query]                                 Projection Worker
Client <- Query Handler <- [Read DB: PostgreSQL / Elastic / Redis]
\`\`\`

---

### 3. Aggregate Snapshots for Performance

When an aggregate has thousands of events, replaying from event #1 introduces high latency.
- **Solution:** Every $N$ events (e.g., every 100 events), compute and persist a **Snapshot**.
- **Reconstruction:** Load latest snapshot (v500), then replay only events v501 to v512.`,
  content_fa: `### ۱. تفاوت ذخیره‌سازی سنتی با Event Sourcing

در سیستم‌های سنتی، وضعیت قبلی با دستور \`UPDATE\` از بین می‌رود؛ اما در **Event Sourcing** هر تغییر به عنوان یک رویداد غیرقابل‌تغییر (\`OrderPlaced\`, \`PaymentReceived\`) در جدول لاگ ثبت می‌شود. این الگو سابقه تاریخی ۱۰۰٪ دقیق و قابلیت بازپخش وضعیت در هر زمان از تاریخ را فراهم می‌سازد.

---

### ۲. الگوی CQRS (تفکیک مسیر نوشتن و خواندن)

- **مسیر فرمان (Write/Command):** وظیفه اعتبارسنجی منطق دامین و ثبت رویدادها را بر عهده دارد.
- **مسیر کوئری (Read/Query):** از طریق کارگران پروجکشن (Projection)، دیتابیس‌های بهینه‌شده برای خواندن (مانند PostgreSQL ایندکس‌شده یا Elasticsearch) را آپدیت می‌کند.

---

### ۳. اسنپ‌شات‌ها (Snapshots)

برای تسریع در بازخوانی حساب‌هایی که هزاران تراکنش دارند، هر ۱۰۰ تراکنش یک اسنپ‌شات کلی از موجودی ذخیره می‌شود تا فقط رویدادهای بعد از آن اسنپ‌شات محاسبه گردند.`,
};
