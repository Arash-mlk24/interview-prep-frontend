import { RoadmapTopic } from "../../../models";

export const databaseReplicationTopic: RoadmapTopic = {
  id: "topic-sys-db-replication",
  stepId: "step-sys-databases-storage",
  slug: "database-replication-topologies-consistency",
  order: 1,
  title: "Database Replication (Single-Leader, Multi-Leader, Leaderless) & Read Consistency Models",
  title_fa: "الگوهای رپلیکیشن پایگاه‌های داده (تک‌لیدر، چندلیدر و بدون‌لیدر) و مدل‌های سازگاری خواندن",
  summary: "Analyze replication lag, synchronous vs asynchronous replication, semi-sync, Read-After-Write consistency, Monotonic Reads, and Quorum consensus (W + R > N).",
  summary_fa: "تحلیل تاخیر رپلیکیشن (Replication Lag)، روش‌های همگام و ناهمگام، سازگاری Read-After-Write، خواندن یکنواخت (Monotonic Reads) و محاسبات حد نصاب حد نصاب کواوروم (W + R > N).",
  readingTimeMinutes: 22,
  difficulty: "senior",
  content: `### 1. Replication Topologies

#### 1. Single-Leader (Primary-Replica)
- **Mechanics:** All write operations execute on the **Leader**; the leader streams Write-Ahead Logs (WAL) / binary change logs to one or more **Followers (Replicas)**.
- **Best for:** Read-heavy workloads ($95\\%+$ reads).
- **Failure Modes:** Leader failover requires election, potential data loss during async failover.

#### 2. Multi-Leader (Active-Active)
- **Mechanics:** Multiple datacenters each host a leader node accepting writes locally and propagating changes asynchronously across WAN.
- **Trade-off:** High write availability across regions, but requires complex **Conflict Resolution** (Last-Write-Wins, CRDTs, or Operational Transformation).

#### 3. Leaderless (Dynamo-Style / Cassandra)
- **Mechanics:** Clients send writes and reads to multiple replica nodes directly.
- **Quorum Consensus Formula:**
  $$W + R > N$$
  Where $N = \\text{Total Replicas}$, $W = \\text{Write Quorum Acknowledgments}$, $R = \\text{Read Quorum Nodes}$.
  - Guarantee: The set of nodes written to and the set of nodes read from must overlap by at least one node containing the latest value.

---

### 2. Consistency Anomalies Caused by Replication Lag

1. **Read-After-Write (Monotonic Read-Your-Own-Writes):**
   - *Problem:* A user updates their profile picture and refreshes the page, but the read hits a replica that hasn't caught up yet.
   - *Solution:* Route user's own profile reads to the Leader for 10 seconds post-write, or attach a timestamp/logical version cookie.
2. **Monotonic Reads:**
   - *Problem:* User makes two consecutive reads; first read hits an up-to-date replica, second read hits a laggy replica, giving the illusion of time going backwards.
   - *Solution:* Ensure a specific user's reads consistently hash to the same replica instance.`,
  content_fa: `### ۱. الگوهای اصلی رپلیکیشن (تکثیر داده‌ها)

۱. **Single-Leader (یک لیدر، چند رپلیکا):**
   - تمام دستورات نوشتن (Write) منحصراً به لیدر ارسال شده و لیدر لاگ‌ها را برای نودهای رید (Replica) می‌فرستد.
   - مناسب سیستم‌های با حجم بالای خواندن (مانند شبکه‌های اجتماعی و اخبار).

۲. **Multi-Leader (چندلیدر فعال در دیتاسنترهای مختلف):**
   - افزایش سرعت نوشتن در سراسر جهان، ولی نیازمند حل تعارض‌های همزمان (Conflict Resolution) مانند روش‌های LWW یا ساختارهای CRDT.

۳. **Leaderless (بدون لیدر - سبک کاساندرا و آمازون دینامو):**
   - با فرمول حد نصاب **$W + R > N$** تضمین می‌شود که همیشه آخرین نسخه معتبر داده در خروجی کوئری‌ها بازگردد.

---

### ۲. چالش‌های تاخیر در رپلیکیشن (Replication Lag)

- **Read-After-Write:** برای جلوگیری از ندیدن تغییرات توسط خود کاربری که داده را تغییر داده، خواندن داده‌های کاربر برای چند ثانیه مستقیماً به لیدر هدایت می‌شود.
- **Monotonic Reads:** جلوگیری از مشاهده نسخه‌های قدیمی‌تر در بارگذاری‌های متوالی با هدایت کاربر به یک رپلیکای پایدار.`,
};
