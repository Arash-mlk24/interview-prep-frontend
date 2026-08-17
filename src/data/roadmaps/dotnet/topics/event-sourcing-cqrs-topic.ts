import { RoadmapTopic } from "../../../models";

export const eventSourcingCqrsTopic: RoadmapTopic = {
  id: "topic-dotnet-event-sourcing-cqrs",
  stepId: "step-distributed-transactions",
  slug: "event-sourcing-cqrs-projections",
  order: 2,
  title: "Event Sourcing & CQRS with Snapshots & Projections",
  title_fa: "الگوی رویدادمحوری (Event Sourcing) و تفکیک CQRS همراه با Snapshot و Projection",
  summary: "Design append-only immutable event streams, reconstitute aggregate state, optimize replay performance with snapshots, and build read models.",
  summary_fa: "طراحی جریان‌های تغییرناپذیر رویداد دامین، بازسازی وضعیت موجودیت‌ها، بهینه‌سازی سرعت با اسنپ‌شات‌ها و ساخت پایگاه‌های داده مخصوص خواندن با پروجکشن‌ها.",
  readingTimeMinutes: 22,
  difficulty: "lead",
  content: `### 1. CRUD vs. Event Sourcing

- **Traditional CRUD:** Overwrites database records (\`UPDATE BankAccounts SET Balance = 800 WHERE Id = 1\`). History is lost.
- **Event Sourcing:** Never deletes or mutates records. Stores state as an append-only stream of immutable **Domain Events**.

\`\`\`
Account #101 Event Stream:
1. AccountOpenedEvent { InitialDeposit = 1000 }
2. MoneyWithdrawnEvent { Amount = 200 }
3. FeeAppliedEvent { Amount = 15 }
Current Balance = $1000 - $200 - $15 = $785
\`\`\`

---

### 2. Snapshots & Projections

1. **Aggregate Rehydration:** Replay events to rebuild domain aggregate state in memory.
2. **Snapshotting:** Periodically save a snapshot of the aggregate state every 100 events to eliminate the performance penalty of replaying thousands of events.
3. **Projections (Read Models):** Asynchronous background workers consume domain events to populate optimized query databases (e.g. Elasticsearch or Read SQL databases) adhering to **CQRS** (Command Query Responsibility Segregation).`,
  content_fa: `### ۱. تفاوت CRUD سنتی با Event Sourcing

در الگوی **Event Sourcing** داده‌ها هرگز آپدیت یا حذف نمی‌شوند، بلکه تمام تغییرات در قالب رویدادهای تغییرناپذیر در یک Event Store افزایشی ثبت می‌گردند.

---

### ۲. اسنپ‌شات‌ها و پروجکشن‌های CQRS

- **اسنپ‌شات (Snapshot):** جهت جلوگیری از کندی بازپخش رویدادها در موجودیت‌های پررویداد، وضعیت خلاصه به صورت دوره‌ای ذخیره می‌شود.
- **پروجکشن‌ها (Projections):** رویدادهای دامین به صورت ناهمگام مصرف شده و پایگاه‌های داده مخصوص جستجو و خواندن سریع را تغذیه می‌کنند.`,
};
