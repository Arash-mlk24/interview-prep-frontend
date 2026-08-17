import { RoadmapTopic } from "../../../models";

export const distributedTransactionsSagaTopic: RoadmapTopic = {
  id: "topic-sys-distributed-transactions",
  stepId: "step-sys-consensus-transactions",
  slug: "distributed-transactions-2pc-saga-outbox",
  order: 3,
  title: "Distributed Transactions: 2PC vs. Saga Pattern (Choreography & Orchestration) & Outbox Pattern",
  title_fa: "تراکنش‌های توزیع‌شده: مقایسه 2PC، الگوی Saga (ارکستریشن و کوریوگرافی) و الگوی Outbox",
  summary: "Master dual-write consistency, Two-Phase Commit blocking vulnerabilities, Saga compensating transactions, state machines with MassTransit/Temporal, and Transactional Outbox CDC.",
  summary_fa: "تسلط بر رفع چالش Dual-Write، نقاط ضعف قفل‌کننده Two-Phase Commit، تراکنش‌های جبرانی در ساگا، ماشین‌های وضعیت با فریم‌ورک‌های MassTransit/Temporal و الگوی Transactional Outbox با CDC.",
  readingTimeMinutes: 23,
  difficulty: "lead",
  content: `### 1. The Dual-Write Problem in Microservices

When a microservice needs to update its local database AND publish an event to a message broker (RabbitMQ/Kafka):

\`\`\`
Client -> Microservice -> [1. Save Order to PostgreSQL] (Success)
                       -> [2. Publish to Kafka Broker] (Network Crash / Failure!)
\`\`\`
Result: Database has the order, but downstream inventory/payment services never receive the event (inconsistent distributed state).

---

### 2. Two-Phase Commit (2PC) vs. Saga Pattern

| Feature | Two-Phase Commit (2PC) | Saga Pattern |
| :--- | :--- | :--- |
| **Consistency Model** | Strong ACID (Immediate) | Eventual Consistency (BASE) |
| **Locking Behavior** | Holds physical row/table locks across network round-trips | Zero cross-service locks; uses local ACID transactions |
| **Availability & Scalability** | Extremely low throughput; coordinator crash blocks everything | High throughput, asynchronous, resilient to service downtime |
| **Failure Recovery** | Automatic Rollback in Phase 1 | Explicit **Compensating Transactions** (e.g., \`RefundPayment\`, \`ReleaseStock\`) |

---

### 3. Saga Topologies: Orchestration vs. Choreography

#### A. Choreography (Event-Driven):
- Services publish and listen to domain events asynchronously.
- *Advantage:* Highly decoupled, simple for 2-3 services.
- *Disadvantage:* Difficult to track complex workflow paths; risk of cyclic dependencies.

#### B. Orchestration (State Machine Coordinator):
- A centralized Orchestrator (e.g., MassTransit Saga State Machine, Temporal.io, AWS Step Functions) explicitly commands each participant: \`Execute Step 1\`, await response, \`Execute Step 2\`.
- *Advantage:* Full visibility of state, straightforward compensating rollbacks, auditability.

---

### 4. The Transactional Outbox Pattern with Debezium CDC

1. The service saves both the entity AND the event message inside the **same local database transaction** (into an \`Outbox\` table).
2. A Change Data Capture (CDC) engine (e.g., Debezium) reads the database transaction log and publishes the message to Kafka with **At-Least-Once delivery guarantees**.`,
  content_fa: `### ۱. مشکل دوگانگی در نوشتن (Dual-Write Problem)

هنگامی که یک سرویس باید داده‌ای را در دیتابیس محلی ذخیره کند و پیامی را به صف (RabbitMQ/Kafka) بفرستد، قطعی شبکه در مرحله دوم باعث ناسازگاری دائمی میان سرویس‌ها می‌شود.

---

### ۲. مقایسه پروتکل 2PC و الگوی ساگا (Saga)

- **2PC (تعهد دوفازی):** نیازمند قفل ماندن رکوردهای دیتابیس در طول شبکه است و در مقیاس بالا باعث قفل شدن کل سیستم و کندی شدید می‌شود.
- **Saga Pattern:** از تراکنش‌های محلی مستقل در هر سرویس استفاده کرده و در صورت شکست هر مرحله، **تراکنش‌های جبرانی (Compensating Transactions)** مانند بازگشت پول یا آزادسازی انبار را اجرا می‌کند.

---

### ۳. الگوی Transactional Outbox

با ذخیره پیام در جدول \`Outbox\` درون همان تراکنش محلی دیتابیس، ابزارهای مدرن CDC (مانند Debezium) به صورت تضمین‌شده لاگ دیتابیس را خوانده و پیام را در بروکر منتشر می‌کنند.`,
};
