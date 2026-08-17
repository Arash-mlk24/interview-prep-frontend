import { RoadmapTopic } from "../../../models";

export const capPacelcTopic: RoadmapTopic = {
  id: "topic-dotnet-cap-pacelc",
  stepId: "step-distributed-data-scaling",
  slug: "cap-pacelc-distributed-databases",
  order: 2,
  title: "CAP Theorem & PACELC Theorem in Distributed Data Stores",
  title_fa: "قضیه CAP و قضیه جامع‌تر PACELC در پایگاه‌های داده توزیع‌شده مدرن",
  summary: "Analyze trade-offs between Consistency, Availability, Partition Tolerance, and Latency in SQL, NoSQL, and Distributed SQL systems.",
  summary_fa: "تحلیل بده‌بستان‌های سازگاری، دسترسی‌پذیری، تحمل قطعی شبکه و تاخیر در سیستم‌های SQL، NoSQL و پایگاه‌های داده توزیع‌شده NewSQL.",
  readingTimeMinutes: 19,
  difficulty: "lead",
  content: `### 1. The CAP Theorem

In any distributed network, network partitions (**P**) are physically inevitable. A system must therefore choose between:
- **CP (Consistency + Partition Tolerance):** Rejects writes or fails if nodes cannot reach consensus (e.g. MongoDB, Redis Sentinel, Google Spanner).
- **AP (Availability + Partition Tolerance):** Returns responses immediately using local node state, accepting **Eventual Consistency** (e.g. Cassandra, DynamoDB).

---

### 2. The PACELC Theorem

The CAP theorem only covers system behavior **during network partitions**. PACELC provides a complete taxonomy including normal operation:

$$\\textbf{If (P)artition:} \\; \\text{choose between } \\textbf{(A)vailability} \\text{ and } \\textbf{(C)onsistency}$$
$$\\textbf{(E)lse (Normal State):} \\; \\text{choose between } \\textbf{(L)atency} \\text{ and } \\textbf{(C)onsistency}$$

| Database | PACELC Model | Rationale |
| :--- | :--- | :--- |
| **MongoDB** | **PC/EC** | Under partition chooses Consistency; during normal state chooses strong Consistency over lowest Latency. |
| **Cassandra** | **PA/EL** | Under partition chooses Availability; during normal state optimizes for ultra-low Latency. |
| **Google Spanner** | **PC/EC** | Uses atomic hardware TrueTime clocks and Raft consensus for globally consistent distributed ACID transactions. |`,
  content_fa: `### ۱. قضیه CAP در سیستم‌های توزیع‌شده

در صورت وقوع قطعی شبکه (**Partition**)، سیستم یا باید سازگاری قطعی (**CP**) را اولویت قرار دهد و درخواست‌ها را رد کند، یا دسترسی‌پذیری (**AP**) را با اصل سازگاری تدریجی (Eventual Consistency) حفظ کند.

---

### ۲. قضیه جامع‌تر PACELC

قضیه PACELC وضعیت عادی سیستم بدون قطعی شبکه را نیز مدل می‌کند:
- **در زمان قطعی (Partition):** انتخاب بین **A**vailability یا **C**onsistency
- **در حالت عادی (Else):** انتخاب بین **L**atency پایین یا **C**onsistency بالا`,
};
