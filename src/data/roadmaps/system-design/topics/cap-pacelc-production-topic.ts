import { RoadmapTopic } from "../../../models";

export const capPacelcProductionTopic: RoadmapTopic = {
  id: "topic-sys-cap-pacelc",
  stepId: "step-sys-consensus-transactions",
  slug: "cap-pacelc-theorems-production",
  order: 1,
  title: "CAP & PACELC Theorems: Real-World Distributed Trade-offs",
  title_fa: "تئوری‌های CAP و PACELC و تصمیم‌گیری در سیستم‌های توزیع‌شده پروداکشن",
  summary: "Move beyond standard CAP misunderstandings to master PACELC: trading Consistency vs Availability during network Partitions, and Latency vs Consistency during Normal operation.",
  summary_fa: "فراتر از تعاریف ساده CAP، تحلیل قضیه PACELC: انتخاب میان دسترسی‌پذیری و سازگاری در زمان قطعی شبکه (Partitions)، و انتخاب میان تاخیر (Latency) و سازگاری در شرایط عادی سیستم.",
  readingTimeMinutes: 19,
  difficulty: "senior",
  content: `### 1. The CAP Theorem Reality Check

The CAP Theorem states that in the event of a **Network Partition ($P$)**, a distributed data system must choose between:
- **Consistency ($C$):** Linearizability; all nodes return the latest write, or error out.
- **Availability ($A$):** High Availability; every non-failing node returns a response, but it may be stale.

> **Crucial Reality:** You cannot "choose CA". Network partitions in distributed networks are inevitable physical guarantees (packet drops, switch failures, GC pauses). Therefore, the actual choice is strictly **CP** or **AP**.

---

### 2. The PACELC Theorem

Formulated by Daniel Abadi to describe system trade-offs **even when no network partitions exist**:

\`\`\`
If Partition (P):
    Trade Availability (A) vs. Consistency (C)
Else (E):
    Trade Latency (L) vs. Consistency (C)
\`\`\`

#### Production Database Classifications:
1. **PC/EC (e.g., Google Spanner, CockroachDB, RDBMS Single-Leader):**
   - In partition $\\rightarrow$ favors Consistency (rejects writes on split nodes).
   - In normal state $\\rightarrow$ pays Latency penalty (synchronous 2PC/Paxos) to guarantee strong Consistency.
2. **PA/EL (e.g., Apache Cassandra, DynamoDB, Couchbase):**
   - In partition $\\rightarrow$ favors Availability (accepts writes on local quorum).
   - In normal state $\\rightarrow$ optimizes for ultra-low Latency (asynchronous background replication).
3. **PC/EL (e.g., MongoDB with default write concern):**
   - In partition $\\rightarrow$ chooses Consistency (waits for primary re-election).
   - In normal state $\\rightarrow$ returns fast with low Latency before secondary replication finishes.`,
  content_fa: `### ۱. واقعیت قضیه CAP در سیستم‌های واقعی

قضیه CAP بیان می‌کند که به هنگام رخ دادن **خطای شبکه یا پارتیشن (P)**، سیستم باید بین **سازگاری قطعی (CP)** یا **پاسخ‌دهی همیشگی (AP)** یکی را انتخاب کند. عبارت «انتخاب سیستم CA» در دنیای شبکه ناممکن است زیرا قطعی فیزیکی فیبر و سوئیچ‌ها حتمی است.

---

### ۲. قضیه جامع‌تر PACELC

قضیه PACELC رفتار سیستم‌ها را علاوه بر زمان قطعی شبکه، در **شرایط عادی** نیز تحلیل می‌کند:
- **اگر پارتیشن رخ داد (P):** بین دسترسی‌پذیری (A) و سازگاری (C) انتخاب کن.
- **در غیر این صورت و در حالت عادی (E):** بین سرعت/تاخیر کم (L) و سازگاری لحظه‌ای (C) یکی را انتخاب کن.

- **سیستم‌های PC/EC (مانند Spanner و CockroachDB):** اولویت همیشگی با سازگاری و امنیت داده است (حتی با تاخیر بیشتر).
- **سیستم‌های PA/EL (مانند Cassandra و DynamoDB):** اولویت با سرعت بالا و در دسترس بودن همیشگی برای کاربر است (سازگاری تدریجی).`,
};
