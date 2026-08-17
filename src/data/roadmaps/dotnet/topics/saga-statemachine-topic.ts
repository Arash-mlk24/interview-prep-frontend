import { RoadmapTopic } from "../../../models";

export const sagaStatemachineTopic: RoadmapTopic = {
  id: "topic-dotnet-saga-statemachine",
  stepId: "step-distributed-transactions",
  slug: "saga-pattern-statemachines",
  order: 1,
  title: "Saga Pattern: Choreography vs Orchestration & State Machines",
  title_fa: "الگوی طراحی Saga: رقص‌آرایی (Choreography) در برابر رهبری (Orchestration) و ماشین وضعیت",
  summary: "Manage long-running distributed business transactions using local transactions, compensating actions, and MassTransit State Machines.",
  summary_fa: "مدیریت تراکنش‌های طولانی‌مدت توزیع‌شده بین میکروسرویس‌ها با تراکنش‌های محلی، عملیات جبران‌کننده (Compensations) و ماشین‌های وضعیت در MassTransit.",
  readingTimeMinutes: 21,
  difficulty: "lead",
  content: `### 1. Distributed Transactions: Why 2PC Fails at Scale

In microservices with "Database-per-Service", **Two-Phase Commit (2PC / XA Transactions)** blocks database resources across network boundaries, causing catastrophic latency and single points of failure.

---

### 2. The Saga Pattern & Compensating Transactions

A **Saga** represents a business transaction as a sequence of local transactions:
\`\`\`
Step 1: Order Service creates Pending Order ->
Step 2: Payment Service charges Credit Card ->
Step 3: Inventory Service reserves Stock -> (FAILS! Out of stock)
Compensating Step 2: Payment Service refunds Credit Card
Compensating Step 1: Order Service marks Order as Cancelled
\`\`\`

---

### 3. Choreography vs. Orchestration

- **Choreography (Event-Driven):** Services emit events and react to other services' events independently. Best for simple workflows ($2-3$ services).
- **Orchestration (State Machine):** A central **Saga Orchestrator** (e.g. MassTransit Automatonymous State Machine) explicitly commands each participant what step to execute and manages compensation state. Best for complex enterprise workflows.`,
  content_fa: `### ۱. مدیریت تراکنش‌های توزیع‌شده با الگوی Saga

به جای استفاده از تراکنش‌های مسدودکننده 2PC، در الگوی **Saga** هر سرویس یک تراکنش محلی را اجرا کرده و در صورت شکست یکی از مراحل، تراکنش‌های جبران‌کننده (**Compensating Transactions**) به صورت معکوس اجرا می‌شوند تا وضعیت سیستم به حالت اولیه بازگردد.

---

### ۲. رقص‌آرایی (Choreography) در برابر ارکستراسیون (Orchestration)

- **Choreography:** سرویس‌ها بدون هماهنگ‌کننده مرکزی با گوش دادن به رویدادهای یکدیگر واکنش نشان می‌دهند.
- **Orchestration:** یک ماشین وضعیت متمرکز در کتابخانه MassTransit تمام مراحل را مدیریت و در صورت بروز خطا دستورات جبرانی را صادر می‌کند.`,
};
